import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { onboardingConfig } from "@/lib/onboarding/config"

export const dynamic = "force-dynamic"

export const metadata = {
  title: `Welcome | ${onboardingConfig.productName}`,
}

function firstWord(value: unknown): string {
  if (typeof value !== "string") return ""
  const word = value.trim().split(/\s+/)[0]
  return word ?? ""
}

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("onboarding_completed_at, full_name")
    .eq("id", user.id)
    .single()

  let completedAt = profile?.onboarding_completed_at as string | null | undefined
  let fullName = profile?.full_name as string | null | undefined

  // Older databases may not have full_name. Don't block onboarding on that.
  if (profileError) {
    const fallback = await supabase
      .from("users")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single()
    completedAt = fallback.data?.onboarding_completed_at
    fullName = null
  }

  if (completedAt) {
    redirect(onboardingConfig.dashboardRoute)
  }

  const firstName = firstWord(fullName) || firstWord(user.user_metadata?.full_name)

  return <OnboardingFlow firstName={firstName} />
}
