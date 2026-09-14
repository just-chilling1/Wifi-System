"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Link2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { createClient } from "@/lib/supabase/client"
import { brand } from "@/config/brand.config"
import { usePromoLinks } from "@/context/PromoLinksContext"
import { getVisibleExclusiveOffers } from "@/lib/promo-links"
import { getCachedClientUser } from "@/lib/auth-client-cache"
import { isAdminUser } from "@/lib/admin"
import {
  mainSectionLabel,
  premiumSectionLabel,
} from "@/config/navigation.config"
import {
  getMainNav,
  getSupportNav,
  getVisiblePremiumNav,
} from "@/lib/features"
import { NAV_ICONS } from "@/lib/nav-icons"
import { ExclusiveOffersNavSection } from "@/components/layout/ExclusiveOffersNavSection"

const COLLAPSE_KEY = "rh_sidebar_collapsed"

function applySidebarLayout(collapsed: boolean) {
  document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded"
  document.documentElement.style.setProperty("--sidebar-w", collapsed ? "76px" : "280px")
}

function SidebarBody({
  pathname,
  collapsed,
  onToggle,
  onNavigate,
  onSignOut,
  displayName,
  userInitials,
  isAdmin,
}: {
  pathname: string
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
  onSignOut: () => void
  displayName: string
  userInitials: string
  isAdmin: boolean
}) {
  const menuItems = getMainNav()
  const premiumItems = getVisiblePremiumNav()
  const supportItem = getSupportNav()
  const { settings: promoSettings } = usePromoLinks()
  const exclusiveOffers = getVisibleExclusiveOffers(promoSettings)

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-[var(--sidebar-border)] bg-[var(--sidebar-shell-bg,#fff)]">
      <div className={`shrink-0 border-b border-[var(--ds-line)] ${collapsed ? "p-3" : "px-[14px] py-4"}`}>
        <div className={`flex w-full items-center ${collapsed ? "flex-col gap-3" : "gap-2"}`}>
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={`transition-opacity hover:opacity-90 ${collapsed ? "flex w-full justify-center" : "min-w-0 flex-1"}`}
            title={brand.productName}
          >
            {collapsed ? (
              <BrandLogo variant="icon" size={52} />
            ) : (
              <BrandLogo variant="wordmark" width={220} priority />
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ds-line)] text-ink-3 transition-colors hover:bg-sapphire-100 hover:text-ink ${!collapsed ? "ml-auto" : ""}`}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="sidebar-scroll flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain py-2">
        {!collapsed && <p className="sidebar-section-label px-[14px]">{mainSectionLabel}</p>}
        <nav aria-label="Main navigation" className="space-y-0.5 px-[14px]">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            const Icon = NAV_ICONS[item.icon]
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={`sidebar-nav-item group flex items-center rounded-md border border-transparent text-[15px] ${
                  collapsed ? "justify-center px-2 py-3" : "gap-3 py-3 pl-[14px] pr-3"
                } ${isActive ? "is-active" : "text-ink"}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-sapphire-200" : "text-ink-3"}`} />
                {!collapsed && <span className="sidebar-nav-label truncate font-normal leading-[1.4]">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className={`mt-4 shrink-0 ${collapsed ? "px-1.5" : "px-[14px]"}`}>
          <div className={`premium-nav-section ${collapsed ? "p-1" : "p-2"}`}>
            <div className="premium-nav-section-shimmer" aria-hidden />
            {!collapsed && (
              <p className="premium-nav-section-label relative z-[1] flex items-center gap-1.5 px-2.5 pb-2 pt-1.5 text-[13px] uppercase tracking-wider">
                <Sparkles className="premium-sparkle h-3.5 w-3.5" fill="currentColor" />
                {premiumSectionLabel}
              </p>
            )}
            <nav className="relative z-[1] space-y-1">
              {premiumItems.map((item, index) => {
                const isActive = pathname === item.path
                const Icon = NAV_ICONS[item.icon]
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onNavigate}
                    title={item.label}
                    style={{ animationDelay: `${0.15 + index * 0.06}s` }}
                    className={`premium-stagger-item premium-sidebar-item flex items-center text-[15px] font-medium ${
                      collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2"
                    } ${isActive ? "is-active" : ""}`}
                  >
                    <span className="premium-sidebar-icon-chip">
                      <Icon className="h-4 w-4" />
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {!collapsed && (
          <div className="mt-4 min-w-0 shrink-0 px-[14px]">
            <ExclusiveOffersNavSection offers={exclusiveOffers} />
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-2 border-t border-[var(--ds-line)] p-2 md:p-4">
        {isAdmin ? (
          <Link
            href="/admin"
            onClick={onNavigate}
            title="Promo Links"
            className={`sidebar-nav-item flex items-center text-[15px] ${
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
            } ${pathname === "/admin" || pathname.startsWith("/admin/") ? "is-active" : "text-ink"}`}
          >
            <Link2 className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="sidebar-nav-label">Promo Links</span>}
          </Link>
        ) : null}
        {supportItem && (
          <Link
            href={supportItem.path}
            onClick={onNavigate}
            title={supportItem.label}
            className={`sidebar-nav-item flex items-center text-[15px] ${
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
            } ${pathname === supportItem.path ? "is-active" : "text-ink"}`}
          >
            {(() => {
              const Icon = NAV_ICONS[supportItem.icon]
              return <Icon className="h-5 w-5 shrink-0" />
            })()}
            {!collapsed && <span className="sidebar-nav-label">{supportItem.label}</span>}
          </Link>
        )}

        <div className={`min-w-0 ${collapsed ? "px-1" : "px-1 pt-1"}`}>
          <div className={`flex min-w-0 items-center ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-[15px] font-medium text-primary-foreground shadow-sm">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-medium text-ink">{displayName}</div>
                <div className="truncate text-[13px] text-ink-5">Active Member</div>
              </div>
            )}
            <button
              type="button"
              onClick={onSignOut}
              className="sidebar-sign-out h-10 w-10 rounded-lg p-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [displayName, setDisplayName] = useState("Member")
  const [userInitials, setUserInitials] = useState("WC")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY) === "1"
    setCollapsed(saved)
    applySidebarLayout(saved)
  }, [])

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      if (!user) return
      const handle = user.email?.split("@")[0] || "Member"
      const name =
        (user.user_metadata?.full_name as string | undefined)?.trim() ||
        handle.charAt(0).toUpperCase() + handle.slice(1)
      setDisplayName(name)
      setUserInitials(name.substring(0, 2).toUpperCase())
      setIsAdmin(isAdminUser(user))
    })
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0")
      applySidebarLayout(next)
      return next
    })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      <aside
        className="app-sidebar fixed left-0 top-0 z-50 hidden h-dvh transition-[width] duration-300 lg:flex"
        style={{ width: "var(--sidebar-w)" }}
      >
        <SidebarBody
          pathname={pathname}
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          onSignOut={handleSignOut}
          displayName={displayName}
          userInitials={userInitials}
          isAdmin={isAdmin}
        />
      </aside>

      <div
        className="mobile-header-glass fixed inset-x-0 top-0 z-40 flex items-center justify-center lg:hidden"
        style={{ paddingTop: "env(safe-area-inset-top)", height: "calc(var(--mobile-header-h, 3.5rem) + env(safe-area-inset-top))" }}
      >
        <Link href="/dashboard" className="min-w-0 px-4">
          <BrandLogo variant="wordmark" width={180} priority />
        </Link>
      </div>
    </>
  )
}
