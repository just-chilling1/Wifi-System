"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BannerSize } from "@/components/earnings-banner"
import { WELCOME_OFFER_URL } from "@/config/offers.config"

/** Q-LAPS offer — same link as the old WelcomePopup (do not change). */
const CTA_URL = WELCOME_OFFER_URL

/**
 * Same shell as EarningsBanner, but with the former WelcomePopup copy.
 * Used on premium feature generation CTAs (Unlimited, Instant Income, Automated Profits).
 */
export function WelcomeOfferBanner({ size = "full" }: { size?: BannerSize }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const compact = size === "compact"
  const prominent = size === "prominent"

  return (
    <div className={cn("bonus-training-card relative w-full", prominent ? "mb-0" : "mb-4")}>
      <div className="bonus-training-card__glow" aria-hidden />
      <div
        className={cn(
          "bonus-training-card__body",
          compact
            ? "!px-4 !py-3.5 md:!px-5 md:!py-5"
            : prominent
              ? "!px-4 !py-4 !pr-10 md:!px-8 md:!py-6"
              : "!px-4 !py-6 !pr-10 sm:!px-6 sm:!py-8 md:!px-12 md:!py-10",
        )}
      >
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close banner"
          className="absolute right-2 top-2 z-[2] rounded-lg p-1.5 text-ink-4 transition-colors hover:bg-[var(--surface-hover)] hover:text-ink"
        >
          <X className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </button>

        <div className="bonus-training-card__badge-wrap">
          <span
            className={cn(
              "bonus-training-badge",
              compact ? "!px-2.5 !py-0.5 !text-[10px] md:!text-xs" : prominent ? "!text-xs md:!text-sm" : "",
            )}
          >
            You&apos;ve Been Selected
          </span>
        </div>

        <h2
          className={cn(
            "font-heading mx-auto mt-3 font-semibold leading-snug text-text-primary",
            compact
              ? "max-w-2xl text-sm md:text-base"
              : prominent
                ? "max-w-3xl text-lg sm:text-xl md:text-2xl"
                : "max-w-4xl text-xl sm:text-2xl md:text-3xl",
          )}
        >
          Limited Free Training — Learn How To Make{" "}
          <span className="bonus-training-accent">$1,000&ndash;$5,000</span> Per Day
        </h2>

        {(prominent || !compact) && (
          <>
            <p
              className={cn(
                "mx-auto mt-3 max-w-3xl font-medium leading-relaxed text-text-secondary",
                prominent ? "text-sm sm:text-base" : "text-base sm:text-lg",
              )}
            >
              With no extra work. Fully automated commission system revealed — works in just 20 minutes per day.
            </p>

            {!prominent && (
              <ul className="mx-auto mt-5 max-w-xl space-y-2 text-left text-sm text-text-secondary sm:text-base">
                <li className="flex gap-2">
                  <span className="text-[var(--link)]">★</span>
                  Fully automated commission system revealed
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--link)]">★</span>
                  No tech skills or experience needed
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--link)]">★</span>
                  Works in just 20 minutes per day
                </li>
              </ul>
            )}
          </>
        )}

        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "bonus-training-cta",
            compact && "!mt-3 !min-h-[2.75rem] !rounded-[var(--ds-r-md)] !text-xs md:!text-sm",
            prominent && "!mt-5",
            !compact && !prominent && "!mt-6",
          )}
        >
          Claim My Free Spot &gt;&gt;
        </a>

        {(prominent || !compact) && (
          <>
            <p className={cn("bonus-training-urgency", prominent ? "!mt-3" : "!mt-4")}>
              Warning: Only a few free spots remaining
            </p>
            {!prominent && (
              <p className="mt-2 text-xs text-text-secondary">100% Free — No credit card required</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
