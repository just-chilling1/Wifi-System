"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePromoLinks } from "@/context/PromoLinksContext"

export type BannerSize = "compact" | "prominent" | "full"

export function EarningsBanner({ size = "full" }: { size?: BannerSize }) {
  const [dismissed, setDismissed] = useState(false)
  const { settings } = usePromoLinks()
  const ctaUrl = settings.externalTrainingUrl
  const title = settings.externalTrainingTitle
  const ctaLabel = settings.externalTrainingCtaLabel

  if (dismissed || !ctaUrl) return null

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
          Free Training
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
          {title}
        </h2>

        {(prominent || !compact) && (
          <p
            className={cn(
              "mx-auto font-bold leading-snug text-ink-4",
              prominent
                ? "mb-5 max-w-2xl text-sm sm:text-base md:text-lg"
                : "mb-6 max-w-3xl text-base sm:mb-8 sm:text-lg md:text-2xl",
            )}
          >
            Discover how to scale to $1,000&ndash;$5,000 every single day &mdash; without doing any extra work.
          </p>
        )}

        <Link
          href={ctaUrl}
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
          {ctaLabel}
        </Link>

        {(prominent || !compact) && (
          <p
            className={cn(
              "font-black uppercase tracking-wide text-[#C53030]",
              prominent ? "mt-4 text-xs md:text-sm" : "mt-4 text-sm md:text-base",
            )}
          >
            Warning: This will be taken down soon
          </p>
        )}
      </div>
    </div>
  )
}
