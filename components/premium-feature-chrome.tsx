import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"
import { clsx } from "clsx"

/**
 * Blackbox PremiumControlCard-shaped intro / feature banner.
 * Keeps export name PremiumFeatureBanner for existing call sites.
 */
export function PremiumFeatureBanner({
  icon: Icon,
  kicker,
  title,
  description,
  chip,
  className,
}: {
  icon: LucideIcon
  kicker: string
  title: string
  description: ReactNode
  chip?: string
  className?: string
}) {
  return (
    <section className={clsx("glass-card overflow-hidden p-0", className)}>
      <div className="border-b border-[var(--ds-line)] bg-sapphire-100 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sapphire-100 text-sapphire-700">
              <Icon size={24} strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-sapphire-700">{kicker}</p>
              <p className="font-medium text-ink">{title}</p>
              <div className="mt-1 text-sm text-ink-3">{description}</div>
            </div>
          </div>
          {chip ? (
            <span className="inline-flex items-center self-start rounded-full border border-[var(--ds-line-sapphire)] bg-[var(--layer-elevated)] px-3 py-1.5 text-xs font-medium text-sapphire-700 md:self-center">
              {chip}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * Blackbox PremiumControlCard — form / tool panel with brass header strip.
 */
export function PremiumControlCard({
  icon: Icon,
  title,
  description,
  badge,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  description: string
  badge?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={clsx("glass-card overflow-hidden p-0", className)}>
      <div className="border-b border-[var(--ds-line)] bg-sapphire-100 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sapphire-100 text-sapphire-700">
              <Icon size={24} strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="font-medium text-ink">{title}</p>
              <p className="text-sm text-ink-3">{description}</p>
            </div>
          </div>
          {badge}
        </div>
      </div>
      <div className="space-y-3 p-5 md:p-6">{children}</div>
    </section>
  )
}

/**
 * Blackbox PremiumStepsSection — 3-step how-to grid.
 * Keeps export name PremiumSteps for existing call sites.
 */
export function PremiumSteps({
  eyebrow: _eyebrow,
  title = "How to Use This (3 Simple Steps)",
  steps,
}: {
  eyebrow?: string
  title?: string
  steps: readonly { num: string; title: string; desc: string }[]
}) {
  return (
    <section className="glass-card p-8">
      <div className="mb-8 flex items-center gap-3">
        <CheckCircle2 size={22} className="text-sapphire-700" strokeWidth={1.75} aria-hidden />
        <h2 className="text-xl font-medium text-ink">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col gap-4 rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-100 p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grad-sapphire text-sm font-medium text-white">
              {step.num}
            </div>
            <h3 className="text-lg font-medium text-ink">{step.title}</h3>
            <p className="text-sm leading-relaxed text-ink-3">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
