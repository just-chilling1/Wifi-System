"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SupportCtaBanner } from "@/components/layout/SupportCtaBanner"

const BottomNav = dynamic(
  () => import("@/components/bottom-nav").then((m) => ({ default: m.BottomNav })),
  { ssr: false },
)

const SpecialistWelcomePopupHost = dynamic(
  () =>
    import("@/components/specialist-welcome-popup-host").then((m) => ({
      default: m.SpecialistWelcomePopupHost,
    })),
  { ssr: false },
)

const PUBLIC_SHELL_BYPASS_PREFIXES = ["/article/", "/embed/"]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage =
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/legal/") ||
    pathname.startsWith("/dev/") ||
    pathname.startsWith("/secret-")

  const isPublicPage = PUBLIC_SHELL_BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  const hideSupportBanner =
    pathname === "/support" ||
    pathname.startsWith("/support/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")

  // Mount on login + app so SIGNED_IN can open the popup, then survive the
  // redirect into the dashboard. Sign-up and onboarding skip it. Embed/dev
  // render their own copy.
  const hideSpecialistPopup =
    pathname === "/embed" ||
    pathname.startsWith("/embed/") ||
    pathname.startsWith("/article/") ||
    pathname.startsWith("/dev/") ||
    pathname.startsWith("/legal/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname === "/auth/sign-up" ||
    pathname.startsWith("/auth/sign-up/") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/forgot-password")

  const specialistPopup = hideSpecialistPopup ? null : <SpecialistWelcomePopupHost />

  const chrome =
    isAuthPage || isPublicPage ? (
      children
    ) : (
      <div className="app-bg flex min-h-dvh min-w-0 overflow-x-clip">
        <AppSidebar />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <main className="app-main-canvas relative min-w-0 flex-1 overflow-x-clip overflow-y-auto scroll-smooth px-3 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-[calc(var(--mobile-header-h,3.5rem)+env(safe-area-inset-top,0px))] transition-[padding] duration-300 sm:px-6 lg:pb-8 lg:pl-[calc(var(--sidebar-w)+var(--sidebar-gap))] lg:pr-8 lg:pt-8">
            <div className="app-content-layer flex min-h-full w-full min-w-0 flex-col gap-0">
              {children}
              {!hideSupportBanner ? <SupportCtaBanner className="mx-auto mt-6 w-full max-w-7xl sm:mt-8" /> : null}
            </div>
          </main>
        </div>

        <BottomNav />
      </div>
    )

  return (
    <>
      {chrome}
      {specialistPopup}
    </>
  )
}
