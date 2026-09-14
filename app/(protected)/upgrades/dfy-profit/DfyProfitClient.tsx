"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Package,
  Sparkles,
  Wallet,
} from "lucide-react"
import { PremiumControlCard, PremiumFeatureBanner, PremiumSteps } from "@/components/premium-feature-chrome"
import { PremiumPageLayout } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { GenerationProgress } from "@/components/generation-progress"
import { SavedLinksPicker } from "@/components/saved-links-picker"
import { SavedGenerationsLibrary } from "@/components/saved-generations-library"
import { MarkAsUsedButton, UsedBadge } from "@/components/mark-as-used-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { commentUsedKey, defaultLabelFromUrl, postUsedKey } from "@/lib/generation-set-name"
import { parseDfySavedKit, summarizeDfyKit } from "@/lib/dfy-profit/saved-kit"
import { cn } from "@/lib/utils"
import type { AffiliateLink } from "@/app/actions/affiliate-links"
import {
  deletePremiumGenerationSet,
  markPremiumGenerationItemUsed,
  upsertPremiumGenerationSet,
  type PremiumGenerationSet,
} from "@/app/actions/premium-generation-sets"
import type { DfyArticleResult, DfyFacebookPost, DfyVideoResult } from "@/lib/dfy-profit/types"
import { DfyResultPanel } from "./DfyResultPanel"

const NICHES = [
  "Weight Loss",
  "Make Money Online",
  "Health & Fitness",
  "Beauty & Skincare",
  "Relationships",
  "Tech & Gadgets",
  "Pets",
  "Home & Garden",
]

const STEPS = [
  {
    num: "1",
    title: "Add your link",
    desc: "Paste an affiliate URL or pick one from Link Vault.",
  },
  {
    num: "2",
    title: "Pick a niche",
    desc: "Choose the niche so videos, article tone, and posts stay on-brand.",
  },
  {
    num: "3",
    title: "Generate your kit",
    desc: "We find 5 videos, write an authority article, and draft Facebook posts.",
  },
]

type Stage = "idle" | "videos" | "article" | "posts" | "done"

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  videos: "Finding your videos…",
  article: "Writing your authority article…",
  posts: "Generating Facebook posts…",
}

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:shadow-sapphire"

export default function DfyProfitClient({
  savedLinks,
  initialSets = [],
}: {
  savedLinks: AffiliateLink[]
  initialSets?: PremiumGenerationSet[]
}) {
  const [affiliateUrl, setAffiliateUrl] = useState("")
  const [offerName, setOfferName] = useState("")
  const [kitName, setKitName] = useState("")
  const [nameTouched, setNameTouched] = useState(false)
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [niche, setNiche] = useState("")
  const [stage, setStage] = useState<Stage>("idle")
  const [error, setError] = useState("")

  const [videos, setVideos] = useState<DfyVideoResult[]>([])
  const [article, setArticle] = useState<DfyArticleResult | null>(null)
  const [posts, setPosts] = useState<DfyFacebookPost[]>([])
  const [articleError, setArticleError] = useState("")
  const [postsError, setPostsError] = useState("")
  const [usedFallbackLink, setUsedFallbackLink] = useState(false)
  const [context, setContext] = useState({ productName: "", productContext: "", niche: "" })
  const [retryingArticle, setRetryingArticle] = useState(false)
  const [retryingPosts, setRetryingPosts] = useState(false)

  const [librarySets, setLibrarySets] = useState<PremiumGenerationSet[]>(initialSets)
  const [libraryOpen, setLibraryOpen] = useState(initialSets.length > 0)
  const [openLibraryId, setOpenLibraryId] = useState<string | null>(null)
  const [libraryError, setLibraryError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [markingKey, setMarkingKey] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeSetId, setActiveSetId] = useState<string | null>(null)
  const [usedKeys, setUsedKeys] = useState<Record<string, string>>({})

  const generating = stage === "videos" || stage === "article" || stage === "posts"

  useEffect(() => {
    if (nameTouched) return
    setKitName(offerName.trim() || defaultLabelFromUrl(affiliateUrl))
  }, [affiliateUrl, offerName, nameTouched])

  const persistKit = async (
    nextVideos: DfyVideoResult[],
    nextArticle: DfyArticleResult | null,
    nextPosts: DfyFacebookPost[],
    nextContext: { productName: string; productContext: string; niche: string },
    nextUsedFallbackLink: boolean,
  ) => {
    const name = kitName.trim()
    if (!name || !isValidAffiliateUrl(affiliateUrl)) return

    const result = await upsertPremiumGenerationSet({
      feature: "dfy_profit",
      name,
      affiliateUrl,
      niche: nextContext.niche || niche,
      payload: {
        offerName,
        productName: nextContext.productName,
        productContext: nextContext.productContext,
        videos: nextVideos,
        article: nextArticle,
        posts: nextPosts,
        usedFallbackLink: nextUsedFallbackLink,
      },
    })

    if (!result.success) {
      setLibraryError(result.error)
      return
    }

    setLibrarySets((prev) => {
      const without = prev.filter(
        (s) => s.id !== result.set.id && s.name.trim().toLowerCase() !== name.toLowerCase(),
      )
      return [result.set, ...without]
    })
    setActiveSetId(result.set.id)
    setUsedKeys(result.set.usedKeys)
    setLibraryOpen(true)
    setOpenLibraryId(result.set.id)
    setLibraryError("")
  }

  const restoreSet = (set: PremiumGenerationSet) => {
    const kit = parseDfySavedKit(set.payload)
    setAffiliateUrl(set.affiliateUrl)
    setOfferName(kit.offerName || set.name)
    setKitName(set.name)
    setNameTouched(true)
    setSelectedLinkId(null)
    setNiche(set.niche || kit.productContext)
    setVideos(kit.videos)
    setArticle(kit.article)
    setPosts(kit.posts)
    setUsedFallbackLink(kit.usedFallbackLink)
    setContext({
      productName: kit.productName,
      productContext: kit.productContext,
      niche: set.niche,
    })
    setArticleError("")
    setPostsError("")
    setStage("done")
    setActiveSetId(set.id)
    setUsedKeys(set.usedKeys)
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleMarkUsed = async (itemKey: string, setId = activeSetId) => {
    if (!setId) return
    setMarkingKey(itemKey)
    setLibraryError("")
    const result = await markPremiumGenerationItemUsed(setId, itemKey)
    setMarkingKey(null)
    if (!result.success) {
      setLibraryError(result.error)
      return
    }
    setLibrarySets((prev) => prev.map((set) => (set.id === result.set.id ? result.set : set)))
    if (activeSetId === result.set.id) setUsedKeys(result.set.usedKeys)
  }

  const handleDeleteSet = async (setId: string) => {
    setDeletingId(setId)
    setLibraryError("")
    const result = await deletePremiumGenerationSet(setId)
    setDeletingId(null)
    if (!result.success) {
      setLibraryError(result.error)
      return
    }
    setLibrarySets((prev) => prev.filter((s) => s.id !== setId))
    if (openLibraryId === setId) setOpenLibraryId(null)
    if (activeSetId === setId) {
      setActiveSetId(null)
      setUsedKeys({})
    }
  }

  const runArticle = async (ctx: { productName: string; productContext: string; niche: string }) => {
    const response = await fetch("/api/premium/dfy-profit/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateUrl, ...ctx }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Article generation failed")
    return data as DfyArticleResult
  }

  const runPosts = async (ctx: { productName: string; niche: string }, articleUrl: string | null) => {
    const response = await fetch("/api/premium/dfy-profit/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateUrl, articleUrl: articleUrl ?? undefined, ...ctx }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Facebook post generation failed")
    return data as { posts: DfyFacebookPost[]; usedFallbackLink: boolean }
  }

  const handleGenerate = async () => {
    if (!isValidAffiliateUrl(affiliateUrl)) {
      setError("Enter a valid affiliate URL starting with https://")
      return
    }
    if (!niche) {
      setError("Pick a niche first.")
      return
    }
    if (!kitName.trim()) {
      setError("Add a name for this kit so we can save it in your library.")
      return
    }

    setError("")
    setArticleError("")
    setPostsError("")
    setVideos([])
    setArticle(null)
    setPosts([])
    setStage("videos")

    let ctx = { productName: "", productContext: "", niche }
    let nextVideos: DfyVideoResult[] = []

    try {
      const response = await fetch("/api/premium/dfy-profit/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateUrl, niche, offerName: offerName || undefined }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Video search failed")

      nextVideos = data.videos
      setVideos(data.videos)
      ctx = { productName: data.productName, productContext: data.productContext, niche: data.niche }
      setContext(ctx)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Video search failed")
      setStage("idle")
      return
    }

    setStage("article")
    let nextArticle: DfyArticleResult | null = null
    let articleUrl: string | null = null
    try {
      const result = await runArticle(ctx)
      nextArticle = result
      setArticle(result)
      articleUrl = result.url
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    }

    setStage("posts")
    let nextPosts: DfyFacebookPost[] = []
    let nextUsedFallbackLink = false
    try {
      const result = await runPosts({ productName: ctx.productName, niche: ctx.niche }, articleUrl)
      nextPosts = result.posts
      nextUsedFallbackLink = result.usedFallbackLink
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    }

    setStage("done")
    await persistKit(nextVideos, nextArticle, nextPosts, ctx, nextUsedFallbackLink)
  }

  const handleRetryArticle = async () => {
    setArticleError("")
    setRetryingArticle(true)
    try {
      const result = await runArticle(context)
      setArticle(result)
      await persistKit(videos, result, posts, context, usedFallbackLink)
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed")
    } finally {
      setRetryingArticle(false)
    }
  }

  const handleRetryPosts = async () => {
    setPostsError("")
    setRetryingPosts(true)
    try {
      const result = await runPosts(
        { productName: context.productName, niche: context.niche },
        article?.url ?? null,
      )
      setPosts(result.posts)
      setUsedFallbackLink(result.usedFallbackLink)
      await persistKit(videos, article, result.posts, context, result.usedFallbackLink)
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed")
    } finally {
      setRetryingPosts(false)
    }
  }

  return (
    <PremiumPageLayout
      title="Done-For-You Profit"
      subtitle="Paste your affiliate link, pick a niche, and get 5 videos to comment on, an authority article, and Facebook posts in one run."
    >
      <PremiumVideoTutorial
        premiumKey="dfyProfit"
        vimeoId={getPremiumTrainingVimeoId("dfyProfit")}
        title={`${PREMIUM_FEATURE_LABELS.dfyProfit} Training`}
        description="Watch how to paste your affiliate link, pick a niche, and generate 5 comment-ready videos, a hosted authority article, and Facebook posts in one run."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.dfyProfit} training video`}
      />

      <PremiumFeatureBanner
        icon={Package}
        kicker="Promo kit"
        title="One link, one niche"
        description="Generate 5 comment-ready videos, a hosted authority article, and Facebook posts in a single run."
        chip="Done-for-you"
      />

      <PremiumSteps title="How to Use This (3 Simple Steps)" steps={STEPS} />

      <SavedGenerationsLibrary
        title="Saved kits"
        subtitle="Each generation is saved under the kit name you enter. Same name updates that kit."
        emptyTitle="No saved kits yet"
        emptyHint="Generate a kit with a name to start your library."
        sets={librarySets}
        libraryOpen={libraryOpen}
        onLibraryOpenChange={setLibraryOpen}
        openSetId={openLibraryId}
        onOpenSetIdChange={(id) => {
          setOpenLibraryId(id)
          if (id) {
            const match = librarySets.find((set) => set.id === id)
            if (match) restoreSet(match)
          }
        }}
        deletingId={deletingId}
        error={libraryError}
        onDelete={(id) => void handleDeleteSet(id)}
        metaForSet={(set) =>
          `${set.niche || "Kit"} · ${summarizeDfyKit(set.payload)} · ${new Date(set.updatedAt).toLocaleDateString()}`
        }
        renderSet={(set) => {
          const kit = parseDfySavedKit(set.payload)
          return (
            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => restoreSet(set)}
                className={cn("h-10 w-full text-sm", primaryCtaClass)}
              >
                Open this kit
              </Button>
              {kit.posts.map((post, index) => {
                const copyKey = `${set.id}-${post.id}`
                const itemKey = postUsedKey(post.id)
                const isUsed = Boolean(set.usedKeys[itemKey])
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
                      {isUsed ? <UsedBadge /> : null}
                    </div>
                    <p className={cn("whitespace-pre-wrap text-sm leading-relaxed text-ink", isUsed && "text-ink-3")}>
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
                      <MarkAsUsedButton
                        used={isUsed}
                        marking={markingKey === itemKey}
                        onClick={() => void handleMarkUsed(itemKey, set.id)}
                      />
                    </div>
                  </div>
                )
              })}
              {kit.videos.map((video) => (
                <div key={video.videoId} className="rounded-xl border border-[var(--ds-line)] bg-card p-4">
                  <p className="truncate text-sm font-semibold text-ink">{video.title}</p>
                  <p className="mt-0.5 truncate text-xs text-text-secondary">{video.channelTitle}</p>
                  <div className="mt-3 space-y-2">
                    {video.comments.map((comment, index) => {
                      const itemKey = commentUsedKey(video.videoId, index)
                      const isUsed = Boolean(set.usedKeys[itemKey])
                      const copyKey = `${set.id}-${itemKey}`
                      return (
                        <div
                          key={itemKey}
                          className={cn(
                            "rounded-lg border border-[var(--ds-line)] p-3",
                            isUsed && "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)]/40",
                          )}
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-sapphire-700">
                              Comment {index + 1}
                            </span>
                            {isUsed ? <UsedBadge /> : null}
                          </div>
                          <p className={cn("text-sm leading-relaxed text-ink", isUsed && "text-ink-3")}>{comment}</p>
                          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <Button
                              type="button"
                              onClick={() => handleCopy(copyKey, comment)}
                              className={cn(
                                "h-10 flex-1 text-sm",
                                copiedId === copyKey
                                  ? "rounded-xl bg-sapphire-500 font-medium text-white hover:bg-sapphire-500"
                                  : primaryCtaClass,
                              )}
                            >
                              {copiedId === copyKey ? "Copied" : "Copy"}
                            </Button>
                            <MarkAsUsedButton
                              used={isUsed}
                              marking={markingKey === itemKey}
                              onClick={() => void handleMarkUsed(itemKey, set.id)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        }}
      />

      <PremiumControlCard
        icon={Wallet}
        title="Generate your kit"
        description="One click creates 5 comment-ready videos, a hosted authority article, and Facebook posts."
      >
          <div className="space-y-2">
            <span className="block text-sm font-medium text-foreground">Affiliate link</span>
            {savedLinks.length > 0 ? (
              <SavedLinksPicker
                links={savedLinks}
                selectedId={selectedLinkId}
                onSelect={(link) => {
                  setSelectedLinkId(link.id)
                  setAffiliateUrl(link.affiliate_url)
                  setOfferName(link.offer_name)
                  setError("")
                }}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                No saved links yet. Paste a link below or{" "}
                <Link href="/share" className="font-medium text-sapphire-700 underline-offset-4 hover:underline">
                  open Link Vault
                </Link>
                .
              </p>
            )}
            <Input
              id="dfy-profit-affiliate-link"
              type="url"
              value={affiliateUrl}
              onChange={(event) => {
                setAffiliateUrl(event.target.value)
                setSelectedLinkId(null)
                setOfferName("")
                setError("")
              }}
              placeholder="https://..."
              disabled={generating}
              className="rounded-3xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dfy-profit-kit-name">Kit name</Label>
            <Input
              id="dfy-profit-kit-name"
              value={kitName}
              onChange={(event) => {
                setNameTouched(true)
                setKitName(event.target.value)
                setError("")
              }}
              placeholder="e.g. Weight Loss offer"
              disabled={generating}
              className="rounded-3xl"
            />
            <p className="text-xs text-muted-foreground">
              Saved kits use this name. Generating again with the same name updates that kit.
            </p>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-foreground">2. Niche</legend>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--ds-line)] bg-surface-nested p-3">
              {NICHES.map((option) => {
                const selected = niche === option
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={generating}
                    aria-pressed={selected}
                    onClick={() => setNiche(option)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all disabled:opacity-50 ${
                      selected
                        ? "bg-grad-sapphire text-white shadow-sapphire"
                        : "border border-[var(--ds-line)] bg-card text-ink-3 hover:border-[var(--ds-line-sapphire)] hover:text-ink"
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.75} aria-hidden />}
                    {option}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <Button
            type="button"
            disabled={generating}
            onClick={() => void handleGenerate()}
            className="btn-primary inline-flex h-11 items-center gap-2"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Generating…" : videos.length > 0 ? "Generate another kit" : "Generate kit"}
          </Button>
      </PremiumControlCard>

      {generating && (
        <GenerationProgress
          label={STAGE_LABELS[stage as Exclude<Stage, "idle" | "done">]}
          offer="welcome"
        />
      )}

      <DfyResultPanel
        niche={context.niche || niche}
        videos={videos}
        article={article}
        posts={posts}
        articleError={articleError}
        postsError={postsError}
        usedFallbackLink={usedFallbackLink}
        isGeneratingArticle={stage === "article"}
        isGeneratingPosts={stage === "posts"}
        retryingArticle={retryingArticle}
        retryingPosts={retryingPosts}
        onRetryArticle={() => void handleRetryArticle()}
        onRetryPosts={() => void handleRetryPosts()}
        usedKeys={usedKeys}
        markingKey={markingKey}
        onMarkUsed={activeSetId ? (itemKey) => void handleMarkUsed(itemKey) : undefined}
      />

      <p className="pb-4 text-center text-sm text-muted-foreground">
        Hosted articles appear in My Vault. Individual results vary.
      </p>
    </PremiumPageLayout>
  )
}
