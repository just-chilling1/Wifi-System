import { NextResponse } from "next/server"
import { getServiceRoleClient } from "@/lib/api-auth"
import { getAuthCallbackUrl, getSiteUrl } from "@/lib/auth/site-url"
import { consumePasswordResetQuota } from "@/lib/rate-limit"
import { brand } from "@/config/brand.config"

export const dynamic = "force-dynamic"

const GENERIC_SUCCESS = {
  success: true as const,
  message: "If an account exists for that email, a reset link is on its way.",
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

async function sendResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const from =
    process.env.RESEND_FROM_EMAIL || `${brand.productName} <support@reliteagency.com>`
  const product = brand.productName

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Reset your ${product} password`,
      text: `Reset your ${product} password:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>We received a request to reset your ${escapeHtml(product)} password.</p>
<p><a href="${escapeHtml(resetUrl)}">Choose a new password</a></p>
<p>If you did not request this, you can ignore this email.</p>`,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error("[auth] Reset email send failed:", res.status, detail)
    return false
  }

  return true
}

export async function POST(request: Request) {
  let email = ""
  try {
    const body = (await request.json()) as { email?: unknown }
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  } catch {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  if (!consumePasswordResetQuota(email)) {
    return NextResponse.json(GENERIC_SUCCESS)
  }

  const admin = getServiceRoleClient()
  const apiKey = process.env.RESEND_API_KEY
  if (!admin || !apiKey) {
    console.error("[auth] Password reset needs SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY")
    return NextResponse.json({ error: "Password reset is temporarily unavailable." }, { status: 503 })
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: getAuthCallbackUrl("/auth/reset-password") },
  })

  if (error || !data.properties?.hashed_token) {
    return NextResponse.json(GENERIC_SUCCESS)
  }

  const resetUrl = `${getSiteUrl()}/auth/callback?token_hash=${encodeURIComponent(
    data.properties.hashed_token,
  )}&type=recovery&next=${encodeURIComponent("/auth/reset-password")}`

  const sent = await sendResetEmail(email, resetUrl)
  if (!sent) {
    return NextResponse.json({ error: "Could not send the reset email. Try again shortly." }, { status: 503 })
  }

  return NextResponse.json(GENERIC_SUCCESS)
}
