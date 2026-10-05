"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import {
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  LayoutTemplate,
  Loader2,
  Lock,
  Mail,
  Palette,
  Scale,
  Send,
} from "lucide-react"
import { PremiumErrorAlert, PremiumPageLayout } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { SUPPORT_EMAIL } from "@/lib/support"
import {
  EDITION_CONTENTS,
  type EditionContent,
  type EditionIconId,
} from "@/lib/license-rights/edition-contents"
import {
  DEFAULT_REQUEST_MESSAGE,
  REQUEST_SUBJECT,
  clearPendingRequest,
  readPendingRequest,
  savePendingRequest,
  submitLicenseRightsRequest,
  type PendingLicenseRightsRequest,
} from "@/lib/license-rights/request"
import { cn } from "@/lib/utils"

const ACTIVATION_STEPS = [
  {
    num: "1",
    title: "Send your request",
    desc: "Tell support you purchased this edition. Your ticket is filed as License Rights.",
  },
  {
    num: "2",
    title: "Team reviews it",
    desc: "We verify the purchase on your account. Typical reply is 2 hours, up to 48.",
  },
  {
    num: "3",
    title: "License unlocks",
    desc: "The reseller edition is activated on your account and the assets below open.",
  },
] as const

type FormState = "idle" | "submitting" | "error"

const panelClass =
  "overflow-hidden rounded-[2.75rem] border border-[var(--border-subtle)] bg-[var(--layer-elevated)] shadow-[var(--ds-shadow-card)]"

const primaryCtaClass =
  "rounded-[1.75rem] bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-sapphire active:translate-y-0 active:scale-[0.98]"

const quietButtonClass =
  "rounded-[1.75rem] border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,transform] duration-200 hover:border-primary hover:bg-primary-light hover:text-sapphire-700 active:scale-[0.98]"

const fieldClassName =
  "w-full min-w-0 rounded-[1.75rem] border-[1.5px] border-[var(--border-strong)] bg-card px-5 py-3 text-sm leading-normal text-foreground placeholder:text-muted-foreground hover:border-[var(--ds-sapphire-300)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:bg-surface-nested disabled:text-[var(--text-disabled)]"

const labelClassName = "mb-2 block text-sm font-medium text-ink"

const EDITION_ICONS: Record<EditionIconId, typeof Scale> = {
  scale: Scale,
  palette: Palette,
  layout: LayoutTemplate,
  book: BookOpen,
}

function EditionContentCard({ item }: { item: EditionContent }) {
  const Icon = EDITION_ICONS[item.icon]

  return (
    <div className="surface-action rounded-[1.75rem] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--layer-elevated)] text-ink-3">
          <Icon size={20} aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-ink">{item.title}</h3>
            <span className="inline-flex items-center gap-1 text-xs text-ink-3">
              <Lock size={12} aria-hidden />
              Locked
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ink-3">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

function PendingActivationPanel({
  email,
  viaMailto,
  onReset,
}: {
  email: string
  viaMailto: boolean
  onReset: () => void
}) {
  return (
    <div className="surface-action space-y-6 rounded-[1.75rem] p-6 sm:p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-[var(--ds-offer-green-100)] p-3">
          <CheckCircle2 className="h-6 w-6 text-sapphire-700" aria-hidden />
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-sm text-ink-3">
            <Clock size={14} aria-hidden />
            Awaiting team activation
          </span>
          <h3 className="text-lg font-medium text-ink">Request received</h3>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          {viaMailto ? (
            <>
              Your email app should open with subject{" "}
              <span className="font-semibold text-ink">{REQUEST_SUBJECT}</span>. Tap{" "}
              <span className="font-semibold text-ink">Send</span> to deliver it, then we&apos;ll
              reply to <span className="break-all font-semibold text-ink">{email}</span>.
            </>
          ) : (
            <>
              We&apos;ll reply to <span className="break-all font-semibold text-ink">{email}</span>{" "}
              when your reseller license is activated.
            </>
          )}{" "}
          We usually respond within about 2 hours. During busy periods, please allow 24-48 hours.
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">
          This edition stays locked until the team activates it. Our reply will go to{" "}
          <span className="break-all font-semibold text-ink">{email}</span> only. Check that
          inbox&apos;s spam or junk folder if you don&apos;t see it within 48 hours.
        </p>
      </div>

      <Button type="button" variant="outline" onClick={onReset} className={cn("h-12 w-full", quietButtonClass)}>
        Send another request
      </Button>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-12 animate-pulse rounded-[1.75rem] bg-surface-nested" />
      <div className="h-36 animate-pulse rounded-[1.75rem] bg-surface-nested" />
      <div className="h-12 animate-pulse rounded-[1.75rem] bg-surface-nested" />
    </div>
  )
}

export function LicenseRightsContent() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(DEFAULT_REQUEST_MESSAGE)
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [pending, setPending] = useState<PendingLicenseRightsRequest | null>(null)
  const [viaMailto, setViaMailto] = useState(false)
  const [ready, setReady] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
      const id = user?.id ?? "anonymous"
      setUserId(id)
      setPending(readPendingRequest(id))
      setReady(true)
    })
  }, [])

  const handleReset = () => {
    if (userId) clearPendingRequest(userId)
    setPending(null)
    setViaMailto(false)
    setFormState("idle")
    setErrorMessage("")
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL)
      setCopiedEmail(true)
      window.setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

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

      const result = await submitLicenseRightsRequest({
        email: trimmedEmail,
        message: trimmedMessage,
      })

      if (!result.ok) {
        setErrorMessage(result.error)
        setFormState("error")
        return
      }

      if (userId) savePendingRequest(userId, trimmedEmail)
      setPending({ email: trimmedEmail, submittedAt: new Date().toISOString() })
      setViaMailto(result.viaMailto)
      setFormState("idle")
    },
    [email, message, userId],
  )

  const statusBadge = pending ? (
    <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning-light px-4 py-2.5">
      <Clock size={15} className="text-warning" aria-hidden />
      <span className="text-xs font-bold uppercase tracking-wider text-warning">
        Pending review
      </span>
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--layer-elevated)] px-4 py-2.5 text-ink">
      <Lock size={15} aria-hidden />
      <span className="text-sm font-medium">Activation required</span>
    </div>
  )

  const overviewStats = [
    {
      label: "Edition status",
      value: pending ? "Pending review" : "Not activated",
    },
    {
      label: "Ticket subject",
      value: REQUEST_SUBJECT,
    },
    {
      label: "Typical reply",
      value: "2-48 hours",
    },
  ]

  const licenseVideoId = getPremiumTrainingVimeoId("licenseRights")

  return (
    <PremiumPageLayout
      title={PREMIUM_FEATURE_LABELS.licenseRights}
      subtitle={`Request activation from our support desk. Your ticket is filed as "${REQUEST_SUBJECT}" and the team unlocks this edition on your account.`}
      actions={ready ? statusBadge : undefined}
    >
      <PremiumVideoTutorial
        premiumKey="licenseRights"
        vimeoId={licenseVideoId}
        title={`${PREMIUM_FEATURE_LABELS.licenseRights} training`}
        description={`How the reseller edition works, and how to request activation for your ${PRODUCT_NAME} account.`}
        iframeTitle={`${PREMIUM_FEATURE_LABELS.licenseRights} training video`}
      />

      <section className={cn(panelClass, "px-5 py-6 md:px-8 md:py-8")}>
        <h2 className="text-xl font-medium tracking-tight text-ink">How it works</h2>
        <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-ink-3">
          Sell {PRODUCT_NAME} under your own brand. Submit one request and the team activates it on your account.
        </p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {ACTIVATION_STEPS.map((step) => (
            <li key={step.num} className="surface-action flex h-full flex-col rounded-[1.75rem] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-grad-sapphire text-sm font-medium text-white">
                {step.num}
              </span>
              <h3 className="mt-4 text-base font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">{step.desc}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {overviewStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--layer-shell)] px-5 py-4"
            >
              <dt className="text-sm text-ink-3">{stat.label}</dt>
              <dd className="mt-1 text-lg font-medium text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="scroll-mt-8 xl:col-span-7" id="license-request">
          <section className={cn(panelClass, "h-full px-5 py-6 md:px-8 md:py-8")}>
            <h2 className="text-xl font-medium tracking-tight text-ink">Request activation</h2>
            <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-ink-3">
              We send your message to support with the title &quot;{REQUEST_SUBJECT}&quot;.
            </p>
            <div className="mt-6">
            {!ready ? (
              <FormSkeleton />
            ) : pending ? (
              <PendingActivationPanel
                email={pending.email}
                viaMailto={viaMailto}
                onReset={handleReset}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="min-w-0">
                  <label htmlFor="license-rights-email" className={labelClassName}>
                    Your email
                  </label>
                  <input
                    id="license-rights-email"
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
                  <label htmlFor="license-rights-message" className={labelClassName}>
                    Your message
                  </label>
                  <textarea
                    id="license-rights-message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={formState === "submitting"}
                    rows={6}
                    className={`${fieldClassName} min-h-[148px] resize-y`}
                  />
                </div>

                {formState === "error" && errorMessage ? (
                  <PremiumErrorAlert message={errorMessage} />
                ) : null}

                <p className="text-sm leading-relaxed text-ink-3">
                  Support receives your ticket, verifies your purchase, and replies when the reseller
                  license is ready. Check spam if you don&apos;t hear back within 48 hours.
                </p>

                <Button
                  type="submit"
                  disabled={formState === "submitting"}
                  className={cn("h-12 w-full text-base", primaryCtaClass)}
                >
                  {formState === "submitting" ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send License Rights request
                    </span>
                  )}
                </Button>

                <div className="surface-action flex flex-col gap-4 rounded-[1.75rem] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-ink">
                      <Mail className="h-4 w-4 text-ink-3" aria-hidden />
                      Form not working?
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-3">
                      Copy the support address and send the request yourself.
                    </p>
                    <p className="mt-3 break-all text-sm font-medium text-ink">{SUPPORT_EMAIL}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCopyEmail()}
                    className={cn("inline-flex h-11 shrink-0 items-center justify-center gap-2 px-5", quietButtonClass)}
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden />
                        Copy email
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
            </div>
          </section>
        </div>

        <div className="xl:col-span-5">
          <section className={cn(panelClass, "h-full px-5 py-6 md:px-8 md:py-8")}>
            <h2 className="text-xl font-medium tracking-tight text-ink">What you unlock</h2>
            <p className="mt-1 text-sm text-ink-3">
              {EDITION_CONTENTS.length} deliverables included after activation
            </p>
            <div className="mt-5 space-y-3">
              {EDITION_CONTENTS.map((item) => (
                <EditionContentCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </PremiumPageLayout>
  )
}
