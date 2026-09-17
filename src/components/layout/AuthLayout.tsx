"use client"

import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { brand } from "@/config/brand.config"
import { BrandLogo } from "@/components/brand-logo"

interface AuthLayoutProps {
  children: React.ReactNode
  subtitle?: string
}

const cardTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

/** Blackbox-shaped auth frame on Wifi Code sapphire. */
export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden p-4 sm:p-6"
      style={{ backgroundColor: brand.colors.authPage }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute -left-[8%] top-[-12%] h-[22rem] w-[22rem] rounded-full bg-[color-mix(in_srgb,var(--ds-sapphire-500)_22%,transparent)] blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, 28, 0], y: [0, 18, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[10%] bottom-[-16%] h-[26rem] w-[26rem] rounded-full bg-[color-mix(in_srgb,var(--ds-sapphire-300)_35%,transparent)] blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, -22, 0], y: [0, -16, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={cardTransition}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card relative flex flex-col gap-4 border border-[var(--ds-line-sapphire)] p-4 shadow-[var(--ds-shadow-card),0_28px_64px_-28px_rgba(13,148,136,0.38)] sm:gap-6 sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={reduceMotion ? false : { x: "-130%", opacity: 0 }}
              animate={reduceMotion ? undefined : { x: "240%", opacity: [0, 1, 0] }}
              transition={{ duration: 1.15, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <BrandLogo variant="wordmark" width={220} priority className="w-full max-w-[13.75rem] sm:max-w-[17.5rem]" />
            {subtitle ? <p className="text-[15px] font-medium text-ink-3">{subtitle}</p> : null}
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--ds-sapphire-300)] to-transparent" />
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
