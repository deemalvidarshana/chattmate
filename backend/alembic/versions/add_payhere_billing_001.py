"""PayHere billing: orders and payment notifications

Revision ID: add_payhere_billing_001
Revises: add_platform_backups_001
Create Date: 2026-09-10

Adds a fourth head. The stack already runs `alembic upgrade heads` (plural,
docker-compose.growmiq.yml) so parallel heads are the norm here rather than a
mistake; branching off the newest feature head keeps this migration independent
of the unrelated upload-prefix and allow-new-chat lines.
"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "add_payhere_billing_001"
down_revision = "add_platform_backups_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "payhere_orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", sa.String(64), nullable=False),
        sa.Column("organization_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("plan_code", sa.String(32), nullable=False),
        # The quoted price, not the plan's current one — this is what the
        # notification's amount is checked against.
        sa.Column("amount_cents", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False),
        sa.Column("status", sa.String(16), nullable=False, server_default="pending"),
        sa.Column("subscription_id", sa.String(64), nullable=True),
        sa.Column("next_billing_date", sa.String(10), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True),
                  server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"],
                                ondelete="CASCADE"),
        sa.UniqueConstraint("order_id", name="uq_payhere_orders_order_id"),
    )
    op.create_index("ix_payhere_orders_order_id", "payhere_orders", ["order_id"])
    op.create_index("ix_payhere_orders_organization_id", "payhere_orders",
                    ["organization_id"])
    op.create_index("ix_payhere_orders_subscription_id", "payhere_orders",
                    ["subscription_id"])
    op.create_index("ix_payhere_orders_org_status", "payhere_orders",
                    ["organization_id", "status"])

    op.create_table(
        "payhere_payments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", sa.String(64), nullable=False),
        # Unique: PayHere retries notifications it believes were missed, and
        # this is what stops one installment being applied twice.
        sa.Column("payment_id", sa.String(64), nullable=True),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column("amount", sa.String(32), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False),
        sa.Column("message_type", sa.String(48), nullable=True),
        sa.Column("verified", sa.String(8), nullable=False, server_default="true"),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["order_id"], ["payhere_orders.order_id"],
                                ondelete="CASCADE"),
        sa.UniqueConstraint("payment_id", name="uq_payhere_payments_payment_id"),
    )
    op.create_index("ix_payhere_payments_order_id", "payhere_payments", ["order_id"])
    op.create_index("ix_payhere_payments_payment_id", "payhere_payments",
                    ["payment_id"])


def downgrade() -> None:
    op.drop_index("ix_payhere_payments_payment_id", table_name="payhere_payments")
    op.drop_index("ix_payhere_payments_order_id", table_name="payhere_payments")
    op.drop_table("payhere_payments")
    op.drop_index("ix_payhere_orders_org_status", table_name="payhere_orders")
    op.drop_index("ix_payhere_orders_subscription_id", table_name="payhere_orders")
    op.drop_index("ix_payhere_orders_organization_id", table_name="payhere_orders")
    op.drop_index("ix_payhere_orders_order_id", table_name="payhere_orders")
    op.drop_table("payhere_orders")
