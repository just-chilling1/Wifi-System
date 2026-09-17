"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Filter,
  FolderOpen,
  Loader2,
  BookOpen,
  ChevronDown,
  Link2,
  PencilLine,
  BookmarkCheck,
  X,
} from "lucide-react"
import type { AffiliateLink } from "@/app/actions/affiliate-links"
import {
  listHighTicketArticleUsage,
  toggleHighTicketArticleUsage,
} from "@/app/actions/high-ticket-article-usage"
import { GenerationProgress } from "@/components/generation-progress"
import {
  PremiumControlCard,
  PremiumFeatureBanner,
  PremiumSteps,
} from "@/components/premium-feature-chrome"
import { PremiumPageLayout } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import { wrapArticleWithTitle } from "@/lib/high-ticket-payouts/article-content"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import {
  ARTICLE_CATALOG,
  HIGH_TICKET_ARTICLE_TARGET_COUNT,
  HIGH_TICKET_NICHES,
  weaveAffiliateLink,
  type HighTicketArticle,
} from "@/lib/high-ticket-payouts/catalog"
import { replaceFeaturedImageUrl } from "@/lib/high-ticket-payouts/niche-images"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { cn } from "@/lib/utils"

const CrossPlatformGuide = dynamic(() =>
  import("@/components/cross-platform-guide").then((mod) => mod.CrossPlatformGuide),
)

const PAGE_SIZE = 24
const LINK_STORAGE_KEY = "wifi_code_high_ticket_link_id"
const PASTE_MODE = "__paste__"

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary"

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:shadow-sapphire"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium !text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:!text-sapphire-700 hover:shadow-hover"

const STEPS = [
  {
    num: "1",
    title: "Pick your offer link",
    desc: "Choose a saved Link Vault offer, or paste any affiliate URL. We weave it into every article automatically.",
  },
  {
    num: "2",
    title: "Preview an article",
    desc: "Filter by niche, open any of the 100 long-form templates, and confirm your link sits in the CTA.",
  },
  {
    num: "3",
    title: "Publish anywhere",
    desc: "Copy plain text for Medium / LinkedIn, or HTML for your blog. One article per week builds lasting traffic.",
  },
] as const

function formatAngle(angle: string): string {
  return angle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function truncateUrl(url: string, max = 48) {
  const trimmed = url.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

function OfferLinkPicker({
  links,
  selectedLinkId,
  onChange,
}: {
  links: AffiliateLink[]
  selectedLinkId: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = links.find((l) => l.id === selectedLinkId) ?? null
  const isPaste = selectedLinkId === PASTE_MODE

  useEffect(() => {
    if (!open) return
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  function choose(id: string) {
    onChange(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <Label id="offer-link-label" className={labelClassName}>
        Link Vault offer
      </Label>
      <button
        type="button"
        aria-labelledby="offer-link-label"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="offer-link-menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border bg-card px-3.5 py-3 text-left shadow-[var(--ds-shadow-card)] transition-colors",
          "hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          open ? "border-primary ring-2 ring-primary/20" : "border-[var(--ds-line)]",
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isPaste ? "bg-[var(--ds-offer-green-100)] text-sapphire-700" : "bg-sapphire-200 text-sapphire-700",
          )}
        >
          {isPaste ? <PencilLine className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
        </span>
        <span className="min-w-0 flex-1">
          {isPaste ? (
            <>
              <span className="block truncate text-sm font-semibold text-ink">Paste a link instead</span>
              <span className="mt-0.5 block truncate text-xs text-text-secondary">
                Enter any affiliate URL below
              </span>
            </>
          ) : selected ? (
            <>
              <span className="block truncate text-sm font-semibold text-ink">{selected.offer_name}</span>
              <span className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-text-secondary">
                {selected.niche ? (
                  <span className="shrink-0 rounded-full bg-surface-nested px-2 py-0.5 font-semibold text-ink">
                    {selected.niche}
                  </span>
                ) : null}
                <span className="truncate">{truncateUrl(selected.affiliate_url)}</span>
              </span>
            </>
          ) : (
            <span className="block text-sm font-semibold text-text-secondary">Choose an offer</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id="offer-link-menu"
          role="listbox"
          aria-labelledby="offer-link-label"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-[var(--ds-line)] bg-card p-1.5 shadow-[var(--ds-shadow-raised)]"
        >
          {links.map((link) => {
            const active = link.id === selectedLinkId
            return (
              <li key={link.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(link.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    active ? "bg-primary text-white" : "text-ink hover:bg-surface-nested",
                  )}
                >
                  <Link2
                    className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-white" : "text-sapphire-700")}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{link.offer_name}</span>
                    <span
                      className={cn(
                        "mt-0.5 flex min-w-0 items-center gap-2 text-xs",
                        active ? "text-white/80" : "text-text-secondary",
                      )}
                    >
                      {link.niche ? (
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 font-semibold",
                            active ? "bg-white/20 text-white" : "bg-surface-nested text-ink",
                          )}
                        >
                          {link.niche}
                        </span>
                      ) : null}
                      <span className="truncate">{truncateUrl(link.affiliate_url)}</span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
          <li className="mt-1 border-t border-[var(--ds-line)] pt-1" role="option" aria-selected={isPaste}>
            <button
              type="button"
              onClick={() => choose(PASTE_MODE)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                isPaste
                  ? "bg-sapphire-500 text-white"
                  : "text-sapphire-700 hover:bg-[var(--ds-offer-green-100)]",
              )}
            >
              <PencilLine className="h-4 w-4 shrink-0" aria-hidden />
              Paste a link instead…
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export function HighTicketPayoutsContent({ links }: { links: AffiliateLink[] }) {
  const [niche, setNiche] = useState("all")
  const [selectedLinkId, setSelectedLinkId] = useState("")
  const [pastedLink, setPastedLink] = useState("")
  const [previewId, setPreviewId] = useState<number | null>(null)
  const [articleHtml, setArticleHtml] = useState<Record<number, string>>({})
  const [loadingAction, setLoadingAction] = useState<{
    articleId: number
    action: "view" | "copy"
  } | null>(null)
  const [copiedMode, setCopiedMode] = useState<"text" | "html" | null>(null)
  const [copiedArticleId, setCopiedArticleId] = useState<number | null>(null)
  const [page, setPage] = useState(0)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [usedArticleIds, setUsedArticleIds] = useState<Set<number>>(new Set())
  const [usageLoading, setUsageLoading] = useState(false)
  const [togglingUsageId, setTogglingUsageId] = useState<number | null>(null)
  const [usageError, setUsageError] = useState("")

  const resultsRef = useScrollToResults(showResults && previewId != null)

  useEffect(() => {
    if (links.length === 0) return

    let fromStorage: string | null = null
    try {
      fromStorage = localStorage.getItem(LINK_STORAGE_KEY)
    } catch {
      /* ignore */
    }

    const preferred =
      fromStorage && links.some((l) => l.id === fromStorage) ? fromStorage : links[0].id
    setSelectedLinkId(preferred)
  }, [links])

  useEffect(() => {
    if (!selectedLinkId || selectedLinkId === PASTE_MODE) return
    try {
      localStorage.setItem(LINK_STORAGE_KEY, selectedLinkId)
    } catch {
      /* ignore */
    }
  }, [selectedLinkId])

  const selectedVaultLink = useMemo(
    () => links.find((l) => l.id === selectedLinkId) ?? null,
    [links, selectedLinkId],
  )

  const activeAffiliateUrl = useMemo(() => {
    if (selectedLinkId === PASTE_MODE) return pastedLink.trim()
    return selectedVaultLink?.affiliate_url.trim() ?? ""
  }, [pastedLink, selectedLinkId, selectedVaultLink])

  const usageLinkInput = useMemo(() => {
    if (selectedLinkId && selectedLinkId !== PASTE_MODE) {
      return { affiliateLinkId: selectedLinkId, affiliateUrl: null as string | null }
    }
    if (activeAffiliateUrl) {
      return { affiliateLinkId: null as string | null, affiliateUrl: activeAffiliateUrl }
    }
    return null
  }, [activeAffiliateUrl, selectedLinkId])

  useEffect(() => {
    let cancelled = false

    async function loadUsage() {
      if (!usageLinkInput) {
        setUsedArticleIds(new Set())
        setUsageError("")
        return
      }

      setUsageLoading(true)
      setUsageError("")
      const result = await listHighTicketArticleUsage(usageLinkInput)
      if (cancelled) return

      if (!result.success) {
        setUsedArticleIds(new Set())
        setUsageError(result.error)
        setUsageLoading(false)
        return
      }

      setUsedArticleIds(new Set(result.articleIds))
      setUsageLoading(false)
    }

    void loadUsage()
    return () => {
      cancelled = true
    }
  }, [usageLinkInput])

  const filteredArticles = useMemo(() => {
    if (niche === "all") return ARTICLE_CATALOG
    return ARTICLE_CATALOG.filter((a) => a.niche === niche)
  }, [niche])

  useEffect(() => {
    setPage(0)
    setPreviewId(null)
  }, [niche])

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE))
  const paged = useMemo(
    () => filteredArticles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filteredArticles, page],
  )

  const previewArticle =
    previewId != null ? (ARTICLE_CATALOG.find((a) => a.id === previewId) ?? null) : null

  const personalizeArticle = async (
    article: HighTicketArticle,
    action: "view" | "copy",
  ): Promise<string | null> => {
    if (!activeAffiliateUrl) {
      setError("Select a Link Vault offer or paste your affiliate link first.")
      return null
    }

    if (!isValidAffiliateUrl(activeAffiliateUrl)) {
      setError("Use a full link that starts with https://")
      return null
    }

    if (articleHtml[article.id]) {
      setError("")
      return articleHtml[article.id]
    }

    setLoadingAction({ articleId: article.id, action })
    setError("")
    setShowResults(false)

    await new Promise((resolve) => setTimeout(resolve, 1800))

    let woven = weaveAffiliateLink(article.html, activeAffiliateUrl)

    try {
      const res = await fetch("/api/premium/high-ticket-payouts/featured-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: article.niche, title: article.title }),
      })
      if (res.ok) {
        const data = (await res.json()) as { url?: string }
        if (typeof data.url === "string" && data.url.trim()) {
          woven = replaceFeaturedImageUrl(woven, data.url.trim())
        }
      }
    } catch {
      // Keep the niche-keyworded fallback already embedded in the catalog HTML.
    }

    setArticleHtml((prev) => ({ ...prev, [article.id]: woven }))
    setLoadingAction(null)
    setShowResults(true)
    return woven
  }

  const openPreview = async (articleId: number) => {
    if (previewId === articleId) {
      setPreviewId(null)
      return
    }
    const article = ARTICLE_CATALOG.find((a) => a.id === articleId)
    if (!article) return
    const html = await personalizeArticle(article, "view")
    if (html) setPreviewId(articleId)
  }

  const copyArticleFromCard = async (articleId: number) => {
    const article = ARTICLE_CATALOG.find((a) => a.id === articleId)
    if (!article) return
    const html = await personalizeArticle(article, "copy")
    if (!html) return

    const exportHtml = sanitizeArticleHtml(wrapArticleWithTitle(article.title, html))
    const payload = `${article.title}\n\n${htmlToPlainText(exportHtml)}`
    await navigator.clipboard.writeText(payload)
    setCopiedArticleId(articleId)
    setTimeout(() => setCopiedArticleId(null), 2000)
  }

  const copyArticle = async (mode: "text" | "html") => {
    if (previewId == null) return
    const html = articleHtml[previewId]
    const article = ARTICLE_CATALOG.find((a) => a.id === previewId)
    if (!html || !article) return

    const exportHtml = sanitizeArticleHtml(wrapArticleWithTitle(article.title, html))
    const payload =
      mode === "html" ? exportHtml : `${article.title}\n\n${htmlToPlainText(exportHtml)}`

    await navigator.clipboard.writeText(payload)
    setCopiedMode(mode)
    setTimeout(() => setCopiedMode(null), 2000)
  }

  const toggleUsed = async (articleId: number) => {
    if (!usageLinkInput) {
      setUsageError("Select a Link Vault offer or paste your affiliate link first.")
      return
    }

    const wasUsed = usedArticleIds.has(articleId)
    setUsageError("")
    setTogglingUsageId(articleId)
    setUsedArticleIds((prev) => {
      const next = new Set(prev)
      if (wasUsed) next.delete(articleId)
      else next.add(articleId)
      return next
    })

    const result = await toggleHighTicketArticleUsage({
      articleId,
      ...usageLinkInput,
    })

    setTogglingUsageId(null)

    if (!result.success) {
      setUsedArticleIds((prev) => {
        const next = new Set(prev)
        if (wasUsed) next.add(articleId)
        else next.delete(articleId)
        return next
      })
      setUsageError(result.error)
      return
    }

    setUsedArticleIds((prev) => {
      const next = new Set(prev)
      if (result.used) next.add(articleId)
      else next.delete(articleId)
      return next
    })
  }

  useEffect(() => {
    setArticleHtml({})
    setPreviewId(null)
  }, [activeAffiliateUrl])

  return (
    <PremiumPageLayout
      title={PREMIUM_FEATURE_LABELS.highTicketPayouts}
      subtitle={`${HIGH_TICKET_ARTICLE_TARGET_COUNT} long-form authority articles — pick a Link Vault offer, preview with your affiliate link woven in, and publish on Medium, LinkedIn, Quora, or your own blog.`}
      animate={false}
    >
      <PremiumVideoTutorial
        premiumKey="highTicketPayouts"
        vimeoId={getPremiumTrainingVimeoId("highTicketPayouts")}
        title={`${PREMIUM_FEATURE_LABELS.highTicketPayouts} Training`}
        description="A short walkthrough: pick a template, preview with your offer link inside, then publish on Medium, LinkedIn, or your blog."
        iframeTitle={`${PREMIUM_FEATURE_LABELS.highTicketPayouts} training video`}
      />

      <PremiumFeatureBanner
        icon={BookOpen}
        kicker="Authority library"
        title={`${HIGH_TICKET_ARTICLE_TARGET_COUNT} ready articles`}
        description="Weave your offer link into a long-form template, preview it, then copy plain text or HTML for Medium, LinkedIn, or your blog."
        chip="Publish anywhere"
      />

      <PremiumSteps title="Three steps to publish" steps={STEPS} />

      <PremiumControlCard
        icon={Link2}
        title="Select your offer link"
        description="Previews weave this URL into every article CTA. You can switch offers anytime."
      >
            {links.length === 0 && selectedLinkId !== PASTE_MODE ? (
              <div className="rounded-2xl border border-dashed border-[var(--ds-line)] bg-surface-nested/70 px-5 py-8 text-center">
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sapphire-700 shadow-sm">
                  <FolderOpen className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-semibold text-ink">No Link Vault offers yet</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  Save an offer in Link Vault first, or paste a link below.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Button asChild size="sm" className={cn("h-10 px-4", primaryCtaClass)}>
                    <Link href="/share">Open Link Vault</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn("h-10 px-4", outlineCtaClass)}
                    onClick={() => setSelectedLinkId(PASTE_MODE)}
                  >
                    Paste a link instead
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <OfferLinkPicker
                  links={links}
                  selectedLinkId={selectedLinkId}
                  onChange={setSelectedLinkId}
                />

                {selectedVaultLink && selectedLinkId !== PASTE_MODE ? (
                  <p
                    role="status"
                    className="flex w-full items-start gap-2.5 rounded-xl border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-3.5 py-2.5 text-sm font-medium text-sapphire-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                    <span>
                      Link armed from Link Vault
                      {selectedVaultLink.niche ? ` · ${selectedVaultLink.niche}` : ""}. Previews will
                      weave this URL into each article.
                    </span>
                  </p>
                ) : null}
              </>
            )}

            {(selectedLinkId === PASTE_MODE || links.length === 0) && (
              <div className="w-full rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4">
                <Label htmlFor="pasted-affiliate-link" className={labelClassName}>
                  Paste your affiliate link
                </Label>
                <Input
                  id="pasted-affiliate-link"
                  type="url"
                  placeholder="https://your-affiliate-link.com"
                  value={pastedLink}
                  onChange={(e) => {
                    setPastedLink(e.target.value)
                    if (selectedLinkId !== PASTE_MODE) setSelectedLinkId(PASTE_MODE)
                  }}
                  className="h-12 bg-card text-base text-ink"
                />
                {pastedLink.trim() ? (
                  <p
                    role="status"
                    className="mt-3 flex items-start gap-2.5 rounded-xl border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-3.5 py-2.5 text-sm font-medium text-sapphire-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                    <span>Link ready — previews will weave this URL into each article.</span>
                  </p>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    Must start with https://
                  </p>
                )}
              </div>
            )}

            <div>
              <p className={cn(labelClassName, "mb-3 flex items-center gap-2")}>
                <Filter className="h-3.5 w-3.5" aria-hidden />
                Filter by niche
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by niche">
                <button
                  type="button"
                  onClick={() => setNiche("all")}
                  aria-pressed={niche === "all"}
                  className={cn(
                    "h-auto min-h-10 px-3 py-2 text-left text-xs sm:px-4 sm:text-sm",
                    niche === "all" ? primaryCtaClass : outlineCtaClass,
                  )}
                >
                  All niches
                </button>
                {HIGH_TICKET_NICHES.map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setNiche(n)}
                    aria-pressed={niche === n}
                    className={cn(
                      "h-auto min-h-10 px-3 py-2 text-left text-xs sm:px-4 sm:text-sm",
                      niche === n ? primaryCtaClass : outlineCtaClass,
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                {error}
              </p>
            ) : null}
      </PremiumControlCard>

      <CrossPlatformGuide />

      {loadingAction ? (
        <GenerationProgress
          offer="welcome"
          label="Personalizing article with your affiliate link..."
        />
      ) : showResults ? (
        <WelcomeOfferBanner />
      ) : null}

      <AnimatePresence>
        {previewArticle && articleHtml[previewArticle.id] ? (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="scroll-mt-24 glass-card overflow-hidden p-0"
          >
            <div className="flex items-start justify-between gap-3 bg-grad-sapphire px-5 py-4 text-white md:px-6">
              <div className="min-w-0">
                <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-white/80">
                  {previewArticle.niche}
                </p>
                <h2 className="mt-1 text-lg font-medium leading-snug text-white">{previewArticle.title}</h2>
                <span className="mt-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[12px] font-medium text-white">
                  {formatAngle(previewArticle.angle)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewId(null)}
                className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="article-body max-h-[min(70vh,720px)] max-w-none overflow-y-auto bg-card px-5 py-6 md:px-8 md:py-8"
              onClick={(event) => {
                const target = event.target as HTMLElement | null
                const anchor = target?.closest?.("a[href^='#']") as HTMLAnchorElement | null
                if (!anchor) return
                const id = decodeURIComponent(anchor.getAttribute("href")?.slice(1) ?? "")
                if (!id) return
                const root = event.currentTarget
                const heading = root.querySelector(`#${CSS.escape(id)}`)
                if (!heading) return
                event.preventDefault()
                heading.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
              dangerouslySetInnerHTML={{
                __html: sanitizeArticleHtml(wrapArticleWithTitle(previewArticle.title, articleHtml[previewArticle.id])),
              }}
            />
            <div className="flex flex-wrap gap-2 border-t border-[var(--ds-line)] px-5 py-4 md:px-6">
              <Button
                type="button"
                onClick={() => void copyArticle("text")}
                variant="outline"
                className={cn("h-11 px-4", outlineCtaClass)}
              >
                {copiedMode === "text" ? (
                  <Check size={16} className="mr-2" />
                ) : (
                  <Copy size={16} className="mr-2" />
                )}
                {copiedMode === "text" ? "Copied" : "Copy plain text"}
              </Button>
              <Button type="button" onClick={() => void copyArticle("html")} className={cn("h-11 px-4", primaryCtaClass)}>
                {copiedMode === "html" ? (
                  <Check size={16} className="mr-2" />
                ) : (
                  <Copy size={16} className="mr-2" />
                )}
                {copiedMode === "html" ? "Copied" : "Copy HTML"}
              </Button>
              <Button
                type="button"
                disabled={!usageLinkInput || togglingUsageId === previewArticle.id || usageLoading}
                onClick={() => void toggleUsed(previewArticle.id)}
                variant={usedArticleIds.has(previewArticle.id) ? "default" : "outline"}
                className={cn(
                  "h-11 px-4 disabled:opacity-40",
                  usedArticleIds.has(previewArticle.id) ? primaryCtaClass : outlineCtaClass,
                )}
              >
                {togglingUsageId === previewArticle.id ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <BookmarkCheck size={16} className="mr-2" />
                )}
                {usedArticleIds.has(previewArticle.id) ? "Used" : "Mark as Used"}
              </Button>
            </div>
            {usageError ? (
              <p
                role="alert"
                className="border-t border-[#C53030]/20 bg-[#FDE4E4] px-5 py-2.5 text-sm font-medium text-[#C53030] md:px-6"
              >
                {usageError}
              </p>
            ) : null}
          </motion.section>
        ) : null}
      </AnimatePresence>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="page-eyebrow mb-1">Library</p>
            <h2 className="text-xl font-semibold text-ink sm:text-2xl">Authority articles</h2>
            <p className="mt-1 text-sm text-text-secondary">
              View a template with your link inside, then copy text or HTML to publish.
            </p>
          </div>
          <p className="rounded-full border border-[var(--ds-line)] bg-card px-3 py-1.5 text-sm font-semibold text-ink">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
            {niche !== "all" ? ` in ${niche}` : ""}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((article) => (
            <article
              key={article.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-5 shadow-[var(--ds-shadow-card)] transition-colors",
                previewId === article.id
                  ? "border-primary bg-sapphire-100"
                  : "border-[var(--ds-line)] hover:border-ink/30",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sapphire-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sapphire-700">
                    {article.niche}
                  </span>
                  <span className="rounded-full border border-[var(--ds-line)] bg-surface-nested px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                    {formatAngle(article.angle)}
                  </span>
                  {usedArticleIds.has(article.id) ? (
                    <span className="rounded-full bg-[var(--ds-offer-green-100)] px-2.5 py-0.5 text-[11px] font-semibold text-sapphire-700">
                      Used
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-ink">
                  {article.title}
                </h3>
                {article.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/80">
                    {article.excerpt}
                  </p>
                ) : null}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  disabled={loadingAction?.articleId === article.id || !activeAffiliateUrl}
                  onClick={() => void openPreview(article.id)}
                  variant="outline"
                  className={cn("h-10 flex-1 text-sm disabled:opacity-40", outlineCtaClass)}
                >
                  {loadingAction?.articleId === article.id && loadingAction.action === "view" ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Eye size={14} className="mr-1.5" />
                  )}
                  {previewId === article.id ? "Close" : "View"}
                </Button>
                <Button
                  type="button"
                  disabled={loadingAction?.articleId === article.id || !activeAffiliateUrl}
                  onClick={() => void copyArticleFromCard(article.id)}
                  className={cn("h-10 flex-1 text-sm disabled:opacity-40", primaryCtaClass)}
                >
                  {loadingAction?.articleId === article.id && loadingAction.action === "copy" ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : copiedArticleId === article.id ? (
                    <Check size={14} className="mr-1.5" />
                  ) : (
                    <Copy size={14} className="mr-1.5" />
                  )}
                  {copiedArticleId === article.id ? "Copied" : "Copy"}
                </Button>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--ds-line)] bg-card py-10 text-center text-sm text-text-secondary">
            No articles in this niche yet.
          </p>
        ) : null}

        {pageCount > 1 ? (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              variant="outline"
              className={cn("h-10 px-4 disabled:opacity-40", outlineCtaClass)}
            >
              <ChevronLeft size={14} className="mr-1" />
              Prev
            </Button>
            <span className="text-sm font-semibold text-ink">
              Page {page + 1} of {pageCount}
            </span>
            <Button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              variant="outline"
              className={cn("h-10 px-4 disabled:opacity-40", outlineCtaClass)}
            >
              Next
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        ) : null}
      </section>
    </PremiumPageLayout>
  )
}
