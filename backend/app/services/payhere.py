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

PayHere checkout signing and notification verification.

Two signatures, one secret. The outbound `hash` proves to PayHere that a
checkout came from us; the inbound `md5sig` proves to us that a notification
came from PayHere. Both are documented at
https://support.payhere.lk/api-&-mobile-sdk/checkout-api and both are MD5 —
that is PayHere's protocol, not a choice available to us, which is exactly why
the amount is re-checked against the plan in the caller rather than trusted
because the signature matched.

The merchant secret never leaves this module. The checkout parameters it
returns are safe to hand to a browser; the secret that signed them is not.
"""

import hashlib
import hmac
from decimal import ROUND_HALF_UP, Decimal
from typing import Optional

from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

LIVE_CHECKOUT_URL = "https://www.payhere.lk/pay/checkout"
SANDBOX_CHECKOUT_URL = "https://sandbox.payhere.lk/pay/checkout"

# PayHere's status_code, as sent to notify_url.
STATUS_SUCCESS = 2
STATUS_PENDING = 0
STATUS_CANCELED = -1
STATUS_FAILED = -2
STATUS_CHARGEDBACK = -3

STATUS_LABELS = {
    STATUS_SUCCESS: "success",
    STATUS_PENDING: "pending",
    STATUS_CANCELED: "canceled",
    STATUS_FAILED: "failed",
    STATUS_CHARGEDBACK: "chargedback",
}

# Currencies PayHere will settle. A plan priced in anything else cannot be
# charged, and saying so at checkout beats a gateway rejection the visitor
# cannot interpret.
SUPPORTED_CURRENCIES = ("LKR", "USD", "GBP", "EUR", "AUD")


def is_configured() -> bool:
    """Whether this deployment can take a payment at all.

    Checked before offering an upgrade button rather than after the visitor
    presses it: a checkout that 500s is a worse answer than a page that says
    payments are not set up yet.
    """
    return bool(settings.PAYHERE_MERCHANT_ID and settings.PAYHERE_MERCHANT_SECRET)


def checkout_url() -> str:
    return SANDBOX_CHECKOUT_URL if settings.PAYHERE_SANDBOX else LIVE_CHECKOUT_URL


def format_amount(cents: int) -> str:
    """Cents to PayHere's `1000.00`.

    Via Decimal rather than float: `f"{19.99:.2f}"` is fine, but money that has
    been through a binary float has already lost the argument. The signature is
    computed over this exact string, so a formatting difference of one digit is
    a rejected payment.
    """
    return str((Decimal(cents) / Decimal(100)).quantize(
        Decimal("0.01"), rounding=ROUND_HALF_UP))


def _md5_upper(raw: str) -> str:
    return hashlib.md5(raw.encode("utf-8")).hexdigest().upper()


def _hashed_secret() -> str:
    return _md5_upper(settings.PAYHERE_MERCHANT_SECRET)


def checkout_hash(order_id: str, amount: str, currency: str) -> str:
    """PayHere's documented formula:

        hash = upper(md5(merchant_id + order_id + amount + currency
                         + upper(md5(merchant_secret))))

    `amount` must already be the formatted string that will be POSTed, not a
    number — see format_amount.
    """
    return _md5_upper(
        f"{settings.PAYHERE_MERCHANT_ID}{order_id}{amount}{currency}{_hashed_secret()}"
    )


def verify_notification(
    merchant_id: str,
    order_id: str,
    payhere_amount: str,
    payhere_currency: str,
    status_code: str,
    md5sig: str,
) -> bool:
    """Whether a notification really came from PayHere.

        md5sig = upper(md5(merchant_id + order_id + payhere_amount
                           + payhere_currency + status_code
                           + upper(md5(merchant_secret))))

    Fails closed on every unexpected input, including an unset secret: without a
    secret every signature is forgeable, so "not configured" must mean "reject",
    never "skip the check".

    Note what this does and does not prove. It proves PayHere sent the message.
    It does NOT prove the amount is the one we asked for — the values are inputs
    to the signature, so a real PayHere payment of 1.00 against our order carries
    a perfectly valid md5sig. The caller must compare the amount to the plan.
    """
    if not settings.PAYHERE_MERCHANT_SECRET:
        logger.error(
            "PayHere notification rejected: no merchant secret configured, so "
            "its signature cannot be verified"
        )
        return False

    if not md5sig:
        logger.warning("PayHere notification rejected: no md5sig supplied")
        return False

    # The merchant id is part of the signed payload, but check it separately so
    # a notification aimed at a different merchant is refused with a clear
    # reason instead of a generic signature mismatch.
    if merchant_id != settings.PAYHERE_MERCHANT_ID:
        logger.warning(
            "PayHere notification rejected: merchant_id %r is not ours", merchant_id)
        return False

    expected = _md5_upper(
        f"{merchant_id}{order_id}{payhere_amount}{payhere_currency}"
        f"{status_code}{_hashed_secret()}"
    )

    # Constant-time: the signature is the whole security boundary, and an
    # early-exit compare leaks how much of a guess was right.
    if not hmac.compare_digest(expected, (md5sig or "").upper()):
        logger.warning(
            "PayHere notification rejected: signature mismatch for order %r", order_id)
        return False

    return True


def amount_matches(expected_cents: int, payhere_amount: str) -> bool:
    """Whether the gateway charged what the plan costs.

    The second half of verification, and the half a valid signature does not
    give us. Compared as Decimal so "149.00", "149.0" and "149" agree, because
    PayHere's formatting is its business rather than a contract we control.
    """
    try:
        paid = Decimal(str(payhere_amount))
    except Exception:
        logger.warning("PayHere sent an unparseable amount: %r", payhere_amount)
        return False
    return paid == (Decimal(expected_cents) / Decimal(100))


def build_checkout(
    *,
    order_id: str,
    amount_cents: int,
    currency: str,
    items: str,
    first_name: str,
    last_name: str,
    email: str,
    phone: str,
    address: str,
    city: str,
    country: str,
    return_url: str,
    cancel_url: str,
    notify_url: str,
    recurring: bool = True,
    custom_1: Optional[str] = None,
    custom_2: Optional[str] = None,
) -> dict:
    """The exact form fields to POST to PayHere, signed.

    Returned rather than posted here: PayHere's checkout is a browser redirect
    the customer has to see, so the form is submitted client-side. Only the
    signature is computed server-side, which is the whole point — the browser
    gets a hash it could not have produced itself.
    """
    amount = format_amount(amount_cents)
    fields = {
        "merchant_id": settings.PAYHERE_MERCHANT_ID,
        "return_url": return_url,
        "cancel_url": cancel_url,
        "notify_url": notify_url,
        "order_id": order_id,
        "items": items,
        "currency": currency,
        "amount": amount,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "phone": phone,
        "address": address,
        "city": city,
        "country": country,
        "hash": checkout_hash(order_id, amount, currency),
    }
    if recurring:
        fields["recurrence"] = settings.PAYHERE_RECURRENCE
        fields["duration"] = settings.PAYHERE_DURATION
    if custom_1:
        fields["custom_1"] = custom_1
    if custom_2:
        fields["custom_2"] = custom_2
    return fields
