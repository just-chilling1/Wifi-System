import { generateStructuredJson, isAiConfigured } from "@/lib/dfy-profit/ai"
import { scrapeOfferContext } from "@/lib/dfy-profit/scrape-offer-context"
import { INSTANT_INCOME_POST_COUNT } from "./niches"
import { pickProductName, resolveOfferLabel } from "./offer-label"
import { buildInstantIncomeFallbackPosts } from "./posts-fallback"
import { buildInstantIncomePostsPrompt } from "./prompts"

export type GeneratedInstantIncomePost = {
  id: string
  body: string
}

function validatePosts(raw: unknown, postCount: number, promoLink: string): string[] | null {
  const posts = (raw as { posts?: unknown })?.posts
  if (!Array.isArray(posts)) return null

  const usable = posts.filter((post): post is string => typeof post === "string" && post.trim().length >= 80)
  if (usable.length < postCount) return null

  return usable.slice(0, postCount).map((post) => (post.includes(promoLink) ? post.trim() : `${post.trim()}\n\n${promoLink}`))
}

export async function generateInstantIncomePosts(input: {
  affiliateUrl: string
  niche: string
  offerName?: string
  postCount?: number
}): Promise<{
  posts: GeneratedInstantIncomePost[]
  productName: string
  usedFallback: boolean
}> {
  const postCount = input.postCount ?? INSTANT_INCOME_POST_COUNT
  const scraped = await scrapeOfferContext(input.affiliateUrl)
  const productName = pickProductName(input.offerName, scraped.productName)
  const offerLabel = resolveOfferLabel(productName, input.niche)
  const productContextParts = [
    scraped.productContext.trim() || `${offerLabel} — a ${input.niche} offer the reader can start from the link`,
  ]
  if (input.offerName?.trim() && input.offerName.trim() !== productName) {
    productContextParts.push(`The member saved this offer as “${input.offerName.trim()}”.`)
  }
  const productContext = productContextParts.join(" ")

  let bodies: string[]
  let usedFallback = false

  if (!isAiConfigured()) {
    bodies = buildInstantIncomeFallbackPosts({
      niche: input.niche,
      productName,
      promoLink: input.affiliateUrl,
      count: postCount,
    })
    usedFallback = true
  } else {
    try {
      bodies = await generateStructuredJson<string[]>({
        prompt: buildInstantIncomePostsPrompt({
          productName: offerLabel,
          productContext,
          niche: input.niche,
          promoLink: input.affiliateUrl,
          postCount,
        }),
        validate: (raw) => validatePosts(raw, postCount, input.affiliateUrl),
        options: { maxRetries: 2, timeoutMs: 50_000 },
      })
    } catch (error) {
      console.error("[rh] instant-income posts AI failed, using niche fallback:", error)
      bodies = buildInstantIncomeFallbackPosts({
        niche: input.niche,
        productName,
        promoLink: input.affiliateUrl,
        count: postCount,
      })
      usedFallback = true
    }
  }

  return {
    productName,
    usedFallback,
    posts: bodies.map((body, index) => ({
      id: `ii-post-${index + 1}`,
      body,
    })),
  }
}
