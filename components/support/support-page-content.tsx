"use client"

import { PageHeader } from "@/components/page-header"
import { ContactSupportWidget } from "@/components/contact-support-widget"
import { faqSections } from "@/lib/faq"
import { support } from "@/lib/support"
import { SupportChannelCards } from "./support-channel-cards"
import { SupportFaqAccordion, SupportFaqCardHeader } from "./support-faq-accordion"
import { SupportRefundSection } from "./support-refund-section"

export function SupportPageContent() {
  return (
    <div className="page-container support-page mx-auto w-full max-w-7xl">
      <PageHeader eyebrow="Help" title={support.pageTitle} subtitle={support.pageSubtitle} />

      <div className="flex flex-col gap-8">
        <SupportChannelCards />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <section
            id="faq"
            className="overflow-hidden rounded-[2.75rem] border border-[var(--border-subtle)] bg-[var(--layer-elevated)] shadow-[var(--ds-shadow-card)] lg:col-span-3"
          >
            <SupportFaqCardHeader />
            <SupportFaqAccordion sections={faqSections} />
          </section>

          <div id="contact" className="lg:sticky lg:top-6 lg:col-span-2">
            <ContactSupportWidget prominent />
          </div>
        </div>

        <SupportRefundSection />
      </div>
    </div>
  )
}
