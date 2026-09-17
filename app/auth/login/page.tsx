"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { brand } from "@/config/brand.config"
import { isAdminUser } from "@/lib/admin"

export default function LoginPage() {
  const [callbackError, setCallbackError] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("error") === "auth_callback_failed") {
      setCallbackError(true)
    }
  }, [])

  useEffect(() => {
    void fetch("/api/auth/ensure-admin", { method: "POST" }).catch(() => {})
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      await fetch("/api/auth/ensure-admin", { method: "POST" }).catch(() => {})

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push(isAdminUser(data.user) ? "/admin" : "/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="text-center">
        <p className="page-eyebrow">Welcome back</p>
        <h1 className="ds-h2 text-ink">Access {brand.productName}</h1>
        <p className="mt-1 text-sm font-medium text-ink-3">{brand.tagline}</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-ink">
            Email Address
          </Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-5"
              aria-hidden
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base h-12 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-sapphire-700 transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-5"
              aria-hidden
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base h-12 pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-5 transition-colors hover:bg-sapphire-100 hover:text-sapphire-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {callbackError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
            <p className="text-sm font-medium text-destructive">
              Your sign-in link expired or is invalid. Please try again or request a new password reset.
            </p>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        <Button type="submit" className="btn-primary h-12 w-full font-semibold" disabled={isLoading}>
          {isLoading ? "Authenticating..." : "Enter Platform"}
        </Button>
        <div className="pt-1 text-center">
          <p className="text-sm text-ink-3">
            New user?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-sapphire-700 transition-colors hover:text-primary">
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
