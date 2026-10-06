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
import { premiumSectionLabel } from "@/config/navigation.config"
import {
  getMainNavSections,
  getSupportNav,
  getVisiblePremiumNav,
} from "@/lib/features"
import { NAV_ICONS } from "@/lib/nav-icons"
import { ExclusiveOffersNavSection } from "@/components/layout/ExclusiveOffersNavSection"

const COLLAPSE_KEY = "rh_sidebar_collapsed"

function applySidebarLayout(collapsed: boolean) {
  document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded"
  document.documentElement.style.setProperty("--sidebar-w", collapsed ? "84px" : "280px")
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
  const menuSections = getMainNavSections()
  const premiumItems = getVisiblePremiumNav()
  const supportItem = getSupportNav()
  const { settings: promoSettings } = usePromoLinks()
  const exclusiveOffers = getVisibleExclusiveOffers(promoSettings)

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--layer-shell)]">
      <div className={`shrink-0 ${collapsed ? "px-3 py-4" : "px-5 pb-2 pt-6"}`}>
        {collapsed ? (
          <div className="flex w-full flex-col items-center gap-3">
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="flex w-full justify-center transition-opacity hover:opacity-90"
              title={brand.productName}
            >
              <BrandLogo variant="icon" size={44} />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expand sidebar"
              aria-expanded={false}
              className="sidebar-collapse-toggle relative z-10"
            >
              <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)_2.25rem] items-center gap-2">
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="min-w-0 transition-opacity hover:opacity-90"
              title={brand.productName}
            >
              <BrandLogo variant="wordmark" size={40} priority />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              aria-expanded={true}
              className="sidebar-collapse-toggle relative z-10"
            >
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      <div className="sidebar-scroll flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain py-3">
        <nav aria-label="Main navigation" className={`flex flex-col ${collapsed ? "px-2" : "px-4"}`}>
          {menuSections.map((section) => (
            <div key={section.id} className="sidebar-nav-group">
              {!collapsed && <p className="sidebar-section-label">{section.label}</p>}
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path
                  const Icon = NAV_ICONS[item.icon]
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={`sidebar-nav-item type-nav group flex items-center border border-transparent ${
                        collapsed ? "sidebar-icon-btn justify-center" : "gap-3 px-2 py-1.5"
                      } ${isActive ? "is-active" : "text-[var(--brand-50)]"}`}
                    >
                      <span className="nav-icon-well">
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      </span>
                      {!collapsed && <span className="sidebar-nav-label truncate">{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`mt-4 shrink-0 ${collapsed ? "px-1.5" : "px-[14px]"}`}>
          <div className={`premium-nav-section ${collapsed ? "sidebar-premium-collapsed" : "p-2"}`}>
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
                      collapsed ? "sidebar-icon-btn justify-center" : "gap-2.5 px-3 py-2"
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

      <div className="sidebar-footer shrink-0 space-y-1 p-3 md:p-4">
        {isAdmin ? (
          <Link
            href="/admin"
            onClick={onNavigate}
            title="Promo Links"
            className={`sidebar-nav-item flex items-center text-[15px] ${
              collapsed ? "sidebar-icon-btn justify-center" : "gap-3 px-3 py-3"
            } ${pathname === "/admin" || pathname.startsWith("/admin/") ? "is-active" : "text-ink"}`}
          >
            {collapsed ? (
              <span className="nav-icon-well">
                <Link2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              </span>
            ) : (
              <Link2 className="h-5 w-5 shrink-0" />
            )}
            {!collapsed && <span className="sidebar-nav-label">Promo Links</span>}
          </Link>
        ) : null}
        {supportItem && (
          <Link
            href={supportItem.path}
            onClick={onNavigate}
            title={supportItem.label}
            className={`sidebar-nav-item flex items-center text-[15px] ${
              collapsed ? "sidebar-icon-btn justify-center" : "gap-3 px-3 py-3"
            } ${pathname === supportItem.path ? "is-active" : "text-ink"}`}
          >
            {(() => {
              const Icon = NAV_ICONS[supportItem.icon]
              return collapsed ? (
                <span className="nav-icon-well">
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                </span>
              ) : (
                <Icon className="h-5 w-5 shrink-0" />
              )
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
        className="app-sidebar pointer-events-auto fixed left-0 top-0 z-[80] hidden h-dvh transition-[width] duration-300 lg:flex"
        style={{ width: collapsed ? "84px" : "280px" }}
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
        <Link href="/dashboard" className="flex min-w-0 items-center px-4">
          <BrandLogo variant="wordmark" size={38} priority />
        </Link>
      </div>
    </>
  )
}
