"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Headset, Loader2, Phone, X } from "lucide-react"
import { completeOnboarding } from "@/app/actions/onboarding"
import { BrandLogo } from "@/components/brand-logo"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { onboardingConfig } from "@/lib/onboarding/config"
import { specialist } from "@/config/specialist.config"
import { suppressSpecialistPopup } from "@/lib/specialist-popup-session"

const COUNTDOWN_MS = 10 * 60 * 1000

type CompleteResult = { success: true } | { success: false; error: string }

function trackCallClick() {
  try {
    const payload = JSON.stringify({ event: "cta_call_click" })
    const sent = navigator.sendBeacon?.(
      "/api/track/specialist-popup",
      new Blob([payload], { type: "text/plain" }),
    )
    if (!sent) {
      fetch("/api/track/specialist-popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // ignore
  }
}

function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
  const ss = String(totalSeconds % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

function CheckBullet({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <Check size={16} strokeWidth={3} aria-hidden />
      </span>
      <span className="text-[16px] font-medium leading-snug text-ink">{children}</span>
    </li>
  )
}

function SpecialistAvatar({ size = "lg" }: { size?: "lg" | "sm" }) {
  const box = size === "lg" ? "h-16 w-16" : "h-12 w-12"
  const icon = size === "lg" ? 30 : 22
  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sapphire ring-4 ring-sapphire-200`}
    >
      <Headset size={icon} strokeWidth={1.8} aria-hidden />
    </span>
  )
}

function CallButton({ label, onCall }: { label: string; onCall: () => void }) {
  return (
    <a
      href={specialist.phoneTel}
      onClick={onCall}
      className="relative flex min-h-[64px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-grad-sapphire px-5 py-3 text-white shadow-sapphire transition-all hover:bg-grad-sapphire-hover active:scale-[0.985] touch-manipulation select-none motion-safe:animate-[cta-pulse-green_2.2s_ease-in-out_infinite]"
    >
      <Phone size={22} strokeWidth={2.4} className="shrink-0" aria-hidden />
      <span className="flex flex-col items-start text-left leading-tight">
        <span className="text-[17px] font-extrabold tracking-tight sm:text-[18px]">{label}</span>
        <span className="mt-0.5 text-[15px] font-semibold tabular-nums text-white/95">
          Tap to call {specialist.phoneDisplay}
        </span>
      </span>
    </a>
  )
}

function Countdown({ remainingMs }: { remainingMs: number }) {
  const cfg = onboardingConfig.consultation
  const expired = remainingMs <= 0
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <p className="text-[15px] font-semibold text-ink-2">
        {expired ? cfg.timerExpiredLabel : cfg.timerLabel}
      </p>
      <span
        className="inline-flex min-w-[5.25rem] items-center justify-center rounded-xl bg-ink px-3 py-1.5 text-[1.35rem] font-black tabular-nums tracking-tight text-white"
        aria-live="polite"
      >
        {formatCountdown(remainingMs)}
      </span>
    </div>
  )
}

function SpecialistCard({ firstName, compact = false }: { firstName: string; compact?: boolean }) {
  const cfg = onboardingConfig.consultation
  return (
    <div className={`rounded-2xl border border-[var(--ds-line-sapphire)] bg-card ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <div className="flex items-center gap-3">
        <SpecialistAvatar size={compact ? "sm" : "lg"} />
        <div className="min-w-0">
          <p className={`brand-font font-black leading-tight text-ink ${compact ? "text-[1.35rem]" : "text-[1.75rem]"}`}>
            {cfg.specialistTitle}
          </p>
          <p className="mt-0.5 text-[15px] font-medium text-ink-3">{cfg.specialistSubtitle}</p>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-primary-light px-4 py-3 text-[16px] font-medium leading-snug text-ink">
        {cfg.quote(firstName)}
      </p>
      <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-ink-2">
        <Phone size={16} className="shrink-0 text-primary" aria-hidden />
        {cfg.callType}
      </p>
    </div>
  )
}

export function OnboardingFlow({ firstName }: { firstName: string }) {
  const router = useRouter()
  const cfg = onboardingConfig
  const [phase, setPhase] = useState<"initiating" | "consultation">("initiating")
  const [step, setStep] = useState(0)
  const [exitOpen, setExitOpen] = useState(false)
  const [called, setCalled] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [leaveError, setLeaveError] = useState<string | null>(null)
  const [remainingMs, setRemainingMs] = useState(COUNTDOWN_MS)
  const completing = useRef<Promise<CompleteResult> | null>(null)

  useEffect(() => {
    suppressSpecialistPopup()
  }, [])

  useEffect(() => {
    if (phase !== "initiating") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const stepMs = reduce ? 300 : 700
    const timers = cfg.initiating.rows.map((_, i) =>
      window.setTimeout(() => setStep(i + 1), stepMs * (i + 1)),
    )
    const advance = window.setTimeout(
      () => setPhase("consultation"),
      stepMs * (cfg.initiating.rows.length + 1),
    )
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(advance)
    }
  }, [cfg.initiating.rows, phase])

  useEffect(() => {
    if (phase !== "consultation") return
    const startedAt = Date.now()
    const tick = () => setRemainingMs(Math.max(0, COUNTDOWN_MS - (Date.now() - startedAt)))
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [phase])

  const ensureCompleted = useCallback(() => {
    if (!completing.current) {
      completing.current = completeOnboarding().then((result) => {
        if (!result.success) completing.current = null
        return result
      })
    }
    return completing.current
  }, [])

  const handleCall = useCallback(() => {
    trackCallClick()
    suppressSpecialistPopup()
    void ensureCompleted()
    setCalled(true)
  }, [ensureCompleted])

  const finishAndLeave = useCallback(async () => {
    if (leaving) return
    setLeaving(true)
    setLeaveError(null)
    suppressSpecialistPopup()
    const result = await ensureCompleted()
    if (!result.success) {
      setLeaving(false)
      setLeaveError(result.error || "Could not open your account. Please try again.")
      return
    }
    router.push(cfg.dashboardRoute)
    router.refresh()
  }, [cfg.dashboardRoute, ensureCompleted, leaving, router])

  const continueButton = called ? (
    <button
      type="button"
      onClick={finishAndLeave}
      disabled={leaving}
      className="flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-ink bg-card text-[16px] font-bold text-ink transition-colors hover:bg-surface-hover disabled:opacity-60 touch-manipulation"
    >
      {leaving ? "Opening your account…" : cfg.afterCall}
    </button>
  ) : null

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-[8%] top-[-12%] h-[22rem] w-[22rem] rounded-full bg-[color-mix(in_srgb,var(--ds-sapphire-500)_22%,transparent)] blur-3xl" />
        <div className="absolute -right-[10%] bottom-[-16%] h-[26rem] w-[26rem] rounded-full bg-[color-mix(in_srgb,var(--ds-sapphire-300)_35%,transparent)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[var(--ds-line-sapphire)] bg-card shadow-[var(--ds-shadow-card)]">
          {phase === "initiating" ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <BrandLogo variant="wordmark" width={200} priority className="w-full max-w-[12.5rem]" />
              <h1 className="brand-font mt-8 text-[2rem] font-black leading-tight text-ink sm:text-[2.4rem]">
                {cfg.initiating.title}
              </h1>
              <ul className="mt-8 w-full max-w-md space-y-3 text-left">
                {cfg.initiating.rows.map((row, i) => {
                  const done = step > i
                  return (
                    <li
                      key={row}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-background px-4 py-3.5"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          done ? "bg-primary text-white" : "bg-primary-light text-primary"
                        }`}
                      >
                        {done ? (
                          <Check size={16} strokeWidth={3} aria-hidden />
                        ) : (
                          <Loader2 size={16} className="animate-spin" aria-hidden />
                        )}
                      </span>
                      <span className={`text-[16px] font-semibold leading-snug ${done ? "text-ink" : "text-ink-3"}`}>
                        {row}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <>
              <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-primary sm:text-[13px]">
                  <Check size={14} strokeWidth={3} aria-hidden />
                  {cfg.consultation.createdLabel}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setExitOpen(true)}
                    className="rounded-lg px-2 py-2 text-[15px] font-semibold text-ink-2 underline-offset-2 hover:underline touch-manipulation"
                  >
                    {cfg.consultation.skipLink}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExitOpen(true)}
                    aria-label="Close"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-primary-light touch-manipulation"
                  >
                    <X size={20} />
                  </button>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
                <div className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-start lg:gap-8">
                  <div>
                    <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
                      {cfg.consultation.eyebrow}
                    </p>
                    <h1 className="brand-font mt-2 text-[1.85rem] font-black leading-[1.15] text-ink sm:text-[2.45rem]">
                      {cfg.consultation.headline(firstName)}
                    </h1>
                    <p className="mt-3 text-[17px] font-bold leading-snug text-ink sm:text-[18px]">
                      {cfg.consultation.subhead}
                    </p>

                    <div className="mt-4 lg:hidden">
                      <SpecialistCard firstName={firstName} compact />
                    </div>

                    <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{cfg.consultation.body}</p>
                    <p className="mb-3 mt-5 text-[16px] font-bold text-ink">{cfg.consultation.learnTitle}</p>
                    <ul className="space-y-3">
                      {cfg.consultation.bullets.map((item) => (
                        <CheckBullet key={item}>{item}</CheckBullet>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 hidden lg:mt-1 lg:block">
                    <SpecialistCard firstName={firstName} />
                  </div>
                </div>
              </div>

              <footer className="shrink-0 border-t border-[var(--ds-line-sapphire)] bg-card px-5 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-5">
                <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
                  <Countdown remainingMs={remainingMs} />
                  <CallButton label={cfg.consultation.cta} onCall={handleCall} />
                  {continueButton}
                  {leaveError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[15px] font-medium text-red-700">
                      {leaveError}
                    </p>
                  ) : null}
                  <p className="text-center text-[15px] leading-snug text-ink-3">{cfg.consultation.footnote}</p>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="flex max-h-[min(92dvh,42rem)] w-full flex-col gap-0 overflow-hidden rounded-3xl border-[var(--ds-line-sapphire)] p-0 sm:max-w-md max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:max-h-[92dvh] max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
            <div className="flex items-center gap-3 pr-8">
              <SpecialistAvatar size="sm" />
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-primary">{cfg.exit.eyebrow}</p>
            </div>
            <DialogTitle className="brand-font mt-4 text-center text-[1.65rem] font-black leading-[1.2] text-ink sm:text-[1.85rem]">
              {cfg.exit.title(firstName)}
            </DialogTitle>
            <DialogDescription className="mt-3 text-center text-[16px] leading-relaxed text-ink-2">
              {cfg.exit.body}
            </DialogDescription>
            <div className="mt-4 rounded-2xl bg-primary-light px-4 py-4">
              <p className="mb-3 text-[16px] font-bold text-ink">{cfg.exit.listTitle}</p>
              <ul className="space-y-3">
                {cfg.exit.bullets.map((item) => (
                  <CheckBullet key={item}>{item}</CheckBullet>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-center text-[15px] leading-snug text-ink-3">{cfg.exit.note}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 border-t border-[var(--ds-line-sapphire)] bg-card px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7 sm:pb-5">
            <CallButton label={cfg.exit.cta} onCall={handleCall} />
            <Countdown remainingMs={remainingMs} />
            {continueButton}
            {leaveError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-[15px] font-medium text-red-700">
                {leaveError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={finishAndLeave}
              disabled={leaving}
              className="py-1 text-center text-[15px] font-semibold text-ink-2 underline underline-offset-2 disabled:opacity-60 touch-manipulation"
            >
              {leaving ? "Opening your account…" : cfg.exit.skipLink}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
