import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/dfy-profit/ai", () => ({
  generateStructuredJson: vi.fn(),
  isAiConfigured: vi.fn(),
}))

vi.mock("@/lib/dfy-profit/scrape-offer-context", () => ({
  scrapeOfferContext: vi.fn(),
}))

import { generateStructuredJson, isAiConfigured } from "@/lib/dfy-profit/ai"
import { scrapeOfferContext } from "@/lib/dfy-profit/scrape-offer-context"
import { generateInstantIncomePosts } from "./generate-posts"

describe("generateInstantIncomePosts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns niche fallback posts when AI is not configured", async () => {
    vi.mocked(isAiConfigured).mockReturnValue(false)
    vi.mocked(scrapeOfferContext).mockResolvedValue({
      productName: "KetoMax",
      productContext: "A 6-week fat-loss meal plan",
    })

    const result = await generateInstantIncomePosts({
      affiliateUrl: "https://example.com/keto",
      niche: "Weight Loss",
      offerName: "KetoMax",
    })

    expect(result.usedFallback).toBe(true)
    expect(result.productName).toBe("KetoMax")
    expect(result.posts).toHaveLength(5)
    expect(result.posts[0]?.body).toContain("KetoMax")
    expect(result.posts[0]?.body).toContain("https://example.com/keto")
    expect(generateStructuredJson).not.toHaveBeenCalled()
  })

  it("uses AI bodies when they validate", async () => {
    vi.mocked(isAiConfigured).mockReturnValue(true)
    vi.mocked(scrapeOfferContext).mockResolvedValue({
      productName: "CalmPaws",
      productContext: "Reactive dog walking course",
    })
    vi.mocked(generateStructuredJson).mockImplementation(async ({ validate }) => {
      const posts = [
        `Our walks were a mess until CalmPaws gave us a sequence that actually fit a reactive dog.\n\nhttps://example.com/paws`,
        `I stopped collecting random pet tips and followed CalmPaws instead.\n\nhttps://example.com/paws`,
        `Skeptical pet parent here. CalmPaws was the first thing that matched our dog.\n\nhttps://example.com/paws`,
        `Small win: a walk that did not feel like a battle after CalmPaws.\n\nhttps://example.com/paws`,
        `I wish I had CalmPaws before another month of generic hacks.\n\nhttps://example.com/paws`,
      ]
      const validated = validate({ posts })
      if (!validated) throw new Error("test fixture failed validation")
      return validated
    })

    const result = await generateInstantIncomePosts({
      affiliateUrl: "https://example.com/paws",
      niche: "Pets",
    })

    expect(result.usedFallback).toBe(false)
    expect(result.posts).toHaveLength(5)
    expect(result.posts[0]?.body).toContain("CalmPaws")
    expect(generateStructuredJson).toHaveBeenCalled()
    const prompt = vi.mocked(generateStructuredJson).mock.calls[0]?.[0]?.prompt as string
    expect(prompt).toContain("Pets")
    expect(prompt).toContain("Reactive dog walking course")
  })
})
