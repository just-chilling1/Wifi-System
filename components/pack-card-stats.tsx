"use client"

import { InfoHint } from "@/components/ui/info-hint"

function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="border-l border-[var(--ds-line)] px-3 py-3 first:border-l-0 sm:px-4">
      <dt className="flex items-center justify-center gap-1 text-xs font-medium text-ink-4 sm:justify-start">
        {label}
        {hint ? <InfoHint label={hint} side="bottom" /> : null}
      </dt>
      <dd className="mt-1 text-center text-lg font-semibold tabular-nums text-ink sm:text-left">{value}</dd>
    </div>
  )
}

export function PackCardStats({
  commentCount,
  views,
  clicks,
}: {
  commentCount: number
  views: number
  clicks: number
}) {
  return (
    <dl className="grid grid-cols-3 rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)]">
      <Stat label="Comments" value={commentCount} />
      <Stat
        label="Opens"
        value={views}
        hint="How many times people have opened this comment pack."
      />
      <Stat
        label="Copies"
        value={clicks}
        hint="How many times a comment from this pack has been copied."
      />
    </dl>
  )
}
