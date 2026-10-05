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
    <div
      className={cn(
        "earnings-banner-card relative w-full overflow-hidden before:hidden",
        prominent ? "mb-0" : "mb-4",
        compact ? "rounded-xl" : "rounded-2xl",
      )}
    >
      <div
        className={cn(
          "earnings-banner-card__body relative z-[1] flex flex-col items-center text-center",
          compact
            ? "px-3 py-3.5 md:px-5 md:py-5"
            : prominent
              ? "px-4 py-4 pr-10 md:px-8 md:py-6"
              : "px-4 py-6 pr-10 sm:px-6 sm:py-8 md:px-12 md:py-10",
        )}
      >
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close banner"
          className="absolute right-2 top-2 z-[2] rounded-lg p-1.5 text-ink-4 transition-colors hover:bg-white/10 hover:text-ink"
        >
          <X className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </button>

        <span
          className={cn(
            "earnings-banner-badge inline-flex items-center rounded-md bg-gold-grad font-black uppercase tracking-[0.16em] text-white",
            compact
              ? "mb-2 px-2.5 py-0.5 text-[10px] md:text-xs"
              : prominent
                ? "mb-3 px-3.5 py-1 text-xs md:text-sm"
                : "mb-4 px-4 py-1.5 text-sm md:text-base",
          )}
        >
          You&apos;ve Been Selected
        </span>

        <h2
          className={cn(
            "font-heading mx-auto font-black uppercase leading-tight text-ink",
            compact
              ? "mb-2 max-w-2xl text-sm md:text-base"
              : prominent
                ? "mb-3 max-w-3xl text-lg sm:text-xl md:text-2xl lg:text-[1.85rem]"
                : "mb-3 max-w-4xl text-2xl leading-tight sm:mb-4 sm:text-3xl md:text-5xl",
          )}
        >
          Limited Free Training — Learn How To Make{" "}
          <span className="earnings-banner-accent">$1,000&ndash;$5,000</span> Per Day
        </h2>

        {(prominent || !compact) && (
          <>
            <p
              className={cn(
                "mx-auto font-bold leading-snug text-ink-4",
                prominent
                  ? "mb-4 max-w-2xl text-sm sm:text-base md:text-lg"
                  : "mb-5 max-w-3xl text-base sm:mb-6 sm:text-lg md:text-2xl",
              )}
            >
              With no extra work. Fully automated commission system revealed — works in just 20 minutes per day.
            </p>

            {!prominent && (
              <ul className="mx-auto mb-6 max-w-xl space-y-2 text-left text-sm font-semibold text-ink-4 sm:mb-8 sm:text-base md:text-lg">
                <li className="flex gap-2">
                  <span className="text-[var(--gold-700)]">★</span>
                  Fully automated commission system revealed
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--gold-700)]">★</span>
                  No tech skills or experience needed
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--gold-700)]">★</span>
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
            "earnings-banner-cta inline-flex max-w-full items-center justify-center rounded-xl bg-gold-grad font-black uppercase text-white no-underline shadow-[0_12px_36px_-12px_rgba(183,121,31,0.58)] transition-[background,transform,box-shadow] hover:bg-gold-grad-hover hover:-translate-y-px",
            compact
              ? "px-4 py-2 text-xs whitespace-normal text-center md:text-sm"
              : prominent
                ? "min-h-[3.25rem] w-full px-6 py-3.5 text-sm whitespace-normal text-center sm:w-auto sm:whitespace-nowrap md:min-h-[3.5rem] md:px-8 md:text-base"
                : "min-h-12 w-full px-6 py-3.5 text-base whitespace-normal text-center sm:w-auto sm:whitespace-nowrap sm:px-10 sm:py-5 sm:text-xl md:text-2xl",
          )}
        >
          Claim My Free Spot &gt;&gt;
        </a>

        {(prominent || !compact) && (
          <>
            <p
              className={cn(
                "font-black uppercase tracking-wide text-[#C53030]",
                prominent ? "mt-4 text-xs md:text-sm" : "mt-4 text-sm md:text-base",
              )}
            >
              Warning: Only a few free spots remaining
            </p>
            {!prominent && (
              <p className="mt-2 text-xs text-ink-4">100% Free — No credit card required</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
