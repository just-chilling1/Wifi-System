import { describe, expect, it } from "vitest"
import { pickProductName, resolveOfferLabel } from "./offer-label"
import { buildInstantIncomeFallbackPosts } from "./posts-fallback"

const LINK = "https://example.com/offer/keto"

describe("pickProductName", () => {
  it("prefers a scraped product name over a library label", () => {
    expect(pickProductName("My first link", "KetoMax")).toBe("KetoMax")
  })

  it("uses the set name when the scrape is only a marketplace host", () => {
    expect(pickProductName("KetoMax Plan", "Digistore24")).toBe("KetoMax Plan")
  })

  it("ignores a hostname-style set name so the scrape can win", () => {
    expect(pickProductName("digistore24.com", "KetoMax")).toBe("KetoMax")
  })
})

describe("resolveOfferLabel", () => {
  it("keeps a real product name", () => {
    expect(resolveOfferLabel("KetoMax", "Weight Loss")).toBe("KetoMax")
  })

  it("rewrites marketplace leftovers into a niche-specific label", () => {
    expect(resolveOfferLabel("Digistore24", "Pets")).toBe("this pets program")
  })
})

describe("buildInstantIncomeFallbackPosts", () => {
  it("returns the requested number of Weight Loss posts that name the offer and link", () => {
    const posts = buildInstantIncomeFallbackPosts({
      niche: "Weight Loss",
      productName: "KetoMax",
      promoLink: LINK,
      count: 5,
    })

    expect(posts).toHaveLength(5)
    for (const post of posts) {
      expect(post).toContain("KetoMax")
      expect(post).toContain(LINK)
      expect(post).not.toContain("{PRODUCT}")
      expect(post).not.toContain("{LINK}")
    }
    expect(new Set(posts).size).toBe(5)
  })

  it("stays in the Pets niche instead of serving weight-loss copy", () => {
    const posts = buildInstantIncomeFallbackPosts({
      niche: "Pets",
      productName: "CalmPaws",
      promoLink: LINK,
      count: 5,
    })

    expect(posts.join(" ").toLowerCase()).toMatch(/dog|pet|animal|walk/)
    expect(posts.join(" ")).toContain("CalmPaws")
    expect(posts.join(" ").toLowerCase()).not.toContain("yo-yo dieting")
  })

  it("still produces copy for an unknown niche", () => {
    const posts = buildInstantIncomeFallbackPosts({
      niche: "Underwater Basket Weaving",
      productName: "WeaveKit",
      promoLink: LINK,
      count: 3,
    })
    expect(posts).toHaveLength(3)
    expect(posts[0]).toContain("WeaveKit")
    expect(posts[0]).toContain(LINK)
  })
})
