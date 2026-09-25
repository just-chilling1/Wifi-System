/** Canonical wifi code shown in the welcome video. */
export const WIFI_CODE = "102030wifi00"

/** Max Levenshtein edits allowed (substitutions, inserts, deletes). */
export const WIFI_CODE_MAX_DISTANCE = 2

function normalizeWifiCode(value: string): string {
  return value.trim().replace(/\s+/g, "").toLowerCase()
}

/** Edit distance between two strings (insert, delete, substitute). */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const prev = new Array<number>(b.length + 1)
  const curr = new Array<number>(b.length + 1)

  for (let j = 0; j <= b.length; j++) prev[j] = j

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]!
  }

  return prev[b.length]!
}

/** True when the input matches the wifi code within the allowed edit distance. */
export function isWifiCodeAccepted(input: string): boolean {
  const normalized = normalizeWifiCode(input)
  if (!normalized) return false
  return levenshteinDistance(normalized, WIFI_CODE) <= WIFI_CODE_MAX_DISTANCE
}
