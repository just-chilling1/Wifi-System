const MARKETPLACE_STEMS =
  /^(digistore24|clickbank|warriorplus|jvzoo|paykickstart|buygoods|maxweb|hop|track|go|www|com)$/i

export function isGenericProductName(name: string): boolean {
  const trimmed = name.trim()
  if (!trimmed) return true
  if (trimmed.includes(".")) return true
  const firstWord = trimmed.split(/[\s|/]+/)[0] ?? ""
  return MARKETPLACE_STEMS.test(firstWord)
}

export function pickProductName(offerName: string | undefined, scrapedName: string): string {
  const scraped = scrapedName.trim()
  if (scraped && !isGenericProductName(scraped)) return scraped

  const named = offerName?.trim() ?? ""
  if (named && !isGenericProductName(named)) return named

  return scraped || named || "This Offer"
}

export function resolveOfferLabel(productName: string, niche: string): string {
  const trimmed = productName.trim()
  if (!trimmed || isGenericProductName(trimmed)) {
    return `this ${niche.toLowerCase()} program`
  }
  return trimmed
}
