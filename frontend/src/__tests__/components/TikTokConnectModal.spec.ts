import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import TikTokConnectModal from '@/components/integrations/TikTokConnectModal.vue'
import { tiktokService } from '@/services/tiktok'

vi.mock('@/services/tiktok', () => ({tiktokService: {
  config: vi.fn(), creator: vi.fn(), authorize: vi.fn(), publish: vi.fn(), status: vi.fn(), disconnect: vi.fn(),
}}))
let wrapper: VueWrapper | undefined
beforeEach(() => {
  vi.clearAllMocks()
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
  vi.mocked(tiktokService.config).mockResolvedValue({enabled: true, private_only: true, max_video_bytes: 20971520})
})
afterEach(() => { wrapper?.unmount(); vi.unstubAllGlobals() })

describe('TikTok integration popup', () => {
  it('explains test-mode restrictions and never pretends to be connected', async () => {
    wrapper = mount(TikTokConnectModal, {props: {accounts: []}})
    await flushPromises()
    expect(wrapper.text()).toContain('Only me')
    expect(wrapper.text()).toContain('Inbox AI replies are not enabled')
    expect(wrapper.text()).not.toContain('Connected')
    expect(wrapper.find('dialog').attributes('aria-labelledby')).toBe('tt-title')
  })
  it('does not start OAuth without server credentials', async () => {
    vi.mocked(tiktokService.config).mockResolvedValue({enabled: false, private_only: true, max_video_bytes: 20971520})
    wrapper = mount(TikTokConnectModal, {props: {accounts: []}})
    await flushPromises()
    expect(wrapper.find('.tt-primary').attributes('disabled')).toBeDefined()
    expect(tiktokService.authorize).not.toHaveBeenCalled()
  })
  it('ignores callbacks from other windows or origins', async () => {
    const popup = {location: {href: ''}, closed: false, close: vi.fn()}
    vi.stubGlobal('open', vi.fn(() => popup))
    vi.mocked(tiktokService.authorize).mockResolvedValue({url: 'https://www.tiktok.com/v2/auth/authorize/?state=test'})
    wrapper = mount(TikTokConnectModal, {props: {accounts: []}})
    await flushPromises()
    await wrapper.find('.tt-primary').trigger('click'); await flushPromises()
    window.dispatchEvent(new MessageEvent('message', {origin: 'https://other.example', data: {type: 'growmiq:tiktok:callback', ok: true}}))
    window.dispatchEvent(new MessageEvent('message', {origin: window.location.origin, data: {type: 'growmiq:tiktok:callback', ok: true}}))
    expect(wrapper.emitted('changed')).toBeUndefined()
    expect(popup.location.href).toContain('https://www.tiktok.com/')
  })
  it('requires a video, privacy selection and consent before publishing', async () => {
    vi.mocked(tiktokService.creator).mockResolvedValue({can_publish: true, can_upload: true,
      creator_nickname: 'Review account', privacy_level_options: ['SELF_ONLY'], comment_disabled: true})
    wrapper = mount(TikTokConnectModal, {props: {accounts: [{id: 'account-1', display_name: 'Review account'} as any]}})
    await flushPromises()
    expect(wrapper.text()).toContain('Review account')
    expect(wrapper.find('.tt-primary').attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('select')[1]?.element.value).toBe('')
    expect(wrapper.find('.tt-consent input').element.checked).toBe(false)
    expect(tiktokService.publish).not.toHaveBeenCalled()
  })
})
