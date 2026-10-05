"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  FolderOpen,
  Loader2,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GenerationProgress } from "@/components/generation-progress"
import { BonusTrainingCard } from "@/components/bonus-training-card"
import { PremiumPageLayout, PremiumErrorAlert } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { defaultLabelFromUrl } from "@/lib/generation-set-name"
import { INSTANT_INCOME_NICHES, INSTANT_INCOME_POST_COUNT } from "@/lib/instant-income/niches"
import {
  deleteInstantIncomePostSet,
  markInstantIncomePostUsed,
  upsertInstantIncomePostSet,
  type InstantIncomePostSet,
  type InstantIncomeSavedPost,
} from "@/app/actions/instant-income-post-sets"

const STEPS = [
  { num: "1", title: "Pick a niche", desc: "Match it to the offer you are promoting." },
  { num: "2", title: "Add your link", desc: "Paste the URL and name the set." },
  { num: "3", title: "Copy and post", desc: "Edit the opening line, then share it where the rules allow." },
] as const

const GUIDE = [
  {
    title: "Find groups",
    items: [
      "Search keywords like “weight loss support”, “make money online”, or “fitness motivation”, then filter to Groups.",
      "Join 10-15 groups with 5,000+ members.",
      "Wait for admin approval, usually 1-24 hours. Post only after you are in.",
    ],
  },
  {
    title: "Read the rules",
    items: [
      "Open About and check whether personal stories are allowed. Most groups ban hard selling, not honest updates.",
      "These drafts are written as personal stories. Still read the rules first.",
      "If a group says no links, post the story and send the link in DMs to people who ask.",
    ],
  },
  {
    title: "Post the message",
    items: [
      "Paste the draft, change the first line so it sounds like you, then post.",
      "Useful windows: 7-9 AM, 12-1 PM, and 7-9 PM. Post in 3-5 groups a day, spaced out.",
      "Reply to comments within an hour so the thread stays visible.",
    ],
  },
] as const

const panelClass =
  "overflow-hidden rounded-[2.75rem] border border-[var(--border-subtle)] bg-[var(--layer-elevated)] shadow-[var(--ds-shadow-card)]"

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-sapphire active:translate-y-0 active:scale-[0.98]"

const quietButtonClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,transform] duration-200 hover:border-primary hover:bg-primary-light hover:text-sapphire-700 active:scale-[0.98]"

export function InstantIncomeContent({
  userId: _userId,
  initialSets = [],
}: {
  userId: string
  initialSets?: InstantIncomePostSet[]
}) {
  const [selectedNiche, setSelectedNiche] = useState<string>("Weight Loss")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [setName, setSetName] = useState("")
  const [nameTouched, setNameTouched] = useState(false)
  const [showPosts, setShowPosts] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [librarySets, setLibrarySets] = useState<InstantIncomePostSet[]>(initialSets)
  const [openLibraryId, setOpenLibraryId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [libraryError, setLibraryError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [markingPostKey, setMarkingPostKey] = useState<string | null>(null)
  const [resultPosts, setResultPosts] = useState<InstantIncomeSavedPost[]>([])
  const [resultNiche, setResultNiche] = useState("Weight Loss")

  const postsResultsRef = useScrollToResults(showPosts && resultPosts.length > 0)
  const reduceMotion = useReducedMotion()

  const savedSetForResults = librarySets.find(
    (set) => set.name.trim().toLowerCase() === setName.trim().toLowerCase(),
  )

  useEffect(() => {
    if (nameTouched) return
    setSetName(defaultLabelFromUrl(affiliateLink))
  }, [affiliateLink, nameTouched])

  const handleCopy = (postId: string, body: string) => {
    navigator.clipboard.writeText(body)
    setCopiedId(postId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGeneratePosts = async () => {
    const link = affiliateLink.trim()
    const name = setName.trim()

    if (!isValidAffiliateUrl(link)) {
      setFormError("Use a full link that starts with https://")
      return
    }
    if (!name) {
      setFormError("Add a name for this link so we can save the set in your library.")
      return
    }

    setFormError("")
    setLibraryError("")
    setShowPosts(false)
    setResultPosts([])
    setGenerating(true)

    try {
      const response = await fetch("/api/premium/instant-income/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateUrl: link,
          niche: selectedNiche,
          offerName: name,
        }),
      })
      const data = (await response.json()) as {
        error?: string
        posts?: InstantIncomeSavedPost[]
      }
      if (!response.ok || !data.posts?.length) {
        setGenerating(false)
        setFormError(data.error || "Could not generate posts for that offer. Try again.")
        return
      }

      const result = await upsertInstantIncomePostSet({
        name,
        affiliateUrl: link,
        niche: selectedNiche,
        posts: data.posts.map((post) => ({ id: post.id, body: post.body })),
      })

      setGenerating(false)

      if (!result.success) {
        setFormError(result.error)
        return
      }

      setLibrarySets((prev) => {
        const without = prev.filter(
          (s) => s.id !== result.set.id && s.name.trim().toLowerCase() !== name.toLowerCase(),
        )
        return [result.set, ...without]
      })
      setLibraryOpen(true)
      setOpenLibraryId(result.set.id)
      setResultPosts(result.set.posts)
      setResultNiche(selectedNiche)
      setShowPosts(true)
    } catch {
      setGenerating(false)
      setFormError("Could not generate posts for that offer. Try again.")
    }
  }

  const handleMarkPostUsed = async (setId: string, postId: string) => {
    const key = `${setId}-${postId}`
    setMarkingPostKey(key)
    setLibraryError("")
    const result = await markInstantIncomePostUsed(setId, postId)
    setMarkingPostKey(null)
    if (!result.success) {
      setLibraryError(result.error)
      return
    }
    setLibrarySets((prev) => prev.map((set) => (set.id === result.set.id ? result.set : set)))
    setResultPosts((prev) => (prev.some((post) => post.id === postId) ? result.set.posts : prev))
  }

  const handleDeleteSet = async (setId: string) => {
    setDeletingId(setId)
    setLibraryError("")
    const result = await deleteInstantIncomePostSet(setId)
    setDeletingId(null)
    if (!result.success) {
      setLibraryError(result.error)
      return
    }
    setLibrarySets((prev) => prev.filter((s) => s.id !== setId))
    if (openLibraryId === setId) setOpenLibraryId(null)
  }

  return (
    <PremiumPageLayout
      title={PREMIUM_FEATURE_LABELS.instantIncome}
      subtitle="Facebook posts for one niche and one offer. Paste a link, copy a draft, and share it where the group rules allow."
    >
      <PremiumVideoTutorial
        premiumKey="recurringStreams"
        vimeoId={getPremiumTrainingVimeoId("recurringStreams")}
        title={`${PREMIUM_FEATURE_LABELS.instantIncome} training`}
        description="How to copy a draft, adjust the first line, and post it in a group that allows it."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.instantIncome} training video`}
      />

      <Disclosure
        open={guideOpen}
        onToggle={() => setGuideOpen((open) => !open)}
        icon={BookOpen}
        title="How to post in Facebook groups"
        summary="Groups reward posts that sound like a person. Read this once, then edit the first line before you paste."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {GUIDE.map((step, index) => (
            <div key={step.title} className="surface-action rounded-[1.75rem] p-4 sm:p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-grad-sapphire text-xs font-medium text-white">
                  {index + 1}
                </span>
                <h3 className="text-sm font-medium text-ink">{step.title}</h3>
              </div>
              <ul className="mt-3 space-y-2.5">
                {step.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-ink-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-ink-3">
          Results depend on the niche, the offer, the group rules, and how often you post. Treat these as drafts.
          Space them out, reply quickly, and keep notes on which opening line and time of day get replies.
        </p>
      </Disclosure>

      <Disclosure
        open={libraryOpen}
        onToggle={() => setLibraryOpen((open) => !open)}
        icon={FolderOpen}
        title="Saved post sets"
        summary="Each generation is stored under the link name. The same name updates that set."
        meta={`${librarySets.length} set${librarySets.length === 1 ? "" : "s"}`}
      >
        {libraryError ? <PremiumErrorAlert message={libraryError} className="mb-4" /> : null}
        {librarySets.length === 0 ? (
          <div className="empty-state-panel rounded-[1.75rem]">
            <span className="empty-state-icon">
              <FolderOpen className="h-6 w-6" aria-hidden />
            </span>
            <p className="text-sm font-medium text-ink">No saved sets yet</p>
            <p className="empty-state-copy">Generate posts with a link name to start your library.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {librarySets.map((set) => {
              const open = openLibraryId === set.id
              return (
                <article
                  key={set.id}
                  className={cn(
                    "overflow-hidden rounded-[1.75rem] border bg-card transition-colors duration-200",
                    open ? "border-primary" : "border-[var(--ds-line)]",
                  )}
                >
                  <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
                    <button
                      type="button"
                      onClick={() => setOpenLibraryId(open ? null : set.id)}
                      aria-expanded={open}
                      className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-sm font-medium text-sapphire-700">
                        {set.posts.length}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{set.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-ink-3">
                          {set.niche}, {new Date(set.updatedAt).toLocaleDateString()}
                        </span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200",
                          open && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={deletingId === set.id}
                      onClick={() => void handleDeleteSet(set.id)}
                      className={cn("h-9 w-9 shrink-0 px-0", quietButtonClass)}
                      aria-label={`Delete ${set.name}`}
                    >
                      {deletingId === set.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {open ? (
                    <div className="space-y-3 border-t border-[var(--ds-line)] bg-surface-nested/40 px-3 py-4 sm:px-4">
                      <p className="truncate rounded-lg bg-card px-3 py-2 text-xs text-ink-3">{set.affiliateUrl}</p>
                      {set.posts.map((post, index) => {
                        const copyKey = `${set.id}-${post.id}`
                        const isUsed = Boolean(post.usedAt)
                        return (
                          <PostDraft
                            key={post.id}
                            index={index}
                            body={post.body}
                            isUsed={isUsed}
                            copied={copiedId === copyKey}
                            marking={markingPostKey === copyKey}
                            markDisabled={isUsed}
                            onCopy={() => handleCopy(copyKey, post.body)}
                            onMark={() => void handleMarkPostUsed(set.id, post.id)}
                          />
                        )
                      })}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </Disclosure>

      <section className={cn(panelClass, "px-5 py-6 md:px-8 md:py-8")}>
        <h2 className="text-xl font-medium tracking-tight text-ink">How it works</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.num} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-xs font-medium text-white">
                {step.num}
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{step.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-3">{step.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className={panelClass}>
        <div className="px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-medium tracking-tight text-ink">Write posts</h2>
                <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-ink-3">
                  We read the offer page and write stories about that link.
                </p>
              </div>
              <p className="rounded-full border border-[var(--ds-line-sapphire)] bg-primary-light px-3 py-1 text-sm font-medium text-sapphire-700">
                {INSTANT_INCOME_POST_COUNT} {selectedNiche} posts
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="surface-action rounded-[1.75rem] p-4 sm:p-5">
                <Label id="niche-label" className="text-sm font-medium text-ink">
                  Niche
                </Label>
                <div
                  role="radiogroup"
                  aria-labelledby="niche-label"
                  className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4"
                >
                  {INSTANT_INCOME_NICHES.map((niche) => {
                    const selected = selectedNiche === niche
                    return (
                      <button
                        key={niche}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setSelectedNiche(niche)
                          setShowPosts(false)
                        }}
                        className={cn(
                          "min-h-11 rounded-xl border px-3 py-2 text-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98]",
                          selected
                            ? primaryCtaClass
                            : "border-[var(--ds-line)] bg-card text-ink-3 hover:border-[var(--ds-line-strong)] hover:text-ink",
                        )}
                      >
                        {niche}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="surface-action rounded-[1.75rem] p-4 sm:p-5 md:col-span-2">
                  <Label htmlFor="affiliate-link" className="text-sm font-medium text-ink">
                    Affiliate link
                  </Label>
                  <Input
                    id="affiliate-link"
                    type="url"
                    placeholder="https://digistore24.com/..."
                    value={affiliateLink}
                    onChange={(e) => {
                      setAffiliateLink(e.target.value)
                      setShowPosts(false)
                    }}
                    className="mt-2 h-12 rounded-[1.75rem] bg-card px-5 text-base text-ink"
                  />
                  <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-3">
                    Must start with https://. Need a link?{" "}
                    <a
                      href="http://digistore24.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center font-medium text-sapphire-700 underline decoration-sapphire-300 underline-offset-2 hover:text-sapphire-900"
                    >
                      DigiStore24
                      <ExternalLink className="ml-1 h-3.5 w-3.5" aria-hidden />
                    </a>{" "}
                    is a free marketplace. Create an account, open Promote on a product, and paste your link here.
                  </p>
                </div>

                <div className="surface-action rounded-[1.75rem] p-4 sm:p-5 md:col-span-2">
                  <Label htmlFor="set-name" className="text-sm font-medium text-ink">
                    Name for this link
                  </Label>
                  <Input
                    id="set-name"
                    type="text"
                    placeholder="Melatonin Digistore"
                    value={setName}
                    onChange={(e) => {
                      setNameTouched(true)
                      setSetName(e.target.value)
                    }}
                    className="mt-2 h-12 rounded-[1.75rem] bg-card px-5 text-base text-ink"
                  />
                  <p className="mt-2 text-sm leading-relaxed text-ink-3">
                    Saved sets use this name. The same name updates that set.
                  </p>
                </div>
              </div>

              {generating ? (
                <GenerationProgress
                  label={`Writing ${INSTANT_INCOME_POST_COUNT} ${selectedNiche} posts for your offer`}
                />
              ) : null}

              {formError ? <PremiumErrorAlert message={formError} /> : null}

              <Button
                onClick={() => void handleGeneratePosts()}
                disabled={!affiliateLink.trim() || !setName.trim() || generating}
                className={cn("h-12 w-full text-base", primaryCtaClass)}
                size="lg"
              >
                {generating ? "Writing your posts" : `Generate ${INSTANT_INCOME_POST_COUNT} ${selectedNiche} posts`}
                {!generating ? <ArrowRight className="ml-2 h-4 w-4" aria-hidden /> : null}
              </Button>
            </div>
          </div>
      </section>

      {showPosts && resultPosts.length > 0 ? (
        <motion.div
          ref={postsResultsRef}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(panelClass, "scroll-mt-24")}
        >
          <div className="bg-grad-sapphire px-5 py-5 text-white md:px-8 md:py-6">
            <p className="text-sm text-white/80">{resultNiche}</p>
            <h2 className="mt-1 text-xl font-medium tracking-tight text-white">
              {resultPosts.length} posts ready
            </h2>
            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-white/80">
              Copy a draft, rewrite the opening line in your voice, then paste where the group rules allow.
            </p>
          </div>
          <div className="space-y-4 p-5 md:p-8">
            {libraryError ? <PremiumErrorAlert message={libraryError} /> : null}
            {resultPosts.map((post, index) => {
              const savedPost = savedSetForResults?.posts.find((item) => item.id === post.id)
              const isUsed = Boolean(savedPost?.usedAt || post.usedAt)
              const setId = savedSetForResults?.id
              const markKey = setId ? `${setId}-${post.id}` : null
              return (
                <PostDraft
                  key={post.id}
                  index={index}
                  niche={resultNiche}
                  body={post.body}
                  isUsed={isUsed}
                  copied={copiedId === post.id}
                  marking={markKey != null && markingPostKey === markKey}
                  markDisabled={!setId || isUsed}
                  onCopy={() => handleCopy(post.id, post.body)}
                  onMark={() => setId && void handleMarkPostUsed(setId, post.id)}
                />
              )
            })}
            <BonusTrainingCard />
          </div>
        </motion.div>
      ) : null}
    </PremiumPageLayout>
  )
}

function Disclosure({
  open,
  onToggle,
  icon: Icon,
  title,
  summary,
  meta,
  children,
}: {
  open: boolean
  onToggle: () => void
  icon: LucideIcon
  title: string
  summary: string
  meta?: string
  children: ReactNode
}) {
  return (
    <section className={panelClass}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-surface-hover md:px-6"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-sapphire-700">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-medium text-ink">{title}</span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-3">{summary}</span>
        </span>
        {meta ? (
          <span className="hidden shrink-0 rounded-full border border-[var(--ds-line)] bg-card px-3 py-1 text-sm font-medium tabular-nums text-ink sm:inline">
            {meta}
          </span>
        ) : null}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? <div className="border-t border-[var(--border-brand)] px-5 py-5 md:px-6 md:py-6">{children}</div> : null}
    </section>
  )
}

function PostDraft({
  index,
  niche,
  body,
  isUsed,
  copied,
  marking,
  markDisabled,
  onCopy,
  onMark,
}: {
  index: number
  niche?: string
  body: string
  isUsed: boolean
  copied: boolean
  marking: boolean
  markDisabled: boolean
  onCopy: () => void
  onMark: () => void
}) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[1.75rem] border bg-card",
        isUsed ? "border-[var(--ds-line-offer)]" : "border-[var(--ds-line)]",
      )}
    >
      <div className="flex items-center gap-3 border-b border-[var(--ds-line)] px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-sm font-medium text-white">
          {index + 1}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-ink">Post {index + 1}</h3>
          {niche ? <p className="text-xs text-ink-3">{niche}</p> : null}
        </div>
        {isUsed ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-2.5 py-1 text-xs font-medium text-[var(--ds-offer-green-800)]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Used
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "whitespace-pre-wrap px-4 py-4 text-[15px] leading-7 text-ink sm:px-5 sm:py-5",
          isUsed && "text-ink-3",
        )}
      >
        {body}
      </p>
      <div className="flex flex-col gap-2 border-t border-[var(--ds-line)] px-4 py-3 sm:flex-row sm:px-5">
        <Button
          type="button"
          onClick={onCopy}
          className={cn(
            "h-11 flex-1 text-sm",
            copied ? "rounded-xl bg-sapphire-500 font-medium text-white hover:bg-sapphire-500" : primaryCtaClass,
          )}
        >
          {copied ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy this post
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={markDisabled || marking}
          onClick={onMark}
          className={cn(
            "h-11 flex-1 text-sm",
            isUsed
              ? "rounded-xl border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] font-medium text-[var(--ds-offer-green-800)]"
              : quietButtonClass,
          )}
        >
          {marking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : isUsed ? (
            "Marked as used"
          ) : (
            "Mark as used"
          )}
        </Button>
      </div>
    </article>
  )
}
