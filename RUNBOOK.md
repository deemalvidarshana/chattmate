# ChatterMate — Operations Runbook

Production: **https://chat.growmiq.io** · VPS `187.77.156.57` (`srv1541176`, Ubuntu 24.04)

> This VPS also runs **Checkfunnel** (Django/daphne/celery, natively — not in Docker).
> ChatterMate must never take it down. Everything below is scoped to the
> `chattermate` compose project and touches nothing of Checkfunnel's.

---

## Access

```bash
ssh -i ~/.ssh/checkfunnel_ci_deploy root@187.77.156.57
```

Password authentication is **disabled** (`/etc/ssh/sshd_config.d/01-hardening.conf`).
Key auth only. If the key is ever lost, recover through the Hostinger VNC console —
there is no password fallback by design.

---

## Layout

| | |
|---|---|
| App directory | `/opt/chattermate` |
| Compose project | `chattermate` |
| Compose file | `docker-compose.growmiq.yml` |
| Secrets | `backend/.env`, `.env.growmiq` (mode 600) |
| Backups | `/var/backups/chattermate` |
| nginx vhost | `/etc/nginx/sites-available/chattermate` |
| TLS | `/etc/letsencrypt/live/chat.growmiq.io/` |

Everything is published on **loopback only** — the host nginx is the sole public entry.

| Service | Address |
|---|---|
| backend | `127.0.0.1:8080` (8000 belongs to Checkfunnel's daphne) |
| frontend | `127.0.0.1:3080` |
| postgres, redis | not published at all — private network only |

The standard compose shortcut, used throughout:

```bash
cd /opt/chattermate
alias dc='docker compose -p chattermate -f docker-compose.growmiq.yml --env-file .env.growmiq'
```

---

## Everyday commands

```bash
dc ps                          # what's running
dc logs -f backend             # follow backend
dc logs --tail=100 knowledge_processor
dc restart backend
/opt/chattermate/scripts/deploy.sh              # sync-built code, rebuild, restart, verify
/opt/chattermate/scripts/deploy.sh --no-build   # restart only
/usr/local/bin/chattermate-health.sh            # run the health check now
```

---

## Automation already in place

| What | When | Where |
|---|---|---|
| Backup (db + uploads + env) | 02:15 daily | `/etc/cron.d/chattermate-backup` → `/var/log/chattermate-backup.log` |
| Restore rehearsal | 03:40 Sundays | same cron → `/var/log/chattermate-restore-check.log` |
| Health check | every 10 min | `/etc/cron.d/chattermate-health` → `/var/log/chattermate-health.log` |
| TLS renewal | certbot timer | `systemctl list-timers | grep certbot` |

02:15 is deliberate — Checkfunnel's own backup runs at midnight, and two `pg_dump`s
on 2 vCPU would contend.

---

## Backup and restore

```bash
/usr/local/bin/chattermate-backup.sh            # run one now
/usr/local/bin/chattermate-restore.sh --list    # what's available
```

Each night produces three files sharing a timestamp. **All three are needed for a
real recovery:**

- `db-<stamp>.dump` — the database
- `uploads-<stamp>.tar.gz` — attachments and knowledge files (on disk, not in the DB)
- `env-<stamp>.tar.gz` — **contains `ENCRYPTION_KEY`**

That last one is the trap. Message bodies, agent memory and stored provider
credentials are encrypted with `ENCRYPTION_KEY`. Restore a database without it and
you get unreadable ciphertext. Keep a copy somewhere other than the VPS.

**Rehearse a restore (safe — throwaway container, production untouched):**

```bash
/usr/local/bin/chattermate-restore.sh --verify /var/backups/chattermate/db-<stamp>.dump
```

**Restore into production (destructive — asks for confirmation):**

```bash
/usr/local/bin/chattermate-restore.sh --into-live /var/backups/chattermate/db-<stamp>.dump
# then, if uploads were lost too:
docker run --rm -i -v chattermate_uploads:/data -w /data alpine:3 tar xzf - < uploads-<stamp>.tar.gz
```

> ⚠️ **The host cron's backups live only on this VPS.** A disk failure loses both
> the database and its backups. Either set `OFFSITE_RCLONE_REMOTE` in
> `/etc/chattermate-backup.env`, or use the console's OneDrive destination below.

### Console backups (Backups & recovery)

The operator console has its own backup path, independent of the host cron above.
It produces a single encrypted archive rather than three files:

```
chattermate-backup-<stamp>.cmbk
  database.dump   pg_dump custom format
  uploads/        attachments and knowledge files
  RESTORE.txt     the instructions, inside the archive
```

Two destinations: **Download to local computer** (built, streamed once, then
deleted from the server) and **Microsoft OneDrive**, which also runs on a
schedule set in the console.

**The archive is encrypted with a key derived from `ENCRYPTION_KEY`.** That is
what makes it safe to hand to Microsoft — what lands in OneDrive is ciphertext,
so a compromised Microsoft account yields nothing readable. It is also why the
same warning as above applies twice over: **keep `ENCRYPTION_KEY` somewhere other
than this VPS**, or the archives cannot be opened at all.

To restore one:

```bash
ENCRYPTION_KEY=... python backend/scripts/restore_backup.py backup.cmbk --out backup.tar.gz
tar xzf backup.tar.gz
pg_restore --clean --if-exists --no-owner --no-acl -d "$DATABASE_URL" database.dump
```

`restore_backup.py` imports nothing from the application on purpose — it runs
from a checkout on a laptop when this server no longer exists. It refuses to
write anything if the archive was truncated or modified, or if the key is wrong.

**Connecting OneDrive** needs a Microsoft Entra app registration with the
`Files.ReadWrite.All` **application** permission and admin consent granted.
Delegated permission is not enough — an unattended 02:00 upload has no browser to
sign in with. `Connect & test` writes a probe file into the destination folder and
deletes it, so a read-only grant fails there rather than at 02:00.

---

## Signup control

Signup is currently **OPEN** (`ALLOW_PUBLIC_SIGNUP=true` in `backend/.env`) — reopened
on 12 Aug for testing. Anyone with the URL can create a workspace.

Outstanding risks while it stays open: verification is **soft** — mail is
delivered, but an unverified user can still sign in, so addresses are prompted
for rather than proven (flip `REQUIRE_EMAIL_VERIFICATION` to change that); no
usage metering (one tenant can spend the whole AI budget); and backups still
only on this VPS.

```bash
# close it
sed -i 's/^ALLOW_PUBLIC_SIGNUP=.*/ALLOW_PUBLIC_SIGNUP=false/' /opt/chattermate/backend/.env && dc up -d backend
# open it
sed -i 's/^ALLOW_PUBLIC_SIGNUP=.*/ALLOW_PUBLIC_SIGNUP=true/'  /opt/chattermate/backend/.env && dc up -d backend
```

Closed, `POST /api/v1/organizations` returns `403 Signups are currently closed.`
Existing users can always still log in either way — the flag gates registration only.

Related knob in the same file: `SIGNUP_RATE_LIMIT_PER_HOUR` (default 20, per IP).

Password policy has exactly one home — `MIN_PASSWORD_LENGTH` and
`MIN_PASSWORD_CHARACTER_CLASSES` in `backend/app/core/security.py` (8 characters,
3 of 4 character classes). Signup, invitations, admin resets and the public
password reset all run through the same validator. There is deliberately **no**
signup-specific length setting: when one existed, it drifted out of step with the
checklist the UI shows and signups failed against rules the user had just met.

---

## Platform email (verification and password reset)

**Configured and delivering** as of 13 Aug 2026, via Gmail SMTP.

| Setting | Value |
|---|---|
| Host / port | `smtp.gmail.com:587` (STARTTLS) |
| Account | `ai.checkfunnel@gmail.com` (Google App Password, app name "chattermate") |
| From | `ChatterMate <ai.checkfunnel@gmail.com>` |

Two things about this account that are easy to get wrong:

- **`FROM_EMAIL` must equal `SMTP_USERNAME`.** Gmail will not send as an
  arbitrary address; a mismatch either bounces or is silently rewritten to the
  authenticated mailbox. To send as `noreply@growmiq.io`, first add it under
  Gmail → Settings → Accounts → *Send mail as* and verify it, then change
  `FROM_EMAIL`.
- **The App Password is stored with its spaces removed.** Google displays it as
  four groups of four for readability; the spaces are not part of the secret and
  `smtplib` would transmit them verbatim.

Gmail caps sending at roughly **500 messages/day**. That is comfortable for early
customers but is a hard ceiling — move to a transactional provider (Resend,
SendGrid, Mailgun) before signup volume approaches it, which also gets mail off a
`gmail.com` sender address and onto the growmiq.io domain with its own SPF/DKIM.

STARTTLS is **required** on non-465 ports: a server that refuses it makes the
send fail rather than fall back to plaintext, because these messages carry live
credentials.

If credentials are ever removed, `is_configured()` returns false and the system
degrades deliberately rather than silently — signup still succeeds but reports
`email_verification_sent: false`, and password reset answers `503` rather than
accepting a request it cannot fulfil.

### Rotating the credential

```bash
# in /opt/chattermate/backend/.env  (mode 600)
SMTP_PASSWORD=<new app password, spaces stripped>
```
Then `dc up -d backend`. Verify before relying on it:
```bash
docker exec -i chattermate-backend-1 python - <<'EOF'
import smtplib
from app.core.config import settings
s = smtplib.SMTP(settings.SMTP_SERVER, int(settings.SMTP_PORT), timeout=20)
s.starttls(); s.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
print("SMTP AUTH: OK"); s.quit()
EOF
```

This is separate from the customer-support **email channel**
(`app/channels/email.py`), which uses each organization's own inbox credentials.
Platform mail always goes out as the platform, and never through a tenant's
mail server.

### Requiring verification

`REQUIRE_EMAIL_VERIFICATION` (default `false`) decides whether an unverified user
is blocked from signing in.

- **`false` (current)** — the account works immediately; a dismissible banner
  prompts for verification. Chosen as the default because verification depends on
  SMTP, and a mail outage under `true` locks out every new customer with no way to
  trigger the mail that would let them back in.
- **`true`** — signup issues no session at all (no cookies, no tokens) and shows
  "check your inbox"; login returns `403` until the link is clicked.

Flip it only once mail delivery is proven in production. Verified behaviour of
both modes, tested 12 Aug: under `true`, a wrong password still returns `401` and
not `403`, so the gate never reveals that an account exists to someone who does
not already know the password.

### Endpoints

All unauthenticated, all rate limited by IP, all non-disclosing by design —
a password-reset request answers identically whether the address exists or not.

| Route | Purpose |
|---|---|
| `POST /api/v1/auth/forgot-password/request` | Email a 6-digit code (15 min TTL, 5 attempts) |
| `POST /api/v1/auth/forgot-password/verify` | Exchange code for a new password; revokes all sessions |
| `POST /api/v1/auth/verify-email` | Consume the link token (48 h TTL, single use) |
| `POST /api/v1/auth/resend-verification` | Issue a fresh link, invalidating earlier ones |

Tokens are stored as SHA-256 digests in `auth_tokens`; the plaintext exists only
in the email. A leaked backup therefore yields no usable credential.

---

## Verifying tenant isolation

```bash
/opt/chattermate/scripts/tenant_isolation_smoke.sh https://chat.growmiq.io
```

11 checks: two tenants can sign up independently, and neither can read or modify the
other's organization, agents or users. **Run this after every deploy that touches
auth, repositories or API routes.**

It needs signup open, and makes 4 signups against a budget of 5/hour, so:

```bash
# open signup temporarily, clear the limiter, run, close again
docker exec chattermate-redis-1 redis-cli --scan --pattern 'public_rl:signup:*' \
  | xargs -r docker exec chattermate-redis-1 redis-cli DEL
```

Delete the tenants it leaves behind:

```bash
docker exec chattermate-backend-1 python -c "
from app.database import SessionLocal
from app.models.organization import Organization
db = SessionLocal()
for o in db.query(Organization).filter(Organization.domain.like('smoke-%')).all():
    db.delete(o)
db.commit()"
```

Use the ORM for this, **not** SQL. `roles.organization_id` has no `ON DELETE CASCADE`
at the database level, so `DELETE FROM organizations` fails on a foreign key — the
cascade exists only in SQLAlchemy.

---

## Troubleshooting

### A page in the app is blank after a deploy

Almost always a stale app shell, not a broken build. Every deploy emits new
content-hashed chunk filenames and deletes the old ones, so a browser still
holding the previous `index.html` — from the service worker's precache or an
ordinary HTTP cache — asks for chunks that no longer exist.

The router now recovers from this by itself: `router.onError` in
`frontend/src/router/index.ts` detects a failed dynamic import and reloads once,
guarded by a `sessionStorage` flag so it can never loop. Before that existed the
navigation simply rendered nothing.

If someone still reports a blank page:

```bash
# Confirm the server is serving the current build, not that the client is stale
curl -s https://chat.growmiq.io/ | grep -o '/assets/main-[^"]*\.js'
```

Then have them hard-reload once (Cmd/Ctrl+Shift+R), or in DevTools →
Application → Service Workers → Unregister. A normal reload is not always enough:
the waiting worker only takes over when the update toast is accepted.

### Everything renders in the wrong font

`Content-Security-Policy` in `frontend/nginx.conf` must list
`https://fonts.googleapis.com` under `style-src` **and**
`https://fonts.gstatic.com` under `font-src`. `default-src 'self'` does not cover
either, so omitting them makes the browser refuse both the stylesheet and the
font files — silently, with only a console warning. Every screen then falls back
to Times/Arial and looks nothing like the design. This is baked into the
frontend image, so changing it needs a rebuild (`scripts/deploy.sh`), though it
can be hot-patched to verify:

```bash
docker cp /opt/chattermate/frontend/nginx.conf chattermate-frontend-1:/etc/nginx/conf.d/default.conf
docker exec chattermate-frontend-1 nginx -t && docker exec chattermate-frontend-1 nginx -s reload
curl -sI https://chat.growmiq.io/ | grep -i content-security-policy
```

### "Custom Models feature is not available in your current plan"

A tenant cannot configure AI. This deployment has **no shared platform model** —
every workspace brings its own provider key — so `custom_models` is not an
upsell here, it is the only route to a working agent. It must be enabled on
every plan:

```bash
docker exec chattermate-db-1 psql -U postgres -d chattermate -c \
  "INSERT INTO plan_features (id, plan_code, feature_key, is_enabled)
   SELECT gen_random_uuid(), code, 'custom_models', true FROM plans
   ON CONFLICT (plan_code, feature_key) DO UPDATE SET is_enabled = true;"
```

The seed in `add_plan_features_and_metrics_001.py` places it at tier 0 for the
same reason. Check what a plan grants with:

```bash
docker exec chattermate-db-1 psql -U postgres -d chattermate -c \
  "SELECT plan_code, string_agg(feature_key, ', ' ORDER BY feature_key)
   FROM plan_features WHERE is_enabled GROUP BY plan_code ORDER BY plan_code;"
```

### 502 from the site

```bash
dc ps                         # is the backend actually up?
tail -30 /var/log/nginx/chattermate.error.log
```

**`upstream sent too big header`** — this has bitten us before. Login and signup set
a `user_info` cookie carrying the full role object with all 26 permissions, which
overflows nginx's default proxy buffers. The backend logs a clean `200` while nginx
returns 502. Fixed by `proxy_buffer_size 32k` in the `/api/` block; if it recurs
after a config change, that setting has been lost.

**`connect() failed (111: Connection refused)`** — backend is down or still booting.
Cold start takes ~30s.

### The agent ignores the knowledge base

Symptom: the bot answers generically, or apologises, and never cites the website
or documents you added. The instinct is to blame ingestion or the embeddings.
**Check the model's token budget first — that was the actual cause here.**

Retrieval and the LLM call are separate failures, and the logs tell them apart:

```bash
dc logs backend | grep -E "Found [0-9]+ documents|Request too large|rate_limit"
```

* **`Found 3 documents` followed by a 413** — retrieval worked and the
  *completion carrying its results* was refused. This is the common case.
* **No `Found` line at all** — the agent never searched; check the source is
  linked to the agent the widget uses.
* **`No knowledge sources available`** — the link is missing entirely.

Confirm retrieval independently of the model:

```bash
docker exec chattermate-backend-1 python -c "
from app.tools.knowledge_search_byagent import KnowledgeSearchByAgent
import uuid
t = KnowledgeSearchByAgent(agent_id='<agent-uuid>', org_id=uuid.UUID('<org-uuid>'))
print(t.search_knowledge_base('a question about your content')[:500])"
```

Content is there if this prints it. Then the problem is budget, not knowledge.

**Why it happens.** A knowledge-grounded turn is the largest request the agent
ever makes: system prompt (~1,900 tokens) + three tool schemas + five prior
exchanges + the retrieved chunks, and Groq's free `on_demand` tier allows
**8,000 tokens per minute**. Observed requests ran 8,232–9,536 — over by 232 to
1,536. The run is not retried, so the visitor gets "I encountered an error"
while the answer sits unread in the knowledge base.

**What the code now does.** `ChatAgent._arun` catches a size rejection and
retries once with conversation history dropped, which reclaims more than the
observed overage; `KNOWLEDGE_RESULT_CHAR_BUDGET` (default 4000) caps how much
retrieved text a single search may return.

**What that does not fix.** The headroom is still thin — even with no history,
prompt plus tools plus two calls per grounded turn is most of an 8k budget. The
durable fix is a larger allowance: upgrade the Groq tier, or move the org to a
model whose limits are not per-minute. Check what an org runs with:

```sql
SELECT organization_id, model_type, model_name FROM ai_configs WHERE is_active;
```

**Embedding model.** Ingestion and query must embed with the same model or the
similarities are meaningless while nothing errors (the usual alternatives are
all 384-dimensional, so it fails silently). Both read `FASTEMBED_MODEL`; if you
change it, existing vectors must be re-ingested, not just re-queried.

### Backend won't start

```bash
dc logs --tail=50 backend
```

**`Multiple head revisions are present`** — the repo ships two unmerged alembic
branches. The compose command uses `alembic upgrade heads` (plural). If someone
changes it to `head`, migrations abort and, chained with `&&`, the server never
starts.

**Firebase `Could not deserialize key data`** — expected and harmless. Firebase
credentials are placeholders; only browser push notifications are affected.

### Everything is slow / OOM

```bash
free -h; docker stats --no-stream
```

7.8 GB total, 8 GB swap, shared with Checkfunnel. The heaviest process is
`knowledge_processor` (torch + FastEmbed). To buy headroom immediately:

```bash
dc stop knowledge_processor    # pauses knowledge ingestion only; chat keeps working
```

### Build fails on `pip install` with a hash mismatch

Four services share one Dockerfile, and building them together downloads the ~200 MB
torch wheel several times in parallel, which corrupts it. `deploy.sh` already builds
the backend alone first. Don't run a bare `dc build`.

### Certificate

```bash
certbot certificates
certbot renew --dry-run
```

Renewal is automatic. Expires 2026-11-09.

---

## Payments (PayHere)

Self-serve plan changes go through **PayHere**. Tenants see them at
`/settings/billing`; the enterprise module's own `/settings/subscription` page
is hidden when this one is active, so the two never disagree.

| | |
|---|---|
| Checkout (sandbox) | `https://sandbox.payhere.lk/pay/checkout` |
| Checkout (live) | `https://www.payhere.lk/pay/checkout` |
| Notify URL to register | `{BACKEND_URL}/api/v1/billing/notify` |
| Credentials | `PAYHERE_MERCHANT_ID`, `PAYHERE_MERCHANT_SECRET` in `backend/.env` |

```bash
# in /opt/chattermate/backend/.env  (mode 600)
PAYHERE_MERCHANT_ID=1221234
PAYHERE_MERCHANT_SECRET=...          # Settings -> Domains & Credentials
PAYHERE_SANDBOX=false                # only once the live account is approved
```

`PAYHERE_SANDBOX` defaults to **true**. That direction is deliberate: guessing
wrong towards sandbox means test payments on a real deployment, and guessing
wrong the other way means charging real cards from a test one.

### Why a valid signature is not enough

Two independent checks stand between the internet and a free plan upgrade, and
both are in `app/api/billing.py`:

1. **`md5sig`** proves PayHere sent the notification. Without it anyone who
   knows a tenant's order id could POST "status_code=2" and be upgraded.
2. **The amount** is compared against `payhere_orders.amount_cents`, the price
   quoted when checkout was signed. This is the check the signature does *not*
   provide: a genuine PayHere payment of 1.00 against a 149.00 order is signed
   perfectly correctly, because it really happened.

Verification fails closed, including when no merchant secret is set — with no
secret every signature is forgeable, so "not configured" must mean "reject",
never "skip the check".

Rejected notifications are still written to `payhere_payments` with
`verified='false'` and a reason. A run of those is what an attack looks like;
silently dropping them would leave nothing to look at.

```sql
-- forged or mispriced notifications
SELECT created_at, order_id, amount, currency, rejection_reason
FROM payhere_payments WHERE verified = 'false' ORDER BY created_at DESC;

-- who is subscribed right now
SELECT o.name, p.plan_code, p.amount_cents, p.currency, p.next_billing_date
FROM payhere_orders p JOIN organizations o ON o.id = p.organization_id
WHERE p.status = 'active';
```

### Chargebacks do not downgrade

`status_code = -3` marks the order `chargedback` and logs an error, but leaves
the plan in place. A disputed charge can be resolved in the customer's favour,
and cutting off service automatically would punish someone who may be in the
right. Downgrading is a human decision, taken in the operator console.

### Testing without real money

Sandbox cards are in PayHere's docs. The notification is server-to-server, so
`notify_url` has to be reachable from the internet — on a laptop that means a
tunnel, and `BACKEND_URL` must match it or the URL sent to PayHere points at
localhost and nothing ever arrives.

---

## Open items

These are **not** done yet and matter before real customers:

1. **Off-site backups.** Install `rclone`, configure a remote, then:
   ```bash
   echo 'OFFSITE_RCLONE_REMOTE=your-remote:chattermate-backups' > /etc/chattermate-backup.env
   chmod 600 /etc/chattermate-backup.env
   ```
   The backup script picks it up automatically and logs `offsite: copied`.
2. **Error tracking.** No Sentry DSN configured — failures are only visible in logs.
3. **Alert delivery.** Health alerts go to local `root` mail, which nobody reads.
   Set `ALERT_WEBHOOK` in `/etc/chattermate-backup.env` to a Slack/Discord webhook.
4. **No staging environment.** Deploys go straight to production.
5. **Email runs on a Gmail account.** Working and delivering, but capped at
   ~500/day and sending from a `gmail.com` address rather than growmiq.io.
   Fine now; move to a transactional provider before signup volume grows.
6. **Tenant isolation has no database backstop.** Correct scoping still depends
   on every one of 266 endpoints applying its own `organization_id` filter.
   The 25-probe IDOR sweep is the compensating control, not a substitute for
   PostgreSQL row-level security.
7. **Payments run through PayHere** (see the Payments section above), but
   `PAYHERE_MERCHANT_ID` / `PAYHERE_MERCHANT_SECRET` are still unset on the
   server, so `/settings/billing` shows "payments aren't configured" rather
   than an upgrade button. Set both and turn `PAYHERE_SANDBOX` off to start
   collecting. Note that **monthly message allowances are still not enforced**
   — see `tests/services/test_billing_plan_enforcement.py`, which documents
   that `usage.check()` is never called for flow metrics.
8. **CI cannot deploy.** The `Deploy` job fails at *Add SSH key* because the
   `VPS_SSH_KEY` secret is unset, so every deploy so far has been run by hand.
   The `Multi-tenant checks` job does run and passes on every push. To fix:
   GitHub → Settings → Secrets and variables → Actions → add `VPS_SSH_KEY`
   (the private half of `~/.ssh/checkfunnel_ci_deploy`), `VPS_HOST`
   (`187.77.156.57`) and `VPS_USER` (`root`).

---

## Platform operator console

**https://chat.growmiq.io/platform** — cross-tenant operations.

Two kinds of operator account:

| | Standalone | Promoted tenant user |
|---|---|---|
| Created by | `scripts/create_platform_admin.py` | `scripts/grant_platform_admin.py --grant` |
| Belongs to a tenant | No (`organization_id` is NULL) | Yes, keeps their workspace |
| Can use tenant features | No — every tenant route 403s | Yes, as normal |
| Lands after login on | `/platform` | their usual dashboard |

Prefer standalone for day-to-day operations. A promoted account wears two hats:
its actions inside its own workspace are indistinguishable from ordinary use,
and deleting that workspace would delete the operator account with it.

```bash
# create a standalone operator (password generated and printed once)
docker exec -i chattermate-backend-1 python - \
    --email ops@growmiq.io --name "Ops" \
  < /opt/chattermate/scripts/create_platform_admin.py

# list / promote / demote
docker exec -i chattermate-backend-1 python - --list \
  < /opt/chattermate/scripts/grant_platform_admin.py
```

Granting is shell-only by design — there is no API for it, so operator access
cannot be obtained through a request someone can be tricked into making. The
script refuses to revoke the last operator.

### Why not the `super_admin` permission

`super_admin` is **organization-scoped and self-grantable**: any tenant admin
can `POST /roles/{their_own_role}/permissions/super_admin`. Keying platform
access off it would hand every customer's admin the keys to every other
customer. Platform access is `users.is_platform_admin`, a column no API writes.
`scripts/check_platform_admin_boundary.py` fails the build if that field ever
appears in a request model; CI also rejects any `super_admin` permission check
inside `platform_admin.py`.

### What the console can do

Eleven screens under `/platform`:

| Screen | What it is for |
|---|---|
| Overview | Workspace and user counts, recurring revenue, plan mix, metered volume |
| Organizations | Search, filter, **create**, suspend, change plan, delete |
| Organization detail | 8 tabs — overview, members, conversations, features, usage, knowledge, integrations, audit |
| Users | Cross-tenant search, create, change role, reset password, deactivate, remove; operator list |
| Plans & Limits | Prices, usage ceilings, and the feature matrix |
| AI Configuration | Which model each workspace runs, and who has not set one up |
| Analytics | Conversations, handovers, channel mix, CSAT, busiest workspaces |
| System Health | Live probes of Postgres, pgvector, Redis, SMTP and disk |
| Audit Log | Every operator action, searchable, CSV export |
| Billing | Revenue by plan; states plainly that no payments are collected yet |
| Backups | States plainly that none exist, and exactly what turning them on needs |

### Plan features are enforced, not decorative

`plan_features` says what a tier includes; `organization_feature_overrides`
records per-customer exceptions. `app/services/feature_gate.py` resolves both
on every gated request.

This mattered: before it, `feature_gate` returned `True` unconditionally
whenever the private enterprise module was absent — which is every deployment of
this repository — so **every per-plan capability toggle in the product did
nothing**. Twelve capabilities now gate for real; `scripts/check_feature_catalog.py`
fails the build if a catalog entry has no enforcing call site, or if a gate
keys off a string absent from the catalog.

**A plan with no `plan_features` rows is unrestricted, not empty.** The other
direction would mean deploying before the seed ran — or adding a new plan —
silently locked every tenant on it out of the whole product at once. The console
labels an unconfigured plan rather than letting it look like a deliberate
denial.

```sql
-- what a tier includes
SELECT plan_code, feature_key, is_enabled FROM plan_features ORDER BY plan_code;

-- exceptions granted to individual customers
SELECT o.domain, f.feature_key, f.is_enabled, f.reason, f.created_by_email
FROM organization_feature_overrides f
JOIN organizations o ON o.id = f.organization_id;
```

### Revenue is recorded, not recomputed

`platform_metrics` holds a month-end snapshot of MRR, active tenants and paying
tenants. Each console read upserts the current month; when the month rolls over
that last value becomes history.

Recomputing March from today's plan prices would give March's tenants at today's
prices — a number that never happened. Months with no snapshot come back `null`
and draw as a gap in the chart rather than a zero, which would read as a
collapse in revenue.

Recurring revenue here is **derived, not invoiced**: plan price × active
tenants. Nothing has charged a card — see the Billing screen.

### What it deliberately cannot do

- **Channel credentials and webhook secrets are never returned** — not even
  masked. An operator who could read them could impersonate the tenant on
  WhatsApp or Slack.
- **Agent instructions are counted, not exposed.** A tenant's prompts are their
  product.
- **No endpoint writes a message** or lets an operator appear to a customer as
  the tenant. Transcript access is read-only.
- **Operator accounts cannot be edited through the tenant-user route**, so one
  operator cannot reset another's password and take over the platform.

### Transcript access is audited individually

Opening a conversation writes a `conversation.read` audit row naming the
operator, tenant, session, customer email and message count — the pattern
Intercom and Zendesk use for admin access. The conversation *list* is not
audited per call, deliberately: auditing every scroll would bury the entries
that matter under routine ones. The reader is told in the UI that the record
exists.

Review it under **Audit**, or:

```sql
SELECT created_at, actor_email, action, target_organization_domain, details
FROM platform_audit_log ORDER BY created_at DESC LIMIT 50;
```

Audit rows survive the tenant they describe: both foreign keys are ON DELETE
SET NULL and the domain is denormalised, so deleting a customer does not erase
the record of having deleted them.

---

## Domain history

The site moved from `chattermate.growmiq.io` to **`chat.growmiq.io`** on 12 Aug 2026.

The old name is still served and **301-redirects** to the new one, over HTTPS as
well as HTTP — it keeps its own certificate because a browser only follows a
redirect after the TLS handshake succeeds, so serving the retired name on port 80
alone would give anyone with a bookmarked `https://` link a certificate error
instead of a redirect.

`CORS_ORIGINS` deliberately still lists both names: a widget embedded on a
customer's site while the old host was live calls it directly, and dropping it
from the allowlist would break those pages before the redirect could run. Remove
the old entry once no widget references it.

Both certificates renew via the existing certbot timer. The retired vhost can be
deleted entirely once traffic to it reaches zero (`grep chattermate.growmiq.io
/var/log/nginx/chattermate.access.log`).
