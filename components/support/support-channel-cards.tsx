"use client"

import { useState, type MouseEvent } from "react"
import { Check, Copy, ExternalLink, Mail } from "lucide-react"
import { support } from "@/lib/support"

const cardClass =
  "rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--layer-elevated)] shadow-[var(--ds-shadow-card)]"

export function SupportChannelCards() {
  const [copied, setCopied] = useState(false)

  const copyEmail = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    void navigator.clipboard.writeText(support.email).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <section aria-label="Contact options" className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <a
          href={`mailto:${support.email}`}
          className="flex items-center gap-4 rounded-[1.75rem] border border-[color-mix(in_srgb,var(--brand-100)_28%,transparent)] bg-[linear-gradient(155deg,var(--brand-400),var(--brand-600))] px-5 py-5 text-[var(--brand-50)] shadow-[var(--shadow-brand)] transition-[filter,box-shadow] duration-150 hover:brightness-110"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-[var(--brand-50)]">
            <Mail className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Email</p>
            <p className="truncate text-sm text-[color-mix(in_srgb,var(--brand-50)_78%,transparent)]">
              {support.email}
            </p>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-[var(--brand-50)] transition-colors hover:bg-white/25"
            aria-label={copied ? "Email copied" : "Copy support email"}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </a>

        <a
          href={support.helpCenterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-[1.75rem] border border-[var(--ds-line-offer)] bg-[linear-gradient(155deg,var(--offer-olive-500),var(--offer-olive-800))] px-5 py-5 text-[var(--brand-50)] shadow-[var(--ds-shadow-offer)] transition-[filter,box-shadow] duration-150 hover:brightness-110"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-[var(--brand-50)]">
            <ExternalLink className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Help portal</p>
            <p className="truncate text-sm text-[color-mix(in_srgb,var(--brand-50)_78%,transparent)]">
              Articles and ticket status
            </p>
          </div>
        </a>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {support.stats.map((stat) => (
          <li key={stat.label} className={`${cardClass} px-5 py-4`}>
            <p className="text-sm text-ink-3">{stat.label}</p>
            <p className="mt-1 text-lg font-medium text-ink">{stat.highlight}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
