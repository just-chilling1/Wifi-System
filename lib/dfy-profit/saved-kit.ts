import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"

export type DfySavedKitPayload = {
  offerName: string
  productName: string
  productContext: string
  videos: DfyVideoResult[]
  article: DfyArticleResult | null
  posts: DfyFacebookPost[]
  usedFallbackLink: boolean
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function parseVideos(raw: unknown): DfyVideoResult[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const row = item as Record<string, unknown>
      const videoId = asString(row.videoId)
      const comments = Array.isArray(row.comments)
        ? row.comments.filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        : []
      if (!videoId) return null
      return {
        videoId,
        title: asString(row.title),
        channelTitle: asString(row.channelTitle),
        thumbnailUrl: asString(row.thumbnailUrl),
        viewCount: typeof row.viewCount === "number" ? row.viewCount : 0,
        videoUrl: asString(row.videoUrl),
        comments,
        usedFallbackComments: Boolean(row.usedFallbackComments),
      }
    })
    .filter((v): v is DfyVideoResult => v != null)
}

function parsePosts(raw: unknown): DfyFacebookPost[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const row = item as Record<string, unknown>
      const id = asString(row.id)
      const body = asString(row.body).trim()
      if (!id || !body) return null
      return { id, body }
    })
    .filter((p): p is DfyFacebookPost => p != null)
}

function parseArticle(raw: unknown): DfyArticleResult | null {
  if (!raw || typeof raw !== "object") return null
  const row = raw as Record<string, unknown>
  const title = asString(row.title)
  const html = asString(row.html)
  if (!title || !html) return null
  return {
    id: typeof row.id === "string" ? row.id : null,
    slug: typeof row.slug === "string" ? row.slug : null,
    url: typeof row.url === "string" ? row.url : null,
    title,
    excerpt: asString(row.excerpt),
    html,
    saveWarning: typeof row.saveWarning === "string" ? row.saveWarning : undefined,
  }
}

export function parseDfySavedKit(payload: Record<string, unknown>): DfySavedKitPayload {
  return {
    offerName: asString(payload.offerName),
    productName: asString(payload.productName),
    productContext: asString(payload.productContext),
    videos: parseVideos(payload.videos),
    article: parseArticle(payload.article),
    posts: parsePosts(payload.posts),
    usedFallbackLink: Boolean(payload.usedFallbackLink),
  }
}

export function summarizeDfyKit(payload: Record<string, unknown>) {
  const kit = parseDfySavedKit(payload)
  const parts = [
    `${kit.videos.length} video${kit.videos.length === 1 ? "" : "s"}`,
    kit.article ? "1 article" : "no article",
    `${kit.posts.length} post${kit.posts.length === 1 ? "" : "s"}`,
  ]
  return parts.join(" · ")
}
