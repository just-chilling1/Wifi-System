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
  Zap,
  AlertTriangle,
  ArrowRight,
  Gem,
  Link2,
  Tag,
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
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import {
  PremiumControlCard,
  PremiumFeatureBanner,
  PremiumSteps,
} from "@/components/premium-feature-chrome"
import { PremiumPageLayout } from "@/components/premium-page-layout"
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

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium !text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:shadow-sapphire"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:text-sapphire-700 hover:shadow-hover"

function viralBarClass(score: number) {
  if (score >= 85) return "bg-gold-grad"
  if (score >= 60) return "bg-gradient-to-r from-sapphire-300 to-sapphire-500"
  return "bg-ink-6"
}

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
    <PremiumPageLayout
      title={PREMIUM_FEATURE_LABELS.dfyVault}
      subtitle={`${libraryCountLabel} Select your product once, then copy and paste comments on any video.`}
    >
      <PremiumVideoTutorial
        premiumKey="accelerator"
        vimeoId={getPremiumTrainingVimeoId("accelerator")}
        title={`${PREMIUM_FEATURE_LABELS.dfyVault} Training`}
        description="Watch how to browse pre-loaded viral videos, select your product once, and copy ready-made comments — all in under two minutes."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.dfyVault} training video`}
      />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
      <PremiumFeatureBanner
        icon={Gem}
        kicker="Comment vault"
        title="Ready-made viral videos"
        description="Lock your offer once. Every comment already includes the product name and your link."
        chip={videos.length > 0 ? `${videos.length} videos loaded` : "Library ready"}
      />

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
          return `${usedCount} comment${usedCount === 1 ? "" : "s"} used · ${new Date(set.updatedAt).toLocaleDateString()}`
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
                className={cn("h-10 w-full text-sm", primaryCtaClass)}
              >
                Open this generation
              </Button>
            </div>
          )
        }}
      />

      {!productSelected ? (
        <div className="space-y-6">
          <PremiumSteps title="Three steps to post" steps={UNLIMITED_STEPS} />

          <PremiumControlCard
            icon={Zap}
            title="Select your product"
            description="Your name and link drop into every ready-made comment."
            badge={
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide",
                  filledCount === 2
                    ? "bg-[var(--ds-offer-green-100)] text-sapphire-700"
                    : filledCount === 1
                      ? "bg-grad-sapphire text-white"
                      : "border border-warning/30 bg-warning-light text-warning",
                )}
              >
                {filledCount}/2 ready
              </span>
            }
          >
            <form onSubmit={handleSelectProduct} noValidate className="space-y-6">
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-nested">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        filledCount === 2 ? "bg-sapphire-500" : "bg-primary",
                      )}
                      style={{ width: `${(filledCount / 2) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4">
                      <Label
                        htmlFor="unlimited-product-name"
                        className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-3"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                          <Tag size={12} aria-hidden />
                        </span>
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
                        className="h-12 bg-card text-base"
                      />
                      {fieldErrors.productName ? (
                        <p className="mt-2 text-sm font-medium text-[#C53030]">{fieldErrors.productName}</p>
                      ) : (
                        <p className="mt-2 text-xs text-ink-4">Shown inside each comment as the offer name.</p>
                      )}
                    </div>
                    <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4">
                      <Label
                        htmlFor="unlimited-affiliate-link"
                        className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-3"
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                          <Link2 size={12} aria-hidden />
                        </span>
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
                        className="h-12 bg-card text-base"
                      />
                      {fieldErrors.productLink ? (
                        <p className="mt-2 text-sm font-medium text-[#C53030]">{fieldErrors.productLink}</p>
                      ) : (
                        <p className="mt-2 text-xs text-ink-4">Must start with https://</p>
                      )}
                    </div>
                  </div>

                  {productError && (
                    <Alert variant="destructive" className="border border-[#C53030]/40 bg-[#FDE4E4] text-[#C53030]">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="font-medium text-[#C53030]">{productError}</AlertDescription>
                    </Alert>
                  )}

                  {unlocking && (
                    <GenerationProgress
                      offer="welcome"
                      label={`Unlocking your ${PREMIUM_FEATURE_LABELS.dfyVault} library...`}
                    />
                  )}

                  <Button
                    type="submit"
                    disabled={unlocking}
                    className={cn("h-12 w-full text-base sm:h-14 sm:text-lg", primaryCtaClass)}
                  >
                    {unlocking ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Unlocking library…
                      </span>
                    ) : (
                      <>
                        Unlock {PREMIUM_FEATURE_LABELS.dfyVault} library
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
            </form>
          </PremiumControlCard>
        </div>
      ) : (
        <>
          <WelcomeOfferBanner />

          <div ref={libraryResultsRef} className="space-y-6">
            <div className="glass-card overflow-hidden p-0">
              <div className="border-b border-[var(--ds-line)] bg-sapphire-100 p-5 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                      <Check size={18} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-sapphire-700">
                        Offer locked
                      </p>
                      <p className="font-medium text-ink">{productName}</p>
                      <p className="max-w-xl truncate text-sm text-ink-3">{productLink}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setProductSelected(false)}
                    variant="outline"
                    className={cn("shrink-0", outlineCtaClass)}
                  >
                    Change product
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex gap-2 overflow-x-auto">
                  {niches.map((niche) => (
                    <Button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      variant={selectedNiche === niche ? "default" : "outline"}
                      className={`whitespace-nowrap font-medium ${
                        selectedNiche === niche
                          ? "bg-grad-sapphire !text-white hover:bg-grad-sapphire"
                          : outlineCtaClass
                      }`}
                    >
                      {niche === "all" ? "All Niches" : niche}
                    </Button>
                  ))}
              </div>
              <p className="mt-4 text-sm font-medium text-ink-3">
                Showing {displayedVideos.length} opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {displayedVideos.map((video) => {
                const watchUrl = `https://youtube.com/watch?v=${video.videoId}`
                const isHot = video.viralScore >= 85

                return (
                  <article
                    key={video.videoId}
                    className={cn(
                      "glass-card overflow-hidden p-0 transition-[border-color,box-shadow] duration-200 hover:border-[var(--ds-line-sapphire)]",
                      isHot && "accent-card",
                    )}
                  >
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      {video.thumbnailUrl ? (
                        <a
                          href={watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Watch ${video.title} on YouTube`}
                          className="group relative block aspect-[9/16] w-[5.75rem] shrink-0 self-start overflow-hidden rounded-[12px] bg-ink sm:w-[7rem]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={video.thumbnailUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                          <div className="video-thumb-scrim absolute inset-0" />
                          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                            <Youtube className="h-3 w-3" aria-hidden />
                            Short
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sapphire-700 opacity-90 shadow-md transition-transform duration-200 group-hover:scale-110">
                              <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
                            </span>
                          </span>
                        </a>
                      ) : null}

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-sapphire-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sapphire-700">
                            <Gem className="h-3 w-3" aria-hidden />
                            {video.niche}
                          </span>
                          {isHot ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold-200)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sapphire-700">
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
                            <Eye className="h-4 w-4 text-sapphire-700" aria-hidden />
                            {formatNumber(video.viewCount)}
                            <span className="font-medium text-text-muted">views</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                            <TrendingUp className="h-4 w-4 text-sapphire-700" aria-hidden />
                            {formatNumber(video.estimatedClicks)}
                            <span className="font-medium text-text-muted">est. clicks</span>
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                              <Flame className="h-3.5 w-3.5 text-sapphire-700" aria-hidden />
                              Viral score
                            </p>
                            <p className="text-xs font-bold tabular-nums text-ink">
                              {video.viralScore}
                              <span className="font-medium text-text-muted">/100</span>
                            </p>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-sapphire-200">
                            <div
                              className={cn(
                                "h-full rounded-full transition-[width] duration-500",
                                viralBarClass(video.viralScore),
                              )}
                              style={{ width: `${Math.min(100, Math.max(0, video.viralScore))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-[var(--ds-line-sapphire)] bg-[var(--ds-sapphire-100)] px-4 py-4 sm:px-5 sm:py-5">
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
                          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-500 focus-visible:ring-offset-2"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sapphire-700 shadow-sm">
                            <MessageSquare className="h-4 w-4" aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-ink sm:text-base">5 ready comments</p>
                            <p className="truncate text-xs font-medium text-text-secondary">
                              Personalized with your offer
                            </p>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 shrink-0 text-sapphire-700 transition-transform duration-200",
                              openCommentsByVideoId[video.videoId] && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </button>
                        <Button
                          asChild
                          size="sm"
                          className={cn("h-9 shrink-0 px-3 font-bold !text-white", primaryCtaClass)}
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
                                  "flex flex-col gap-2.5 rounded-xl border border-[var(--ds-line)] bg-white p-3 transition-colors hover:border-[var(--ds-line-sapphire)] sm:p-3.5",
                                  isUsed && "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)]/40",
                                )}
                              >
                                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[11px] font-bold text-sapphire-700">
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
                                    className={cn(
                                      "h-9 w-full shrink-0 rounded-lg px-3 font-bold transition-all sm:flex-1",
                                      copied
                                        ? "bg-[#16875c] text-white hover:bg-[#16875c]"
                                        : "bg-gradient-to-r from-primary to-primary-hover text-white hover:from-primary-hover hover:to-primary-hover",
                                    )}
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
    </PremiumPageLayout>
  )
}
