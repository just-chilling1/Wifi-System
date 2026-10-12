"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

interface InfoHintProps {
  /** Plain-language explanation shown in the bubble. */
  label: string
  /** Extra classes for the wrapper. */
  className?: string
  /** Accessible label for the button. */
  srLabel?: string
  /** Which side the bubble opens toward. */
  side?: "top" | "bottom"
}

/**
 * A small "?" helper that reveals a short, plain-language explanation.
 * Opens on hover (desktop) and tap/click (mobile); closes on outside-click or Escape.
 */
export function InfoHint({ label, className, srLabel = "What does this mean?", side = "top" }: InfoHintProps) {
  const [pinned, setPinned] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null)
  const wrapperRef = React.useRef<HTMLSpanElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const open = pinned || hovered

  const updateCoords = React.useCallback(() => {
    const el = buttonRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const left = rect.left + rect.width / 2
    const top = side === "top" ? rect.top - 8 : rect.bottom + 8
    setCoords({ top, left })
  }, [side])

  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }
    updateCoords()
    window.addEventListener("scroll", updateCoords, true)
    window.addEventListener("resize", updateCoords)
    return () => {
      window.removeEventListener("scroll", updateCoords, true)
      window.removeEventListener("resize", updateCoords)
    }
  }, [open, updateCoords])

  React.useEffect(() => {
    if (!pinned) return

    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setPinned(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPinned(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [pinned])

  const tooltip =
    open && coords && typeof document !== "undefined"
      ? createPortal(
          <span
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: side === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            }}
            className="pointer-events-none z-[200] w-max max-w-[min(260px,calc(100vw-2rem))] rounded-lg border border-border-strong bg-[var(--layer-elevated)] px-3 py-2 text-left text-xs font-medium leading-relaxed text-foreground shadow-card"
          >
            {label}
          </span>,
          document.body,
        )
      : null

  return (
    <span ref={wrapperRef} className={cn("relative inline-flex align-middle", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={srLabel}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setPinned((value) => !value)
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-nested)] text-[var(--link)] transition-colors hover:bg-[var(--surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {tooltip}
    </span>
  )
}
