"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error || "An error occurred")
      }
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-center">
        <h1 className="ds-h2 text-ink">Reset Password</h1>
        <p className="mt-1 text-sm font-medium text-ink-3">We&apos;ll email you a secure reset link</p>
      </div>

      {success ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
            <Mail className="h-6 w-6 text-ink-3" />
          </div>
          <div className="space-y-2">
            <p className="text-base font-semibold text-ink">Check your email</p>
            <p className="text-sm leading-relaxed text-ink-3">
              If an account exists for <span className="font-semibold text-ink">{email}</span>, you&apos;ll
              receive a password reset link shortly.
            </p>
          </div>
          <Button asChild className="btn-primary h-12 w-full font-semibold">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-3">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}
          <Button type="submit" className="btn-primary h-12 w-full font-semibold" disabled={isLoading}>
            {isLoading ? "Sending reset link..." : "Send Reset Link"}
          </Button>
          <div className="pt-1 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-sapphire-700 transition-colors hover:text-primary"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
