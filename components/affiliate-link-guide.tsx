"use client"

import { useState } from "react"
import {
  Bookmark,
  ChevronDown,
  Copy,
  ExternalLink,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

const DIGISTORE_URL = "http://digistore24.com"

const STEPS = [
  {
    icon: UserPlus,
    title: "Go to Digistore24.com and create a free account",
    href: DIGISTORE_URL,
    linkLabel: "Open Digistore24",
  },
  {
    icon: Search,
    title: "Navigate to the Marketplace and find your product",
  },
  {
    icon: Sparkles,
    title: 'Click "Promote Now" to get your unique affiliate link',
  },
  {
    icon: Copy,
    title: "Copy your affiliate link",
  },
  {
    icon: Bookmark,
    title: 'Paste it below and click "Save to Your Links"',
  },
] as const

export function AffiliateLinkGuide({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface-sub)]",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left font-sans transition-colors hover:bg-primary-light"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--layer-elevated)] text-primary">
          <Bookmark className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink">
          How to get your affiliate link
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-[160ms]",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ol className="space-y-2 px-3 pb-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-3 py-2.5"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light font-sans text-[11px] font-semibold text-primary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-start gap-2 font-sans text-sm font-medium leading-snug text-ink">
                  <step.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <span>{step.title}</span>
                </p>
                {"href" in step && step.href ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 pl-[22px] font-sans text-sm font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {step.linkLabel}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
