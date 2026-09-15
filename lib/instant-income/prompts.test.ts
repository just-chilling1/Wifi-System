import { describe, expect, it } from "vitest"
import { buildInstantIncomePostsPrompt } from "./prompts"

describe("buildInstantIncomePostsPrompt", () => {
  it("locks the model to the chosen niche, offer details, and affiliate link", () => {
    const prompt = buildInstantIncomePostsPrompt({
      productName: "KetoMax",
      productContext: "A 6-week meal plan for stubborn belly fat",
      niche: "Weight Loss",
      promoLink: "https://digistore24.com/redir/keto",
      postCount: 5,
    })

    expect(prompt).toContain("Weight Loss")
    expect(prompt).toContain("KetoMax")
    expect(prompt).toContain("A 6-week meal plan for stubborn belly fat")
    expect(prompt).toContain("https://digistore24.com/redir/keto")
    expect(prompt).toContain("5 different Facebook")
    expect(prompt).toContain("Stay strictly inside")
    expect(prompt).not.toMatch(/could apply to any product/i)
  })

  it("uses a Pets story constraint so copy cannot drift into another niche", () => {
    const prompt = buildInstantIncomePostsPrompt({
      productName: "CalmPaws",
      productContext: "A course for reactive dog walking",
      niche: "Pets",
      promoLink: "https://example.com/calmpaws",
    })

    expect(prompt).toContain("Pets")
    expect(prompt).toContain("If the niche is Pets, do not write about weight loss")
    expect(prompt).toContain("CalmPaws")
  })
})
