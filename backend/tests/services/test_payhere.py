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

PayHere signing and verification.

/billing/notify is a public endpoint that grants paid plans, so these are the
tests that decide whether a stranger can upgrade themselves for free. The
signature cases and the amount cases are separate on purpose: they defend
against different attacks, and the second one is the one a valid signature does
NOT cover.

The expected digests below are computed the way PayHere's own PHP sample does,
independently of the implementation, so a bug in our concatenation order cannot
make its own test pass.
"""

import hashlib

import pytest

from app.core.config import settings
from app.services import payhere


MERCHANT_ID = "1221234"
MERCHANT_SECRET = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMg=="


@pytest.fixture(autouse=True)
def payhere_config(monkeypatch):
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_ID", MERCHANT_ID)
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_SECRET", MERCHANT_SECRET)
    monkeypatch.setattr(settings, "PAYHERE_SANDBOX", True)


def _reference_hash(*parts: str) -> str:
    """PayHere's formula, written out longhand as their PHP sample does."""
    secret = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()
    return hashlib.md5(("".join(parts) + secret).encode()).hexdigest().upper()


# --- amount formatting ------------------------------------------------------

@pytest.mark.parametrize("cents,expected", [
    (0, "0.00"),
    (4900, "49.00"),
    (14900, "149.00"),
    (14901, "149.01"),      # the production pro price
    (49900, "499.00"),
    (1, "0.01"),
    (100000000, "1000000.00"),
])
def test_amount_is_formatted_to_two_decimals(cents, expected):
    """The signature is computed over this exact string, so one digit matters."""
    assert payhere.format_amount(cents) == expected


# --- checkout hash ----------------------------------------------------------

def test_checkout_hash_matches_payhere_formula():
    got = payhere.checkout_hash("order-1", "149.00", "LKR")
    assert got == _reference_hash(MERCHANT_ID, "order-1", "149.00", "LKR")


def test_checkout_hash_is_uppercase_hex():
    got = payhere.checkout_hash("order-1", "149.00", "LKR")
    assert got == got.upper()
    assert len(got) == 32


def test_checkout_hash_changes_with_every_signed_field():
    """No field may be ignored — an unsigned field is one an attacker can edit."""
    base = payhere.checkout_hash("order-1", "149.00", "LKR")
    assert payhere.checkout_hash("order-2", "149.00", "LKR") != base
    assert payhere.checkout_hash("order-1", "1.00", "LKR") != base
    assert payhere.checkout_hash("order-1", "149.00", "USD") != base


def test_merchant_secret_never_appears_in_checkout_fields():
    """The browser POSTs these. The secret would let it sign any price."""
    fields = payhere.build_checkout(
        order_id="order-1", amount_cents=14900, currency="LKR",
        items="Pro plan", first_name="A", last_name="B",
        email="a@b.com", phone="0771234567", address="1 St",
        city="Colombo", country="Sri Lanka",
        return_url="https://x/r", cancel_url="https://x/c",
        notify_url="https://x/n",
    )
    assert MERCHANT_SECRET not in "".join(str(v) for v in fields.values())
    assert fields["hash"] == _reference_hash(MERCHANT_ID, "order-1", "149.00", "LKR")


def test_recurring_fields_are_present_for_a_subscription():
    fields = payhere.build_checkout(
        order_id="o", amount_cents=4900, currency="LKR", items="Starter",
        first_name="A", last_name="B", email="a@b.com", phone="07",
        address="1", city="C", country="Sri Lanka",
        return_url="https://x/r", cancel_url="https://x/c", notify_url="https://x/n",
        recurring=True,
    )
    assert fields["recurrence"] == settings.PAYHERE_RECURRENCE
    assert fields["duration"] == settings.PAYHERE_DURATION


# --- notification verification ----------------------------------------------

def _sig(order_id="order-1", amount="149.00", currency="LKR", status="2"):
    return _reference_hash(MERCHANT_ID, order_id, amount, currency, status)


def test_genuine_notification_verifies():
    assert payhere.verify_notification(
        MERCHANT_ID, "order-1", "149.00", "LKR", "2", _sig()) is True


def test_lowercase_signature_still_verifies():
    """Case is not a security property, and rejecting it would drop real payments."""
    assert payhere.verify_notification(
        MERCHANT_ID, "order-1", "149.00", "LKR", "2", _sig().lower()) is True


@pytest.mark.parametrize("field,value", [
    ("order_id", "order-2"),
    ("amount", "1.00"),
    ("currency", "USD"),
    ("status", "0"),
])
def test_tampering_with_any_signed_field_is_rejected(field, value):
    """The forgery this endpoint exists to stop.

    A signature captured from a real 149.00 payment must not validate a replay
    claiming a different order, price, currency or outcome.
    """
    args = {"order_id": "order-1", "amount": "149.00",
            "currency": "LKR", "status": "2"}
    good = _sig(**args)
    args[field] = value
    assert payhere.verify_notification(
        MERCHANT_ID, args["order_id"], args["amount"],
        args["currency"], args["status"], good) is False


def test_forged_signature_is_rejected():
    assert payhere.verify_notification(
        MERCHANT_ID, "order-1", "149.00", "LKR", "2", "F" * 32) is False


def test_empty_signature_is_rejected():
    assert payhere.verify_notification(
        MERCHANT_ID, "order-1", "149.00", "LKR", "2", "") is False


def test_another_merchants_notification_is_rejected():
    other = _reference_hash("9999999", "order-1", "149.00", "LKR", "2")
    assert payhere.verify_notification(
        "9999999", "order-1", "149.00", "LKR", "2", other) is False


def test_verification_fails_closed_without_a_secret(monkeypatch):
    """Unconfigured must mean reject, never "skip the check".

    With no secret every signature is forgeable, so an implementation that
    treated absence as "nothing to verify against" would hand out free upgrades
    on any deployment that had not finished setting PayHere up.
    """
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_SECRET", "")
    assert payhere.verify_notification(
        MERCHANT_ID, "order-1", "149.00", "LKR", "2", _sig()) is False


# --- amount check, which the signature does NOT cover -----------------------

def test_amount_matches_accepts_equivalent_formatting():
    """PayHere's formatting is its own business, so compare numerically."""
    assert payhere.amount_matches(14900, "149.00") is True
    assert payhere.amount_matches(14900, "149.0") is True
    assert payhere.amount_matches(14900, "149") is True


def test_amount_matches_rejects_underpayment():
    """A genuine, correctly signed payment of the wrong price.

    This is the attack a signature check cannot see: pay 1.00 against a 149.00
    order and PayHere signs it faithfully, because it really did happen.
    """
    assert payhere.amount_matches(14900, "1.00") is False
    assert payhere.amount_matches(14900, "148.99") is False


def test_amount_matches_rejects_garbage():
    assert payhere.amount_matches(14900, "not-a-number") is False
    assert payhere.amount_matches(14900, "") is False


# --- configuration ----------------------------------------------------------

def test_sandbox_and_live_urls_are_distinct():
    assert payhere.SANDBOX_CHECKOUT_URL != payhere.LIVE_CHECKOUT_URL
    assert payhere.checkout_url() == payhere.SANDBOX_CHECKOUT_URL


def test_live_url_used_when_sandbox_is_off(monkeypatch):
    monkeypatch.setattr(settings, "PAYHERE_SANDBOX", False)
    assert payhere.checkout_url() == payhere.LIVE_CHECKOUT_URL


def test_is_configured_requires_both_credentials(monkeypatch):
    assert payhere.is_configured() is True
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_SECRET", "")
    assert payhere.is_configured() is False
