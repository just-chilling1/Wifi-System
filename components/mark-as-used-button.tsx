"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:text-sapphire-700 hover:shadow-hover"

export function MarkAsUsedButton({
  used,
  marking,
  onClick,
  disabled,
  className,
}: {
  used: boolean
  marking?: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={used || marking || disabled}
      onClick={onClick}
      className={cn(
        "h-10 flex-1 text-sm",
        used
          ? "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] font-medium text-[var(--ds-offer-green-800)]"
          : outlineCtaClass,
        className,
      )}
    >
      {marking ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving…
        </>
      ) : used ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Marked as used
        </>
      ) : (
        "Mark as used"
      )}
    </Button>
  )
}

export function UsedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ds-offer-green-800)]">
      <CheckCircle2 className="h-3 w-3" aria-hidden />
      Used
    </span>
  )
}
