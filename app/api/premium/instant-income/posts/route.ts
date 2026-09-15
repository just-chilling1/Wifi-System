import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { generateInstantIncomePosts } from "@/lib/instant-income/generate-posts"
import { isInstantIncomeNiche } from "@/lib/instant-income/niches"

export const dynamic = "force-dynamic"
export const maxDuration = 120

const NO_STORE = { "Cache-Control": "no-store" } as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE })
  }

  const body = await request.json().catch(() => ({}))
  const affiliateUrl = typeof body.affiliateUrl === "string" ? body.affiliateUrl.trim() : ""
  const niche = typeof body.niche === "string" ? body.niche.trim() : ""
  const offerName = typeof body.offerName === "string" ? body.offerName.trim() : ""

  if (!isValidAffiliateUrl(affiliateUrl)) {
    return NextResponse.json(
      { error: "Enter a valid affiliate URL starting with https://" },
      { status: 400, headers: NO_STORE },
    )
  }
  if (!isInstantIncomeNiche(niche)) {
    return NextResponse.json({ error: "Pick a niche first." }, { status: 400, headers: NO_STORE })
  }

  const result = await generateInstantIncomePosts({
    affiliateUrl,
    niche,
    offerName: offerName || undefined,
  })

  return NextResponse.json(result, { headers: NO_STORE })
}
