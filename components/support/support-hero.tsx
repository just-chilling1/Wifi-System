"use client"

import { Headphones } from "lucide-react"

export function SupportHero() {
  return (
    <section aria-label="Priority support" className="dashboard-support-banner">
      <div className="flex min-w-0 items-start gap-3.5 sm:items-center sm:gap-4">
        <div className="dashboard-support-banner__icon" aria-hidden>
          <Headphones className="size-6 text-white sm:size-7" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className="dashboard-support-banner__badge">24/7 Priority Support</p>
          <h2 className="dashboard-support-banner__title">We&apos;re here to help</h2>
          <p className="mt-1 text-sm font-medium leading-snug text-ink-3 sm:text-[15px]">
            Search the FAQ below, email us, or send a message — most replies arrive within a few hours.
          </p>
        </div>
      </div>
    </section>
  )
}
