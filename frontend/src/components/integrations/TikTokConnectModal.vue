<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ChannelAccount } from '@/services/channels'
import { tiktokService, type TikTokConfig, type TikTokCreator, type TikTokPost } from '@/services/tiktok'
import tiktokLogo from '@/assets/tiktok-logo.svg'

const props = defineProps<{accounts: ChannelAccount[]}>()
const emit = defineEmits<{(e: 'close'): void; (e: 'changed'): void}>()
const dialog = ref<HTMLDialogElement | null>(null)
const config = ref<TikTokConfig | null>(null)
const creator = ref<TikTokCreator | null>(null)
const selectedId = ref('')
const account = computed(() => props.accounts.find(a => a.id === selectedId.value))
const loading = ref(true), signingIn = ref(false), busy = ref(false), checking = ref(false)
const error = ref(''), disconnectConfirm = ref(false)
const mode = ref('direct'), caption = ref(''), privacy = ref('')
const allowComment = ref(false), allowDuet = ref(false), allowStitch = ref(false)
const ownBrand = ref(false), paidPartnership = ref(false), aiGenerated = ref(false), consent = ref(false)
const file = ref<File | null>(null), preview = ref(''), duration = ref(0)
const post = ref<TikTokPost | null>(null)
const uploadRequestId = ref(crypto.randomUUID())
let popup: Window | null = null, popupTimer: number | undefined, pollTimer: number | undefined, polls = 0
let loadVersion = 0
const messageFor = (e: any) => typeof e?.response?.data?.detail === 'string' ? e.response.data.detail : e.message || 'Something went wrong. Please try again.'
const privacyNames: Record<string, string> = {SELF_ONLY: 'Only me', PUBLIC_TO_EVERYONE: 'Everyone', MUTUAL_FOLLOW_FRIENDS: 'Friends', FOLLOWER_OF_CREATOR: 'Followers'}
const terminal = computed(() => ['PUBLISH_COMPLETE', 'SEND_TO_USER_INBOX', 'FAILED', 'UPLOAD_FAILED'].includes(post.value?.status || ''))
const postLabel = computed(() => {
  switch (post.value?.status) {
    case 'PUBLISH_COMPLETE': return 'Published to TikTok'
    case 'SEND_TO_USER_INBOX': return 'Sent to your TikTok inbox. Open TikTok to finish editing and post.'
    case 'FAILED': return 'TikTok could not publish this video.'
    case 'UPLOAD_FAILED': return 'The video transfer did not complete. Check its status before trying another upload.'
    default: return 'TikTok is processing your video…'
  }
})
const canSubmit = computed(() => !!file.value && duration.value > 0 && !!creator.value && consent.value && !busy.value &&
  (!post.value || terminal.value) && (mode.value === 'draft' ? creator.value.can_upload : creator.value.can_publish && !!privacy.value) &&
  (!creator.value.max_video_post_duration_sec || duration.value <= creator.value.max_video_post_duration_sec) &&
  !(mode.value === 'direct' && paidPartnership.value && privacy.value === 'SELF_ONLY'))

function stopPolling() { window.clearTimeout(pollTimer) }
function resetVideo() {
  if (preview.value.startsWith('blob:')) URL.revokeObjectURL(preview.value)
  preview.value = ''; file.value = null; duration.value = 0; consent.value = false
}
async function loadCreator() {
  const version = ++loadVersion
  creator.value = null; privacy.value = ''; consent.value = false; post.value = null
  error.value = ''; stopPolling(); resetVideo()
  const id = selectedId.value
  if (!id) return
  loading.value = true
  try {
    const info = await tiktokService.creator(id)
    if (version !== loadVersion) return
    creator.value = info
    mode.value = info.can_publish ? 'direct' : 'draft'
    try { post.value = JSON.parse(sessionStorage.getItem('tiktok:post:' + id) || 'null') } catch { post.value = null }
    if (post.value && !terminal.value) { polls = 0; await checkStatus() }
  } catch (e) { if (version === loadVersion) error.value = messageFor(e) }
  finally { if (version === loadVersion) loading.value = false }
}
watch(() => props.accounts, accounts => {
  if (!accounts.some(a => a.id === selectedId.value)) selectedId.value = accounts[0]?.id || ''
}, {immediate: true})
watch(selectedId, loadCreator)
watch(mode, () => { consent.value = false; privacy.value = '' })

async function connect() {
  error.value = ''
  popup = window.open('about:blank', 'growmiq-tiktok-connect', 'popup,width=650,height=760')
  if (!popup) { error.value = 'Allow popups for Growmiq, then try Connect again.'; return }
  signingIn.value = true
  try {
    const result = await tiktokService.authorize()
    const destination = new URL(result.url)
    if (destination.origin !== 'https://www.tiktok.com') throw new Error('TikTok sign-in is unavailable.')
    popup.location.href = result.url
    popupTimer = window.setInterval(() => {
      if (popup?.closed) { signingIn.value = false; window.clearInterval(popupTimer) }
    }, 500)
  } catch (e) { popup.close(); signingIn.value = false; error.value = messageFor(e) }
}
function receiveCallback(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== popup || event.data?.type !== 'growmiq:tiktok:callback') return
  window.clearInterval(popupTimer); signingIn.value = false; popup = null
  if (event.data.ok) emit('changed')
  else error.value = event.data.message || 'TikTok connection was not completed.'
}
function chooseVideo(event: Event) {
  const input = event.target as HTMLInputElement
  const chosen = input.files?.[0]
  resetVideo(); error.value = ''
  if (!chosen) return
  if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(chosen.type) || chosen.size > (config.value?.max_video_bytes || 20971520)) {
    input.value = ''; error.value = 'Choose an MP4, MOV or WebM video smaller than 20 MB.'; return
  }
  file.value = chosen; preview.value = URL.createObjectURL(chosen)
  uploadRequestId.value = crypto.randomUUID()
}
function videoMetadata(event: Event) {
  const video = event.target as HTMLVideoElement
  if (!Number.isFinite(video.duration) || video.duration < 3 || Math.min(video.videoWidth, video.videoHeight) < 360) {
    error.value = 'Choose a video at least 3 seconds long and at least 360 pixels on each side.'
    duration.value = 0; return
  }
  duration.value = video.duration
  if (creator.value?.max_video_post_duration_sec && video.duration > creator.value.max_video_post_duration_sec) {
    error.value = `This account supports videos up to ${creator.value.max_video_post_duration_sec} seconds.`
  }
}
function videoPreviewError() {
  const chosen = file.value
  if (!chosen || !preview.value.startsWith('blob:')) {
    error.value = 'This video could not be previewed. Choose another file.'
    return
  }
  // Some embedded browsers reject blob media URLs. Keep the original File for upload.
  const oldUrl = preview.value
  const reader = new FileReader()
  reader.onload = () => {
    if (file.value !== chosen || preview.value !== oldUrl) return
    if (typeof reader.result !== 'string' || !reader.result.startsWith('data:video/')) {
      error.value = 'This video could not be previewed. Choose another file.'
      return
    }
    URL.revokeObjectURL(oldUrl)
    preview.value = reader.result
  }
  reader.onerror = () => { if (file.value === chosen) error.value = 'This video could not be previewed. Choose another file.' }
  reader.readAsDataURL(chosen)
}
function rememberPost(id: string) {
  try { sessionStorage.setItem('tiktok:post:' + id, JSON.stringify(post.value)) } catch { /* storage may be disabled */ }
}
async function checkStatus() {
  if (!post.value || !account.value || checking.value) return
  const id = account.value.id, publishId = post.value.publish_id
  checking.value = true
  try {
    const result = await tiktokService.status(id, publishId)
    if (id !== selectedId.value || post.value?.publish_id !== publishId) return
    post.value = {...post.value, ...result}; rememberPost(id); error.value = ''
    if (!terminal.value && ++polls < 40) pollTimer = window.setTimeout(checkStatus, 3000)
  } catch (e) { error.value = messageFor(e) }
  finally { checking.value = false }
}
async function publish() {
  if (!canSubmit.value || !file.value || !account.value) return
  const id = account.value.id, data = new FormData()
  data.set('video', file.value); data.set('mode', mode.value); data.set('request_id', uploadRequestId.value)
  data.set('title', caption.value); data.set('privacy_level', privacy.value); data.set('consent', String(consent.value))
  for (const [key, value] of Object.entries({allow_comment: allowComment.value, allow_duet: allowDuet.value,
    allow_stitch: allowStitch.value, own_brand: ownBrand.value, paid_partnership: paidPartnership.value, ai_generated: aiGenerated.value})) data.set(key, String(value))
  busy.value = true; error.value = ''; stopPolling()
  try {
    post.value = await tiktokService.publish(id, data); rememberPost(id); polls = 0
    if (post.value.status !== 'UPLOAD_FAILED') await checkStatus()
    consent.value = false
  } catch (e) { error.value = messageFor(e) }
  finally { busy.value = false }
}
async function disconnect() {
  if (!account.value) return
  busy.value = true; error.value = ''
  try {
    const id = account.value.id
    await tiktokService.disconnect(id)
    sessionStorage.removeItem('tiktok:post:' + id); stopPolling(); post.value = null
    disconnectConfirm.value = false; emit('changed')
  } catch (e) { error.value = messageFor(e) }
  finally { busy.value = false }
}
onMounted(async () => {
  dialog.value?.showModal()
  window.addEventListener('message', receiveCallback)
  try { config.value = await tiktokService.config(); if (selectedId.value) await loadCreator() }
  catch (e) { error.value = messageFor(e) }
  finally { loading.value = false }
})
onBeforeUnmount(() => {
  ++loadVersion; window.removeEventListener('message', receiveCallback)
  window.clearInterval(popupTimer); stopPolling(); resetVideo(); popup?.close(); dialog.value?.close()
})
</script>

<template>
  <dialog ref="dialog" class="tt-modal" aria-labelledby="tt-title" @cancel.prevent="!busy && emit('close')" @click="event => { if (event.target === dialog && !busy) emit('close') }">
    <header><div class="tt-heading"><img :src="tiktokLogo" alt="" /><h2 id="tt-title">{{ account ? 'TikTok' : 'Connect TikTok' }}</h2></div><button class="tt-close" aria-label="Close TikTok" :disabled="busy" @click="emit('close')">×</button></header>
    <p class="tt-intro">Connect your TikTok account, preview a video and choose how to share it.</p>
    <div v-if="config?.private_only" class="tt-note">Test mode: direct posts are limited to <strong>Only me</strong> while TikTok reviews public publishing. Inbox AI replies are not enabled by this connection.</div>
    <p v-if="error" role="alert" class="tt-error">{{ error }}</p>
    <p v-if="loading" role="status">Loading TikTok…</p>
    <template v-else-if="!account">
      <ol><li>Sign in to TikTok in the popup.</li><li>Choose which permissions to allow.</li><li>Return here to preview and share your video.</li></ol>
      <p v-if="config && !config.enabled" class="tt-note">TikTok connection is awaiting platform configuration. Please try again once setup is complete.</p>
      <button class="tt-primary" :disabled="!config?.enabled || signingIn" @click="connect">{{ signingIn ? 'Waiting for TikTok…' : 'Continue with TikTok' }}</button>
    </template>
    <template v-else>
      <label v-if="accounts.length > 1">TikTok account<select v-model="selectedId" :disabled="busy"><option v-for="a in accounts" :key="a.id" :value="a.id">{{ a.display_name }}</option></select></label>
      <div class="tt-account"><div><strong>{{ creator?.creator_nickname || account.display_name }}</strong><span v-if="creator?.creator_username">@{{ creator.creator_username }}</span><span class="tt-connected">Connected</span></div><button class="tt-secondary" :disabled="busy" @click="disconnectConfirm = !disconnectConfirm">Disconnect</button></div>
      <div v-if="disconnectConfirm" class="tt-note"><p>Disconnect this TikTok account from Growmiq? Videos already sent to TikTok will stay there.</p><button class="tt-secondary" :disabled="busy" @click="disconnect">Confirm disconnect</button> <button class="tt-secondary" @click="disconnectConfirm = false">Cancel</button></div>
      <template v-if="creator && (creator.can_publish || creator.can_upload)">
        <label>Share as<select v-model="mode" :disabled="busy"><option v-if="creator.can_publish" value="direct">Post to TikTok</option><option v-if="creator.can_upload" value="draft">Send to TikTok inbox</option></select></label>
        <label>Video<input type="file" accept="video/mp4,video/quicktime,video/webm" :disabled="busy" @change="chooseVideo" /><small>MP4, MOV or WebM · up to 20 MB<span v-if="creator.max_video_post_duration_sec"> · up to {{ creator.max_video_post_duration_sec }} seconds</span></small></label>
        <video v-if="preview" :key="preview" :src="preview" controls preload="metadata" @loadedmetadata="videoMetadata" @error="videoPreviewError" />
        <template v-if="mode === 'direct'">
          <label>Caption<textarea v-model="caption" maxlength="2200" rows="3" :disabled="busy" placeholder="Write a caption…" /></label>
          <label>Who can watch this video?<select v-model="privacy" :disabled="busy"><option value="" disabled>Choose a privacy setting</option><option v-for="p in creator.privacy_level_options" :key="p" :value="p">{{ privacyNames[p] || p }}</option></select></label>
          <fieldset :disabled="busy"><legend>Allow viewers to</legend><label class="tt-check"><input v-model="allowComment" type="checkbox" :disabled="creator.comment_disabled" />Comment</label><label class="tt-check"><input v-model="allowDuet" type="checkbox" :disabled="creator.duet_disabled" />Duet</label><label class="tt-check"><input v-model="allowStitch" type="checkbox" :disabled="creator.stitch_disabled" />Stitch</label></fieldset>
          <fieldset :disabled="busy"><legend>Content disclosures</legend><label class="tt-check"><input v-model="ownBrand" type="checkbox" />Promotes my own brand or business</label><label class="tt-check"><input v-model="paidPartnership" type="checkbox" />Paid partnership promoting another brand</label><p v-if="ownBrand || paidPartnership" class="tt-note">TikTok will label this as {{ paidPartnership ? 'Paid partnership' : 'Promotional content' }}.</p><p v-if="paidPartnership && privacy === 'SELF_ONLY'" class="tt-error">Paid partnerships cannot use Only me. Public publishing requires TikTok approval.</p><label class="tt-check"><input v-model="aiGenerated" type="checkbox" />AI-generated content</label></fieldset>
        </template>
        <p v-else class="tt-note">TikTok will notify you in its inbox. Open TikTok to edit the video, add a caption, choose privacy and finish posting.</p>
        <label class="tt-check tt-consent"><input v-model="consent" type="checkbox" :disabled="busy" /><span>I have reviewed this video and authorize sending it to the TikTok account shown above. I agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer">Music Usage Confirmation</a><template v-if="ownBrand || paidPartnership"> and <a href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener noreferrer">Branded Content Policy</a></template>.</span></label>
        <p class="tt-note">After you submit, TikTok may take a few minutes to process your video.</p>
        <button class="tt-primary" :disabled="!canSubmit" @click="publish">{{ busy ? 'Sending video…' : mode === 'direct' ? 'Post to TikTok' : 'Send to TikTok inbox' }}</button>
      </template>
      <div v-if="post" class="tt-result" role="status"><strong>{{ postLabel }}</strong><p v-if="post.fail_reason">{{ post.fail_reason }}</p><small>Reference: {{ post.publish_id }}</small><button class="tt-secondary" :disabled="checking || busy" @click="checkStatus">{{ checking ? 'Checking…' : 'Check status' }}</button></div>
    </template>
    <footer><a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a><a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a></footer>
  </dialog>
</template>

<style scoped>
.tt-modal { width: min(560px, calc(100vw - 32px)); max-height: calc(100dvh - 48px); box-sizing: border-box; margin: auto; padding: 24px; border: 1px solid var(--border-color); border-radius: 16px; background: var(--background-color); color: var(--text-color); font-family: var(--font-body, inherit); }
.tt-modal::backdrop { background: rgba(0,0,0,.65); }
header,.tt-heading,.tt-account { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.tt-heading { justify-content: flex-start; } .tt-heading img { width: 28px; height: 28px; background: #111; padding: 6px; border-radius: 9px; box-sizing: content-box; }
h2 { font-family: var(--font-display); font-size: 22px; margin: 0; } .tt-close { background: transparent; border: 0; color: inherit; font-size: 28px; cursor: pointer; }
.tt-intro,small,ol { color: var(--muted); line-height: 1.6; } ol { padding-left: 20px; }
.tt-note,.tt-error,.tt-result { border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; font-size: 13px; line-height: 1.6; margin: 14px 0; }
.tt-note { background: var(--background-soft); } .tt-error { color: #f87171; } .tt-result { border-color: var(--accent-solid); } .tt-result small { display: block; overflow-wrap: anywhere; margin: 8px 0; }
.tt-account { border-bottom: 1px solid var(--border-color); padding: 12px 0; } .tt-account span { display: block; font-size: 13px; } .tt-connected { color: var(--accent-solid); }
label { display: block; font-size: 14px; font-weight: 500; margin: 16px 0; } input:not([type=checkbox]), select, textarea { display: block; width: 100%; box-sizing: border-box; margin-top: 7px; background: var(--background-soft); border: 1px solid var(--border-color); color: inherit; padding: 10px; border-radius: 8px; font: inherit; }
small { display: block; font-size: 12px; font-weight: 400; margin-top: 5px; } video { width: 100%; max-height: 280px; background: #000; border-radius: 8px; }
fieldset { border: 1px solid var(--border-color); border-radius: 8px; margin-top: 16px; } legend { color: var(--muted); font-size: 13px; } .tt-check { display: flex; gap: 9px; align-items: flex-start; margin: 10px 0; line-height: 1.5; font-size: 13px; font-weight: 400; } input[type=checkbox] { margin-top: 3px; accent-color: var(--accent-solid); flex-shrink: 0; } .tt-consent { margin-top: 20px; }
.tt-primary,.tt-secondary { border: 1px solid var(--border-color); padding: 10px 15px; border-radius: 8px; font: inherit; font-size: 14px; cursor: pointer; } .tt-primary { width: 100%; background: var(--accent-solid); color: var(--on-accent-solid); font-weight: 600; } .tt-secondary { background: var(--background-soft); color: inherit; } button:disabled { opacity: .5; cursor: not-allowed; }
a { color: var(--accent-solid); } footer { display: flex; gap: 20px; justify-content: center; margin-top: 24px; font-size: 12px; }
@media(max-width: 480px) { .tt-modal { padding: 18px; max-height: calc(100dvh - 24px); } }
</style>
