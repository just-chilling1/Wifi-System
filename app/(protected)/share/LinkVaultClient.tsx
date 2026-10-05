"use client"

import { Fragment, useEffect, useState, useTransition } from "react"
import {
  AlertTriangle,
  Calendar,
  Check,
  Copy,
  Edit2,
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  Tag,
  Trash2,
} from "lucide-react"

import {
  createAffiliateLink,
  deleteAffiliateLink,
  listAffiliateLinks,
  updateAffiliateLink,
  type AffiliateLink,
} from "@/app/actions/affiliate-links"
import { EarningsBanner } from "@/components/earnings-banner"
import { PageHeader } from "@/components/page-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InfoHint } from "@/components/ui/info-hint"

const EMPTY_STEPS = [
  { n: 1, title: "Save a money link", body: "Paste your DigiStore, ClickBank, or other affiliate URL." },
  { n: 2, title: "Name the offer", body: "Label it so you can pick the right one in Gold Rush." },
  { n: 3, title: "Drop it in comments", body: "Use the saved link when you generate a campaign." },
] as const

const USE_STEPS = [
  { n: 1, icon: Copy, title: "Copy or pick", body: "Grab a saved URL, or choose it in Gold Rush instead of pasting." },
  { n: 2, icon: Link2, title: "Generate comments", body: "Gold Rush writes comments with your money link already inside." },
  { n: 3, icon: ExternalLink, title: "Post and earn", body: "Drop a comment on a matching Short so traffic hits your offer." },
] as const

const TIPS = [
  { title: "Organize by niche", body: "Match your links to specific niches for better targeting." },
  { title: "Test multiple offers", body: "Try different products in the same niche to find winners." },
  { title: "Track your clicks", body: "Use a shortener with analytics so you know what converts." },
  { title: "Aim higher ticket", body: "Offers $100+ usually mean more serious commissions." },
] as const

const emptyForm = {
  niche: "",
  offerName: "",
  affiliateLink: "",
  notes: "",
}

function formatAdded(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function LinkVaultClient() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isPending, startTransition] = useTransition()

  const loadLinks = async () => {
    const result = await listAffiliateLinks()
    if (result.success) {
      setLinks(result.links)
      setError(null)
    } else {
      setError(result.error)
      setLinks([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadLinks()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
    setError(null)
  }

  const openEdit = (link: AffiliateLink) => {
    setEditingId(link.id)
    setForm({
      niche: link.niche ?? "",
      offerName: link.offer_name,
      affiliateLink: link.affiliate_url,
      notes: link.notes ?? "",
    })
    setIsFormOpen(true)
    setError(null)
  }

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const payload = {
        offerName: form.offerName,
        affiliateUrl: form.affiliateLink,
        niche: form.niche,
        notes: form.notes,
      }
      const result = editingId
        ? await updateAffiliateLink(editingId, payload)
        : await createAffiliateLink(payload)

      if (!result.success) {
        setError(result.error)
        return
      }

      setLinks((current) => {
        if (editingId) {
          return current.map((link) => (link.id === result.link.id ? result.link : link))
        }
        return [result.link, ...current]
      })
      resetForm()
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    const id = deleteId
    setDeleteId(null)
    startTransition(async () => {
      const result = await deleteAffiliateLink(id)
      if (!result.success) {
        setError(result.error)
        return
      }
      setLinks((current) => current.filter((link) => link.id !== id))
      if (editingId === id) resetForm()
    })
  }

  const copyLink = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return <ShareSkeleton />
  }

  const isEmpty = links.length === 0
  const deletingLink = links.find((link) => link.id === deleteId)

  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <PageHeader
        eyebrow="Money Link Storage"
        title="Link Vault"
        subtitle={
          <>
            Store your DigiStore, ClickBank, and affiliate links here. Use them in your comment campaigns.{" "}
            <InfoHint
              label="A money link is your affiliate URL, the personal web link you share. When someone buys through it, you earn a commission."
              side="bottom"
            />
          </>
        }
        actions={
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
            {!isEmpty ? (
              <p className="inline-flex items-baseline justify-center gap-2 self-start rounded-full border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-1.5 sm:self-end">
                <span className="font-heading text-[1.65rem] font-medium leading-none tabular-nums text-ink">
                  {links.length}
                </span>
                <span className="text-sm text-ink-3">{links.length === 1 ? "link saved" : "links saved"}</span>
              </p>
            ) : null}
            <Button size="lg" className="w-full sm:w-auto" onClick={openCreate}>
              <Plus className="h-5 w-5" />
              <span className="sm:hidden">Add Link</span>
              <span className="hidden sm:inline">Add New Affiliate Link</span>
            </Button>
          </div>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isFormOpen ? (
        <section className="page-section-card">
          <h2 className="ds-h3">{editingId ? "Edit your money link" : "Add your money link"}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vault-niche" className="text-sm font-semibold text-ink">
                Niche / category
              </Label>
              <Input
                id="vault-niche"
                value={form.niche}
                onChange={(event) => setForm((current) => ({ ...current, niche: event.target.value }))}
                placeholder="e.g., Weight Loss, Make Money, Dating"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vault-offer" className="text-sm font-semibold text-ink">
                Offer name
              </Label>
              <Input
                id="vault-offer"
                value={form.offerName}
                onChange={(event) => setForm((current) => ({ ...current, offerName: event.target.value }))}
                placeholder="e.g., Ultimate Weight Loss System"
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-url" className="text-sm font-semibold text-ink">
              Your affiliate link
            </Label>
            <Input
              id="vault-url"
              type="url"
              value={form.affiliateLink}
              onChange={(event) => setForm((current) => ({ ...current, affiliateLink: event.target.value }))}
              placeholder="https://hop.clickbank.net/... or https://digistore24.com/..."
              className="h-12 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vault-notes" className="text-sm font-semibold text-ink">
              Notes (optional)
            </Label>
            <Textarea
              id="vault-notes"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Commission rate, target audience, best performing platform, etc."
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Save changes" : "Save link"}
            </Button>
            <Button variant="outline" onClick={resetForm} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </section>
      ) : null}

      {isEmpty && !isFormOpen ? <EmptyVault /> : null}

      {!isEmpty ? (
        <div className="flex flex-col gap-5">
          <HowToUseStrip />
          <div className="flex flex-col gap-4">
            {links.map((link, index) => {
              const copied = copiedId === link.id

              return (
                <Fragment key={link.id}>
                  <article className="page-section-card">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-[var(--link)]">
                        <Link2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="ds-h3 truncate">{link.offer_name}</h2>
                        {link.niche ? (
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-3">
                            <Tag className="h-3.5 w-3.5 shrink-0 text-ink-4" aria-hidden />
                            <span className="truncate">{link.niche}</span>
                          </p>
                        ) : null}
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--link)]">
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{link.affiliate_url.replace(/^https?:\/\//, "")}</span>
                        </p>
                        {link.notes ? (
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-3">{link.notes}</p>
                        ) : null}
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-4">
                          <Calendar className="h-3.5 w-3.5" aria-hidden />
                          <time dateTime={link.created_at}>{formatAdded(link.created_at)}</time>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button className="h-11 w-full sm:flex-1" onClick={() => copyLink(link.affiliate_url, link.id)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy link"}
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="h-11 min-w-0 flex-1 px-4 sm:flex-none"
                          onClick={() => window.open(link.affiliate_url, "_blank", "noopener,noreferrer")}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 min-w-0 flex-1 px-4 sm:flex-none"
                          onClick={() => openEdit(link)}
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDeleteId(link.id)}
                          aria-label="Delete link"
                          className="h-11 w-11 shrink-0 px-0 text-[var(--danger)] hover:border-[var(--destructive)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </article>
                  {(index + 1) % 2 === 0 ? <EarningsBanner size="compact" /> : null}
                </Fragment>
              )
            })}
          </div>
          <TipsSection />
        </div>
      ) : null}

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-ink">
              <AlertTriangle className="h-5 w-5 text-[var(--danger)]" />
              Delete this link?
            </DialogTitle>
            <DialogDescription className="text-ink-3">
              {deletingLink
                ? `This will remove "${deletingLink.offer_name}" from Link Vault. Gold Rush will not offer it as a saved link anymore.`
                : "This will permanently remove this affiliate link."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isPending}>
              Keep it
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyVault() {
  return (
    <section className="page-section-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] text-[var(--link)]">
        <Link2 className="h-6 w-6" aria-hidden />
      </div>
      <div className="max-w-xl">
        <h2 className="ds-h2">No affiliate links yet</h2>
        <p className="ds-subtitle mt-2">
          Add your DigiStore or ClickBank links, then pick them in Gold Rush when you make comments.
        </p>
      </div>
      <ol className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {EMPTY_STEPS.map((step) => (
          <li key={step.n} className="rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] p-4">
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

function HowToUseStrip() {
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

function TipsSection() {
  return (
    <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] px-4 py-4 sm:px-5 sm:py-5">
      <h2 className="ds-h3">Link Vault tips</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {TIPS.map((tip) => (
          <li key={tip.title} className="rounded-xl border border-[var(--ds-line)] bg-[var(--surface-nested)] p-4">
            <p className="text-sm font-semibold text-ink">{tip.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">{tip.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ShareSkeleton() {
  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-28 animate-pulse rounded bg-[var(--surface-hover)]" />
          <div className="h-10 w-48 max-w-full animate-pulse rounded-lg bg-[var(--surface-hover)]" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded bg-[var(--surface)]" />
        </div>
        <div className="h-12 w-52 animate-pulse rounded-xl bg-[var(--surface-hover)]" />
      </div>
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-[var(--layer-elevated)]" />
        ))}
      </div>
    </div>
  )
}
