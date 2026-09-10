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

The /billing/notify endpoint, end to end.

This is the route that upgrades a paying customer, and it is open to the
internet — PayHere posts to it server-to-server, so there is no session to
authenticate. Everything it grants rests on two checks, and these tests exist to
make sure neither can be skipped: the signature (did PayHere really send this)
and the amount (did it charge what we asked).

The endpoint answers 200 to everything on purpose. PayHere retries any other
status, and a rejected forgery is not a delivery failure worth retrying — so
"was it applied?" is asserted against the database, never against the status
code.
"""

import hashlib

import pytest
from fastapi.testclient import TestClient

from app.core.auth import get_current_user, require_permissions
from app.core.config import settings
from app.core.application import app
from app.database import get_db
from app.models.organization import Organization
from app.models.payhere import PayHereOrder, PayHereOrderStatus, PayHerePayment
from app.models.plan import Plan
from app.models.user import User
from app.services import payhere


MERCHANT_ID = "1221234"
MERCHANT_SECRET = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMg=="
NOTIFY = f"{settings.API_V1_STR}/billing/notify"


@pytest.fixture(autouse=True)
def payhere_config(monkeypatch):
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_ID", MERCHANT_ID)
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_SECRET", MERCHANT_SECRET)
    monkeypatch.setattr(settings, "PAYHERE_SANDBOX", True)


@pytest.fixture
def plans(db):
    for code, name, price in [("free", "Free", 0), ("pro", "Pro", 14900)]:
        db.add(Plan(code=code, name=name, price_cents=price, currency="LKR",
                    sort_order=0 if code == "free" else 1,
                    is_active=True, is_default=(code == "free")))
    db.commit()
    return db.query(Plan).all()


@pytest.fixture
def org(db, test_organization, plans):
    test_organization.plan_code = "free"
    db.commit()
    db.refresh(test_organization)
    return test_organization


@pytest.fixture
def order(db, org):
    o = PayHereOrder(
        order_id="gm-test-0001", organization_id=org.id, plan_code="pro",
        amount_cents=14900, currency="LKR",
        status=PayHereOrderStatus.PENDING.value,
    )
    db.add(o)
    db.commit()
    db.refresh(o)
    return o


@pytest.fixture
def client(db, test_user: User) -> TestClient:
    async def _user():
        return test_user

    async def _perms(*args, **kwargs):
        return test_user

    def _db():
        yield db

    app.dependency_overrides[get_current_user] = _user
    app.dependency_overrides[require_permissions] = _perms
    app.dependency_overrides[get_db] = _db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides = {}


def _sig(order_id, amount, currency, status):
    secret = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()
    return hashlib.md5(
        f"{MERCHANT_ID}{order_id}{amount}{currency}{status}{secret}".encode()
    ).hexdigest().upper()


def _notify(order_id="gm-test-0001", amount="149.00", currency="LKR",
            status="2", payment_id="pay-1", sig=None, **extra):
    body = {
        "merchant_id": MERCHANT_ID,
        "order_id": order_id,
        "payment_id": payment_id,
        "payhere_amount": amount,
        "payhere_currency": currency,
        "status_code": status,
        "md5sig": sig if sig is not None else _sig(order_id, amount, currency, status),
    }
    body.update(extra)
    return body


# --- the happy path ---------------------------------------------------------

def test_successful_payment_activates_the_plan(client, db, org, order):
    r = client.post(NOTIFY, data=_notify())
    assert r.status_code == 200

    db.refresh(order)
    db.refresh(org)
    assert order.status == PayHereOrderStatus.ACTIVE.value
    assert org.plan_code == "pro"


def test_successful_payment_is_recorded(client, db, order):
    client.post(NOTIFY, data=_notify(subscription_id="sub-9",
                                     item_rec_date_next="2026-10-10"))
    payment = db.query(PayHerePayment).filter(
        PayHerePayment.payment_id == "pay-1").first()
    assert payment is not None
    assert payment.status == "success"
    assert payment.verified == "true"

    db.refresh(order)
    assert order.subscription_id == "sub-9"
    assert order.next_billing_date == "2026-10-10"


# --- forgery ----------------------------------------------------------------

def test_forged_signature_does_not_upgrade(client, db, org, order):
    """The whole reason this endpoint can be public."""
    r = client.post(NOTIFY, data=_notify(sig="F" * 32))
    assert r.status_code == 200
    assert r.json()["status"] == "rejected"

    db.refresh(order)
    db.refresh(org)
    assert order.status == PayHereOrderStatus.PENDING.value
    assert org.plan_code == "free"


def test_unsigned_notification_does_not_upgrade(client, db, org, order):
    client.post(NOTIFY, data=_notify(sig=""))
    db.refresh(org)
    assert org.plan_code == "free"


def test_rejected_notification_is_recorded_for_review(client, db, order):
    """A dropped forgery leaves nothing to look at when someone asks why."""
    client.post(NOTIFY, data=_notify(sig="F" * 32))
    payment = db.query(PayHerePayment).filter(
        PayHerePayment.order_id == "gm-test-0001").first()
    assert payment is not None
    assert payment.verified == "false"
    assert "signature" in (payment.rejection_reason or "")


# --- underpayment: correctly signed, wrong price ----------------------------

def test_underpayment_does_not_upgrade(client, db, org, order):
    """The attack a signature check cannot see.

    PayHere signs a real 1.00 payment against our order faithfully, because it
    really happened. Only comparing against the quoted price catches it.
    """
    r = client.post(NOTIFY, data=_notify(amount="1.00"))
    assert r.status_code == 200
    assert r.json()["status"] == "rejected"

    db.refresh(org)
    db.refresh(order)
    assert org.plan_code == "free"
    assert order.status == PayHereOrderStatus.PENDING.value


def test_underpayment_records_the_reason(client, db, order):
    client.post(NOTIFY, data=_notify(amount="1.00"))
    payment = db.query(PayHerePayment).filter(
        PayHerePayment.order_id == "gm-test-0001").first()
    assert payment.verified == "false"
    assert "amount mismatch" in payment.rejection_reason


def test_currency_swap_does_not_upgrade(client, db, org, order):
    """149.00 USD is not 149.00 LKR, and the signature is happy with either."""
    client.post(NOTIFY, data=_notify(currency="USD"))
    db.refresh(org)
    assert org.plan_code == "free"


# --- idempotency ------------------------------------------------------------

def test_replayed_notification_is_ignored(client, db, org, order):
    """PayHere retries anything it thinks we missed."""
    client.post(NOTIFY, data=_notify())
    r = client.post(NOTIFY, data=_notify())
    assert r.json()["status"] == "duplicate"

    payments = db.query(PayHerePayment).filter(
        PayHerePayment.order_id == "gm-test-0001").count()
    assert payments == 1


# --- states other than success ----------------------------------------------

@pytest.mark.parametrize("status_code,expected", [
    ("-1", PayHereOrderStatus.CANCELED.value),
    ("-2", PayHereOrderStatus.FAILED.value),
])
def test_unsuccessful_payment_leaves_the_plan_alone(
        client, db, org, order, status_code, expected):
    client.post(NOTIFY, data=_notify(status=status_code))
    db.refresh(order)
    db.refresh(org)
    assert order.status == expected
    assert org.plan_code == "free"


def test_chargeback_flags_but_does_not_downgrade(client, db, org, order):
    """A disputed charge needs a human.

    Cutting service off automatically would punish a customer who may be in the
    right, and the dispute can be resolved in their favour.
    """
    client.post(NOTIFY, data=_notify())          # pay first
    db.refresh(org)
    assert org.plan_code == "pro"

    client.post(NOTIFY, data=_notify(status="-3", payment_id="pay-2"))
    db.refresh(order)
    db.refresh(org)
    assert order.status == PayHereOrderStatus.CHARGEDBACK.value
    assert org.plan_code == "pro"


def test_subscription_stopped_ends_the_order(client, db, order):
    client.post(NOTIFY, data=_notify(message_type="RECURRING_STOPPED"))
    db.refresh(order)
    assert order.status == PayHereOrderStatus.CANCELED.value


# --- unknown orders ---------------------------------------------------------

def test_notification_for_unknown_order_is_ignored(client, db, org):
    """Correctly signed, but for an order we never created."""
    r = client.post(NOTIFY, data=_notify(order_id="gm-does-not-exist"))
    assert r.json()["status"] == "unknown-order"
    db.refresh(org)
    assert org.plan_code == "free"


def test_unknown_order_creates_no_payment_row(client, db):
    """A bogus order_id must not seed a row a real payment could collide with."""
    client.post(NOTIFY, data=_notify(order_id="gm-does-not-exist"))
    assert db.query(PayHerePayment).filter(
        PayHerePayment.order_id == "gm-does-not-exist").count() == 0


# --- checkout ---------------------------------------------------------------

def test_checkout_returns_signed_fields(client, db, org, plans):
    r = client.post(f"{settings.API_V1_STR}/billing/checkout", json={
        "plan_code": "pro", "phone": "0771234567",
        "address": "1 Main St", "city": "Colombo", "country": "Sri Lanka",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["action"] == payhere.SANDBOX_CHECKOUT_URL
    assert body["fields"]["amount"] == "149.00"
    assert body["fields"]["currency"] == "LKR"
    assert len(body["fields"]["hash"]) == 32


def test_checkout_records_the_quoted_price(client, db, org, plans):
    """The order is what the notification's amount is later checked against."""
    r = client.post(f"{settings.API_V1_STR}/billing/checkout", json={
        "plan_code": "pro", "phone": "07", "address": "1",
        "city": "Colombo", "country": "Sri Lanka",
    })
    order_id = r.json()["fields"]["order_id"]
    saved = db.query(PayHereOrder).filter(
        PayHereOrder.order_id == order_id).first()
    assert saved.amount_cents == 14900
    assert saved.status == PayHereOrderStatus.PENDING.value


def test_checkout_never_leaks_the_merchant_secret(client, db, org, plans):
    r = client.post(f"{settings.API_V1_STR}/billing/checkout", json={
        "plan_code": "pro", "phone": "07", "address": "1",
        "city": "Colombo", "country": "Sri Lanka",
    })
    assert MERCHANT_SECRET not in r.text


def test_checkout_refuses_a_free_plan(client, db, org, plans):
    """Nothing to charge; the gateway would reject a zero-value transaction."""
    r = client.post(f"{settings.API_V1_STR}/billing/checkout", json={
        "plan_code": "free", "phone": "07", "address": "1",
        "city": "Colombo", "country": "Sri Lanka",
    })
    assert r.status_code == 400


def test_checkout_unavailable_when_payhere_is_not_configured(
        client, db, org, plans, monkeypatch):
    monkeypatch.setattr(settings, "PAYHERE_MERCHANT_SECRET", "")
    r = client.post(f"{settings.API_V1_STR}/billing/checkout", json={
        "plan_code": "pro", "phone": "07", "address": "1",
        "city": "Colombo", "country": "Sri Lanka",
    })
    assert r.status_code == 503
