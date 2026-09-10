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

Tenant-facing billing: buy a plan through PayHere, and hear back from it.

Three routes with three different trust levels, which is the thing to keep
straight while reading this:

  * /plans and /subscription are ordinary authenticated reads.
  * /checkout is authenticated and gated on manage_organization, because it
    commits the tenant to a price.
  * /notify is UNAUTHENTICATED. It is a public endpoint the internet can post
    to, and everything it believes comes from a signature check plus a price
    check. It is the only place in this file where the caller is not a
    customer we know.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, require_permissions
from app.core.config import settings
from app.core.logger import get_logger
from app.database import get_db
from app.models.organization import Organization
from app.models.payhere import PayHereOrder, PayHereOrderStatus, PayHerePayment
from app.models.plan import Plan
from app.models.user import User
from app.services import payhere

logger = get_logger(__name__)
router = APIRouter()


class CheckoutRequest(BaseModel):
    plan_code: str
    # PayHere requires a billing address. Collected at checkout rather than
    # stored on the org, because it is the cardholder's, not the workspace's.
    phone: str
    address: str
    city: str
    country: str = "Sri Lanka"


def _order_id(organization_id) -> str:
    """Readable in PayHere's dashboard, unique, and not guessable in bulk.

    Prefixed with the tenant so support can tell whose payment it is without a
    database lookup; suffixed with random hex so two upgrades in the same second
    cannot collide.
    """
    return f"gm-{str(organization_id)[:8]}-{uuid.uuid4().hex[:12]}"


@router.get("/plans")
async def list_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """The catalog, plus whether this deployment can actually charge for it.

    `payments_enabled` is false when PayHere has no credentials configured. The
    UI uses it to explain that rather than offering a button that cannot work.
    """
    plans = (
        db.query(Plan)
        .filter(Plan.is_active == True)  # noqa: E712 - SQL, not Python truthiness
        .order_by(Plan.sort_order)
        .all()
    )
    return {
        "payments_enabled": payhere.is_configured(),
        "sandbox": settings.PAYHERE_SANDBOX,
        "current_plan": current_user.organization.plan_code if current_user.organization else None,
        "plans": [p.to_dict() for p in plans],
    }


@router.get("/subscription")
async def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """This tenant's live subscription, if any."""
    order = (
        db.query(PayHereOrder)
        .filter(
            PayHereOrder.organization_id == current_user.organization_id,
            PayHereOrder.status == PayHereOrderStatus.ACTIVE.value,
        )
        .order_by(PayHereOrder.created_at.desc())
        .first()
    )
    if order is None:
        return {"active": False, "plan_code": current_user.organization.plan_code}

    return {
        "active": True,
        "plan_code": order.plan_code,
        "amount_cents": order.amount_cents,
        "currency": order.currency,
        "subscription_id": order.subscription_id,
        "next_billing_date": order.next_billing_date,
        "since": order.created_at.isoformat() if order.created_at else None,
    }


@router.post("/checkout")
async def create_checkout(
    payload: CheckoutRequest,
    current_user: User = Depends(require_permissions("manage_organization")),
    db: Session = Depends(get_db),
):
    """Sign a PayHere checkout for a plan change.

    Returns form fields for the browser to POST. The signature is made here
    because it needs the merchant secret, which is the one thing the browser
    must never see — if the client could sign, it could sign any price.
    """
    if not payhere.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payments are not configured for this deployment.",
        )

    plan = db.query(Plan).filter(
        Plan.code == payload.plan_code, Plan.is_active == True).first()  # noqa: E712
    if plan is None:
        raise HTTPException(status_code=404, detail="Plan not found")

    # A free plan has nothing to charge. Sending it to a gateway would produce a
    # zero-value transaction PayHere rejects, and the tenant would be stuck
    # looking at an error for a downgrade that needs no payment at all.
    if plan.price_cents <= 0:
        raise HTTPException(
            status_code=400,
            detail="This plan is free — no payment is required.",
        )

    currency = (plan.currency or settings.PAYHERE_DEFAULT_CURRENCY).upper()
    if currency not in payhere.SUPPORTED_CURRENCIES:
        raise HTTPException(
            status_code=400,
            detail=(f"PayHere cannot settle {currency}. Supported: "
                    f"{', '.join(payhere.SUPPORTED_CURRENCIES)}."),
        )

    order_id = _order_id(current_user.organization_id)

    # Written before the customer leaves for PayHere, so the notification has
    # something to match against when it comes back. An order with no row is a
    # notification we cannot price-check, which is the case we must not create.
    order = PayHereOrder(
        order_id=order_id,
        organization_id=current_user.organization_id,
        plan_code=plan.code,
        amount_cents=plan.price_cents,
        currency=currency,
        status=PayHereOrderStatus.PENDING.value,
    )
    db.add(order)
    db.commit()

    name = (current_user.full_name or current_user.email or "").strip()
    first, _, last = name.partition(" ")

    fields = payhere.build_checkout(
        order_id=order_id,
        amount_cents=plan.price_cents,
        currency=currency,
        items=f"{settings.PROJECT_NAME} — {plan.name} plan",
        first_name=first or "Customer",
        last_name=last or "-",
        email=current_user.email,
        phone=payload.phone,
        address=payload.address,
        city=payload.city,
        country=payload.country,
        return_url=f"{settings.FRONTEND_URL}/settings/billing?paid={order_id}",
        cancel_url=f"{settings.FRONTEND_URL}/settings/billing?canceled=1",
        notify_url=f"{settings.BACKEND_URL}{settings.API_V1_STR}/billing/notify",
        recurring=True,
        custom_1=str(current_user.organization_id),
        custom_2=plan.code,
    )

    logger.info("PayHere checkout created: order=%s org=%s plan=%s %s %s",
                order_id, current_user.organization_id, plan.code,
                payhere.format_amount(plan.price_cents), currency)

    return {"action": payhere.checkout_url(), "fields": fields}


@router.post("/notify")
async def payhere_notify(request: Request, db: Session = Depends(get_db)):
    """PayHere's server-to-server payment notification. Unauthenticated.

    Always answers 200. PayHere retries anything else, and a rejected forgery is
    not a delivery failure — retrying it would achieve nothing except filling
    the log. What actually happened is recorded in payhere_payments, including
    for the notifications we refuse.

    The order of checks matters. Signature first, because until it passes none
    of the other fields mean anything. Then the amount, because a valid
    signature only proves PayHere sent the message, not that it charged what we
    asked for — a real payment of 1.00 against our order is correctly signed.
    """
    form = await request.form()

    merchant_id = str(form.get("merchant_id") or "")
    order_id = str(form.get("order_id") or "")
    payment_id = str(form.get("payment_id") or "") or None
    amount = str(form.get("payhere_amount") or "")
    currency = str(form.get("payhere_currency") or "")
    status_code_raw = str(form.get("status_code") or "")
    md5sig = str(form.get("md5sig") or "")
    message_type = str(form.get("message_type") or "") or None
    subscription_id = str(form.get("subscription_id") or "") or None
    next_date = str(form.get("item_rec_date_next") or "") or None

    def _reject(reason: str, status_code: int = 0):
        logger.warning("PayHere notification rejected (%s): order=%s payment=%s",
                       reason, order_id, payment_id)
        # Recorded against the order only if one exists — a bogus order_id must
        # not create a row that a real payment could later collide with.
        if db.query(PayHereOrder).filter(
                PayHereOrder.order_id == order_id).first() is not None:
            db.add(PayHerePayment(
                order_id=order_id, payment_id=payment_id,
                status_code=status_code, status="rejected",
                amount=amount or "0", currency=currency or "---",
                message_type=message_type, verified="false",
                rejection_reason=reason,
            ))
            db.commit()
        return {"status": "rejected"}

    if not payhere.verify_notification(
            merchant_id, order_id, amount, currency, status_code_raw, md5sig):
        return _reject("signature")

    try:
        status_code = int(status_code_raw)
    except ValueError:
        return _reject("unparseable status_code")

    order = db.query(PayHereOrder).filter(
        PayHereOrder.order_id == order_id).first()
    if order is None:
        # Correctly signed but for an order we never created. Nothing to apply.
        logger.warning("PayHere notification for unknown order %s", order_id)
        return {"status": "unknown-order"}

    # Idempotency. PayHere resends a notification it believes we missed, and
    # applying the same installment twice would extend a subscription nobody
    # paid for a second time.
    if payment_id and db.query(PayHerePayment).filter(
            PayHerePayment.payment_id == payment_id).first() is not None:
        logger.info("PayHere notification %s already processed", payment_id)
        return {"status": "duplicate"}

    # A valid signature over the wrong price is still the wrong price.
    if status_code == payhere.STATUS_SUCCESS and not payhere.amount_matches(
            order.amount_cents, amount):
        return _reject(
            f"amount mismatch: charged {amount} {currency}, "
            f"expected {payhere.format_amount(order.amount_cents)} {order.currency}",
            status_code,
        )

    if status_code == payhere.STATUS_SUCCESS and currency.upper() != order.currency:
        return _reject(
            f"currency mismatch: charged {currency}, expected {order.currency}",
            status_code,
        )

    label = payhere.STATUS_LABELS.get(status_code, "unknown")
    db.add(PayHerePayment(
        order_id=order_id, payment_id=payment_id,
        status_code=status_code, status=label,
        amount=amount, currency=currency,
        message_type=message_type, verified="true",
    ))

    if subscription_id:
        order.subscription_id = subscription_id
    if next_date:
        order.next_billing_date = next_date

    organization = db.query(Organization).filter(
        Organization.id == order.organization_id).first()

    if status_code == payhere.STATUS_SUCCESS:
        order.status = PayHereOrderStatus.ACTIVE.value
        if organization is not None and organization.plan_code != order.plan_code:
            previous = organization.plan_code
            organization.plan_code = order.plan_code
            logger.info("Plan changed by payment: org=%s %s -> %s (order %s)",
                        organization.id, previous, order.plan_code, order_id)
    elif status_code == payhere.STATUS_CANCELED:
        order.status = PayHereOrderStatus.CANCELED.value
    elif status_code == payhere.STATUS_FAILED:
        order.status = PayHereOrderStatus.FAILED.value
    elif status_code == payhere.STATUS_CHARGEDBACK:
        order.status = PayHereOrderStatus.CHARGEDBACK.value
        # Deliberately does NOT downgrade the plan. A chargeback needs a human
        # to look at it — reversing service automatically on a disputed charge
        # cuts off a customer who may be in the right.
        logger.error(
            "PayHere chargeback on order %s (org %s, plan %s) — plan left in "
            "place for manual review",
            order_id, order.organization_id, order.plan_code,
        )

    # RECURRING_STOPPED / RECURRING_COMPLETE end the subscription without being
    # a failed payment, so they are handled by message type rather than status.
    if message_type in ("RECURRING_STOPPED", "RECURRING_COMPLETE"):
        order.status = PayHereOrderStatus.CANCELED.value
        logger.info("PayHere subscription %s ended (%s) for org %s",
                    subscription_id, message_type, order.organization_id)

    db.commit()
    return {"status": "ok"}
