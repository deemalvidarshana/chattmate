<!--
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

Plan selection and PayHere checkout.

The upgrade button is only offered when the backend says payments are actually
configured — a checkout that 503s is a worse answer than a page that explains
payments are not set up yet.
-->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import {
  createCheckout,
  formatPrice,
  getPlans,
  getSubscription,
  submitToPayHere,
  type BillingPlan,
  type PlansResponse,
  type Subscription,
} from '@/services/billing'

const route = useRoute()

const loading = ref(true)
const error = ref<string | null>(null)
const catalog = ref<PlansResponse | null>(null)
const subscription = ref<Subscription | null>(null)

const selected = ref<BillingPlan | null>(null)
const submitting = ref(false)
const details = ref({ phone: '', address: '', city: '', country: 'Sri Lanka' })

/**
 * PayHere sends the customer back here with ?paid=<order_id>. That only means
 * the browser returned — the plan changes when the server-to-server
 * notification arrives, which may land a moment later or (if the customer
 * closed the tab early) before them. So this is worded as "processing" rather
 * than "you have been upgraded", and the real state comes from /subscription.
 */
const returnedFromPayment = computed(() => Boolean(route.query.paid))
const canceled = computed(() => Boolean(route.query.canceled))

const currentPlanCode = computed(
  () => subscription.value?.plan_code ?? catalog.value?.current_plan ?? null,
)

const load = async () => {
  loading.value = true
  error.value = null
  try {
    const [plans, sub] = await Promise.all([getPlans(), getSubscription()])
    catalog.value = plans
    subscription.value = sub
  } catch (e) {
    error.value = 'Could not load billing information.'
  } finally {
    loading.value = false
  }
}

const choose = (plan: BillingPlan) => {
  selected.value = plan
}

const pay = async () => {
  if (!selected.value) return
  submitting.value = true
  error.value = null
  try {
    const checkout = await createCheckout(selected.value.code, details.value)
    // Navigates away — nothing after this runs on success.
    submitToPayHere(checkout)
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? 'Could not start checkout.'
    submitting.value = false
  }
}

const limit = (value: number | null) => (value === null ? 'Unlimited' : value.toLocaleString())

onMounted(load)
</script>

<template>
  <DashboardLayout>
    <div class="billing">
      <header class="billing__head">
        <h1>Billing &amp; plan</h1>
        <p class="billing__sub">Your subscription, and what each plan includes.</p>
      </header>

      <div v-if="returnedFromPayment" class="notice notice--ok">
        Payment received. We're confirming it with PayHere — your plan updates as
        soon as that lands, usually within a few seconds.
      </div>
      <div v-if="canceled" class="notice notice--warn">
        Checkout was cancelled. Nothing has been charged.
      </div>
      <div v-if="error" class="notice notice--error">{{ error }}</div>

      <p v-if="loading" class="muted">Loading…</p>

      <template v-else-if="catalog">
        <div v-if="catalog.sandbox && catalog.payments_enabled" class="notice notice--warn">
          PayHere is in <strong>sandbox</strong> mode — payments here are tests and
          no money moves.
        </div>
        <div v-if="!catalog.payments_enabled" class="notice notice--warn">
          Online payment isn't configured on this deployment yet, so plans can't be
          bought self-serve. Contact us and we'll change your plan directly.
        </div>

        <section v-if="subscription?.active" class="card current">
          <div>
            <span class="label">Current subscription</span>
            <strong class="plan-name">{{ subscription.plan_code }}</strong>
          </div>
          <div class="current__meta">
            <span v-if="subscription.amount_cents !== undefined">
              {{ formatPrice(subscription.amount_cents, subscription.currency || '') }}
              / month
            </span>
            <span v-if="subscription.next_billing_date">
              Renews {{ subscription.next_billing_date }}
            </span>
          </div>
        </section>

        <div class="plans">
          <article
            v-for="plan in catalog.plans"
            :key="plan.code"
            class="card plan"
            :class="{ 'plan--current': plan.code === currentPlanCode }"
          >
            <header class="plan__head">
              <strong class="plan-name">{{ plan.name }}</strong>
              <span v-if="plan.code === currentPlanCode" class="pill">Current</span>
            </header>

            <p class="plan__price">
              <template v-if="plan.price_cents > 0">
                {{ formatPrice(plan.price_cents, plan.currency) }}
                <span class="muted">/ month</span>
              </template>
              <template v-else>Free</template>
            </p>

            <ul class="plan__limits">
              <li>{{ limit(plan.max_ai_messages_per_month) }} AI messages</li>
              <li>{{ limit(plan.max_conversations_per_month) }} conversations</li>
              <li>{{ limit(plan.max_agents) }} agents</li>
              <li>{{ limit(plan.max_seats) }} seats</li>
              <li>{{ limit(plan.max_knowledge_docs) }} knowledge documents</li>
            </ul>

            <button
              class="btn"
              :disabled="
                !catalog.payments_enabled ||
                plan.price_cents <= 0 ||
                plan.code === currentPlanCode
              "
              @click="choose(plan)"
            >
              {{ plan.code === currentPlanCode ? 'Current plan' : 'Choose' }}
            </button>
          </article>
        </div>

        <section v-if="selected" class="card checkout">
          <h2>Billing details</h2>
          <p class="muted">
            PayHere requires these for the card statement. They aren't stored on
            your workspace.
          </p>

          <div class="fields">
            <label>
              Phone
              <input v-model="details.phone" type="tel" placeholder="07XXXXXXXX" />
            </label>
            <label>
              Address
              <input v-model="details.address" type="text" placeholder="1 Main Street" />
            </label>
            <label>
              City
              <input v-model="details.city" type="text" placeholder="Colombo" />
            </label>
            <label>
              Country
              <input v-model="details.country" type="text" />
            </label>
          </div>

          <div class="checkout__actions">
            <button class="btn btn--ghost" @click="selected = null">Cancel</button>
            <button
              class="btn btn--primary"
              :disabled="submitting || !details.phone || !details.address || !details.city"
              @click="pay"
            >
              {{
                submitting
                  ? 'Redirecting…'
                  : `Pay ${formatPrice(selected.price_cents, selected.currency)}`
              }}
            </button>
          </div>
          <p class="muted small">
            You'll be taken to PayHere to enter your card. We never see your card
            details.
          </p>
        </section>
      </template>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.billing {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
}

.billing__head h1 {
  font-size: var(--text-2xl);
  color: var(--text);
  margin: 0;
}

.billing__sub {
  color: var(--muted);
  margin: var(--space-xs) 0 var(--space-lg);
}

.card {
  background: var(--surface);
  border: 1px solid var(--o10);
  border-radius: var(--radius-card);
  padding: var(--space-lg);
}

.notice {
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  border: 1px solid var(--o10);
  color: var(--text2);
}
.notice--ok { border-color: var(--teal-border); }
.notice--warn { border-color: var(--accent-border); }
.notice--error { border-color: var(--coral-border); }

.current {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.current__meta {
  display: flex;
  gap: var(--space-lg);
  color: var(--muted);
  font-size: var(--text-sm);
}

.label {
  display: block;
  color: var(--muted);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.plan-name {
  color: var(--text);
  font-size: var(--text-lg);
  text-transform: capitalize;
}

.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
}

.plan {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.plan--current { border-color: var(--accent-border); }

.plan__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan__price {
  color: var(--text);
  font-size: var(--text-xl);
  margin: 0;
}

.plan__limits {
  list-style: none;
  padding: 0;
  margin: var(--space-sm) 0 var(--space-md);
  color: var(--text3);
  font-size: var(--text-sm);
  display: grid;
  gap: var(--space-xs);
}

.pill {
  background: var(--accent-solid);
  color: var(--on-accent-solid);
  border-radius: var(--radius-pill);
  padding: 2px 10px;
  font-size: var(--text-xs);
}

.btn {
  margin-top: auto;
  border-radius: var(--radius-btn);
  border: 1px solid var(--o14);
  background: transparent;
  color: var(--text);
  padding: 10px 16px;
  cursor: pointer;
  font-size: var(--text-sm);
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn--primary {
  background: var(--accent-solid);
  color: var(--on-accent-solid);
  border-color: transparent;
}
.btn--ghost { background: transparent; }

.checkout { margin-top: var(--space-lg); }
.checkout h2 { font-size: var(--text-lg); color: var(--text); margin: 0; }

.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
  margin: var(--space-md) 0;
}

.fields label {
  display: grid;
  gap: var(--space-xs);
  color: var(--muted);
  font-size: var(--text-sm);
}

.fields input {
  background: var(--bg2);
  border: 1px solid var(--o14);
  border-radius: var(--radius-input);
  padding: 10px 12px;
  color: var(--text);
  font-size: var(--text-sm);
}

.checkout__actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}

.muted { color: var(--muted); }
.small { font-size: var(--text-xs); margin-top: var(--space-sm); }
</style>
