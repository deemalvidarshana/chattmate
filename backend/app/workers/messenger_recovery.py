"""Recover recent Messenger text messages that never reached the webhook.

An operator opts in per Page by setting messenger_recovery_since to the UTC
activation timestamp in the channel account's settings.
"""

import asyncio
from datetime import datetime, timedelta, timezone

from app.api.webhooks.common import is_duplicate_message
from app.channels.base import InboundMessage
from app.channels.meta_base import MetaBaseAdapter, graph_get
from app.core.logger import get_logger
from app.database import SessionLocal
from app.models.channels import ChannelAccount, ChannelType
from app.services.channel_chat import process_channel_message

logger = get_logger(__name__)

POLL_SECONDS = 30
WEBHOOK_GRACE = timedelta(seconds=30)
LOOKBACK = timedelta(minutes=10)
PAGE_LIMIT = 25
MAX_PAGES = 4
THREAD_FIELDS = "updated_time,messages.limit(20){id,message,created_time,from}"


def _timestamp(value):
    try:
        stamp = datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return None
    return stamp if stamp.tzinfo else None


def _unanswered_messages(page_id, messages, since, until):
    """A Page reply closes the preceding batch, including human replies."""
    entries = [
        (stamp, message)
        for message in messages
        if (stamp := _timestamp(message.get("created_time"))) is not None
    ]
    last_reply = max(
        (stamp for stamp, message in entries
         if str((message.get("from") or {}).get("id")) == page_id),
        default=None,
    )
    for stamp, message in sorted(entries, key=lambda entry: entry[0]):
        if stamp < since or stamp > until or (last_reply is not None and stamp <= last_reply):
            continue
        sender = message.get("from") or {}
        sender_id = sender.get("id")
        if not sender_id or str(sender_id) == page_id or not message.get("id") or not message.get("message"):
            continue
        yield InboundMessage(
            external_account_id=page_id,
            external_conversation_id=str(sender_id),
            external_user_id=str(sender_id),
            external_message_id=message["id"],
            text=message["message"],
            profile={"name": sender.get("name")},
            timestamp=stamp,
        )


async def _recover_page(account_id, page_id, token, since):
    now = datetime.now(timezone.utc)
    since = max(since, now - LOOKBACK)
    until = now - WEBHOOK_GRACE
    params = {"platform": "messenger", "fields": THREAD_FIELDS, "limit": PAGE_LIMIT}
    for _ in range(MAX_PAGES):
        ok, data = await graph_get(f"{page_id}/conversations", token, params=params)
        if not ok:
            logger.warning("Messenger recovery could not read conversations for Page %s", page_id)
            return
        threads = data.get("data", [])
        for thread in threads:
            updated = _timestamp(thread.get("updated_time"))
            if updated is not None and updated < since:
                continue
            messages = (thread.get("messages") or {}).get("data", [])
            for inbound in _unanswered_messages(page_id, messages, since, until):
                key = f"{account_id}:{inbound.external_message_id}"
                if not is_duplicate_message(ChannelType.MESSENGER.value, key, require_redis=True):
                    await process_channel_message(account_id, inbound)
                    logger.info("Processed a Messenger message via recovery for Page %s", page_id)
        paging = data.get("paging") or {}
        cursor = (paging.get("cursors") or {}).get("after")
        if not paging.get("next") or not cursor or not threads:
            return
        last_updated = _timestamp(threads[-1].get("updated_time"))
        if last_updated is not None and last_updated < since:
            return
        params["after"] = cursor


async def _recover_enabled_pages():
    with SessionLocal() as db:
        accounts = db.query(ChannelAccount).filter(
            ChannelAccount.channel_type == ChannelType.MESSENGER.value,
            ChannelAccount.is_active.is_(True),
            ChannelAccount.settings["messenger_recovery_since"].as_string().is_not(None),
        ).all()
        targets = []
        for account in accounts:
            since = _timestamp((account.settings or {}).get("messenger_recovery_since"))
            token = MetaBaseAdapter.access_token(account) if since else None
            if token:
                targets.append((account.id, account.external_account_id, token, since))
    for account_id, page_id, token, since in targets:
        try:
            await _recover_page(account_id, page_id, token, since)
        except Exception:
            logger.exception("Messenger recovery failed for Page %s", page_id)


async def run_messenger_recovery_loop():
    while True:
        try:
            await _recover_enabled_pages()
        except Exception:
            logger.exception("Messenger recovery tick failed")
        await asyncio.sleep(POLL_SECONDS)
