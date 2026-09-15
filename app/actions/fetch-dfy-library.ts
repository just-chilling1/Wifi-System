"use server"

import { requireUser } from "@/lib/auth/require-user"

export interface DFYVideo {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  viewCount: number
  niche: string
  estimatedClicks: number
  viralScore: number
  commentTemplates: string[] // 5 templates with [PRODUCT] and [LINK] placeholders
}

const NICHES = [
  "Health & Wellness",
  "Finance & Investing",
  "Fitness & Sports",
  "Digital Marketing",
  "Self-Help & Personal Development",
  "Beauty & Skincare",
  "Education & Learning",
  "Business & Entrepreneurship",
  "Travel & Lifestyle",
]

// Cache the library in memory so we don't hammer the APIs (RapidAPI rate-limits
// aggressively) every time someone opens the page.
const LIBRARY_CACHE_TTL_MS = 30 * 60 * 1000
let libraryCache: { videos: DFYVideo[]; fetchedAt: number } | null = null

// Generate comment templates with placeholders
function generateCommentTemplates(): string[] {
  return [
    "I struggled with this exact thing for months. Then I found [PRODUCT] and everything changed. Completely different results now. Here if you want it: [LINK]",
    "This is solid advice. I combined this approach with [PRODUCT] and saw way better results than doing it alone. Game changer: [LINK]",
    "Been there. What finally worked for me was using [PRODUCT] alongside this method. Took things to the next level: [LINK]",
    "Great insights here. I also discovered [PRODUCT] which pairs perfectly with this strategy. Made a huge difference for me: [LINK]",
    "Struggled for a while until I found [PRODUCT]. It connects really well to what's discussed here. Check it out: [LINK]"
  ]
}

function calculateMetrics(viewCount: number): { estimatedClicks: number; viralScore: number } {
  const viralScore = Math.min(100, Math.round((viewCount / 1000000) * 100))

  const baseClickRate = 0.00001
  const bonusClickRate = (viralScore / 100) * 0.00009
  const clickRate = baseClickRate + bonusClickRate
  const rawClicks = viewCount * clickRate
  const estimatedClicks = Math.max(10, Math.min(99, Math.round(rawClicks)))

  return { estimatedClicks, viralScore }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

type RawVideo = {
  videoId?: unknown
  title?: unknown
  channelTitle?: unknown
  channelName?: unknown
  viewCount?: unknown
  thumbnail?: Array<{ url?: string }>
}

function mapRawToDFYVideo(video: RawVideo, niche: string): DFYVideo | null {
  const videoId = String(video.videoId || "")
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null

  const viewCount = parseInt(String(video.viewCount || "0")) || 0
  const metrics = calculateMetrics(viewCount)

  return {
    videoId,
    title: String(video.title || "Untitled"),
    channelTitle: String(video.channelTitle || video.channelName || "Unknown Channel"),
    thumbnailUrl: video.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    viewCount,
    niche,
    commentTemplates: generateCommentTemplates(),
    ...metrics,
  }
}

/** Prefer the higher-view copy when the same Short lands in multiple niches. */
function dedupeByVideoId(videos: DFYVideo[]): DFYVideo[] {
  const byVideoId = new Map<string, DFYVideo>()
  for (const video of videos) {
    const existing = byVideoId.get(video.videoId)
    if (!existing || video.viewCount > existing.viewCount) {
      byVideoId.set(video.videoId, video)
    }
  }
  return Array.from(byVideoId.values())
}

/** Search Shorts via the official YouTube Data API (primary source). */
async function searchWithYouTubeApi(query: string): Promise<RawVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return []

  try {
    const searchQuery = query.includes("shorts") ? query : `${query} shorts`
    const searchUrl =
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&maxResults=25&order=viewCount&q=${encodeURIComponent(searchQuery)}&key=${encodeURIComponent(apiKey)}`

    const searchResponse = await fetchWithTimeout(searchUrl, { cache: "no-store" }, 8000)
    if (!searchResponse.ok) {
      console.error("[DFY] YouTube API search failed:", searchResponse.status, query)
      return []
    }

    const searchData = await searchResponse.json()
    const ids = (searchData.items || [])
      .map((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .filter(Boolean)

    if (ids.length === 0) return []

    const videosUrl =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(ids.join(","))}&key=${encodeURIComponent(apiKey)}`

    const videosResponse = await fetchWithTimeout(videosUrl, { cache: "no-store" }, 8000)
    if (!videosResponse.ok) return []

    const videosData = await videosResponse.json()

    return (videosData.items || []).map((video: Record<string, unknown>) => {
      const snippet = video.snippet as Record<string, unknown> | undefined
      const statistics = video.statistics as Record<string, string> | undefined
      const thumbnails = snippet?.thumbnails as Record<string, { url?: string }> | undefined

      return {
        videoId: video.id,
        title: snippet?.title,
        channelTitle: snippet?.channelTitle,
        viewCount: statistics?.viewCount,
        thumbnail: thumbnails?.medium?.url
          ? [{ url: thumbnails.medium.url }]
          : thumbnails?.default?.url
            ? [{ url: thumbnails.default.url }]
            : [],
      }
    })
  } catch (error) {
    console.error("[DFY] YouTube API search error:", query, error)
    return []
  }
}

/** Search Shorts via RapidAPI (fallback source, aggressively rate-limited). */
async function searchWithRapidApi(query: string): Promise<RawVideo[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  if (!rapidApiKey) return []

  try {
    const response = await fetchWithTimeout(
      `https://yt-api.p.rapidapi.com/search?query=${encodeURIComponent(query)}&type=shorts&sort_by=views`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        },
        cache: "no-store",
      },
      8000,
    )

    if (!response.ok) {
      console.error(`[DFY] RapidAPI search failed for "${query}":`, response.status)
      return []
    }

    const data = await response.json()
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error(`[DFY] RapidAPI search error for "${query}":`, error)
    return []
  }
}

async function searchShorts(query: string): Promise<RawVideo[]> {
  const youtubeResults = await searchWithYouTubeApi(query)
  if (youtubeResults.length > 0) return youtubeResults
  return searchWithRapidApi(query)
}

/**
 * Live search used when the pre-loaded library has no match for the
 * user's product/keyword. Always returns fresh results from YouTube.
 */
export async function searchDFYVideos(query: string): Promise<DFYVideo[]> {
  const { user, error } = await requireUser()
  if (!user) throw new Error(error)

  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  try {
    const raw = await searchShorts(trimmed)
    const seen = new Set<string>()
    const videos: DFYVideo[] = []

    for (const rawVideo of raw) {
      const mapped = mapRawToDFYVideo(rawVideo, trimmed.toLowerCase())
      if (!mapped || seen.has(mapped.videoId)) continue
      seen.add(mapped.videoId)
      videos.push(mapped)
    }

    console.log(`[DFY] Live search "${trimmed}": ${videos.length} videos`)
    return videos.sort((a, b) => b.viewCount - a.viewCount).slice(0, 30)
  } catch (error) {
    console.error("[DFY] Live search failed:", error)
    return []
  }
}

export async function fetchDFYLibrary(): Promise<DFYVideo[]> {
  const { user, error } = await requireUser()
  if (!user) throw new Error(error)

  if (libraryCache && Date.now() - libraryCache.fetchedAt < LIBRARY_CACHE_TTL_MS && libraryCache.videos.length > 0) {
    const deduped = dedupeByVideoId(libraryCache.videos).sort((a, b) => b.viralScore - a.viralScore)
    libraryCache = { videos: deduped, fetchedAt: libraryCache.fetchedAt }
    return deduped
  }

  const byVideoId = new Map<string, DFYVideo>()

  try {
    for (const niche of NICHES) {
      try {
        const raw = await searchShorts(niche)
        let added = 0

        for (const video of raw.slice(0, 35)) {
          const mapped = mapRawToDFYVideo(video, niche)
          if (!mapped) continue

          const existing = byVideoId.get(mapped.videoId)
          if (!existing || mapped.viewCount > existing.viewCount) {
            byVideoId.set(mapped.videoId, mapped)
            if (!existing) added += 1
          }
        }

        console.log(`[DFY] Loaded ${added} new videos for "${niche}" (${byVideoId.size} unique total)`)
      } catch (nicheError) {
        console.error(`[DFY] Error fetching ${niche}:`, nicheError)
      }
    }

    const allVideos = Array.from(byVideoId.values())
    console.log(`[DFY] Total library size: ${allVideos.length} videos`)

    // Sort by viral score (best opportunities first)
    const sorted = allVideos.sort((a, b) => b.viralScore - a.viralScore)

    if (sorted.length > 0) {
      libraryCache = { videos: sorted, fetchedAt: Date.now() }
    }

    return sorted

  } catch (error) {
    console.error("[DFY] Error building library:", error)
    // Return empty array if API fails
    return []
  }
}
