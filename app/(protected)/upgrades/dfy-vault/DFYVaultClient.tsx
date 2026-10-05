"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoHint } from "@/components/ui/info-hint"
import {
  Loader2,
  Youtube,
  Copy,
  Check,
  Eye,
  TrendingUp,
  Flame,
  AlertTriangle,
  Gem,
  Play,
  MessageSquare,
  ChevronDown,
} from "lucide-react"
import { fetchDFYLibrary, type DFYVideo } from "@/app/actions/fetch-dfy-library"
import {
  deletePremiumGenerationSet,
  markPremiumGenerationItemUsed,
  upsertPremiumGenerationSet,
  type PremiumGenerationSet,
} from "@/app/actions/premium-generation-sets"
import { GenerationProgress } from "@/components/generation-progress"
import { BonusTrainingCard } from "@/components/bonus-training-card"
import { PageHeader } from "@/components/page-header"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { SavedGenerationsLibrary } from "@/components/saved-generations-library"
import { MarkAsUsedButton, UsedBadge } from "@/components/mark-as-used-button"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { commentUsedKey } from "@/lib/generation-set-name"
import { cn } from "@/lib/utils"

const UNLIMITED_STEPS = [
  {
    num: "1",
    title: "Lock in your offer",
    desc: "Add the product name and money link once. Unlimited inserts them for you.",
  },
  {
    num: "2",
    title: "Browse ready videos",
    desc: "Open a vault of high-view Shorts already matched to popular niches.",
  },
  {
    num: "3",
    title: "Copy and post",
    desc: "Each video has 5 comments with your offer inside. Paste and go.",
  },
] as const

type FieldKey = "productName" | "productLink"
type FieldErrors = Partial<Record<FieldKey, string>>

export default function DFYVaultClient({
  initialSets = [],
}: {
  initialSets?: PremiumGenerationSet[]
}) {
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<DFYVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<DFYVideo[]>([])
  const [selectedNiche, setSelectedNiche] = useState<string>("all")

  const [productName, setProductName] = useState("")
  const [productLink, setProductLink] = useState("")
  const [productSelected, setProductSelected] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [productError, setProductError] = useState<string | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const prevUnlocking = useRef(false)

  const libraryResultsRef = useScrollToResults(prevUnlocking.current && !unlocking && productSelected)

  useEffect(() => {
    prevUnlocking.current = unlocking
  }, [unlocking])

  const [copiedComment, setCopiedComment] = useState<string | null>(null)
  const [openCommentsByVideoId, setOpenCommentsByVideoId] = useState<
    Record<string, boolean>
  >({})
  const [librarySets, setLibrarySets] = useState<PremiumGenerationSet[]>(initialSets)
  const [libraryOpen, setLibraryOpen] = useState(initialSets.length > 0)
  const [openLibraryId, setOpenLibraryId] = useState<string | null>(null)
  const [libraryError, setLibraryError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [markingKey, setMarkingKey] = useState<string | null>(null)
  const [activeSetId, setActiveSetId] = useState<string | null>(null)
  const [usedKeys, setUsedKeys] = useState<Record<string, string>>({})

  useEffect(() => {
    loadLibrary()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [selectedNiche, videos])

  const loadLibrary = async () => {
    setLoading(true)
    try {
      const library = await fetchDFYLibrary()
      setVideos(library)
      setFilteredVideos(library)
    } catch (error) {
      console.error("[dfy-vault] library load failed:", error)
      setVideos([])
      setFilteredVideos([])
    }
    setLoading(false)
  }

  const filterVideos = () => {
    let filtered = videos

    if (selectedNiche !== "all") {
      filtered = filtered.filter((v) => v.niche === selectedNiche)
    }

    setFilteredVideos(filtered)
  }

  const clearFieldError = (key: FieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validateProduct = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!productName.trim()) {
      next.productName = "Add the name of the product or offer you're promoting."
    }
    if (!productLink.trim()) {
      next.productLink = "Paste your affiliate link so it can go inside the comments."
    } else if (!isValidAffiliateUrl(productLink)) {
      next.productLink = "Use a full link that starts with https://"
    }
    return next
  }

  const persistProduct = async (name: string, link: string) => {
    const result = await upsertPremiumGenerationSet({
      feature: "dfy_vault",
      name,
      affiliateUrl: link,
      payload: { productName: name },
    })
    if (!result.success) {
      setLibraryError(result.error)
      return null
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
    return result.set
  }

  const restoreSet = (set: PremiumGenerationSet) => {
    const savedName =
      typeof set.payload.productName === "string" && set.payload.productName.trim()
        ? set.payload.productName
        : set.name
    setProductName(savedName)
    setProductLink(set.affiliateUrl)
    setFieldErrors({})
    setProductError(null)
    setProductSelected(true)
    setActiveSetId(set.id)
    setUsedKeys(set.usedKeys)
    setOpenLibraryId(set.id)
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
    setLibrarySets((prev) => prev.map((row) => (row.id === result.set.id ? result.set : row)))
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

  const handleSelectProduct = (event?: FormEvent) => {
    event?.preventDefault()
    const nextErrors = validateProduct()
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setProductError("Fill in the highlighted fields to continue.")
      return
    }
    setFieldErrors({})
    setProductError(null)
    setUnlocking(true)
    setTimeout(() => {
      setUnlocking(false)
      setProductSelected(true)
      void persistProduct(productName.trim(), productLink.trim())
    }, 4000)
  }

  const handleCopyComment = async (comment: string, videoId: string, index: number) => {
    const personalizedComment = comment
      .replace(/\[PRODUCT\]/g, productName)
      .replace(/\[LINK\]/g, productLink)

    await navigator.clipboard.writeText(personalizedComment)
    setCopiedComment(`${videoId}-${index}`)
    setTimeout(() => setCopiedComment(null), 2000)
  }

  const niches = ["all", ...Array.from(new Set(videos.map((v) => v.niche)))]
  const filledCount = [productName, productLink].filter((value) => value.trim()).length

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const displayedVideosRaw = filteredVideos
  const seenVideoIds = new Set<string>()
  const displayedVideos = displayedVideosRaw.filter((video) => {
    if (seenVideoIds.has(video.videoId)) return false
    seenVideoIds.add(video.videoId)
    return true
  })
  const libraryCountLabel =
    videos.length > 0
      ? `${videos.length} pre-loaded viral videos + 5 comments each.`
      : "Pre-loaded viral videos + 5 comments each."

  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Unlimited"
        title={PREMIUM_FEATURE_LABELS.dfyVault}
        subtitle={`${libraryCountLabel} Select your product once, then copy and paste comments on any video.`}
      />
      <PremiumVideoTutorial
        premiumKey="accelerator"
        vimeoId={getPremiumTrainingVimeoId("accelerator")}
        title={`${PREMIUM_FEATURE_LABELS.dfyVault} Training`}
        description="Watch how to browse pre-loaded viral videos, select your product once, and copy ready-made comments. It takes under two minutes."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.dfyVault} training video`}
      />

      {loading ? (
        <UnlimitedSkeleton />
      ) : (
        <>
      <SavedGenerationsLibrary
        title="Saved generations"
        subtitle="Each unlock is saved under your product name. Same name updates that set."
        emptyTitle="No saved generations yet"
        emptyHint="Unlock the library with a product name to start saving."
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
        metaForSet={(set) => {
          const usedCount = Object.keys(set.usedKeys).length
          return `${usedCount} comment${usedCount === 1 ? "" : "s"} used, ${new Date(set.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
        }}
        renderSet={(set) => {
          const usedCount = Object.keys(set.usedKeys).length
          return (
            <div className="space-y-3">
              <p className="text-sm text-ink">
                {typeof set.payload.productName === "string" ? set.payload.productName : set.name}
              </p>
              <p className="text-xs text-text-secondary">
                {usedCount} comment{usedCount === 1 ? "" : "s"} marked as used.
              </p>
              <Button
                type="button"
                onClick={() => restoreSet(set)}
                className="h-10 w-full text-sm"
              >
                Open this generation
              </Button>
            </div>
          )
        }}
      />

      {!productSelected ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
            <h2 className="ds-h3">Three steps to post</h2>
            <ol className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
              {UNLIMITED_STEPS.map((step) => (
                <li key={step.num} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-sm font-semibold tabular-nums text-[var(--link)]">
                    {step.num}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-3">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--layer-elevated)] px-4 py-5 sm:px-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">Select your product</h2>
              <p className="shrink-0 text-xs tabular-nums text-ink-4">{filledCount}/2 ready</p>
            </div>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-4">
              Your name and link drop into every ready-made comment.
            </p>
            <form onSubmit={handleSelectProduct} noValidate className="mt-6">
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor="unlimited-product-name"
                    className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-2"
                  >
                    Product name
                    <InfoHint label="The product or offer you're promoting. It gets dropped into every ready-made comment." />
                  </Label>
                  <Input
                    id="unlimited-product-name"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value)
                      clearFieldError("productName")
                    }}
                    placeholder="e.g., Keto Weight Loss System"
                    aria-invalid={Boolean(fieldErrors.productName)}
                    className="h-11 rounded-full bg-[var(--surface-nested)] px-5 text-sm shadow-none"
                  />
                  {fieldErrors.productName ? (
                    <p className="mt-1.5 text-sm text-danger">{fieldErrors.productName}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-ink-4">Shown inside each comment as the offer name.</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="unlimited-affiliate-link"
                    className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-2"
                  >
                    Affiliate link
                    <InfoHint label="Your personal sharing link. You earn a commission when someone buys through it." />
                  </Label>
                  <Input
                    id="unlimited-affiliate-link"
                    type="url"
                    value={productLink}
                    onChange={(e) => {
                      setProductLink(e.target.value)
                      clearFieldError("productLink")
                    }}
                    placeholder="https://digistore24.com/..."
                    aria-invalid={Boolean(fieldErrors.productLink)}
                    className="h-11 rounded-full bg-[var(--surface-nested)] px-5 text-sm shadow-none"
                  />
                  {fieldErrors.productLink ? (
                    <p className="mt-1.5 text-sm text-danger">{fieldErrors.productLink}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-ink-4">Must start with https://</p>
                  )}
                </div>
              </div>

              {productError && (
                <Alert variant="destructive" className="mt-5">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-medium text-danger">{productError}</AlertDescription>
                </Alert>
              )}

              {unlocking && (
                <div className="mt-5">
                  <GenerationProgress
                    label={`Unlocking your ${PREMIUM_FEATURE_LABELS.dfyVault} library...`}
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end border-t border-[var(--border-subtle)] pt-4">
                <Button
                  type="submit"
                  disabled={unlocking}
                  size="sm"
                  variant={filledCount === 2 ? "default" : "outline"}
                  className="w-full rounded-full px-5 shadow-none sm:w-auto"
                >
                  {unlocking ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Unlocking library…
                    </span>
                  ) : (
                    <>Unlock {PREMIUM_FEATURE_LABELS.dfyVault} library</>
                  )}
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        <>
          <BonusTrainingCard />

          <div ref={libraryResultsRef} className="space-y-6">
            <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-[var(--link)]">
                    <Check className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">Offer locked</p>
                    <p className="mt-0.5 truncate text-sm text-ink">{productName}</p>
                    <p className="max-w-xl truncate text-sm text-[var(--link)]">{productLink.replace(/^https?:\/\//, "")}</p>
                  </div>
                </div>
                <Button onClick={() => setProductSelected(false)} variant="outline" className="shrink-0">
                  Change product
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5">
              <div className="flex max-w-full flex-wrap gap-2">
                {niches.map((niche) => {
                  const active = selectedNiche === niche
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setSelectedNiche(niche)}
                      className={cn(
                        "inline-flex h-10 max-w-full items-center rounded-xl px-3.5 text-sm font-semibold transition-[background-color,border-color,color] duration-150",
                        active
                          ? "bg-primary text-[var(--brand-50)]"
                          : "border border-[var(--ds-line)] bg-[var(--surface-nested)] text-ink hover:border-[var(--border-brand)] hover:text-[var(--link)]",
                      )}
                    >
                      {niche === "all" ? "All niches" : niche}
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-sm text-ink-3">Showing {displayedVideos.length} opportunities</p>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {displayedVideos.map((video) => {
                const watchUrl = `https://youtube.com/watch?v=${video.videoId}`
                const isHot = video.viralScore >= 85

                return (
                  <article
                    key={video.videoId}
                    className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)]"
                  >
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      {video.thumbnailUrl ? (
                        <a
                          href={watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Watch ${video.title} on YouTube`}
                          className="group relative block aspect-[9/16] w-[5.75rem] shrink-0 self-start overflow-hidden rounded-xl bg-[var(--layer-canvas)] sm:w-[7rem]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={video.thumbnailUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                          <div className="video-thumb-scrim absolute inset-0" />
                          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-[color-mix(in_srgb,var(--layer-canvas)_78%,transparent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-50)]">
                            <Youtube className="h-3 w-3" aria-hidden />
                            Short
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[var(--brand-50)] shadow-[var(--shadow-brand)] transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
                              <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
                            </span>
                          </span>
                        </a>
                      ) : null}

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--link)]">
                            <Gem className="h-3 w-3" aria-hidden />
                            {video.niche}
                          </span>
                          {isHot ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--link)]">
                              <Flame className="h-3 w-3" aria-hidden />
                              Hot
                            </span>
                          ) : null}
                        </div>

                        <h3 className="ds-h4 line-clamp-2 text-[1.05rem] leading-snug sm:text-[1.1875rem]">
                          {video.title}
                        </h3>
                        <p className="mt-1 truncate text-sm font-medium text-text-secondary">
                          {video.channelTitle}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                            <Eye className="h-4 w-4 text-[var(--link)]" aria-hidden />
                            {formatNumber(video.viewCount)}
                            <span className="font-medium text-text-muted">views</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                            <TrendingUp className="h-4 w-4 text-[var(--link)]" aria-hidden />
                            {formatNumber(video.estimatedClicks)}
                            <span className="font-medium text-text-muted">est. clicks</span>
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                              <Flame className="h-3.5 w-3.5 text-[var(--link)]" aria-hidden />
                              Viral score
                            </p>
                            <p className="text-xs font-bold tabular-nums text-ink">
                              {video.viralScore}
                              <span className="font-medium text-text-muted">/100</span>
                            </p>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-nested)]">
                            <div
                              className="h-full rounded-full bg-primary transition-[width] duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, video.viralScore))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-[var(--ds-line)] bg-[var(--surface-nested)] px-4 py-4 sm:px-5">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenCommentsByVideoId((prev) => ({
                              ...prev,
                              [video.videoId]: !prev[video.videoId],
                            }))
                          }
                          aria-expanded={Boolean(openCommentsByVideoId[video.videoId])}
                          aria-controls={`dfy-comments-${video.videoId}`}
                          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--layer-elevated)] px-3.5 py-3 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link)] sm:px-4 sm:py-3.5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-nested)] text-[var(--link)]">
                            <MessageSquare className="h-4 w-4" aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-ink">5 ready comments</p>
                            <p className="truncate text-xs font-medium text-text-secondary">
                              Personalized with your offer
                            </p>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 shrink-0 text-[var(--link)] transition-transform duration-200",
                              openCommentsByVideoId[video.videoId] && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </button>
                        <Button
                          asChild
                          size="sm"
                          className="h-11 shrink-0 self-center rounded-full px-4 sm:px-5"
                        >
                          <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                            <Youtube className="h-4 w-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">Open Video</span>
                          </a>
                        </Button>
                      </div>

                      {openCommentsByVideoId[video.videoId] ? (
                        <div
                          id={`dfy-comments-${video.videoId}`}
                          className="space-y-2"
                        >
                          {video.commentTemplates.map((template, index) => {
                            const preview = template
                              .replace(/\[PRODUCT\]/g, productName)
                              .replace(/\[LINK\]/g, productLink)
                            const copied = copiedComment === `${video.videoId}-${index}`
                            const itemKey = commentUsedKey(video.videoId, index)
                            const isUsed = Boolean(usedKeys[itemKey])

                            return (
                              <div
                                key={index}
                                className={cn(
                                  "flex flex-col gap-2.5 rounded-xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] p-3 transition-colors hover:border-[var(--ds-line-sapphire)] sm:p-3.5",
                                  isUsed && "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)]/40",
                                )}
                              >
                                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[11px] font-semibold text-[var(--link)]">
                                    {index + 1}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                      {isUsed ? <UsedBadge /> : null}
                                    </div>
                                    <p
                                      className={cn(
                                        "line-clamp-2 min-w-0 text-sm font-medium leading-relaxed text-ink",
                                        isUsed && "text-ink-3",
                                      )}
                                    >
                                      {preview}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                  <Button
                                    type="button"
                                    onClick={() => handleCopyComment(template, video.videoId, index)}
                                    size="sm"
                                    className="h-9 w-full shrink-0 px-3 sm:flex-1"
                                  >
                                    {copied ? (
                                      <>
                                        <Check className="mr-1 h-3.5 w-3.5" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="mr-1 h-3.5 w-3.5" />
                                        Copy
                                      </>
                                    )}
                                  </Button>
                                  <MarkAsUsedButton
                                    used={isUsed}
                                    marking={markingKey === itemKey}
                                    disabled={!activeSetId}
                                    onClick={() => void handleMarkUsed(itemKey)}
                                    className="h-9 sm:flex-1"
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </>
      )}
        </>
      )}
    </div>
  )
}

function UnlimitedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-40 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
        ))}
      </div>
    </div>
  )
}
