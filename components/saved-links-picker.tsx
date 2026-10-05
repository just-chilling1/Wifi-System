"use client"

import Link from "next/link"
import { Bookmark, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export type SavedLinkOption = {
  id: string
  offer_name: string
  affiliate_url: string
}

type SavedLinksPickerProps = {
  links: SavedLinkOption[]
  selectedId: string | null
  /** Pass `null` when the current selection is cleared. */
  onSelect: (link: SavedLinkOption | null) => void
}

function shortUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export function SavedLinksPicker({ links, selectedId, onSelect }: SavedLinksPickerProps) {
  if (links.length === 0) return null

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--layer-elevated)] p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-tight text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary">
            <Bookmark className="h-3.5 w-3.5" aria-hidden />
          </span>
          Use a saved link
        </p>
        <Link
          href="/share"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--layer-elevated)] px-3 font-sans text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-light"
        >
          Manage in Link Vault
          <ExternalLink className="h-3 w-3" aria-hidden />
        </Link>
      </div>
      <div className="flex w-full flex-col gap-2" role="listbox" aria-label="Saved links">
        {links.map((link) => {
          const selected = selectedId === link.id
          return (
            <button
              key={link.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(selected ? null : link)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left font-sans transition-colors",
                selected
                  ? "border-[var(--brand-50)] bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                  : "border-[var(--border)] bg-[var(--surface-field)] text-ink hover:border-primary hover:bg-primary-light",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-[var(--border-strong)] bg-transparent text-transparent",
                )}
                aria-hidden
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold">{link.offer_name}</span>
                  {selected ? (
                    <span className="shrink-0 rounded-full bg-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                      Selected
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate text-[12px] font-medium",
                    selected ? "text-primary-foreground/80" : "text-text-secondary",
                  )}
                >
                  {shortUrl(link.affiliate_url)}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 font-sans text-xs font-medium text-text-secondary">
        {selectedId ? "Click the selected link again to clear it, or paste a new link below." : "Or paste a new link below."}
      </p>
    </div>
  )
}
