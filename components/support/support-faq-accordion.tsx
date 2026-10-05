"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Search, X } from "lucide-react"
import { clsx } from "clsx"
import type { FaqSection } from "@/lib/faq"

interface SupportFaqAccordionProps {
  sections: FaqSection[]
}

export function SupportFaqAccordion({ sections }: SupportFaqAccordionProps) {
  const [query, setQuery] = useState("")
  const [activeSection, setActiveSection] = useState("all")
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const isSearching = query.trim().length > 0
  const isActive = isFocused || isSearching

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return sections
      .filter((section) => activeSection === "all" || section.title === activeSection)
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!q) return true
          return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [sections, query, activeSection])

  const matchCount = filtered.reduce((total, section) => total + section.items.length, 0)

  return (
    <div>
      <div className="space-y-3 border-b border-border-dim/80 px-4 py-3 sm:px-5">
        <label
          className={clsx(
            "flex items-center gap-2.5 rounded-full border px-4 py-3 transition-colors",
            isActive
              ? "border-[var(--border)] bg-[var(--layer-elevated)]"
              : "border-[var(--border)] bg-[var(--surface-nested)]",
          )}
        >
          <Search
            className={clsx("h-4 w-4 shrink-0", isActive ? "text-ink" : "text-ink-3")}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search questions..."
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-text-primary placeholder:text-text-muted outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          />
          {isSearching ? (
            <>
              <span className="hidden shrink-0 text-[12px] text-ink-3 sm:inline">
                {matchCount} {matchCount === 1 ? "match" : "matches"}
              </span>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setQuery("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:text-ink"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : null}
        </label>

        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={activeSection === "all"} onClick={() => setActiveSection("all")} />
          {sections.map((section) => (
            <FilterChip
              key={section.title}
              label={section.title}
              active={activeSection === section.title}
              onClick={() => setActiveSection(section.title)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-text-muted">
          No matching questions. Try another search or send us a message.
        </p>
      ) : (
        filtered.map((section) => (
          <div key={section.title} className="px-4 pb-4 last:pb-5 sm:px-5">
            <p className="px-1 pb-2 pt-4 text-sm text-ink-3">{section.title}</p>
            <div className="space-y-2">
              {section.items.map((faq) => {
                const key = `${section.title}:${faq.q}`
                const isOpen = expandedKey === key

                return (
                  <div
                    key={key}
                    className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-nested)]"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-[var(--layer-elevated)]"
                      onClick={() => setExpandedKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4 text-sm font-medium text-text-primary">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-ink-3 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">{faq.a}</div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
        active
          ? "border-[var(--border)] bg-[var(--surface-nested)] font-medium text-ink"
          : "border-transparent text-ink-3 hover:text-ink"
      }`}
    >
      {label}
    </button>
  )
}

export function SupportFaqCardHeader() {
  return (
    <div className="border-b border-[var(--border-subtle)] px-5 py-5 md:px-6">
      <h2 className="text-xl font-medium tracking-tight text-ink">Questions</h2>
      <p className="mt-1 text-sm text-ink-3">Search by topic, or send a message if you still need help.</p>
    </div>
  )
}
