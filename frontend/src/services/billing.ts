/*
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
*/

import api from '@/services/api'

export interface BillingPlan {
  code: string
  name: string
  description?: string | null
  price_cents: number
  currency: string
  max_ai_messages_per_month: number | null
  max_conversations_per_month: number | null
  max_agents: number | null
  max_seats: number | null
  max_knowledge_docs: number | null
}

export interface PlansResponse {
  /** False when PayHere has no credentials on this deployment. */
  payments_enabled: boolean
  sandbox: boolean
  current_plan: string | null
  plans: BillingPlan[]
}

export interface Subscription {
  active: boolean
  plan_code: string | null
  amount_cents?: number
  currency?: string
  subscription_id?: string | null
  next_billing_date?: string | null
  since?: string | null
}

export interface BillingDetails {
  phone: string
  address: string
  city: string
  country: string
}

/**
 * The signed form PayHere expects. `fields.hash` is computed server-side from
 * the merchant secret, which is why checkout has to be a round trip rather than
 * a form we could assemble here.
 */
export interface CheckoutForm {
  action: string
  fields: Record<string, string>
}

export const getPlans = async (): Promise<PlansResponse> =>
  (await api.get('/billing/plans')).data

export const getSubscription = async (): Promise<Subscription> =>
  (await api.get('/billing/subscription')).data

export const createCheckout = async (
  planCode: string,
  details: BillingDetails,
): Promise<CheckoutForm> =>
  (await api.post('/billing/checkout', { plan_code: planCode, ...details })).data

/**
 * Hand the browser to PayHere.
 *
 * A real form POST, not fetch: PayHere's checkout is a page the customer has to
 * see and interact with, so the browser must navigate to it rather than us
 * reading a response. The form is submitted and discarded immediately.
 */
export const submitToPayHere = (checkout: CheckoutForm): void => {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = checkout.action
  form.style.display = 'none'

  for (const [name, value] of Object.entries(checkout.fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}

/** Cents to a display string, in the plan's own currency. */
export const formatPrice = (cents: number, currency: string): string => {
  const amount = (cents / 100).toFixed(2)
  return `${currency} ${amount}`
}
