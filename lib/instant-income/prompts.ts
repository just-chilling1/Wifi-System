import { INSTANT_INCOME_POST_COUNT } from "./niches"

export function buildInstantIncomePostsPrompt(input: {
  productName: string
  productContext: string
  niche: string
  promoLink: string
  postCount?: number
}): string {
  const postCount = input.postCount ?? INSTANT_INCOME_POST_COUNT
  const productContext = input.productContext.trim() || `${input.productName} in the ${input.niche} niche`

  return `Write ${postCount} different Facebook group posts that promote ONE specific affiliate offer.

NICHE (hard constraint — every sentence of struggle, story, and result MUST be about this niche and nothing else): ${input.niche}
PRODUCT / OFFER NAME: ${input.productName}
WHAT THE OFFER ACTUALLY IS (use these real details; do not invent a different product): ${productContext}
LINK TO INCLUDE EXACTLY ONCE IN EACH POST: ${input.promoLink}

Voice: a real person in a Facebook group sharing what finally helped them. Not an ad, not a guru, not a recap of a generic "method."

Each post MUST:
- Stay strictly inside the ${input.niche} niche. If the niche is Pets, do not write about weight loss. If it is Weight Loss, do not write about making money.
- Be clearly about THIS offer (${input.productName}), not a vague "system I found." Name the offer naturally 1-2 times and describe a benefit that matches the offer details above.
- Read as a first-person personal story (120-180 words)
- Use a different angle from the other posts. Mix these angles across the set: a specific result, a mistake they made for months, skepticism then surprise, a small everyday win, and a "I wish I had this earlier" story.
- End with the link on its own line, exactly: ${input.promoLink}
- Sound human: short paragraphs, contractions, no hashtags, no income promises, no medical diagnoses, no "DM me"
- Do not mention Wifi Code, AI, or that the post was generated

Forbidden:
- Generic copy that could promote any product in any niche
- Inventing brand names, prices, or claims that are not in the offer details
- Writing about a different niche than ${input.niche}

Reply with JSON only, no markdown fences, in exactly this shape:
{"posts": ["first post text", "second post text"]}`
}
