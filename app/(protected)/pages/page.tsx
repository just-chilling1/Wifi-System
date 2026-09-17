import { redirect } from "next/navigation"
import { Fragment } from "react"
import Link from "next/link"
import {
  Calendar,
  Copy,
  Eye,
  Flame,
  Link2,
  MessageCircle,
  MessageSquare,
  Rocket,
  Youtube,
  Zap,
} from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { EarningsBanner } from "@/components/earnings-banner"
import { PageHeader } from "@/components/page-header"
import { PageActions } from "@/components/page-actions"

const EMPTY_STEPS = [
  { n: 1, title: "Generate", body: "Open Gold Rush and create your first AI comment pack." },
  { n: 2, title: "Copy", body: "Pick a comment you like — one click and it’s on your clipboard." },
  { n: 3, title: "Paste", body: "Drop it on the YouTube Short so your profile sends traffic to your link." },
] as const

const USE_STEPS = [
  { n: 1, icon: MessageSquare, title: "View comments", body: "Open the pack and copy one." },
  { n: 2, icon: Youtube, title: "Open the Short", body: "Jump to the YouTube video." },
  { n: 3, icon: Copy, title: "Paste & post", body: "Your profile drives the affiliate traffic." },
] as const

const OUTCOMES = [
  "Videos already getting traffic in your niche",
  "Comments written to sound like a real viewer",
  "Your affiliate link baked in — copy and post",
] as const

function parseComments(content: string | null | undefined): string[] {
  try {
    const pack = JSON.parse(content || '{"comments":[]}')
    if (Array.isArray(pack.comments)) return pack.comments
    if (Array.isArray(pack)) return pack
    return []
  } catch {
    return []
  }
}

export default async function MyVaultPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  const { data: pages } = user
    ? await supabase
        .from("pages")
        .select(
          `
      *,
      niches (name, icon)
    `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null }

  const isEmpty = !pages || pages.length === 0

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="My Vault"
        title="Your Comment Vault"
        subtitle="Every comment pack you generate lives here — copy one, open the Short, and post."
        actions={
          <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
            {!isEmpty ? (
              <p className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-100 px-4 text-sm font-semibold text-sapphire-700">
                {pages.length} pack{pages.length === 1 ? "" : "s"} saved
              </p>
            ) : null}
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/create">
                <Flame className="h-5 w-5" />
                Generate New Pack
              </Link>
            </Button>
          </div>
        }
      />

      {isEmpty ? (
        <EmptyVault />
      ) : (
        <div className="space-y-6">
          <GuidanceRow />
          <div className="grid grid-cols-1 gap-5">
            {pages.map((page, index) => {
              const comments = parseComments(page.content)
              const niche = Array.isArray(page.niches) ? page.niches[0] : page.niches
              return (
                <Fragment key={page.id}>
                  <PackCard
                    offerName={page.offer_name || "Comment Pack"}
                    videoTitle={page.video_title || page.title}
                    nicheIcon={niche?.icon}
                    commentCount={comments.length}
                    views={page.views || 0}
                    clicks={page.clicks || 0}
                    createdAt={page.created_at}
                    pageId={page.id}
                    affiliateLink={page.affiliate_link || ""}
                    videoUrl={page.video_url}
                    comments={comments}
                  />
                  {(index + 1) % 2 === 0 ? <EarningsBanner size="compact" /> : null}
                </Fragment>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyVault() {
  return (
    <div className="space-y-6">
      <GuidanceRow />
      <section className="page-section-card px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-100">
          <Zap className="h-8 w-8 text-sapphire-700" />
        </div>
        <h2 className="ds-h2">Your Vault is Empty</h2>
        <p className="ds-subtitle mx-auto mt-2">
          Fire up Gold Rush and create your first AI comment pack in about a minute.
        </p>

        <ol className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {EMPTY_STEPS.map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] p-4"
            >
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-100 text-sm font-semibold text-sapphire-700">
                {step.n}
              </span>
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-3">{step.body}</p>
            </li>
          ))}
        </ol>

        <Button asChild size="lg" className="mt-8">
          <Link href="/create">
            <Flame className="h-5 w-5" />
            Start Making Packs Now
          </Link>
        </Button>
      </section>
    </div>
  )
}

function GuidanceRow() {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface)] p-5 shadow-card sm:p-6">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-4">How to use a pack</p>
        <ol className="space-y-3">
          {USE_STEPS.map((step) => (
            <li key={step.n} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-sapphire-100 text-sapphire-700">
                <step.icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  <span className="mr-1.5 tabular-nums text-sapphire-700">{step.n}.</span>
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-ink-3">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-[var(--ds-line-sapphire)] bg-gradient-to-br from-[var(--ds-sapphire-100)] to-white p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-sapphire-700" aria-hidden />
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-sapphire-700">
            What you walk away with
          </p>
        </div>
        <ul className="space-y-2 text-sm font-medium leading-relaxed text-ink-3">
          {OUTCOMES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function PackCard({
  offerName,
  videoTitle,
  nicheIcon,
  commentCount,
  views,
  clicks,
  createdAt,
  pageId,
  affiliateLink,
  videoUrl,
  comments,
}: {
  offerName: string
  videoTitle: string | null
  nicheIcon?: string | null
  commentCount: number
  views: number
  clicks: number
  createdAt: string
  pageId: string
  affiliateLink: string
  videoUrl?: string | null
  comments: string[]
}) {
  return (
    <article className="page-section-card transition-shadow hover:shadow-hover">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-sapphire-100 text-2xl">
          {nicheIcon || "💎"}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="ds-h3 truncate">{offerName}</h2>
          {videoTitle ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-3">
              <Youtube className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{videoTitle}</span>
            </p>
          ) : null}
          {affiliateLink ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-sapphire-700">
              <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{affiliateLink.replace(/^https?:\/\//, "")}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatChip icon={MessageCircle} label="Comments" value={commentCount} />
        <StatChip
          icon={Eye}
          label="Opens"
          value={views}
          hint="How many times people have opened this comment pack."
        />
        <StatChip
          icon={Copy}
          label="Copies"
          value={clicks}
          hint="How many times a comment from this pack has been copied."
        />
        <StatChip
          icon={Calendar}
          label="Created"
          value={new Date(createdAt).toLocaleDateString()}
        />
      </div>

      <PageActions pageId={pageId} affiliateLink={affiliateLink} videoUrl={videoUrl ?? undefined} comments={comments} />
    </article>
  )
}

function StatChip({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Eye
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] px-3 py-1.5">
      <Icon className="h-3.5 w-3.5 text-sapphire-700" />
      <span className="text-sm font-semibold tabular-nums text-ink">{value}</span>
      <span className="text-xs font-semibold text-ink-4">{label}</span>
      {hint ? <InfoHint label={hint} /> : null}
    </div>
  )
}
