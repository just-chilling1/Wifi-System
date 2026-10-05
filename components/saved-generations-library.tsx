"use client"

import type { ReactNode } from "react"
import { ChevronDown, FolderOpen, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:text-sapphire-700 hover:shadow-hover"

export type SavedGenerationRow = {
  id: string
  name: string
  affiliateUrl: string
  updatedAt: string
}

export function SavedGenerationsLibrary<T extends SavedGenerationRow>({
  title,
  subtitle,
  emptyTitle,
  emptyHint,
  sets,
  libraryOpen,
  onLibraryOpenChange,
  openSetId,
  onOpenSetIdChange,
  deletingId,
  error,
  onDelete,
  metaForSet,
  renderSet,
}: {
  title: string
  subtitle: string
  emptyTitle: string
  emptyHint: string
  sets: T[]
  libraryOpen: boolean
  onLibraryOpenChange: (open: boolean) => void
  openSetId: string | null
  onOpenSetIdChange: (id: string | null) => void
  deletingId: string | null
  error: string
  onDelete: (id: string) => void
  metaForSet: (set: T) => string
  renderSet: (set: T) => ReactNode
}) {
  return (
    <section className="glass-card overflow-hidden p-0">
      <button
        type="button"
        onClick={() => onLibraryOpenChange(!libraryOpen)}
        aria-expanded={libraryOpen}
        className="flex w-full flex-wrap items-center gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 p-5 text-left transition-colors hover:bg-sapphire-100/80 md:p-6"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--layer-elevated)] text-sapphire-700 shadow-sm">
          <FolderOpen size={24} strokeWidth={1.75} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="page-eyebrow mb-1 block">Library</span>
          <span className="block text-xl font-semibold text-ink sm:text-2xl">{title}</span>
          <span className="mt-1 block text-sm text-text-secondary">{subtitle}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-[var(--ds-line)] bg-card px-3 py-1.5 text-sm font-semibold text-ink">
            {sets.length} set{sets.length === 1 ? "" : "s"}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-sapphire-700 transition-transform duration-200",
              libraryOpen && "rotate-180",
            )}
            aria-hidden
          />
        </span>
      </button>

      {libraryOpen ? (
        <div className="space-y-4 p-5 md:p-6">
          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-[#C53030]/30 bg-danger-light px-3.5 py-2.5 text-sm font-medium text-danger"
            >
              {error}
            </p>
          ) : null}

          {sets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--ds-line)] bg-card px-5 py-10 text-center">
              <FolderOpen className="mx-auto h-8 w-8 text-sapphire-700" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-ink">{emptyTitle}</p>
              <p className="mt-1 text-sm text-text-secondary">{emptyHint}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sets.map((set) => {
                const open = openSetId === set.id
                return (
                  <article
                    key={set.id}
                    className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-card shadow-[var(--ds-shadow-card)]"
                  >
                    <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                      <button
                        type="button"
                        onClick={() => onOpenSetIdChange(open ? null : set.id)}
                        aria-expanded={open}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                          <FolderOpen className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink">{set.name}</span>
                          <span className="mt-0.5 block truncate text-xs text-text-secondary">
                            {metaForSet(set)}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-text-secondary transition-transform",
                            open && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={deletingId === set.id}
                        onClick={() => onDelete(set.id)}
                        className={cn("h-9 shrink-0", outlineCtaClass)}
                        aria-label={`Delete ${set.name}`}
                      >
                        {deletingId === set.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {open ? (
                      <div className="space-y-3 border-t border-[var(--ds-line)] bg-surface-nested/40 px-4 py-4 sm:px-5">
                        <p className="truncate text-xs text-text-secondary">{set.affiliateUrl}</p>
                        {renderSet(set)}
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
