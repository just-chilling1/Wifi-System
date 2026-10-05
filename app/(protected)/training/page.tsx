import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Lightbulb } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { PageHeader } from "@/components/page-header"
import { TrainingVideoCard } from "@/components/training-video-card"
import { ACADEMY_TRAINING_VIDEOS } from "@/lib/academy-training-videos"
import { PREMIUM_TRAINING_VIDEOS } from "@/lib/premium-training-videos"
import {
  TRAINING_CTA,
  TRAINING_PRO_TIPS,
  TRAINING_QUICK_START_CHECKLIST,
  TRAINING_WORKFLOW_STEPS,
} from "@/lib/training-page-content"

export default async function TrainingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  const CtaIcon = TRAINING_CTA.icon

  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Academy"
        title="Training"
        subtitle="Mindset videos first, then click-by-click walkthroughs. Watch in order after the Dashboard intro videos."
      />

      <section className="flex flex-col gap-5">
        <div className="max-w-2xl">
          <h2 className="ds-h2">Platform tutorials</h2>
          <p className="ds-subtitle mt-2">Mindset, then how-to, for each core tool.</p>
        </div>
        {ACADEMY_TRAINING_VIDEOS[0] ? (
          <TrainingVideoCard
            featured
            video={{
              id: ACADEMY_TRAINING_VIDEOS[0].vimeoId,
              title: ACADEMY_TRAINING_VIDEOS[0].title,
              description: ACADEMY_TRAINING_VIDEOS[0].description,
              duration: ACADEMY_TRAINING_VIDEOS[0].duration,
              step: ACADEMY_TRAINING_VIDEOS[0].step,
              badge: ACADEMY_TRAINING_VIDEOS[0].badge,
              thumbnailSlug: ACADEMY_TRAINING_VIDEOS[0].thumbnailSlug,
            }}
          />
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACADEMY_TRAINING_VIDEOS.slice(1).map((training) => (
            <TrainingVideoCard
              key={training.slug}
              video={{
                id: training.vimeoId,
                title: training.title,
                description: training.description,
                duration: training.duration,
                step: training.step,
                badge: training.badge,
                thumbnailSlug: training.thumbnailSlug,
              }}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
        <h2 className="ds-h3">Quick reference</h2>
        <ol className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {TRAINING_WORKFLOW_STEPS.map((step) => (
            <li key={step.step} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-sm font-semibold tabular-nums text-[var(--link)]">
                {step.step}
              </span>
              <div className="min-w-0 pt-0.5">
                <Link
                  href={step.page}
                  className="text-sm font-semibold text-ink transition-colors hover:text-[var(--link)]"
                >
                  {step.title}
                </Link>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-3">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-5">
        <div className="max-w-2xl">
          <h2 className="ds-h2">Premium feature tutorials</h2>
          <p className="ds-subtitle mt-2">Scale these after your first live pack.</p>
        </div>
        {PREMIUM_TRAINING_VIDEOS[0] ? (
          <TrainingVideoCard
            featured
            video={{
              id: PREMIUM_TRAINING_VIDEOS[0].vimeoId,
              title: PREMIUM_TRAINING_VIDEOS[0].title,
              description: PREMIUM_TRAINING_VIDEOS[0].description,
              duration: PREMIUM_TRAINING_VIDEOS[0].duration,
              badge: PREMIUM_TRAINING_VIDEOS[0].badge ?? PREMIUM_TRAINING_VIDEOS[0].feature,
              thumbnailSlug: PREMIUM_TRAINING_VIDEOS[0].thumbnailSlug,
            }}
          />
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PREMIUM_TRAINING_VIDEOS.slice(1).map((video) => (
            <TrainingVideoCard
              key={video.slug}
              video={{
                id: video.vimeoId,
                title: video.title,
                description: video.description,
                duration: video.duration,
                badge: video.badge ?? video.feature,
                thumbnailSlug: video.thumbnailSlug,
              }}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[var(--link)]" strokeWidth={1.75} />
            <h2 className="ds-h3">Launch checklist</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {TRAINING_QUICK_START_CHECKLIST.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--link)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[var(--link)]" strokeWidth={1.75} />
            <h2 className="ds-h3">Pro tips</h2>
          </div>
          <ul className="mt-4 space-y-4">
            {TRAINING_PRO_TIPS.map((tip) => (
              <li key={tip.title}>
                <p className="text-sm font-semibold text-ink">{tip.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-3">{tip.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-5 py-6 sm:px-6">
        <h2 className="ds-h3">{TRAINING_CTA.headline}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-3">{TRAINING_CTA.subcopy}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href={TRAINING_CTA.href}
            className="btn-primary min-h-[48px] flex-1 px-4 text-center text-sm leading-snug sm:px-6 sm:text-base"
          >
            <CtaIcon className="h-5 w-5 shrink-0" />
            {TRAINING_CTA.buttonLabel}
          </Link>
          <Link href="/support" className="btn-secondary min-h-[48px] shrink-0 px-6 text-sm">
            Get help
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
