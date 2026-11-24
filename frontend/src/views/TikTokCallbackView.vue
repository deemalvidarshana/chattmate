<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tiktokService } from '@/services/tiktok'

const router = useRouter()
const message = ref('Completing your TikTok connection…')
onMounted(async () => {
  const query = new URLSearchParams(window.location.search)
  const code = query.get('code'), state = query.get('state')
  // Remove the short-lived authorization code from history before API calls.
  window.history.replaceState({}, '', window.location.pathname)
  let ok = false
  try {
    if (query.has('error')) throw new Error('TikTok connection was cancelled.')
    if (!code || !state) throw new Error('TikTok sign-in expired. Please start again.')
    await tiktokService.callback(code, state)
    ok = true
    message.value = 'TikTok connected. You can close this window.'
  } catch (error: any) {
    message.value = error?.response?.data?.detail || error.message || 'TikTok connection failed.'
  }
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({type: 'growmiq:tiktok:callback', ok, message: message.value}, window.location.origin)
    window.close()
  } else {
    await router.replace({path: '/settings/integrations', query: {
      integration: 'tiktok', status: ok ? 'success' : 'failure', ...(ok ? {} : {reason: 'authorization_failed'}),
    }})
  }
})
</script>
<template><main class="tiktok-callback"><p role="status">{{ message }}</p><a href="/settings/integrations">Back to integrations</a></main></template>
<style scoped>.tiktok-callback { max-width: 480px; margin: 15vh auto; padding: 24px; color: var(--text-color); } a { color: var(--accent-solid); }</style>
