"""TikTok Content Posting onboarding. No Business Messaging/AI routing here."""
import base64
import hashlib
import json
import secrets
import time
from urllib.parse import urlencode, urlparse
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.channels.accounts import get_org_account_or_404
from app.core.auth import get_current_organization, require_permissions
from app.core.config import settings
from app.core.redis import get_redis
from app.database import get_db
from app.models.channels import ChannelAccount
from app.models.organization import Organization
from app.models.user import User
from app.repositories.channels import ChannelAccountRepository

router = APIRouter()
API = "https://open.tiktokapis.com/v2"
MAX_VIDEO_BYTES = 20 * 1024 * 1024
SCOPES = {"user.info.basic", "video.publish", "video.upload"}
admin = require_permissions("manage_organization")


def cache():
    client = get_redis()
    if client is None:
        raise HTTPException(503, "TikTok connection storage is temporarily unavailable.")
    return client


def redirect_uri():
    return settings.FRONTEND_URL.rstrip("/") + "/integrations/tiktok/callback"


def configured():
    return bool(settings.TIKTOK_CLIENT_KEY and settings.TIKTOK_CLIENT_SECRET)


def token_values(data):
    now = time.time()
    return {**{key: data.get(key) for key in ("access_token", "refresh_token", "open_id", "scope")},
            "expires_at": now + int(data.get("expires_in", 0)),
            "refresh_expires_at": now + int(data.get("refresh_expires_in", 0))}


async def token_request(data):
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(API + "/oauth/token/", data={
                "client_key": settings.TIKTOK_CLIENT_KEY,
                "client_secret": settings.TIKTOK_CLIENT_SECRET, **data})
        result = response.json()
        if response.is_error or result.get("error") or not result.get("access_token"):
            raise HTTPException(400, "TikTok authorization expired or was declined. Reconnect your account.")
        return result
    except (httpx.HTTPError, ValueError):
        raise HTTPException(502, "TikTok authorization is temporarily unavailable.")


async def api_request(path, token, data=None, *, method="POST", params=None):
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.request(method, API + path,
                headers={"Authorization": f"Bearer {token}"}, json=data, params=params)
        result = response.json()
        error = result.get("error") or {}
        if response.is_error or error.get("code", "ok") != "ok":
            code = str(error.get("code", "request_failed"))[:100]
            # Do not echo provider bodies, URLs or credentials into responses/logs.
            raise HTTPException(502, f"TikTok could not complete this request ({code}).")
        return result.get("data") or {}
    except (httpx.HTTPError, ValueError):
        raise HTTPException(502, "TikTok is temporarily unavailable. Please try again later.")


def owned_account(db, account_id, organization):
    account = get_org_account_or_404(db, account_id, organization)
    if account.channel_type != "tiktok" or not account.is_active:
        raise HTTPException(404, "TikTok account not found.")
    return account


async def access_token(db, account):
    repo = ChannelAccountRepository(db)
    credentials = repo.get_credentials(account)
    if credentials.get("client_key") != settings.TIKTOK_CLIENT_KEY:
        raise HTTPException(409, "The TikTok app has changed. Reconnect this account.")
    if credentials.get("expires_at", 0) < time.time() + 120:
        # Serialize refresh-token rotation across workers for this account.
        db.refresh(account, with_for_update=True)
        credentials = repo.get_credentials(account)
        if credentials.get("expires_at", 0) < time.time() + 120:
            if credentials.get("refresh_expires_at", 0) <= time.time():
                db.rollback()
                raise HTTPException(409, "TikTok access expired. Reconnect your account.")
            try:
                data = await token_request({"grant_type": "refresh_token",
                                            "refresh_token": credentials["refresh_token"]})
                credentials.update(token_values(data))
                repo.update_credentials(account, credentials)
            except Exception:
                db.rollback()
                raise
        else:
            db.commit()
    return credentials["access_token"], set((credentials.get("scope") or "").split(","))


@router.get("/config")
async def config(user: User = Depends(admin)):
    return {"enabled": configured(), "private_only": not settings.TIKTOK_PUBLIC_POSTING_ENABLED,
            "max_video_bytes": MAX_VIDEO_BYTES}


@router.post("/authorize")
async def authorize(user: User = Depends(admin), org: Organization = Depends(get_current_organization)):
    if not configured():
        raise HTTPException(503, "TikTok connection is awaiting platform configuration.")
    state, verifier = secrets.token_urlsafe(32), secrets.token_urlsafe(48)
    cache().set("tiktok:oauth:" + state, json.dumps({"org": str(org.id), "user": str(user.id),
        "verifier": verifier}), ex=600)
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    return {"url": "https://www.tiktok.com/v2/auth/authorize/?" + urlencode({
        "client_key": settings.TIKTOK_CLIENT_KEY, "scope": ",".join(sorted(SCOPES)),
        "response_type": "code", "redirect_uri": redirect_uri(), "state": state,
        "code_challenge": challenge, "code_challenge_method": "S256"})}


class Callback(BaseModel):
    code: str = Field(min_length=1, max_length=4096)
    state: str = Field(min_length=20, max_length=256)


@router.post("/callback")
async def callback(body: Callback, user: User = Depends(admin),
                   org: Organization = Depends(get_current_organization), db: Session = Depends(get_db)):
    saved = cache().getdel("tiktok:oauth:" + body.state)
    if not saved:
        raise HTTPException(400, "TikTok sign-in expired. Start the connection again.")
    saved = json.loads(saved)
    if saved["org"] != str(org.id) or saved["user"] != str(user.id):
        raise HTTPException(403, "TikTok sign-in belongs to a different workspace or user.")
    data = await token_request({"code": body.code, "grant_type": "authorization_code",
                               "redirect_uri": redirect_uri(), "code_verifier": saved["verifier"]})
    if not data.get("open_id") or not {"user.info.basic"}.issubset(set(data.get("scope", "").split(","))):
        raise HTTPException(400, "TikTok did not grant the requested account access.")
    profile = await api_request("/user/info/", data["access_token"], method="GET",
                                params={"fields": "open_id,display_name,avatar_url"})
    name = (profile.get("user") or {}).get("display_name") or "TikTok account"
    repo = ChannelAccountRepository(db)
    account = repo.get_by_external_id("tiktok", data["open_id"])
    credentials = {**token_values(data), "client_key": settings.TIKTOK_CLIENT_KEY}
    if account:
        if account.organization_id != org.id:
            raise HTTPException(409, "This TikTok account is already connected to another workspace.")
        account.display_name = name
        repo.update_credentials(account, credentials)
        repo.set_active(account, True)
    else:
        account = repo.create_account(org.id, "tiktok", data["open_id"], credentials, name)
    return {"id": str(account.id), "display_name": name}


@router.get("/{account_id}/creator")
async def creator(account_id: UUID, user: User = Depends(admin),
                  org: Organization = Depends(get_current_organization), db: Session = Depends(get_db)):
    account = owned_account(db, account_id, org)
    token, scopes = await access_token(db, account)
    if "video.publish" not in scopes:
        return {"can_publish": False, "can_upload": "video.upload" in scopes}
    data = await api_request("/post/publish/creator_info/query/", token, {})
    if not settings.TIKTOK_PUBLIC_POSTING_ENABLED:
        data["privacy_level_options"] = [p for p in data.get("privacy_level_options", []) if p == "SELF_ONLY"]
    return {**data, "can_publish": True, "can_upload": "video.upload" in scopes}


@router.post("/{account_id}/publish")
async def publish(account_id: UUID, video: UploadFile = File(...), mode: str = Form(...),
                  request_id: UUID = Form(...), title: str = Form(""), privacy_level: str = Form(""),
                  allow_comment: bool = Form(False), allow_duet: bool = Form(False),
                  allow_stitch: bool = Form(False), own_brand: bool = Form(False),
                  paid_partnership: bool = Form(False), ai_generated: bool = Form(False),
                  consent: bool = Form(False), user: User = Depends(admin),
                  org: Organization = Depends(get_current_organization), db: Session = Depends(get_db)):
    account = owned_account(db, account_id, org)
    if not consent or mode not in ("direct", "draft"):
        raise HTTPException(400, "Review your video and give permission to send it to TikTok.")
    if len(title.encode("utf-16-le")) // 2 > 2200:
        raise HTTPException(400, "Caption exceeds TikTok's 2,200 character limit.")
    content = await video.read(MAX_VIDEO_BYTES + 1)
    await video.close()
    if not content or len(content) > MAX_VIDEO_BYTES:
        raise HTTPException(413, "Choose a video smaller than 20 MB.")
    mime = video.content_type
    if mime not in ("video/mp4", "video/quicktime", "video/webm") or not (
        content[4:8] == b"ftyp" or content[:4] == b"\x1aE\xdf\xa3"):
        raise HTTPException(400, "Choose an MP4, MOV or WebM video.")
    token, scopes = await access_token(db, account)
    required = "video.publish" if mode == "direct" else "video.upload"
    if required not in scopes:
        raise HTTPException(403, "Reconnect TikTok and allow video publishing access.")
    payload = {"source_info": {"source": "FILE_UPLOAD", "video_size": len(content),
                              "chunk_size": len(content), "total_chunk_count": 1}}
    if mode == "direct":
        info = await api_request("/post/publish/creator_info/query/", token, {})
        if privacy_level not in info.get("privacy_level_options", []):
            raise HTTPException(400, "Choose an available privacy setting.")
        if not settings.TIKTOK_PUBLIC_POSTING_ENABLED and privacy_level != "SELF_ONLY":
            raise HTTPException(400, "Public publishing is awaiting TikTok approval. Choose Only me.")
        if paid_partnership and privacy_level == "SELF_ONLY":
            raise HTTPException(400, "TikTok does not allow paid partnerships on private posts.")
        payload["post_info"] = {"title": title, "privacy_level": privacy_level,
            "disable_comment": not allow_comment or bool(info.get("comment_disabled")),
            "disable_duet": not allow_duet or bool(info.get("duet_disabled")),
            "disable_stitch": not allow_stitch or bool(info.get("stitch_disabled")),
            "brand_organic_toggle": own_brand, "brand_content_toggle": paid_partnership,
            "is_aigc": ai_generated}
    redis = cache()
    operation = f"tiktok:request:{account.id}:{request_id}"
    if not redis.set(operation, "pending", nx=True, ex=86400):
        raise HTTPException(409, "This upload has already been submitted. Check its status before retrying.")
    try:
        path = "/post/publish/video/init/" if mode == "direct" else "/post/publish/inbox/video/init/"
        data = await api_request(path, token, payload)
    except Exception:
        redis.delete(operation)
        raise
    publish_id, upload_url = data.get("publish_id"), data.get("upload_url", "")
    parsed = urlparse(upload_url)
    # Upload destination comes only from TikTok. Never accept arbitrary user URLs
    # or follow a redirect with the media bytes.
    if not publish_id or parsed.scheme != "https" or not (parsed.hostname or "").endswith(".tiktokapis.com"):
        raise HTTPException(502, "TikTok returned an invalid upload destination.")
    redis.set("tiktok:post:" + hashlib.sha256(publish_id.encode()).hexdigest(),
              json.dumps({"account": str(account.id), "mode": mode}), ex=7 * 86400)
    try:
        async with httpx.AsyncClient(timeout=120, follow_redirects=False) as client:
            response = await client.put(upload_url, content=content, headers={
                "Content-Type": mime, "Content-Length": str(len(content)),
                "Content-Range": f"bytes 0-{len(content)-1}/{len(content)}"})
        if response.status_code not in (200, 201, 206):
            return {"publish_id": publish_id, "status": "UPLOAD_FAILED"}
    except httpx.HTTPError:
        return {"publish_id": publish_id, "status": "UPLOAD_FAILED"}
    return {"publish_id": publish_id, "status": "PROCESSING", "mode": mode}


class PostStatus(BaseModel):
    publish_id: str = Field(min_length=1, max_length=512)


@router.post("/{account_id}/status")
async def status(account_id: UUID, body: PostStatus, user: User = Depends(admin),
                 org: Organization = Depends(get_current_organization), db: Session = Depends(get_db)):
    account = owned_account(db, account_id, org)
    saved = cache().get("tiktok:post:" + hashlib.sha256(body.publish_id.encode()).hexdigest())
    if not saved or json.loads(saved)["account"] != str(account.id):
        raise HTTPException(404, "TikTok upload not found.")
    token, _ = await access_token(db, account)
    data = await api_request("/post/publish/status/fetch/", token, {"publish_id": body.publish_id})
    return {key: data[key] for key in ("status", "fail_reason", "publicaly_available_post_id") if key in data}


@router.delete("/{account_id}")
async def disconnect(account_id: UUID, user: User = Depends(admin),
                     org: Organization = Depends(get_current_organization), db: Session = Depends(get_db)):
    account = owned_account(db, account_id, org)
    repo = ChannelAccountRepository(db)
    token = repo.get_credentials(account).get("access_token")
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            await client.post(API + "/oauth/revoke/", data={"client_key": settings.TIKTOK_CLIENT_KEY,
                "client_secret": settings.TIKTOK_CLIENT_SECRET, "token": token})
    except httpx.HTTPError:
        pass
    repo.delete(account)
    return {"status": "disconnected"}
