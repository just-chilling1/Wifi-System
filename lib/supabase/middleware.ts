import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { isAdminUser } from "@/lib/admin"

function isSpecialistPublicPath(pathname: string) {
  return (
    pathname === "/embed" ||
    pathname.startsWith("/embed/") ||
    pathname.startsWith("/api/eligibility/") ||
    pathname === "/api/track/specialist-popup" ||
    pathname.startsWith("/api/track/specialist-popup/") ||
    pathname === "/api/auth/ensure-admin" ||
    pathname.startsWith("/api/auth/ensure-admin/") ||
    pathname === "/api/auth/forgot-password"
  )
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Never expose /dev/* force-open previews in production.
  if (
    process.env.NODE_ENV !== "development" &&
    (pathname === "/dev" || pathname.startsWith("/dev/"))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Public embed + specialist APIs — must run before auth redirects.
  if (
    isSpecialistPublicPath(pathname) ||
    (process.env.NODE_ENV === "development" &&
      (pathname === "/dev" || pathname.startsWith("/dev/")))
  ) {
    return NextResponse.next({ request })
  }

  if (isDevAuthBypassEnabled(request.nextUrl.hostname)) {
    return NextResponse.next({ request })
  }

  // If Supabase env vars are missing, fail closed in production.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === "production") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = isAdminUser(user)
  const postLoginPath = isAdmin ? "/admin" : "/dashboard"
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")

  if (
    !user &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/article") &&
    pathname !== "/reset-password" &&
    pathname !== "/"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  const authPathsAllowedWhenLoggedIn = ["/auth/callback", "/auth/reset-password"]
  const isResetPasswordRoute = request.nextUrl.pathname.startsWith("/auth/reset-password")

  // Redirect authenticated users away from auth pages (except password reset flow)
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const isAllowed = authPathsAllowedWhenLoggedIn.some(
      (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
    )
    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = isAdmin ? "/admin" : "/onboarding"
      return NextResponse.redirect(url)
    }
  }

  if (user && isAdminRoute && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding")

  if (user && isAdmin) {
    if (isOnboardingRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (
    user &&
    !isOnboardingRoute &&
    !isResetPasswordRoute
  ) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return supabaseResponse
    }

    if (!profile?.onboarding_completed_at) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }
  }

  if (user && isOnboardingRoute) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return supabaseResponse
    }

    if (profile?.onboarding_completed_at) {
      const url = request.nextUrl.clone()
      url.pathname = postLoginPath
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
