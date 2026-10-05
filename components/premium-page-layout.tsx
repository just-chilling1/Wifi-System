"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { clsx } from "clsx"
import { PageHeader } from "@/components/page-header"
import { brand } from "@/config/brand.config"

interface PremiumPageLayoutProps {
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  actions?: ReactNode
  className?: string
  animate?: boolean
}

/** Blackbox premium page shell — page-container + Premium eyebrow + stacked sections. */
export function PremiumPageLayout({
  title,
  subtitle,
  children,
  footer,
  actions,
  className,
  animate = true,
}: PremiumPageLayoutProps) {
  const content = (
    <div className={clsx("page-container mx-auto w-full max-w-7xl", className)}>
      <section className="surface-premium px-6 py-8 sm:px-10 sm:py-12">
        <PageHeader eyebrow="Premium" title={title} subtitle={subtitle} actions={actions} />
      </section>
      {children}
      {footer ?? <PremiumFooter />}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      className="min-w-0 w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {content}
    </motion.div>
  )
}

export function PremiumFooter({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-1 text-xs text-ink-4">{children ?? `Powered by ${brand.productName}.`}</p>
  )
}

export function PremiumErrorAlert({ message, className }: { message: string; className?: string }) {
  return (
    <p
      role="alert"
      className={clsx(
        "flex items-start gap-2 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-3 py-2.5 text-sm font-medium text-[var(--danger)]",
        className,
      )}
    >
      {message}
    </p>
  )
}
