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

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { formatPrice, submitToPayHere } from '@/services/billing'

describe('formatPrice', () => {
  it('renders cents as a two-decimal amount in the plan currency', () => {
    expect(formatPrice(14900, 'LKR')).toBe('LKR 149.00')
    expect(formatPrice(4900, 'USD')).toBe('USD 49.00')
    expect(formatPrice(0, 'LKR')).toBe('LKR 0.00')
  })

  it('keeps a price that is not a round unit', () => {
    // plans.pro is 14901 on production; rounding it here would hide that.
    expect(formatPrice(14901, 'LKR')).toBe('LKR 149.01')
  })
})

describe('submitToPayHere', () => {
  let submit: ReturnType<typeof vi.fn>

  beforeEach(() => {
    submit = vi.fn()
    // jsdom does not implement form submission, and we only care that it was
    // asked to happen — following it would navigate away from the test.
    HTMLFormElement.prototype.submit = submit
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs every signed field to the gateway', () => {
    submitToPayHere({
      action: 'https://sandbox.payhere.lk/pay/checkout',
      fields: { merchant_id: '1221234', order_id: 'gm-1', amount: '149.00', hash: 'ABC' },
    })

    const form = document.querySelector('form') as HTMLFormElement
    expect(form.method.toLowerCase()).toBe('post')
    expect(form.action).toBe('https://sandbox.payhere.lk/pay/checkout')

    const sent = Object.fromEntries(
      Array.from(form.querySelectorAll('input')).map((i) => [i.name, i.value]),
    )
    expect(sent).toEqual({
      merchant_id: '1221234',
      order_id: 'gm-1',
      amount: '149.00',
      hash: 'ABC',
    })
    expect(submit).toHaveBeenCalledOnce()
  })

  it('sends the hash exactly as the server produced it', () => {
    // The signature is computed over specific strings; re-encoding any of them
    // in the browser would invalidate it.
    submitToPayHere({
      action: 'https://sandbox.payhere.lk/pay/checkout',
      fields: { amount: '149.00', hash: 'D1B5D4A0F0E1C2B3A4958677A8B9C0D1' },
    })
    const hash = document.querySelector('input[name="hash"]') as HTMLInputElement
    expect(hash.value).toBe('D1B5D4A0F0E1C2B3A4958677A8B9C0D1')
  })
})
