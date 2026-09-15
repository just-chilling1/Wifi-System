"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Copy,
  CheckCircle2,
  Facebook,
  Search,
  BookOpen,
  PenLine,
  Link2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  FolderOpen,
  Loader2,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GenerationProgress } from "@/components/generation-progress"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import {
  PremiumControlCard,
  PremiumFeatureBanner,
  PremiumSteps,
} from "@/components/premium-feature-chrome"
import { PremiumPageLayout } from "@/components/premium-page-layout"
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

const INSTANT_STEPS = [
  {
    num: "1",
    title: "Pick your niche",
    desc: "Choose the niche that matches your affiliate offer — weight loss, make money online, health, beauty, and more.",
  },
  {
    num: "2",
    title: "Name your link",
    desc: "Paste your affiliate link and give it a name. We write posts about that offer in the niche you picked, then save the set in your library.",
  },
  {
    num: "3",
    title: "Copy and post",
    desc: "Copy a post, personalize it, and share it in groups that allow that kind of message. Reopen saved sets anytime.",
  },
] as const

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:shadow-sapphire"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:text-sapphire-700 hover:shadow-hover"

const GUIDE_STEPS = [
  {
    num: "1",
    icon: Search,
    title: "Find Facebook groups",
    items: [
      "Search keywords like “weight loss support”, “make money online”, or “fitness motivation”, then filter to Groups.",
      "Join 10–15 groups with 5,000+ members. Bigger rooms mean more people seeing a personal story.",
      "Wait for admin approval — usually 1–24 hours. Post only after you’re in.",
    ],
  },
  {
    num: "2",
    icon: BookOpen,
    title: "Read the group rules",
    items: [
      "Open About and check whether personal stories are allowed. Most groups ban hard selling, not honest updates.",
      "These drafts are written as personal stories so they usually fit — still read the rules first.",
      "If a group says no links, post the story and send the link in DMs to people who ask.",
    ],
  },
  {
    num: "3",
    icon: PenLine,
    title: "Post your message",
    items: [
      "Click Write something, paste your copied draft, then Post. Change the first line so it sounds like you.",
      "Best windows: 7–9 AM, 12–1 PM, and 7–9 PM. Post in 3–5 different groups per day — never blast every group at once.",
      "Reply to comments within an hour. Friendly replies keep the thread visible.",
    ],
  },
] as const


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
  const [libraryOpen, setLibraryOpen] = useState(initialSets.length > 0)
  const [librarySets, setLibrarySets] = useState<InstantIncomePostSet[]>(initialSets)
  const [openLibraryId, setOpenLibraryId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [libraryError, setLibraryError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [markingPostKey, setMarkingPostKey] = useState<string | null>(null)
  const [resultPosts, setResultPosts] = useState<InstantIncomeSavedPost[]>([])
  const [resultNiche, setResultNiche] = useState("Weight Loss")

  const postsResultsRef = useScrollToResults(showPosts && resultPosts.length > 0)

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
      title={`${PREMIUM_FEATURE_LABELS.instantIncome}`}
      subtitle="Facebook posts written for your niche and your offer. Paste a link, copy a draft, and share it where the group rules allow."
    >
      <PremiumVideoTutorial
        premiumKey="recurringStreams"
        vimeoId={getPremiumTrainingVimeoId("recurringStreams")}
        title={`${PREMIUM_FEATURE_LABELS.instantIncome} Training`}
        description="Watch this quick tutorial to learn how to copy these Facebook posts and start making money instantly. Simple and easy!"
        iframeTitle={`${PREMIUM_FEATURE_LABELS.instantIncome} training video`}
      />

      <PremiumFeatureBanner
        icon={Facebook}
        kicker="Facebook posts"
        title="Posts for your offer"
        description="Pick a niche, drop in your affiliate link, and get Facebook stories written about that product — then edit them so they sound like you."
        chip="Copy and personalize"
      />

      <PremiumSteps title="Three steps to post" steps={INSTANT_STEPS} />

      <section className="glass-card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setGuideOpen((open) => !open)}
          aria-expanded={guideOpen}
          className="flex w-full items-center gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 p-5 text-left transition-colors hover:bg-sapphire-100/80 md:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sapphire-100 text-sapphire-700">
            <Facebook size={24} strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-ink">How to find and post in Facebook groups</span>
            <span className="mt-0.5 block text-sm text-ink-3">
              Groups reward members who sound human. Read this once, then generate drafts and edit the first line
              before you paste.
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-sapphire-700 transition-transform duration-200",
              guideOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {guideOpen ? (
          <div className="space-y-3 p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {GUIDE_STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.num}
                    className="rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-100/50 p-4 sm:p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-grad-sapphire text-sm font-medium text-white">
                        {step.num}
                      </span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sapphire-700 shadow-sm">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="text-base font-medium text-ink">{step.title}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire-700" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] p-5">
              <h3 className="text-base font-medium text-ink">What to expect</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                Outcomes depend on your niche, offer, group rules, and consistency. Treat these as starting drafts —
                edit them so they sound like you and match each community&apos;s guidelines.
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                  Post in a handful of relevant groups per day, spaced out — never dump the same text everywhere at
                  once.
                </li>
                <li className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                  Reply quickly and helpfully so the thread stays visible without sounding salesy.
                </li>
                <li className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                  Track hook, group, and time of day so you improve the message — not just the volume.
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </section>

      <section className="glass-card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setLibraryOpen((open) => !open)}
          aria-expanded={libraryOpen}
          className="flex w-full flex-wrap items-center gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 p-5 text-left transition-colors hover:bg-sapphire-100/80 md:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sapphire-700 shadow-sm">
            <FolderOpen size={24} strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="page-eyebrow mb-1 block">Library</span>
            <span className="block text-xl font-semibold text-ink sm:text-2xl">Saved post sets</span>
            <span className="mt-1 block text-sm text-text-secondary">
              Each generation is saved under the link name you enter. Same name updates that set.
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-[var(--ds-line)] bg-card px-3 py-1.5 text-sm font-semibold text-ink">
              {librarySets.length} set{librarySets.length === 1 ? "" : "s"}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-sapphire-700 transition-transform duration-200",
                libraryOpen && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>

        {libraryOpen ? (
          <div className="space-y-4 p-5 md:p-6">
            {libraryError ? (
              <p
                role="alert"
                className="rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
              >
                {libraryError}
              </p>
            ) : null}

            {librarySets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--ds-line)] bg-card px-5 py-10 text-center">
                <FolderOpen className="mx-auto h-8 w-8 text-sapphire-700" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-ink">No saved sets yet</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Generate posts with a link name to start your library.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {librarySets.map((set) => {
                  const open = openLibraryId === set.id
                  return (
                    <article
                      key={set.id}
                      className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-card shadow-[var(--ds-shadow-card)]"
                    >
                      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          onClick={() => setOpenLibraryId(open ? null : set.id)}
                          aria-expanded={open}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                            <FolderOpen className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">{set.name}</span>
                            <span className="mt-0.5 block truncate text-xs text-text-secondary">
                              {set.niche} · {set.posts.length} posts ·{" "}
                              {new Date(set.updatedAt).toLocaleDateString()}
                            </span>
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-text-secondary transition-transform",
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
                          className={cn("h-9 shrink-0", outlineCtaClass)}
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
                        <div className="space-y-3 border-t border-[var(--ds-line)] bg-surface-nested/40 px-4 py-4 sm:px-5">
                          <p className="truncate text-xs text-text-secondary">{set.affiliateUrl}</p>
                          {set.posts.map((post, index) => {
                            const copyKey = `${set.id}-${post.id}`
                            const markKey = copyKey
                            const isUsed = Boolean(post.usedAt)
                            const isMarking = markingPostKey === markKey

                            return (
                              <div
                                key={post.id}
                                className={cn(
                                  "rounded-xl border border-[var(--ds-line)] bg-card p-4",
                                  isUsed && "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)]/40",
                                )}
                              >
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-sapphire-700">
                                    Post #{index + 1}
                                  </p>
                                  {isUsed ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ds-offer-green-800)]">
                                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                                      Used
                                    </span>
                                  ) : null}
                                </div>
                                <p
                                  className={cn(
                                    "whitespace-pre-wrap text-sm leading-relaxed text-ink",
                                    isUsed && "text-ink-3",
                                  )}
                                >
                                  {post.body}
                                </p>
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                  <Button
                                    type="button"
                                    onClick={() => handleCopy(copyKey, post.body)}
                                    className={cn(
                                      "h-10 flex-1 text-sm",
                                      copiedId === copyKey
                                        ? "rounded-xl bg-sapphire-500 font-medium text-white hover:bg-sapphire-500"
                                        : primaryCtaClass,
                                    )}
                                  >
                                    {copiedId === copyKey ? (
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
                                    disabled={isUsed || isMarking}
                                    onClick={() => void handleMarkPostUsed(set.id, post.id)}
                                    className={cn(
                                      "h-10 flex-1 text-sm",
                                      isUsed
                                        ? "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] font-medium text-[var(--ds-offer-green-800)]"
                                        : outlineCtaClass,
                                    )}
                                  >
                                    {isMarking ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving…
                                      </>
                                    ) : isUsed ? (
                                      <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Marked as used
                                      </>
                                    ) : (
                                      "Mark as used"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        ) : null}
      </section>

      <PremiumControlCard
        icon={FolderOpen}
        title="Write posts for this offer"
        description="Pick the niche that matches your product. We read the offer page and write Facebook stories about that specific link — not a generic template."
      >
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Step 1 · Choose your niche
              </Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {INSTANT_INCOME_NICHES.map((niche) => {
                  const selected = selectedNiche === niche
                  return (
                    <Button
                      key={niche}
                      type="button"
                      onClick={() => {
                        setSelectedNiche(niche)
                        setShowPosts(false)
                      }}
                      variant={selected ? "default" : "outline"}
                      className={
                        selected
                          ? cn("h-11 text-sm", primaryCtaClass)
                          : cn("h-11 text-sm", outlineCtaClass)
                      }
                    >
                      {niche}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                  <Link2 className="h-3.5 w-3.5" aria-hidden />
                </span>
                Where to get your affiliate link
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                We recommend{" "}
                <a
                  href="http://digistore24.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sapphire-700 underline decoration-sapphire-300 underline-offset-2 hover:text-sapphire-900"
                >
                  DigiStore24
                </a>
                {" "}
                — a free marketplace with products you can promote for commission.
              </p>
              <ol className="mt-3 space-y-2">
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-[11px] font-medium text-white">
                    1
                  </span>
                  Create a free account at digistore24.com (about two minutes).
                </li>
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-[11px] font-medium text-white">
                    2
                  </span>
                  Browse your niche and click Promote on a product.
                </li>
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-[11px] font-medium text-white">
                    3
                  </span>
                  Copy your unique link and paste it below.
                </li>
              </ol>
              <Button asChild variant="outline" className={cn("mt-4 w-full", outlineCtaClass)}>
                <a href="http://digistore24.com" target="_blank" rel="noopener noreferrer">
                  Create free DigiStore24 account
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5">
              <Label
                htmlFor="affiliate-link"
                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                  <Link2 size={12} aria-hidden />
                </span>
                Step 2 · Affiliate link
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
                className="h-12 bg-card text-base text-ink"
              />
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                We write this URL into every draft and use the offer page to keep the story about your product. Must start with https://
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5">
              <Label
                htmlFor="set-name"
                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                  <FolderOpen size={12} aria-hidden />
                </span>
                Step 3 · Name for this link
              </Label>
              <Input
                id="set-name"
                type="text"
                placeholder="e.g. Melatonin Digistore"
                value={setName}
                onChange={(e) => {
                  setNameTouched(true)
                  setSetName(e.target.value)
                }}
                className="h-12 bg-card text-base text-ink"
              />
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Saved sets use this name. Generating again with the same name updates that set.
              </p>
            </div>

            {generating ? (
              <GenerationProgress
                offer="welcome"
                label={`Writing ${INSTANT_INCOME_POST_COUNT} ${selectedNiche} posts for your offer...`}
              />
            ) : showPosts ? (
              <WelcomeOfferBanner />
            ) : null}

            {formError ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
              >
                {formError}
              </p>
            ) : null}

            <Button
              onClick={() => void handleGeneratePosts()}
              disabled={!affiliateLink.trim() || !setName.trim() || generating}
              className={cn("h-12 w-full text-base sm:h-14 sm:text-lg", primaryCtaClass)}
              size="lg"
            >
              {generating ? "Writing your posts…" : `Generate ${INSTANT_INCOME_POST_COUNT} ${selectedNiche} posts`}
              {!generating ? <ArrowRight className="ml-2 h-5 w-5" aria-hidden /> : null}
            </Button>
      </PremiumControlCard>

      {showPosts && resultPosts.length > 0 && (
        <div ref={postsResultsRef} className="space-y-6">
          <div className="glass-card overflow-hidden p-0">
            <div className="border-b border-[var(--ds-line)] bg-sapphire-100 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-sapphire-700">
                    Ready to copy
                  </p>
                  <h2 className="font-medium text-ink">
                    Your {resultPosts.length} {resultNiche} posts are ready
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-3">
                    Copy a draft, rewrite the opening line in your voice, then paste where the group rules allow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {libraryError ? (
            <p
              role="alert"
              className="rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
            >
              {libraryError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4">
            {resultPosts.map((post, index) => {
              const savedPost = savedSetForResults?.posts.find((p) => p.id === post.id)
              const isUsed = Boolean(savedPost?.usedAt || post.usedAt)
              const setId = savedSetForResults?.id
              const markKey = setId ? `${setId}-${post.id}` : null
              const isMarking = markKey != null && markingPostKey === markKey
              const body = post.body

              return (
                <article
                  key={post.id}
                  className={cn(
                    "glass-card overflow-hidden p-0",
                    isUsed && "ring-1 ring-[var(--ds-line-offer)]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2 border-b border-[var(--ds-line)] px-5 py-3">
                    <span className="rounded-full bg-grad-sapphire px-3 py-1 text-xs font-medium text-white">
                      Post #{index + 1}
                    </span>
                    <span className="rounded-full border border-[var(--ds-line)] bg-surface-nested px-3 py-1 text-xs font-medium text-ink">
                      {resultNiche}
                    </span>
                    {isUsed ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-2.5 py-1 text-xs font-semibold text-[var(--ds-offer-green-800)]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        Used
                      </span>
                    ) : null}
                  </div>
                  <div className="px-5 py-5">
                    <div
                      className={cn(
                        "rounded-xl border border-[var(--ds-line)] bg-surface-nested/80 p-4 sm:p-5",
                        isUsed && "opacity-90",
                      )}
                    >
                      <p
                        className={cn(
                          "whitespace-pre-wrap text-[15px] font-normal leading-7 text-ink sm:text-base",
                          isUsed && "text-ink-3",
                        )}
                      >
                        {body}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        onClick={() => handleCopy(post.id, body)}
                        className={cn(
                          "h-12 flex-1 text-base",
                          copiedId === post.id
                            ? "rounded-xl bg-sapphire-500 font-medium text-white hover:bg-sapphire-500"
                            : primaryCtaClass,
                        )}
                        size="lg"
                      >
                        {copiedId === post.id ? (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Copied — now paste in Facebook
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-5 w-5" />
                            Copy this post
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        disabled={!setId || isUsed || isMarking}
                        onClick={() => setId && void handleMarkPostUsed(setId, post.id)}
                        className={cn(
                          "h-12 flex-1 text-base",
                          isUsed
                            ? "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] font-medium text-[var(--ds-offer-green-800)]"
                            : outlineCtaClass,
                        )}
                      >
                        {isMarking ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Saving…
                          </>
                        ) : isUsed ? (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Marked as used
                          </>
                        ) : (
                          "Mark as used"
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </PremiumPageLayout>
  )
}
