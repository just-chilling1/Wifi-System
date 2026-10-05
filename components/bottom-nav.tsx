"use client"

import {
  Menu,
  Sparkles,
  LogOut,
  Link2,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePromoLinks } from "@/context/PromoLinksContext"
import { getVisibleExclusiveOffers } from "@/lib/promo-links"
import { getCachedClientUser } from "@/lib/auth-client-cache"
import { isAdminUser } from "@/lib/admin"
import { premiumSectionLabel } from "@/config/navigation.config"
import {
  getBottomNavMoreLinks,
  getBottomNavTabs,
  getSupportNav,
  getVisiblePremiumNav,
} from "@/lib/features"
import { NAV_ICONS } from "@/lib/nav-icons"
import { ExclusiveOffersNavSection } from "@/components/layout/ExclusiveOffersNavSection"

/** Fixed bottom tab bar for mobile. Hidden on desktop (lg+) where the sidebar lives. */
export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const tabs = getBottomNavTabs()
  const moreLinks = getBottomNavMoreLinks()
  const premiumItems = getVisiblePremiumNav()
  const supportItem = getSupportNav()
  const { settings: promoSettings } = usePromoLinks()
  const exclusiveOffers = getVisibleExclusiveOffers(promoSettings)

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      setIsAdmin(isAdminUser(user))
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const moreActive = !tabs.some((t) => t.path === pathname)

  return (
    <nav
      className="app-bottom-nav lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path
          const Icon = NAV_ICONS[tab.icon]
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`relative flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 transition-colors ${
                isActive ? "text-[var(--primary)]" : "text-[var(--text-primary)] hover:text-[var(--accent)]"
              }`}
            >
              <span className="relative z-[1] flex h-8 w-8 items-center justify-center">
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-[var(--layer-feature)] shadow-[var(--shadow-brand)]" />
                )}
                <Icon className={`relative z-[1] h-6 w-6 ${isActive ? "text-[var(--brand-50)]" : ""}`} strokeWidth={1.75} />
              </span>
              <span className={`bottom-nav-label relative z-[1] text-[11px] font-semibold leading-none ${isActive ? "text-[var(--brand-50)]" : ""}`}>{tab.label}</span>
            </Link>
          )
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`relative flex min-h-16 flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                moreActive ? "text-[var(--primary)]" : "text-[var(--text-primary)] hover:text-[var(--accent)]"
              }`}
            >
              <span className="relative z-[1] flex h-8 w-8 items-center justify-center">
                {moreActive && (
                  <span className="absolute inset-0 rounded-full bg-[var(--layer-feature)] shadow-[var(--shadow-brand)]" />
                )}
                <Menu className={`relative z-[1] h-6 w-6 ${moreActive ? "text-[var(--brand-50)]" : ""}`} strokeWidth={1.75} />
              </span>
              <span className={`bottom-nav-label relative z-[1] text-[11px] font-semibold leading-none ${moreActive ? "text-[var(--brand-50)]" : ""}`}>More</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[var(--ds-line)] bg-card p-0"
          >
            <SheetTitle className="sr-only">More</SheetTitle>
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--brand-700)]" />

            <div className="space-y-6 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
              {moreLinks.length > 0 && (
                <div>
                  <p className="sidebar-section-label !px-1 !pt-0">Library</p>
                  {moreLinks.map((item) => {
                    const Icon = NAV_ICONS[item.icon]
                    const isActive = pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMoreOpen(false)}
                        className={`sidebar-nav-item flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium ${
                          isActive ? "is-active" : "text-ink-2"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}

              <div className="premium-nav-section p-2">
                <div className="premium-nav-section-shimmer" aria-hidden />
                <p className="premium-nav-section-label relative z-[1] flex items-center gap-1.5 px-2 pb-2 pt-1 text-[13px] uppercase tracking-wider">
                  <Sparkles className="premium-sparkle h-3.5 w-3.5" fill="currentColor" />
                  {premiumSectionLabel}
                </p>
                <div className="relative z-[1] space-y-1.5">
                  {premiumItems.map((item, index) => {
                    const Icon = NAV_ICONS[item.icon]
                    const isActive = pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMoreOpen(false)}
                        style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                        className={`premium-stagger-item premium-sidebar-item flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium ${
                          isActive ? "is-active" : ""
                        }`}
                      >
                        <span className="premium-sidebar-icon-chip">
                          <Icon className="h-4 w-4" />
                        </span>
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <ExclusiveOffersNavSection offers={exclusiveOffers} mobile />

              <div className="space-y-1.5 border-t border-[var(--ds-line)] pt-4">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 rounded-[var(--ds-r-md)] px-4 py-3.5 text-[15px] font-medium ${
                      pathname === "/admin" || pathname.startsWith("/admin/")
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <Link2 className="h-5 w-5" />
                    Promo Links
                  </Link>
                ) : null}
                {supportItem && (
                  <Link
                    href={supportItem.path}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 rounded-[var(--ds-r-md)] px-4 py-3.5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  >
                    {(() => {
                      const Icon = NAV_ICONS[supportItem.icon]
                      return <Icon className="h-5 w-5" />
                    })()}
                    {supportItem.label}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="sidebar-sign-out w-full gap-3 px-4 py-3.5"
                >
                  <LogOut className="h-5 w-5" />
                  Exit Platform
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
