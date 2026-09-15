export const INSTANT_INCOME_NICHES = [
  "Weight Loss",
  "Make Money Online",
  "Health & Fitness",
  "Beauty & Skincare",
  "Relationships",
  "Tech & Gadgets",
  "Pets",
  "Home & Garden",
] as const

export type InstantIncomeNiche = (typeof INSTANT_INCOME_NICHES)[number]

export const INSTANT_INCOME_POST_COUNT = 5

export function isInstantIncomeNiche(value: string): value is InstantIncomeNiche {
  return (INSTANT_INCOME_NICHES as readonly string[]).includes(value)
}
