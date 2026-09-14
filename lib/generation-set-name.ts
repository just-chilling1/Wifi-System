export function defaultLabelFromUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ""
  try {
    const host = new URL(trimmed).hostname.replace(/^www\./i, "")
    return host || "My offer"
  } catch {
    return "My offer"
  }
}

export function postUsedKey(postId: string) {
  return `post:${postId}`
}

export function commentUsedKey(videoId: string, index: number) {
  return `comment:${videoId}:${index}`
}
