"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePromoLinks } from "@/context/PromoLinksContext"

/** Free-training promo between dashboard videos — centered offer layout. */
export function BonusTrainingCard({ className }: { className?: string }) {
  const { settings } = usePromoLinks()
  const ctaUrl = settings.externalTrainingUrl
  const ctaLabel = settings.externalTrainingCtaLabel

  if (!ctaUrl) return null

  return (
    <div className={cn("bonus-training-card", className)}>
      <div className="bonus-training-card__glow" aria-hidden />
      <div className="bonus-training-card__body">
        <div className="bonus-training-card__badge-wrap">
          <span className="bonus-training-badge inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 shrink-0" aria-hidden />
            Free member training
          </span>
        </div>

        <div className="bonus-training-copy">
          <p>
            Imagine opening your banking app tomorrow morning and seeing an extra{" "}
            <span className="bonus-training-accent">$1,000</span>,{" "}
            <span className="bonus-training-accent">$3,000</span>, or even{" "}
            <span className="bonus-training-accent">$5,000</span> deposited into your account
            &mdash; without a 9-to-5, overtime, or side hustles.
          </p>
          <p>
            A proven system that helps everyday people generate consistent income on autopilot
            &mdash; no experience or tech skills required.
          </p>
        </div>

        <p className="bonus-training-hook">
          <span className="bonus-training-hook__flame" aria-hidden>
            🔥
          </span>
          <span>
            Ready to break free from financial stress and start living life on your terms?
          </span>
          <span className="bonus-training-hook__flame" aria-hidden>
            🔥
          </span>
        </p>

        <Link
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bonus-training-cta group"
        >
          <span className="text-balance">{ctaLabel}</span>
          <ArrowRight
            className="size-5 shrink-0 transition-transform duration-[160ms] group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>

        <p className="bonus-training-urgency">
          Limited access &mdash; register while it&apos;s still available
        </p>
      </div>
    </div>
  )
}
