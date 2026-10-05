import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { listAffiliateLinks, type AffiliateLink } from "@/app/actions/affiliate-links"
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { HighTicketPayoutsContent } from "./high-ticket-payouts-content"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.highTicketPayouts} | ${PRODUCT_NAME}`,
  description:
    "100 ready-to-publish authority articles — pick a Link Vault offer, preview with your affiliate link woven in, and publish across platforms.",
}

export default async function HighTicketPayoutsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  let links: AffiliateLink[] = []
  if (user) {
    const result = await listAffiliateLinks()
    if (result.success) {
      links = result.links
    }
  }

  return <HighTicketPayoutsContent links={links} />
}
