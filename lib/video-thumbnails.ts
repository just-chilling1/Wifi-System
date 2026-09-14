/** Local WebP posters keyed by training-video roster slug. */
export const VIDEO_THUMBNAIL_PATHS = {
  "watch-this-first": "/thumbnails/wc-thumb-01-watch-this-first.webp",
  "how-the-money-flows": "/thumbnails/wc-thumb-02-how-the-money-flows.webp",
  "your-5-minute-tour": "/thumbnails/wc-thumb-03-your-5-minute-tour.webp",
  "gold-rush-mindset": "/thumbnails/wc-thumb-04-gold-rush-mindset.webp",
  "gold-rush": "/thumbnails/wc-thumb-05-gold-rush.webp",
  "my-vault-mindset": "/thumbnails/wc-thumb-06-my-vault-mindset.webp",
  "my-vault": "/thumbnails/wc-thumb-07-my-vault.webp",
  "link-vault-mindset": "/thumbnails/wc-thumb-08-link-vault-mindset.webp",
  "link-vault": "/thumbnails/wc-thumb-09-link-vault.webp",
  "unlimited-mindset": "/thumbnails/wc-thumb-10-unlimited-mindset.webp",
  unlimited: "/thumbnails/wc-thumb-11-unlimited.webp",
  "instant-income-mindset": "/thumbnails/wc-thumb-12-instant-income-mindset.webp",
  "instant-income": "/thumbnails/wc-thumb-13-instant-income.webp",
  "automated-profits-mindset": "/thumbnails/wc-thumb-14-automated-profits-mindset.webp",
  "automated-profits": "/thumbnails/wc-thumb-15-automated-profits.webp",
  "cyber-protection-mindset": "/thumbnails/wc-thumb-16-cyber-protection-mindset.webp",
  "cyber-protection": "/thumbnails/wc-thumb-17-cyber-protection.webp",
  "reseller-license-rights-mindset":
    "/thumbnails/wc-thumb-18-reseller-license-rights-mindset.webp",
  "reseller-license-rights": "/thumbnails/wc-thumb-19-reseller-license-rights.webp",
  "high-ticket-payouts-mindset":
    "/thumbnails/wc-thumb-20-high-ticket-payouts-mindset.webp",
  "high-ticket-payouts": "/thumbnails/wc-thumb-21-high-ticket-payouts.webp",
  "done-for-you-profit-mindset":
    "/thumbnails/wc-thumb-22-done-for-you-profit-mindset.webp",
  "done-for-you-profit": "/thumbnails/wc-thumb-23-done-for-you-profit.webp",
} as const

export type VideoThumbnailSlug = keyof typeof VIDEO_THUMBNAIL_PATHS

const VIMEO_TO_SLUG: Partial<Record<string, VideoThumbnailSlug>> = {
  "1225645049": "watch-this-first",
  "1225645048": "how-the-money-flows",
  "1226575133": "your-5-minute-tour",
  "1225645047": "gold-rush-mindset",
  "1226575131": "gold-rush",
  "1225645046": "my-vault-mindset",
  "1226577448": "my-vault",
  "1226573904": "link-vault-mindset",
  "1226575132": "link-vault",
  "1226543582": "unlimited-mindset",
  "1226577449": "unlimited",
  "1226543605": "instant-income-mindset",
  "1226547482": "instant-income",
  "1226544264": "automated-profits-mindset",
  "1226545479": "automated-profits",
  "1226544662": "cyber-protection-mindset",
  "1226546051": "cyber-protection",
  "1226544973": "reseller-license-rights-mindset",
  "1226547483": "reseller-license-rights",
  "1226545017": "high-ticket-payouts-mindset",
  "1226546591": "high-ticket-payouts",
  "1226574609": "done-for-you-profit-mindset",
  "1226577445": "done-for-you-profit",
}

type ThumbnailLookup = {
  slug?: VideoThumbnailSlug
  vimeoId?: string
}

export function getVideoThumbnailPath(slug: VideoThumbnailSlug): string {
  return VIDEO_THUMBNAIL_PATHS[slug]
}

/** Resolve a poster by slug first, then by Vimeo ID when present. */
export function getVideoThumbnail({ slug, vimeoId }: ThumbnailLookup = {}): string | null {
  if (slug) return VIDEO_THUMBNAIL_PATHS[slug] ?? null
  const id = vimeoId?.match(/\d{7,}/)?.[0]
  if (id && VIMEO_TO_SLUG[id]) return VIDEO_THUMBNAIL_PATHS[VIMEO_TO_SLUG[id]!] ?? null
  return null
}
