"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { CheckCircle2, Clock, Inbox, Loader2, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { APP_SUPPORT_NAME, SUPPORT_EMAIL } from "@/lib/support"
import { usePromoLinks } from "@/context/PromoLinksContext"

type FormState = "idle" | "submitting" | "success" | "error"

const fieldClassName =
  "w-full min-w-0 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--layer-shell)] px-4 py-3 text-sm leading-normal text-ink placeholder:text-ink-3 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border-subtle)] transition-colors disabled:bg-surface-nested disabled:text-[var(--text-disabled)]"

const labelClassName = "mb-1.5 block text-sm text-ink-3"

function openSupportMailto(email: string, message: string) {
  const subject = `${APP_SUPPORT_NAME} — Support Request`
  const body = `Please reply to: ${email}\n\n${message}`
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function finishWithMailto(
  email: string,
  message: string,
  setSubmittedEmail: (value: string) => void,
  setSentViaMailto: (value: boolean) => void,
  setFormState: (value: FormState) => void,
) {
  openSupportMailto(email, message)
  setSubmittedEmail(email)
  setSentViaMailto(true)
  setFormState("success")
}

async function parseJsonResponse(res: Response): Promise<{
  error?: string
  useMailto?: boolean
  success?: boolean
} | null> {
  const text = await res.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text) as { error?: string; useMailto?: boolean; success?: boolean }
  } catch {
    return null
  }
}

const prominentShell =
  "card-base min-w-0 overflow-hidden !rounded-[2.75rem] !border-[color-mix(in_srgb,var(--brand-100)_42%,transparent)] !bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-400)_34%,var(--layer-elevated)),var(--layer-elevated)_52%)] !shadow-[0_18px_44px_-16px_rgba(140,38,55,0.72)]"

export function ContactSupportWidget({ prominent = false }: { prominent?: boolean }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [sentViaMailto, setSentViaMailto] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { settings } = usePromoLinks()
  const trainingUrl = settings.externalTrainingUrl
  const trainingCta = settings.externalTrainingCtaLabel

  const supabase = createClient()

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setEmail(user.email)
      }
    })()
  }, [supabase])

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
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

        const data = await parseJsonResponse(res)

        if (data === null) {
          finishWithMailto(trimmedEmail, trimmedMessage, setSubmittedEmail, setSentViaMailto, setFormState)
          return
        }

        if (res.status === 401) {
          throw new Error("Your session expired. Please refresh the page and try again.")
        }

        if (res.ok && data.success) {
          setSubmittedEmail(trimmedEmail)
          setSentViaMailto(false)
          setFormState("success")
          return
        }

        if (data.useMailto) {
          finishWithMailto(trimmedEmail, trimmedMessage, setSubmittedEmail, setSentViaMailto, setFormState)
          return
        }

        throw new Error(data.error || "Something went wrong. Please try again.")
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.")
        setFormState("error")
      }
    },
    [email, message],
  )

  const resetForm = () => {
    setFormState("idle")
    setMessage("")
    setSentViaMailto(false)
    setErrorMessage("")
  }

  if (formState === "success") {
    return (
      <div className={prominent ? `${prominentShell} w-full max-w-full` : "card-base w-full min-w-0 max-w-full overflow-hidden !rounded-[2.75rem]"}>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light text-success shadow-[0_0_0_8px_color-mix(in_srgb,var(--success)_12%,transparent)]">
            <CheckCircle2 className="h-7 w-7" aria-hidden />
          </div>
          <h3 className="ds-h3 mt-4">
            {sentViaMailto ? "Finish sending in your email app" : "Message sent"}
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
            {sentViaMailto ? (
              <>
                Your email app should open with the message ready. Tap{" "}
                <span className="font-semibold text-text-heading">Send</span>, then we&apos;ll reply
                to the inbox below.
              </>
            ) : (
              <>Our team has your request. We&apos;ll reply to this inbox only:</>
            )}
          </p>
          <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-100 px-3.5 py-2">
            <Inbox className="h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
            <span className="break-all text-left text-sm font-semibold text-ink">{submittedEmail}</span>
          </p>
        </div>

        <ul className="mt-5 space-y-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-nested)] p-4 text-left">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--layer-elevated)] text-ink-3">
              <Clock className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-sm leading-snug text-text-secondary">
              <span className="font-semibold text-ink">Typical reply: under 2 hours.</span> Allow
              24–48 hours if we&apos;re in a busy period.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--layer-elevated)] text-ink-3">
              <ShieldCheck className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-sm leading-snug text-text-secondary">
              Watch that inbox only — not a different Gmail or work account. Check spam or junk if
              nothing arrives within 48 hours.
            </p>
          </li>
        </ul>

        <div className="bonus-training-card bonus-training-card--compact mt-5 w-full min-w-0 max-w-full">
          <div className="bonus-training-card__glow" aria-hidden />
          <div className="bonus-training-card__body">
            <span className="bonus-training-badge inline-flex max-w-full items-center rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase">
              While you wait
            </span>
            <p className="mt-2.5 w-full min-w-0 break-words text-wrap text-[15px] font-bold leading-snug text-text-primary">
              Free training: wake up to an extra{" "}
              <span className="bonus-training-accent">$1,000–$5,000</span>
            </p>
            <p className="mt-1.5 w-full min-w-0 break-words text-wrap text-sm leading-relaxed text-text-secondary">
              A simple system that can scale to $1k–$5k per day — no extra grind, no credit card.
            </p>
            <p className="bonus-training-urgency !mt-3 w-full min-w-0 !max-w-none break-words text-left normal-case">
              Warning: this may be taken down soon
            </p>
            <a
              href={trainingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bonus-training-cta block w-full min-w-0 max-w-full whitespace-normal text-center"
            >
              {trainingCta}
            </a>
          </div>
        </div>

        <button type="button" onClick={resetForm} className="btn-secondary mt-4 w-full !rounded-full">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className={prominent ? prominentShell : "card-base min-w-0 overflow-hidden !rounded-[2.75rem]"}>
      <div className={prominent ? "border-b border-[color-mix(in_srgb,var(--brand-100)_28%,transparent)] pb-4" : "border-b border-[var(--border-subtle)] pb-4"}>
        {prominent ? (
          <p className="mb-3 inline-flex rounded-full bg-[var(--brand-400)] px-3 py-1 text-xs font-medium text-[var(--brand-50)]">
            Fastest way to reach us
          </p>
        ) : null}
        <h3 className="text-xl font-medium tracking-tight text-ink">Send a message</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-3">
          Typical reply is under two hours. During busy periods, allow 24–48 hours.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="min-w-0">
            <label htmlFor="support-email" className={labelClassName}>
              Your email
            </label>
            <input
              id="support-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={formState === "submitting"}
              className={fieldClassName}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="support-message" className={labelClassName}>
              Your message
            </label>
            <textarea
              id="support-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need help with..."
              required
              disabled={formState === "submitting"}
              rows={3}
              className={`${fieldClassName} min-h-[96px] resize-y`}
            />
          </div>

          {formState === "error" && errorMessage ? (
            <p className="text-sm font-medium text-danger" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <p className="text-sm leading-relaxed text-ink-3">
            Replies go to the email above. Check spam if nothing arrives within 48 hours.
          </p>

          <button type="submit" disabled={formState === "submitting"} className="btn-primary w-full min-h-[48px] !rounded-full">
            {formState === "submitting" ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send message"
            )}
          </button>
        </form>

        <p className="text-sm text-ink-3">
          Or copy{" "}
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(SUPPORT_EMAIL)}
            className="break-all text-left font-medium text-ink underline-offset-2 hover:underline"
            aria-label="Copy support email"
          >
            {SUPPORT_EMAIL}
          </button>
        </p>
      </div>
    </div>
  )
}
