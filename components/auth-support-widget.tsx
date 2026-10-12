"use client"

import { FormEvent, useEffect, useState } from "react"
import { HelpCircle, Loader2, Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { APP_SUPPORT_NAME, SUPPORT_EMAIL } from "@/lib/support"

type FormState = "idle" | "submitting" | "success" | "error"

const fieldClass =
  "w-full min-w-0 rounded-lg border border-[color-mix(in_srgb,var(--brand-950)_14%,white)] bg-white px-3.5 py-3 text-sm leading-normal text-[var(--brand-900)] placeholder:text-[var(--brand-300)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-100)] disabled:opacity-60"

const labelClass = "mb-2 block text-[13px] font-medium uppercase tracking-wide text-[var(--brand-800)]"

function openSupportMailto(email: string, message: string) {
  const subject = `${APP_SUPPORT_NAME} — Support Request`
  const body = `Please reply to: ${email}\n\n${message}`
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function AuthSupportWidget() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [sentViaMailto, setSentViaMailto] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  function finishWithMailto(trimmedEmail: string, trimmedMessage: string) {
    openSupportMailto(trimmedEmail, trimmedMessage)
    setSubmittedEmail(trimmedEmail)
    setSentViaMailto(true)
    setFormState("success")
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrorMessage("")

    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.")
      setFormState("error")
      return
    }

    if (trimmedMessage.length < 10) {
      setErrorMessage("Please add a bit more detail so we can help you.")
      setFormState("error")
      return
    }

    setFormState("submitting")

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage }),
      })

      const text = await res.text()
      const data = text.trim()
        ? (JSON.parse(text) as { error?: string; useMailto?: boolean; success?: boolean })
        : {}

      if (res.status === 401 || data.useMailto) {
        finishWithMailto(trimmedEmail, trimmedMessage)
        return
      }

      if (res.ok && data.success) {
        setSubmittedEmail(trimmedEmail)
        setSentViaMailto(false)
        setFormState("success")
        return
      }

      throw new Error(data.error || "Something went wrong. Please try again.")
    } catch (err) {
      if (err instanceof SyntaxError) {
        finishWithMailto(trimmedEmail, trimmedMessage)
        return
      }
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.")
      setFormState("error")
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close support panel"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Need help? Contact support"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full border border-white/80 bg-[var(--brand-50)] px-5 py-3 text-sm font-semibold text-[var(--brand-700)] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] transition-all hover:-translate-y-px hover:bg-white sm:bottom-6 sm:right-6"
        >
          <HelpCircle className="h-5 w-5 shrink-0" aria-hidden />
          Need help?
        </button>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Need help?"
          className="fixed bottom-4 right-4 z-50 flex max-h-[min(80vh,640px)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--brand-950)_12%,white)] bg-white text-[var(--brand-900)] shadow-xl sm:bottom-6 sm:right-6"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[color-mix(in_srgb,var(--brand-950)_10%,white)] px-4 py-3.5">
            <div className="min-w-0">
              <span className="block text-[13px] font-medium uppercase tracking-widest">Need help?</span>
              <span className="mt-0.5 block text-xs leading-snug text-[var(--brand-700)]">
                Send us a message — we typically reply within 2 hours
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support panel"
              className="shrink-0 rounded-lg p-1.5 text-[var(--brand-700)] transition-colors hover:bg-[var(--brand-100)] hover:text-[var(--brand-900)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {formState === "success" ? (
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-medium">
                  {sentViaMailto ? "Check your email app" : "Message sent"}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--brand-700)]">
                  {sentViaMailto ? (
                    <>
                      Your email app should open with the message ready. Tap Send, and we&apos;ll reply to{" "}
                      <span className="font-medium text-[var(--brand-900)]">{submittedEmail}</span>.
                    </>
                  ) : (
                    <>
                      We&apos;ll reply to{" "}
                      <span className="font-medium text-[var(--brand-900)]">{submittedEmail}</span>.
                    </>
                  )}{" "}
                  We usually respond within about 2 hours — during busy periods, allow 24–48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormState("idle")
                    setMessage("")
                    setSentViaMailto(false)
                    setErrorMessage("")
                  }}
                  className="text-sm font-medium text-[var(--brand-600)] underline-offset-2 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-[var(--brand-700)]">
                  We usually reply within about 2 hours — allow{" "}
                  <span className="font-medium text-[var(--brand-900)]">24–48 hours</span> during busy periods.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label htmlFor="auth-support-email" className={labelClass}>
                      Your email
                    </label>
                    <input
                      id="auth-support-email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={formState === "submitting"}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="auth-support-message" className={labelClass}>
                      Your message
                    </label>
                    <textarea
                      id="auth-support-message"
                      name="message"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Tell us what you need help with..."
                      required
                      disabled={formState === "submitting"}
                      rows={3}
                      className={`${fieldClass} min-h-[96px] resize-y`}
                    />
                  </div>

                  {formState === "error" && errorMessage ? (
                    <p className="text-sm font-semibold text-[#9F1239]" role="alert">
                      {errorMessage}
                    </p>
                  ) : null}

                  <p className="rounded-lg border border-[color-mix(in_srgb,var(--brand-950)_12%,white)] bg-[var(--brand-50)] px-3 py-2.5 text-xs leading-relaxed text-[var(--brand-700)]">
                    <span className="font-medium text-[var(--brand-900)]">Please note:</span> We reply to the email
                    above. Check spam or junk if you don&apos;t hear back within 48 hours.
                  </p>

                  <Button type="submit" className="btn-primary h-12 w-full !rounded-full" disabled={formState === "submitting"}>
                    {formState === "submitting" ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </form>

                <div className="flex gap-2.5 rounded-lg border border-[color-mix(in_srgb,var(--brand-950)_12%,white)] bg-[var(--brand-50)] px-3 py-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-700)]" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs leading-snug text-[var(--brand-700)]">
                      Form not working? Copy our support email:
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyEmail()}
                      className="mt-1 block break-all text-left text-sm font-medium text-[var(--brand-600)] hover:underline"
                    >
                      {copied ? "Copied" : SUPPORT_EMAIL}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
