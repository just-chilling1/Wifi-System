function isLocalHostname(hostname?: string): boolean {
  if (!hostname) return false
  if (hostname === "localhost" || hostname === "127.0.0.1") return true
  if (hostname.startsWith("192.168.") || hostname.startsWith("10.")) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true
  return false
}

/** Local dev only — never enable in production. */
export function isDevAuthBypassEnabled(hostname?: string): boolean {
  const flagEnabled =
    process.env.BYPASS_AUTH === "true" ||
    process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true" ||
    process.env.DEV_BYPASS_AUTH === "true"

  if (!flagEnabled) return false

  if (isLocalHostname(hostname)) {
    return true
  }

  return process.env.NODE_ENV === "development"
}
