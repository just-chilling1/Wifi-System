import { describe, expect, it } from "vitest"
import { isWifiCodeAccepted, levenshteinDistance, WIFI_CODE } from "./wifi-code"

describe("levenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshteinDistance("abc", "abc")).toBe(0)
  })

  it("counts substitutions, inserts, and deletes", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3)
    expect(levenshteinDistance("abc", "ab")).toBe(1)
    expect(levenshteinDistance("ab", "abc")).toBe(1)
  })
})

describe("isWifiCodeAccepted", () => {
  it("accepts the exact code", () => {
    expect(isWifiCodeAccepted(WIFI_CODE)).toBe(true)
  })

  it("accepts different case and surrounding spaces", () => {
    expect(isWifiCodeAccepted("  102030WIFI00  ")).toBe(true)
    expect(isWifiCodeAccepted("1020 30wifi 00")).toBe(true)
  })

  it("accepts one edit", () => {
    expect(isWifiCodeAccepted("102030wifi0")).toBe(true) // missing last 0
    expect(isWifiCodeAccepted("102030wifi01")).toBe(true) // wrong last digit
    expect(isWifiCodeAccepted("x02030wifi00")).toBe(true) // wrong first char
  })

  it("accepts two edits", () => {
    expect(isWifiCodeAccepted("102030wify01")).toBe(true)
    expect(isWifiCodeAccepted("102030wifi")).toBe(true) // two missing chars
  })

  it("rejects three or more edits", () => {
    expect(isWifiCodeAccepted("102030wif")).toBe(false)
    expect(isWifiCodeAccepted("abcdefghijkl")).toBe(false)
    expect(isWifiCodeAccepted("")).toBe(false)
    expect(isWifiCodeAccepted("   ")).toBe(false)
  })
})
