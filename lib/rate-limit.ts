type Bucket = { timestamps: number[] }

const buckets = new Map<string, Bucket>()

const SUPPORT_LIMIT = 5
const SUPPORT_WINDOW_MS = 60 * 60 * 1000

function prune(bucket: Bucket, windowMs: number, now: number) {
  bucket.timestamps = bucket.timestamps.filter((stamp) => now - stamp < windowMs)
}

function consume(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key) ?? { timestamps: [] }
  prune(bucket, windowMs, now)
  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket)
    return false
  }
  bucket.timestamps.push(now)
  buckets.set(key, bucket)
  return true
}

/** 5 support tickets per user per hour. */
export function consumeSupportQuota(userId: string): boolean {
  return consume(`support:${userId}`, SUPPORT_LIMIT, SUPPORT_WINDOW_MS)
}

/** 5 password-reset emails per address per hour. */
export function consumePasswordResetQuota(email: string): boolean {
  return consume(`password-reset:${email.trim().toLowerCase()}`, 5, SUPPORT_WINDOW_MS)
}
