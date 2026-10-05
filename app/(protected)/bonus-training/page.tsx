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
          className="btn-premium block w-full px-8 py-8 text-center text-2xl md:text-3xl"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}
