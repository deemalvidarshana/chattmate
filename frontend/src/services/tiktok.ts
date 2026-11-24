import api from './api'

export interface TikTokConfig { enabled: boolean; private_only: boolean; max_video_bytes: number }
export interface TikTokCreator {
  can_publish: boolean; can_upload: boolean; creator_username?: string; creator_nickname?: string
  privacy_level_options?: string[]; comment_disabled?: boolean; duet_disabled?: boolean
  stitch_disabled?: boolean; max_video_post_duration_sec?: number
}
export interface TikTokPost { publish_id: string; status: string; fail_reason?: string; mode?: string }

export const tiktokService = {
  async config(): Promise<TikTokConfig> { return (await api.get('/channels/tiktok/config')).data },
  async authorize(): Promise<{url: string}> { return (await api.post('/channels/tiktok/authorize')).data },
  async callback(code: string, state: string) { return (await api.post('/channels/tiktok/callback', {code, state})).data },
  async creator(id: string): Promise<TikTokCreator> { return (await api.get(`/channels/tiktok/${id}/creator`)).data },
  async publish(id: string, body: FormData): Promise<TikTokPost> {
    return (await api.post(`/channels/tiktok/${id}/publish`, body, {
      headers: {'Content-Type': 'multipart/form-data'}, timeout: 180000,
    })).data
  },
  async status(id: string, publishId: string): Promise<TikTokPost> {
    return (await api.post(`/channels/tiktok/${id}/status`, {publish_id: publishId})).data
  },
  async disconnect(id: string) { await api.delete(`/channels/tiktok/${id}`) },
}
