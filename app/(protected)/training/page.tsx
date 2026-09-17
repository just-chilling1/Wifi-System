import { redirect } from "next/navigation"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, CheckCircle2, Lightbulb, Play, Star } from "lucide-react"

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

function TrainingSectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-200">
        <Icon className="h-5 w-5 text-sapphire-700" />
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-medium text-ink">{title}</h2>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </div>
    </div>
  )
}

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
    <div className="page-container mx-auto w-full max-w-7xl animate-fade-in-up">
      <PageHeader
        eyebrow="Academy"
        title="Training"
        subtitle="Mindset videos first, then click-by-click walkthroughs — watch in order after the Dashboard intro videos."
      />

      <div className="page-stack">
        <section className="flex flex-col gap-6">
          <TrainingSectionHeader
            icon={Play}
            title="Platform Tutorials"
            subtitle="Mindset then how-to for each core tool — watch in order after Dashboard intro videos"
          />
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7">
            {ACADEMY_TRAINING_VIDEOS.map((training) => (
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

        <section className="glass-card p-5 sm:p-6">
          <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-text-muted">Quick reference</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRAINING_WORKFLOW_STEPS.map((step) => (
              <li key={step.step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[13px] font-medium text-sapphire-700">
                  {step.step}
                </span>
                <div className="min-w-0">
                  <Link
                    href={step.page}
                    className="text-sm font-medium text-ink transition-colors hover:text-sapphire-700"
                  >
                    {step.title}
                  </Link>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-6">
          <TrainingSectionHeader
            icon={Star}
            title="Premium Feature Tutorials"
            subtitle="Mindset then how-to per premium feature — scale after your first live pack"
          />
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7 xl:gap-8">
            {PREMIUM_TRAINING_VIDEOS.map((video) => (
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-sapphire-700" />
              <h3 className="text-base font-medium text-ink">Launch checklist</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {TRAINING_QUICK_START_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-sapphire-700" />
              <h3 className="text-base font-medium text-ink">Pro tips</h3>
            </div>
            <ul className="mt-4 space-y-4">
              {TRAINING_PRO_TIPS.map((tip) => (
                <li key={tip.title}>
                  <p className="text-sm font-medium text-ink">{tip.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{tip.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="glass-card overflow-hidden">
          <div className="border-b border-[var(--ds-line-sapphire)] bg-sapphire-200 px-5 py-6 sm:px-8">
            <h2 className="text-lg font-medium text-ink">{TRAINING_CTA.headline}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{TRAINING_CTA.subcopy}</p>
          </div>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:px-8">
            <Link
              href={TRAINING_CTA.href}
              className="btn-primary min-h-[48px] flex-1 whitespace-normal px-4 text-center text-sm leading-snug sm:px-6 sm:text-base"
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
    </div>
  )
}
