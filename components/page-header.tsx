import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  /** Small accent label above the title, e.g. "Home", "Gold Rush" */
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  /** Right-aligned slot (counters, primary action) */
  actions?: ReactNode
  /** Extra classes on the h1 — use to override Playfair on a specific page */
  titleClassName?: string
}

/**
 * Editorial page hero: tracked eyebrow, display headline, restrained support.
 */
export function PageHeader({ eyebrow, title, subtitle, actions, titleClassName }: PageHeaderProps) {
  return (
    <header className="page-hero page-enter flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="type-eyebrow mb-4">{eyebrow}</p>
        <h1 className={cn("type-display-lg break-words", titleClassName)}>{title}</h1>
        {subtitle ? <p className="type-body-lg mt-4 max-w-2xl">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  )
}
