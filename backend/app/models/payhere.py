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

What we charged, and what the gateway said about it.

Two tables rather than one. An *order* is our intent — this tenant asked to move
to this plan at this price — and is written before the customer ever reaches
PayHere. A *payment* is something that happened to the money, and PayHere sends
one per installment for the life of a subscription. Collapsing them would mean
either losing the renewal history or rewriting the original intent every month,
and the intent is the record that says what price was agreed.

The order is also what makes the amount check possible: it stores the price we
quoted, so a notification claiming a different figure can be recognised as one.
"""

import enum
import uuid

from sqlalchemy import (
    Column, DateTime, ForeignKey, Index, Integer, String, Text, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class PayHereOrderStatus(str, enum.Enum):
    """Where an upgrade attempt got to."""
    PENDING = "pending"        # signed, customer sent to PayHere, nothing back yet
    ACTIVE = "active"          # paid, plan applied
    CANCELED = "canceled"      # customer backed out, or subscription stopped
    FAILED = "failed"          # gateway declined
    CHARGEDBACK = "chargedback"


class PayHereOrder(Base):
    """One upgrade attempt: this tenant, this plan, this price."""

    __tablename__ = "payhere_orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # The order_id sent to PayHere and echoed back on every notification. Ours,
    # not theirs, so it is unique and readable in their dashboard.
    order_id = Column(String(64), unique=True, nullable=False, index=True)

    organization_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # The plan being bought. No FK cascade to plans: a plan may be retired while
    # this record still has to explain a charge that already happened.
    plan_code = Column(String(32), nullable=False)

    # What we quoted, in cents, at the moment of checkout. The plan's price may
    # change afterwards; what the customer agreed to may not.
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String(3), nullable=False)

    status = Column(String(16), nullable=False,
                    default=PayHereOrderStatus.PENDING.value)

    # PayHere's own subscription id, once a recurring authorization succeeds.
    # Absent on a one-off payment, and absent until the first notification.
    subscription_id = Column(String(64), nullable=True, index=True)
    # YYYY-MM-DD from item_rec_date_next, so the UI can say when the next
    # charge lands without asking PayHere.
    next_billing_date = Column(String(10), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(),
                        onupdate=func.now())

    organization = relationship("Organization")
    payments = relationship(
        "PayHerePayment", back_populates="order",
        cascade="all, delete-orphan", passive_deletes=True,
    )

    __table_args__ = (
        # "the current subscription for this tenant" is the only query the
        # billing page makes.
        Index("ix_payhere_orders_org_status", "organization_id", "status"),
    )

    def __repr__(self) -> str:
        return (f"<PayHereOrder {self.order_id} {self.plan_code} "
                f"{self.amount_cents} {self.status}>")


class PayHerePayment(Base):
    """One notification from PayHere about one movement of money.

    Every notification is recorded, including the rejected ones. A forged or
    mismatched notification that is silently dropped leaves nothing to look at
    when someone asks why an upgrade did not apply, so `verified` records the
    verdict rather than the row's existence implying it.
    """

    __tablename__ = "payhere_payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    order_id = Column(
        String(64),
        ForeignKey("payhere_orders.order_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # PayHere's payment id. Unique per installment, and the idempotency key:
    # PayHere retries a notification it thinks we missed, and applying the same
    # installment twice would extend a subscription nobody paid for.
    payment_id = Column(String(64), nullable=True, unique=True, index=True)

    status_code = Column(Integer, nullable=False)
    status = Column(String(16), nullable=False)

    amount = Column(String(32), nullable=False)
    currency = Column(String(3), nullable=False)

    # AUTHORIZATION_SUCCESS, RECURRING_INSTALLMENT_SUCCESS, RECURRING_STOPPED …
    message_type = Column(String(48), nullable=True)

    # False when the signature or the amount did not check out. Kept rather than
    # discarded — a run of these is what an attack looks like.
    verified = Column(String(8), nullable=False, default="true")
    rejection_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("PayHereOrder", back_populates="payments")

    def __repr__(self) -> str:
        return (f"<PayHerePayment {self.payment_id} {self.status} "
                f"{self.amount} {self.currency}>")
