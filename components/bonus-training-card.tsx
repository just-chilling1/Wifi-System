"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePromoLinks } from "@/context/PromoLinksContext"

const BENEFITS = ["No experience needed", "Step-by-step", "24/7 automation"] as const

/** Compact free-training ad between dashboard videos. */
export function BonusTrainingCard() {
  const { settings } = usePromoLinks()
  const ctaUrl = settings.externalTrainingUrl
  const ctaLabel = settings.externalTrainingCtaLabel

  return (
    <div className="bonus-training-card">
      <div className="bonus-training-card__body">
        <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:justify-between md:gap-8 lg:gap-10">
          <div className="min-w-0 flex-1">
            <span className="bonus-training-badge inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase">
              Free Training
            </span>

            <h3 className="mt-2.5 text-balance text-xl font-black leading-[1.12] tracking-tight text-foreground md:text-[1.625rem]">
              Wake up to an extra{" "}
              <span className="bonus-training-accent">$1,000&ndash;$5,000</span>
            </h3>

            <p className="mt-2 max-w-xl text-sm font-semibold leading-snug text-foreground/85 md:text-[15px]">
              Deposited into your account&mdash;without a 9-to-5, overtime, or side hustles.
            </p>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary md:text-[15px]">
              A proven system that helps everyday people generate consistent income on autopilot&mdash;no
              experience or tech skills required.
            </p>

            <p
              className="bonus-training-benefits"
              aria-label="Benefits: No experience needed, Step-by-step, 24/7 automation"
            >
              <span aria-hidden className="bonus-training-accent">
                ✦
              </span>
              {BENEFITS.map((label, index) => (
                <span key={label} className="inline-flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden className="text-[var(--gold-500)]">
                      •
                    </span>
                  )}
                  {label}
                </span>
              ))}
            </p>
          </div>

          <div
            className={cn(
              "bonus-training-cta-zone flex w-full shrink-0 flex-col justify-center rounded-xl px-4 py-4",
              "md:w-[min(100%,18rem)] md:px-5 md:py-5 lg:w-[min(100%,19.5rem)]",
            )}
          >
            <p className="text-center text-sm font-bold text-foreground md:text-[15px]">
              Ready to see how it works?
            </p>

            <Link
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bonus-training-cta mt-3 inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl px-5 py-3.5 text-center text-[13px] font-black leading-snug whitespace-normal sm:text-sm"
            >
              {ctaLabel}
            </Link>

            <p className="mt-2.5 text-center text-[11px] font-semibold tracking-wide text-text-secondary md:text-xs">
              100% Free &mdash; No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
