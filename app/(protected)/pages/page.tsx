import { redirect } from "next/navigation"
import { Fragment } from "react"
import Link from "next/link"
import { Calendar, Copy, Eye, Flame, FolderOpen, Link2, MessageSquare, Youtube } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { EarningsBanner } from "@/components/earnings-banner"
import { PageHeader } from "@/components/page-header"
import { PageActions } from "@/components/page-actions"

const EMPTY_STEPS = [
  { n: 1, title: "Generate", body: "Open Gold Rush and create your first AI comment pack." },
  { n: 2, title: "Copy", body: "Pick a comment you like. One click and it is on your clipboard." },
  { n: 3, title: "Paste", body: "Drop it on the YouTube Short so your profile sends traffic to your link." },
] as const

const USE_STEPS = [
  { n: 1, icon: MessageSquare, title: "View comments", body: "Open the pack and copy one." },
  { n: 2, icon: Youtube, title: "Open the Short", body: "Jump to the YouTube video." },
  { n: 3, icon: Copy, title: "Paste and post", body: "Your profile drives the affiliate traffic." },
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

function formatCreated(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
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
    <div className="page-container mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="My Vault"
        title="Your Comment Vault"
        subtitle="Every comment pack you generate lives here. Copy one, open the Short, and post."
        actions={
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
            {!isEmpty ? (
              <p className="inline-flex items-baseline justify-center gap-2 self-start rounded-full border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-1.5 sm:self-end">
                <span className="font-heading text-[1.65rem] font-medium leading-none tabular-nums text-ink">
                  {pages.length}
                </span>
                <span className="text-sm text-ink-3">{pages.length === 1 ? "pack saved" : "packs saved"}</span>
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
        <div className="flex flex-col gap-5">
          <GuidanceRow />
          <div className="flex flex-col gap-4">
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
    <section className="page-section-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-[var(--link)]">
        <FolderOpen className="h-6 w-6" aria-hidden />
      </div>
      <div className="max-w-xl">
        <h2 className="ds-h2">Your vault is empty</h2>
        <p className="ds-subtitle mt-2">
          Fire up Gold Rush and create your first AI comment pack in about a minute.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {EMPTY_STEPS.map((step) => (
          <li
            key={step.n}
            className="rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] p-4"
          >
            <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-hover)] text-sm font-semibold tabular-nums text-[var(--link)]">
              {step.n}
            </span>
            <p className="text-sm font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function GuidanceRow() {
  return (
    <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
      <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {USE_STEPS.map((step) => (
          <li key={step.n} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-[var(--link)]">
              <step.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-ink">
                <span className="mr-1.5 tabular-nums text-[var(--link)]">{step.n}.</span>
                {step.title}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-3">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
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
    <article className="page-section-card">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-xl">
          <span aria-hidden>{nicheIcon || "💎"}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="ds-h3 truncate">{offerName}</h2>
          {videoTitle ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-3">
              <Youtube className="h-4 w-4 shrink-0 text-ink-4" aria-hidden />
              <span className="truncate">{videoTitle}</span>
            </p>
          ) : null}
          {affiliateLink ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--link)]">
              <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{affiliateLink.replace(/^https?:\/\//, "")}</span>
            </p>
          ) : null}
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-4">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            <time dateTime={createdAt}>{formatCreated(createdAt)}</time>
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 overflow-hidden rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)]">
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

      <PageActions pageId={pageId} affiliateLink={affiliateLink} videoUrl={videoUrl ?? undefined} comments={comments} />
    </article>
  )
}

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
      <dt className="flex items-center gap-1 text-xs font-medium text-ink-4">
        {label}
        {hint ? <InfoHint label={hint} /> : null}
      </dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  )
}
