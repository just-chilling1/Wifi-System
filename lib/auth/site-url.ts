export const APP_ORIGINS = [
  "https://wificodemembers.com",
  "https://www.wificodemembers.com",
] as const

const DEFAULT_SITE_URL = APP_ORIGINS[0]

function normalizeOrigin(url: string): string {
  return url.replace(/\/$/, "")
}

function isAllowedOrigin(origin: string): boolean {
  return APP_ORIGINS.includes(normalizeOrigin(origin) as (typeof APP_ORIGINS)[number])
}

/** Canonical app URL for auth redirects (password reset, email links). */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    const origin = window.location.origin
    if (isAllowedOrigin(origin)) {
      return normalizeOrigin(origin)
    }
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const configured = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
    if (isAllowedOrigin(configured)) {
      return configured
    }
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return DEFAULT_SITE_URL
}

export function getAuthCallbackUrl(nextPath: string): string {
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`
}
