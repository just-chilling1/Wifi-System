"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { clsx } from "clsx"
import {
  Globe,
  Linkedin,
  BookOpen,
  HelpCircle,
  Rss,
  MousePointerClick,
} from "lucide-react"

const PLATFORMS = [
  {
    icon: Rss,
    name: "Your blog / site",
    steps: [
      "Copy the HTML version and paste into WordPress, Ghost, or your site editor.",
      "Set the meta description from the article excerpt for SEO.",
      "Add internal links to your sales page where relevant.",
      "Publish on a schedule. One article per week builds long-term traffic.",
    ],
  },
  {
    icon: BookOpen,
    name: "Medium",
    steps: [
      "Copy the plain-text version and paste into a new Medium story.",
      "Add 3-5 relevant tags for your niche at the bottom.",
      "Keep your affiliate link in the closing CTA. Medium allows external links in articles.",
      "Submit to a niche publication for extra reach, or publish on your profile.",
    ],
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    steps: [
      "Use plain text for a LinkedIn article, or paste HTML into your blog CMS and link from a short LinkedIn post.",
      "Lead with a personal hook in the first two lines. They show before “see more.”",
      "End with a clear CTA and your affiliate link.",
      "Post a shorter teaser on your feed linking to the full article.",
    ],
  },
  {
    icon: HelpCircle,
    name: "Quora",
    steps: [
      "Search for questions in your niche with lots of followers but thin answers.",
      "Adapt a section of the article into a direct answer. Lead with the takeaway, not a link.",
      "Add your article or offer link at the end as “further reading.” Quora allows relevant links, but link-only answers get collapsed.",
      "Answer 2-3 related questions using different sections of the same article.",
    ],
  },
  {
    icon: Globe,
    name: "Cross-posting workflow",
    steps: [
      "Publish the full article on one platform first (your blog or Medium).",
      "Adapt the intro for LinkedIn and Quora. Do not paste identical copy everywhere.",
      "Track which platform drives clicks and double down on what works.",
      "Keep your offer links organized in Link Vault so you can reuse the same CTA across platforms.",
    ],
  },
] as const

type PlatformName = (typeof PLATFORMS)[number]["name"]

export function CrossPlatformGuide() {
  const [selected, setSelected] = useState<PlatformName | null>(null)

  const platform = PLATFORMS.find((p) => p.name === selected)

  return (
    <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-5 sm:px-5 sm:py-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-[var(--link)]">
          <Globe size={20} strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="ds-h3">Publishing guide</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-3">
            These long-form articles work best on platforms that reward depth. Choose a destination to see the posting steps. Your offer link is already woven in.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist">
        {PLATFORMS.map((p) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={selected === p.name}
            onClick={() => setSelected((prev) => (prev === p.name ? null : p.name))}
            className={clsx(
              "inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-[background-color,border-color,color] duration-150",
              selected === p.name
                ? "bg-primary text-[var(--brand-50)]"
                : "border border-[var(--ds-line)] bg-[var(--surface-nested)] text-ink hover:border-[var(--border-brand)] hover:text-[var(--link)]",
            )}
          >
            <p.icon size={15} strokeWidth={1.75} aria-hidden />
            {p.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {platform ? (
          <motion.ol
            key={platform.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mt-5 space-y-2"
          >
            {platform.steps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] px-3.5 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-xs font-semibold tabular-nums text-[var(--link)]">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-ink">{step}</p>
              </li>
            ))}
          </motion.ol>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-5 flex items-center gap-2 text-sm text-ink-3"
          >
            <MousePointerClick size={15} className="shrink-0 text-[var(--link)]" aria-hidden />
            Select a platform to see how to post there.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
