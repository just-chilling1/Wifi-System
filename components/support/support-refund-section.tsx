import { support } from "@/lib/support"

const cardTones = [
  "border-[color-mix(in_srgb,var(--brand-100)_32%,transparent)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--brand-400)_32%,var(--layer-shell)),var(--layer-elevated))]",
  "border-[var(--ds-line-offer)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--offer-olive-500)_34%,var(--layer-shell)),var(--layer-elevated))]",
  "border-[color-mix(in_srgb,var(--warning)_32%,transparent)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--warning)_20%,var(--layer-shell)),var(--layer-elevated))]",
] as const

const badgeTones = [
  "bg-[var(--brand-400)]",
  "bg-[var(--offer-olive-600)]",
  "bg-[color-mix(in_srgb,var(--warning)_62%,var(--brand-700))]",
] as const

export function SupportRefundSection() {
  const { refundPolicy } = support

  return (
    <section className="rounded-[2.75rem] border border-[var(--border-subtle)] bg-[var(--layer-elevated)] px-5 py-6 shadow-[var(--ds-shadow-card)] md:px-8 md:py-8">
      <h2 className="text-xl font-medium tracking-tight text-ink">{refundPolicy.title}</h2>
      <p className="mt-1 max-w-[65ch] text-sm text-ink-3">{refundPolicy.subtitle}</p>
      <dl className="mt-6 grid gap-4 md:grid-cols-3">
        {refundPolicy.items.map((item, index) => (
          <div
            key={item.title}
            className={`rounded-[2.25rem] border px-5 py-5 shadow-[var(--ds-shadow-card)] ${cardTones[index % cardTones.length]}`}
          >
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-[var(--brand-50)] ${badgeTones[index % badgeTones.length]}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <dt className="mt-4 text-sm font-medium text-ink">{item.title}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-3">{item.body}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 rounded-[2rem] border border-[color-mix(in_srgb,var(--brand-100)_22%,transparent)] bg-[var(--surface-nested)] px-5 py-4 text-sm leading-relaxed text-ink-3">
        We never ask for your password. Share only what we need to resolve the issue, and check spam if a reply has not arrived within 48 hours.
      </p>
    </section>
  )
}
