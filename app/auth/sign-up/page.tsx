"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { brand } from "@/config/brand.config"
import {
  clearSpecialistPopupFromSignup,
  markSpecialistPopupFromSignup,
} from "@/lib/specialist-popup-session"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    const trimmedName = firstName.trim()
    if (!trimmedName) {
      setError("Please enter your first name")
      setIsLoading(false)
      return
    }

    try {
      markSpecialistPopupFromSignup()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: trimmedName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      })
      if (error) throw error
      router.push("/onboarding")
    } catch (error: unknown) {
      clearSpecialistPopupFromSignup()
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : error instanceof Error
            ? error.message
            : "An error occurred"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-center">
        <h1 className="ds-h2 text-ink">Join {brand.productName}</h1>
        <p className="mt-1 text-sm font-medium text-ink-3">{brand.signupTagline}</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-sm font-medium text-ink">
            First Name
          </Label>
          <Input
            id="first-name"
            type="text"
            placeholder="Your first name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-base h-12"
            autoComplete="given-name"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-ink">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 6 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base h-12"
          />
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        <Button type="submit" className="btn-primary h-12 w-full font-semibold" disabled={isLoading}>
          {isLoading ? "Initializing Agent..." : "Activate Account"}
        </Button>
        <div className="pt-1 text-center">
          <p className="text-sm text-ink-3">
            Already registered?{" "}
            <Link href="/auth/login" className="font-semibold text-sapphire-700 transition-colors hover:text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
