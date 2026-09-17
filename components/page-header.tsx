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
 * Standard page header: eyebrow + h1 + subtitle, consistent spacing.
 * Every dashboard page starts with this so hierarchy and rhythm match.
 */
export function PageHeader({ eyebrow, title, subtitle, actions, titleClassName }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-2 page-enter sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="page-eyebrow mb-2">{eyebrow}</p>
        <h1 className={cn("ds-h1 break-words", titleClassName)}>{title}</h1>
        {subtitle ? <p className="ds-subtitle mt-2 max-w-2xl">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
