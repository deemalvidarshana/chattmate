"""
Copyright 2024-2026 ChatterMate

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request, Response
from sqlalchemy.orm import Session

from app.api.webhooks.common import is_duplicate_message
from app.channels import get_adapter
from app.channels.meta_base import (account_app_secret, verify_challenge,
                                    verify_meta_signature, webhook_account_ids)
from app.core.logger import get_logger
from app.database import get_db
from app.models.channels import ChannelType
from app.repositories.channels import ChannelAccountRepository
from app.services.channel_chat import process_channel_message

router = APIRouter()
logger = get_logger(__name__)

# One Meta app subscribes WhatsApp + Messenger + Instagram to this single
# callback; the payload's top-level `object` says which product it is.
_OBJECT_TO_CHANNEL = {
    "whatsapp_business_account": ChannelType.WHATSAPP.value,
    "page": ChannelType.MESSENGER.value,
    "instagram": ChannelType.INSTAGRAM.value,
}


def _log_whatsapp_delivery_statuses(payload: dict, phone_number_ids: set[str]) -> None:
    """Record Meta's delivery outcome without logging recipients or message content."""
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            if change.get("field") != "messages":
                continue
            value = change.get("value") or {}
            phone_number_id = str((value.get("metadata") or {}).get("phone_number_id", ""))
            if phone_number_id not in phone_number_ids:
                continue
            for update in value.get("statuses") or []:
                message_id = update.get("id")
                status = update.get("status")
                if not isinstance(message_id, str) or not message_id:
                    continue
                if status not in ("sent", "delivered", "read", "failed"):
                    continue
                error_codes = [
                    error["code"] for error in update.get("errors") or []
                    if isinstance(error, dict) and type(error.get("code")) is int
                ]
                log = logger.warning if status == "failed" else logger.info
                log("WhatsApp delivery status=%s phone_number_id=%s message_id=%r error_codes=%s",
                    status, phone_number_id, message_id, error_codes)


@router.get("")
async def meta_webhook_verify(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
):
    """Webhook verification handshake (App Dashboard → Webhooks → Verify)."""
    challenge = verify_challenge(hub_mode, hub_verify_token, hub_challenge)
    if challenge is None:
        raise HTTPException(status_code=403, detail="Verification failed")
    # Meta expects the raw challenge echoed as text/plain
    return Response(content=challenge, media_type="text/plain")


@router.post("")
async def meta_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Receive a Meta webhook for any of WhatsApp / Messenger / Instagram.

    Verifies the app-level signature, routes on the `object` field, resolves
    the connected account per message, acks immediately, and processes in the
    background.
    """
    raw_body = await request.body()
    account_repo = ChannelAccountRepository(db)

    # Tenants who run their own Meta app sign with their own secret, which this
    # server cannot guess. The ids in the body pick which stored secrets are
    # worth trying — the body is not trusted for anything else, and the HMAC
    # still has to verify against whichever key is chosen. The server-wide
    # secret remains a fallback inside verify_meta_signature, so a shared-app
    # deployment behaves exactly as before.
    candidates = account_repo.list_by_external_ids(
        list(_OBJECT_TO_CHANNEL.values()), webhook_account_ids(raw_body))
    app_secrets = [secret for secret in (account_app_secret(a) for a in candidates) if secret]

    if not verify_meta_signature(raw_body, request.headers.get("x-hub-signature-256", ""),
                                 app_secrets):
        # Logged so a rejected delivery is distinguishable from one that never
        # arrived; the body is untrusted and unlogged. The secret count is the
        # one thing that separates "wrong secret" from "no secret configured",
        # which are different fixes.
        logger.warning(
            f"Meta webhook rejected: bad signature ({len(raw_body)} bytes, "
            f"{len(app_secrets)} account secret(s) tried)")
        raise HTTPException(status_code=403, detail="Invalid signature")

    payload = await request.json()
    channel_type = _OBJECT_TO_CHANNEL.get(payload.get("object"))
    if channel_type is None:
        # Unknown product subscription — ack so Meta doesn't retry forever
        return {"status": "ignored"}

    if channel_type == ChannelType.WHATSAPP.value:
        _log_whatsapp_delivery_statuses(payload, {
            account.external_account_id for account in candidates
            if account.channel_type == channel_type and account.is_active
        })

    adapter = get_adapter(channel_type)

    for inbound in adapter.parse_inbound(payload):
        account = account_repo.get_by_external_id(channel_type, inbound.external_account_id)
        if account is None or not account.is_active:
            logger.info(f"No active {channel_type} account for {inbound.external_account_id}")
            continue
        if is_duplicate_message(channel_type,
                                f"{account.id}:{inbound.external_message_id}"):
            logger.info(f"Skipping duplicate {channel_type} message {inbound.external_message_id}")
            continue
        background_tasks.add_task(process_channel_message, account.id, inbound)

    return {"status": "ok"}
