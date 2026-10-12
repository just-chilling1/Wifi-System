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
        "bonus-training-card relative w-full",
        prominent ? "mb-0" : "mb-4",
      )}
    >
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
            Free Training
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
          {title}
        </h2>

        {(prominent || !compact) && (
          <p
            className={cn(
              "mx-auto mt-3 max-w-3xl font-medium leading-relaxed text-text-secondary",
              prominent ? "text-sm sm:text-base" : "text-base sm:text-lg",
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
            "bonus-training-cta",
            compact && "!mt-3 !min-h-[2.75rem] !rounded-[var(--ds-r-md)] !text-xs md:!text-sm",
            prominent && "!mt-5",
            !compact && !prominent && "!mt-6",
          )}
        >
          {ctaLabel}
        </Link>

        {(prominent || !compact) && (
          <p className={cn("bonus-training-urgency", prominent ? "!mt-3" : "!mt-4")}>
            Warning: This will be taken down soon
          </p>
        )}
      </div>
    </div>
  )
}
