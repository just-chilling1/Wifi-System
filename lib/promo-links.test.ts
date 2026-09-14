import { describe, expect, it } from "vitest"
import {
  getDefaultPromoLinks,
  isValidPromoUrl,
  validatePromoLinksSettings,
} from "./promo-links"

describe("promo-links", () => {
  it("accepts valid https URLs", () => {
    expect(isValidPromoUrl("https://example.com/path")).toBe(true)
    expect(isValidPromoUrl("http://example.com")).toBe(false)
    expect(isValidPromoUrl("not-a-url")).toBe(false)
  })

  it("validates full settings", () => {
    const settings = getDefaultPromoLinks()
    expect(validatePromoLinksSettings(settings)).toBeNull()
  })

  it("rejects invalid training URL", () => {
    const settings = { ...getDefaultPromoLinks(), externalTrainingUrl: "ftp://bad" }
    expect(validatePromoLinksSettings(settings) ?? "").toMatch(/training URL/i)
  })

  it("rejects empty training headline", () => {
    const settings = { ...getDefaultPromoLinks(), externalTrainingTitle: "   " }
    expect(validatePromoLinksSettings(settings) ?? "").toMatch(/headline/i)
  })

  it("rejects empty scale training button text", () => {
    const settings = { ...getDefaultPromoLinks(), scaleTrainingCtaLabel: "" }
    expect(validatePromoLinksSettings(settings) ?? "").toMatch(/button text/i)
  })
})
