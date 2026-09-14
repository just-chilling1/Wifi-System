"use client"

import { PageHeader } from "@/components/page-header"
import { usePromoLinks } from "@/context/PromoLinksContext"

export default function BonusTrainingPage() {
  const { settings } = usePromoLinks()
  const title = settings.scaleTrainingTitle
  const ctaUrl = settings.scaleTrainingUrl
  const ctaLabel = settings.scaleTrainingCtaLabel

  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Bonus"
        title={title}
        subtitle="Watch this exclusive session to get more from the platform"
      />

      <div className="w-full">
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-2xl bg-gradient-to-r from-primary to-primary px-8 py-8 text-center text-2xl font-black text-white shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:from-primary-hover hover:to-primary-hover hover:shadow-[var(--ds-sapphire-500)]/50 md:text-3xl"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}
