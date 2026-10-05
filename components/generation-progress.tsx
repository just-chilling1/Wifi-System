"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { BonusTrainingCard } from "@/components/bonus-training-card"

/**
 * Shown while the app is generating something (videos, comments, posts...).
 * Animated loading bar + the same free-training card used on the dashboard.
 */
export function GenerationProgress({
  label = "AI is working on it...",
}: {
  label?: string
}) {
  const [progress, setProgress] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + Math.max(1, Math.round((95 - prev) / 10))))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="generation-progress-card space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ds-r-md)] border border-[var(--ds-line-sapphire)] bg-sapphire-200">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--link)]" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-ink md:text-lg">{label}</p>
            <p className="mt-1 text-sm text-text-secondary">This usually takes a few seconds.</p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-black tabular-nums text-[var(--link)]">{progress}%</span>
      </div>

      <div className="generation-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="generation-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-3 border-t border-[var(--ds-line)] pt-4">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--link)]">
          While you wait
        </p>
        <BonusTrainingCard />
      </div>
    </div>
  )
}
