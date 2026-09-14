"use client"

import { ExternalLink, Gift, Play } from "lucide-react"
import { clsx } from "clsx"
import { motion } from "framer-motion"
import type { ExclusiveOffer } from "@/config/offers.config"

interface ExclusiveOffersNavSectionProps {
  offers: ExclusiveOffer[]
  collapsed?: boolean
  mobile?: boolean
  className?: string
}

/** Blackbox exclusive-offers block (Gift header + play chips). */
export function ExclusiveOffersNavSection({
  offers,
  collapsed = false,
  mobile = false,
  className,
}: ExclusiveOffersNavSectionProps) {
  if (offers.length === 0 || collapsed) return null

  return (
    <div
      className={clsx(
        "exclusive-offers-nav-section w-full min-w-0 shrink-0",
        mobile ? "p-2.5" : "p-3",
        className,
      )}
    >
      <div className="exclusive-offers-nav-section-shimmer" aria-hidden />
      <p className="exclusive-offers-nav-section-label">
        <Gift className="exclusive-offers-nav-section-icon h-4 w-4" strokeWidth={1.75} aria-hidden />
        Exclusive Offers
      </p>
      <div className={clsx("exclusive-offers-nav-list", mobile ? "space-y-2" : "space-y-1.5")}>
        {offers.map((offer, index) => (
          <motion.a
            key={offer.href + offer.title}
            href={offer.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.14 + index * 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className={clsx(
              "exclusive-offers-nav-item group min-w-0",
              mobile ? "min-h-[52px] px-3 py-3 text-[15px]" : "px-2.5 py-2.5 text-[13px]",
            )}
          >
            <span className="exclusive-offers-nav-play" aria-hidden>
              <Play className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
            </span>
            <span className="exclusive-offers-nav-copy min-w-0 flex-1">
              <span className="exclusive-offers-nav-title">{offer.title}</span>
              {offer.cta?.trim() ? (
                <span className="exclusive-offers-nav-subtitle">{offer.cta.trim()}</span>
              ) : null}
            </span>
            <ExternalLink
              className="exclusive-offers-nav-external h-3.5 w-3.5 shrink-0 text-ink-4"
              strokeWidth={1.75}
            />
          </motion.a>
        ))}
      </div>
    </div>
  )
}
