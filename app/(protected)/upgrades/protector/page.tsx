import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { buildProtectorViewModel, type ProtectorViewModel } from "@/lib/protector/build-protector-data"
import { ProtectorContent } from "./protector-content"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.protector} | Account Security Overview`,
  description: "Real-time account security monitoring and status",
}

export const dynamic = "force-dynamic"

const PREVIEW_VIEW_MODEL: ProtectorViewModel = {
  account: {
    email: "preview@localhost",
    fullName: "Preview Member",
    membership: "Active",
    premiumTier: "Free",
    memberSince: "Today",
    lastLogin: "Now",
    authProtection: "Enabled",
    accountId: "dev-preview",
    pagesGenerated: 0,
  },
  activities: [
    {
      id: "session",
      label: "Secure session active",
      time: "Now",
      sortAt: Date.now(),
    },
  ],
  accountStatus: "Preview",
  isEmailVerified: true,
}

export default async function ProtectorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  if (!user) {
    return <ProtectorContent data={PREVIEW_VIEW_MODEL} />
  }

  const { data: profile } = await supabase
    .from("users")
    .select(
      "email, full_name, upgrade_level, pages_generated, created_at, onboarding_completed_at",
    )
    .eq("id", user.id)
    .single()

  const viewModel = buildProtectorViewModel(user, profile)

  return <ProtectorContent data={viewModel} />
}
