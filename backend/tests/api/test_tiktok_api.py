"""Tenant isolation, OAuth replay protection and publishing guardrails."""
import json
import time
from unittest.mock import AsyncMock, patch
from uuid import uuid4
import httpx

import pytest
from fastapi.testclient import TestClient

import app.main  # noqa: F401
from app.core.application import app
from app.core.auth import get_current_user, get_current_organization
from app.core.config import settings
from app.database import get_db
from app.repositories.channels import ChannelAccountRepository

BASE = "/api/v1/channels/tiktok"


class FakeCache:
    def __init__(self):
        self.values = {}

    def set(self, key, value, nx=False, ex=None):
        if nx and key in self.values:
            return False
        self.values[key] = value
        return True

    def get(self, key):
        return self.values.get(key)

    def getdel(self, key):
        return self.values.pop(key, None)

    def delete(self, key):
        self.values.pop(key, None)


@pytest.fixture
def client(db, test_user, test_organization):
    app.dependency_overrides[get_current_user] = lambda: test_user
    app.dependency_overrides[get_current_organization] = lambda: test_organization
    app.dependency_overrides[get_db] = lambda: db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def account(db, test_organization, monkeypatch):
    monkeypatch.setattr(settings, "TIKTOK_CLIENT_KEY", "test-key")
    monkeypatch.setattr(settings, "TIKTOK_CLIENT_SECRET", "test-secret")
    monkeypatch.setattr(settings, "TIKTOK_PUBLIC_POSTING_ENABLED", False)
    return ChannelAccountRepository(db).create_account(test_organization.id, "tiktok", "test-open-id", {
        "client_key": "test-key", "access_token": "token", "refresh_token": "refresh",
        "scope": "user.info.basic,video.publish,video.upload", "expires_at": time.time() + 3600,
    }, "Test creator")


def test_authorize_binds_state_to_user_and_org(client, account, test_user, test_organization):
    from urllib.parse import parse_qs, urlparse
    cache = FakeCache()
    with patch("app.api.channels.tiktok.cache", return_value=cache):
        response = client.post(BASE + "/authorize")
    query = parse_qs(urlparse(response.json()["url"]).query)
    saved = json.loads(cache.get("tiktok:oauth:" + query["state"][0]))
    assert saved["org"] == str(test_organization.id)
    assert saved["user"] == str(test_user.id)
    assert "client_secret" not in query
    assert query["code_challenge_method"] == ["S256"]


def test_expired_callback_never_exchanges_code(client):
    with patch("app.api.channels.tiktok.cache", return_value=FakeCache()), \
         patch("app.api.channels.tiktok.token_request", new_callable=AsyncMock) as exchange:
        assert client.post(BASE + "/callback", json={"code": "x", "state": "s" * 32}).status_code == 400
        exchange.assert_not_awaited()


def test_callback_wrong_tenant_and_replay_rejected(client, test_user):
    cache = FakeCache()
    cache.set("tiktok:oauth:" + "s" * 32, json.dumps({"org": str(uuid4()), "user": str(test_user.id)}))
    with patch("app.api.channels.tiktok.cache", return_value=cache), \
         patch("app.api.channels.tiktok.token_request", new_callable=AsyncMock) as exchange:
        body = {"code": "x", "state": "s" * 32}
        assert client.post(BASE + "/callback", json=body).status_code == 403
        assert client.post(BASE + "/callback", json=body).status_code == 400
        exchange.assert_not_awaited()


def test_creator_filters_public_privacy_before_approval(client, account):
    with patch("app.api.channels.tiktok.api_request", AsyncMock(return_value={
        "privacy_level_options": ["PUBLIC_TO_EVERYONE", "SELF_ONLY"], "comment_disabled": True})):
        result = client.get(f"{BASE}/{account.id}/creator")
    assert result.json()["privacy_level_options"] == ["SELF_ONLY"]
    assert result.json()["comment_disabled"] is True


def test_other_organization_cannot_access_creator(client, account, db):
    account.organization_id = uuid4()
    db.commit()
    with patch("app.api.channels.tiktok.api_request", new_callable=AsyncMock) as api:
        assert client.get(f"{BASE}/{account.id}/creator").status_code == 404
        api.assert_not_awaited()


def test_publish_requires_explicit_consent(client, account):
    response = client.post(f"{BASE}/{account.id}/publish", data={
        "mode": "direct", "request_id": str(uuid4()), "privacy_level": "SELF_ONLY"},
        files={"video": ("test.mp4", b"0000ftyp" + b"0" * 100, "video/mp4")})
    assert response.status_code == 400


def test_public_post_rejected_before_initialization(client, account):
    with patch("app.api.channels.tiktok.api_request", AsyncMock(return_value={
        "privacy_level_options": ["PUBLIC_TO_EVERYONE", "SELF_ONLY"]})) as api:
        result = client.post(f"{BASE}/{account.id}/publish", data={
            "mode": "direct", "request_id": str(uuid4()), "consent": "true",
            "privacy_level": "PUBLIC_TO_EVERYONE"},
            files={"video": ("test.mp4", b"0000ftyp" + b"0" * 100, "video/mp4")})
    assert result.status_code == 400
    assert api.await_count == 1  # Creator info only; no post was initialized.


def test_status_is_bound_to_connected_account(client, account):
    cache = FakeCache()
    import hashlib
    cache.set("tiktok:post:" + hashlib.sha256(b"post-id").hexdigest(), json.dumps({"account": str(uuid4())}))
    with patch("app.api.channels.tiktok.cache", return_value=cache), \
         patch("app.api.channels.tiktok.api_request", new_callable=AsyncMock) as api:
        assert client.post(f"{BASE}/{account.id}/status", json={"publish_id": "post-id"}).status_code == 404
        api.assert_not_awaited()


def test_successful_callback_encrypts_tokens_and_cannot_be_replayed(client, db, test_user, test_organization, monkeypatch):
    monkeypatch.setattr(settings, "TIKTOK_CLIENT_KEY", "test-key")
    cache = FakeCache()
    cache.set("tiktok:oauth:" + "s" * 32, json.dumps({"org": str(test_organization.id),
        "user": str(test_user.id), "verifier": "pkce-verifier"}))
    token = {"access_token": "private-access-token", "refresh_token": "private-refresh-token",
             "scope": "user.info.basic,video.publish", "open_id": "new-user", "expires_in": 3600,
             "refresh_expires_in": 86400}
    with patch("app.api.channels.tiktok.cache", return_value=cache), \
         patch("app.api.channels.tiktok.token_request", AsyncMock(return_value=token)), \
         patch("app.api.channels.tiktok.api_request", AsyncMock(return_value={"user": {"display_name": "Creator"}})):
        body = {"code": "code", "state": "s" * 32}
        result = client.post(BASE + "/callback", json=body)
        assert result.status_code == 200
        assert "token" not in result.text
        assert client.post(BASE + "/callback", json=body).status_code == 400
    repo = ChannelAccountRepository(db)
    saved = repo.get_by_external_id("tiktok", "new-user")
    assert "private-access-token" not in saved.encrypted_credentials
    assert repo.get_credentials(saved)["access_token"] == "private-access-token"


def test_video_transfer_uses_only_tiktok_url_and_deduplicates(client, account):
    cache = FakeCache()
    upload_client = AsyncMock()
    upload_client.put.return_value = httpx.Response(201)
    request_id = str(uuid4())
    with patch("app.api.channels.tiktok.cache", return_value=cache), \
         patch("app.api.channels.tiktok.api_request", AsyncMock(side_effect=[
             {"privacy_level_options": ["SELF_ONLY"], "comment_disabled": True},
             {"publish_id": "new-post", "upload_url": "https://upload.us.tiktokapis.com/video/?upload_token=secret"},
             {"privacy_level_options": ["SELF_ONLY"]}])) as api, \
         patch("app.api.channels.tiktok.httpx.AsyncClient") as transport:
        transport.return_value.__aenter__.return_value = upload_client
        data = {"mode": "direct", "request_id": request_id, "privacy_level": "SELF_ONLY",
                "consent": "true", "allow_comment": "true"}
        files = {"video": ("test.mp4", b"0000ftyp" + b"0" * 100, "video/mp4")}
        result = client.post(f"{BASE}/{account.id}/publish", data=data, files=files)
        assert result.json()["status"] == "PROCESSING"
        assert "upload_token" not in result.text
        assert api.await_args_list[1].args[2]["post_info"]["disable_comment"] is True
        assert client.post(f"{BASE}/{account.id}/publish", data=data, files=files).status_code == 409
        assert upload_client.put.await_count == 1


def test_untrusted_upload_destination_is_never_contacted(client, account):
    with patch("app.api.channels.tiktok.cache", return_value=FakeCache()), \
         patch("app.api.channels.tiktok.api_request", AsyncMock(return_value={
             "publish_id": "bad-post", "upload_url": "https://127.0.0.1/private"})), \
         patch("app.api.channels.tiktok.httpx.AsyncClient") as transport:
        result = client.post(f"{BASE}/{account.id}/publish", data={
            "mode": "draft", "request_id": str(uuid4()), "consent": "true"},
            files={"video": ("test.mp4", b"0000ftyp" + b"0" * 100, "video/mp4")})
        assert result.status_code == 502
        transport.assert_not_called()
