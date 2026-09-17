import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { PageHeader } from "@/components/page-header"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { DashboardTipsWidget } from "@/components/dashboard-tips-widget"
import { PremiumUpgradesWidget } from "@/components/premium-upgrades-widget"
import { DashboardVideoCard } from "@/components/dashboard-video-card"
import { BonusTrainingCard } from "@/components/bonus-training-card"
import { BookOpen, Brain, Play } from "lucide-react"
import { DASHBOARD_TRAINING_VIDEOS } from "@/lib/dashboard-training-videos"
import { brand } from "@/config/brand.config"
import { dashboard } from "@/config/dashboard.config"

/** Never serve a cached dashboard shell (avoids stale UI after deploys). */
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !isDevAuthBypassEnabled()) {
      redirect("/auth/login")
    }

    let profile = null

    if (user) {
      try {
        const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()
        profile = profileData
      } catch (error) {
        console.error("[robinhood] Error fetching profile:", error)
      }
    }

    const firstName = profile?.full_name ? profile.full_name.split(" ")[0] : ""

    return (
      <div className="page-container mx-auto w-full max-w-7xl">
        <PageHeader
          eyebrow={dashboard.eyebrow}
          title={
            <>
              Welcome to {brand.productName}
              {firstName ? `, ${firstName}` : ""}
            </>
          }
          subtitle={dashboard.subtitle}
        />

        <div className="grid grid-cols-1 gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 text-ink-3" strokeWidth={1.75} />
                <h2 className="ds-h2">Start Here</h2>
              </div>
              <DashboardVideoCard video={DASHBOARD_TRAINING_VIDEOS[0]} />
            </div>

            <BonusTrainingCard />

            <DashboardVideoCard video={DASHBOARD_TRAINING_VIDEOS[1]} />

            <BonusTrainingCard />

            <DashboardVideoCard video={DASHBOARD_TRAINING_VIDEOS[2]} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="btn-primary inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 px-4 text-center text-[14px] leading-snug sm:px-6 sm:text-[15px]"
              >
                <Brain className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span className="sm:hidden">Start with Gold Rush</span>
                <span className="hidden sm:inline">Get Started Now with Gold Rush</span>
              </Link>
              <Link
                href="/training"
                className="btn-secondary inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 px-4 text-center text-[14px] leading-snug sm:px-6 sm:text-[15px]"
              >
                <BookOpen className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span className="sm:hidden">Open the Academy</span>
                <span className="hidden sm:inline">Know More from the Academy</span>
              </Link>
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-8 xl:self-start">
            <ContactSupportWidget />
            <DashboardTipsWidget />
            <PremiumUpgradesWidget />
          </aside>
        </div>
      </div>
    )
  } catch (error) {
    console.error("[robinhood] Dashboard error:", error)
    if (!isDevAuthBypassEnabled()) {
      redirect("/auth/login")
    }
    return (
      <div className="page-container mx-auto w-full max-w-7xl">
        <PageHeader
          eyebrow={dashboard.eyebrow}
          title={<>Welcome to {brand.productName}</>}
          subtitle={dashboard.subtitle}
        />
        <p className="text-sm text-text-secondary">Preview mode — dashboard data unavailable.</p>
      </div>
    )
  }
}
