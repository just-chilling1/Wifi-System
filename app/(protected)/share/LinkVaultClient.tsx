"use client"

import { Fragment, useEffect, useState, useTransition } from "react"
import {
  AlertTriangle,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  Flame,
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
import { cn } from "@/lib/utils"

const EMPTY_STEPS = [
  { n: 1, title: "Save a money link", body: "Paste your DigiStore, ClickBank, or other affiliate URL." },
  { n: 2, title: "Name the offer", body: "Label it so you can pick the right one in Gold Rush." },
  { n: 3, title: "Drop it in comments", body: "Use the saved link when you generate a campaign." },
] as const

const USE_STEPS = [
  { n: 1, title: "Copy or pick", body: "Grab a saved URL, or choose it in Gold Rush instead of pasting." },
  { n: 2, title: "Generate comments", body: "Gold Rush writes comments with your money link already inside." },
  { n: 3, title: "Post and earn", body: "Drop a comment on a matching Short so traffic hits your offer." },
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-bold text-ink-4">Loading your links...</p>
        </div>
      </div>
    )
  }

  const isEmpty = links.length === 0
  const deletingLink = links.find((link) => link.id === deleteId)

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Money Link Storage"
        title="Link Vault"
        subtitle={
          <>
            Store your DigiStore, ClickBank, and affiliate links here. Use them in your comment campaigns.{" "}
            <InfoHint
              label="A money link is your affiliate URL — the personal web link you share. When someone buys through it, you earn a commission."
              side="bottom"
            />
          </>
        }
        actions={
          <Button size="lg" className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="h-5 w-5" />
            <span className="sm:hidden">Add Link</span>
            <span className="hidden sm:inline">Add New Affiliate Link</span>
          </Button>
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
              <Label htmlFor="vault-niche" className="font-bold text-ink">
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
              <Label htmlFor="vault-offer" className="font-bold text-ink">
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
            <Label htmlFor="vault-url" className="font-bold text-ink">
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
            <Label htmlFor="vault-notes" className="font-bold text-ink">
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

      {isEmpty && !isFormOpen ? (
        <EmptyVault onAdd={openCreate} />
      ) : null}

      {!isEmpty ? (
        <div className="space-y-5">
          <HowToUseStrip />
          <div className="space-y-5">
            {links.map((link, index) => {
              const copied = copiedId === link.id

              return (
              <Fragment key={link.id}>
                <article
                  className={cn(
                    "accent-card overflow-hidden rounded-2xl border border-[var(--ds-line-sapphire)] bg-[var(--ds-surface)]",
                    "shadow-[0_8px_24px_-10px_rgba(13,148,136,0.28)] transition-[border-color,box-shadow] duration-200",
                    "hover:border-sapphire-500/40 hover:shadow-[0_12px_28px_-10px_rgba(13,148,136,0.38)]",
                  )}
                >
                  <div className="bg-gradient-to-br from-[var(--ds-sapphire-100)] via-white to-[var(--ds-sapphire-100)]/40 p-5 sm:p-6">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sapphire-300 to-[#1d4ed8] text-white shadow-[var(--ds-shadow-sapphire)]">
                        <Link2 className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="ds-h3 truncate text-[1.25rem] sm:text-[1.375rem]">{link.offer_name}</h2>
                          <span className="inline-flex items-center rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Money link
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-ink-3">
                          Added {new Date(link.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {(link.niche || link.notes) ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {link.niche ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-line-sapphire)] bg-white/90 px-3 py-1 text-xs font-bold text-sapphire-700">
                            <Tag className="h-3 w-3" aria-hidden />
                            {link.niche}
                          </span>
                        ) : null}
                        {link.notes ? (
                          <span className="inline-flex items-center rounded-full border border-[var(--ds-line)] bg-white/70 px-3 py-1 text-xs font-semibold text-ink-4">
                            Has notes
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-4 rounded-xl border border-[var(--ds-line-sapphire)] bg-white p-2.5 shadow-sm sm:p-3">
                      <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-sapphire-700">
                        Affiliate URL
                      </p>
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                        <p className="min-w-0 flex-1 truncate rounded-lg bg-[var(--ds-surface-sub)] px-3 py-2.5 font-mono text-sm text-ink">
                          {link.affiliate_url}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => copyLink(link.affiliate_url, link.id)}
                          className={cn(
                            "h-10 shrink-0 rounded-lg px-4 font-bold shadow-sm sm:min-w-[7.5rem]",
                            copied
                              ? "bg-[#16875c] text-white hover:bg-[#16875c]"
                              : "bg-gradient-to-r from-primary to-primary-hover text-white hover:from-primary-hover hover:to-primary-hover",
                          )}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? "Copied" : "Copy link"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 border-t border-[var(--ds-line-sapphire)] bg-[var(--ds-surface-sub)] px-3 py-2 sm:px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.affiliate_url, "_blank", "noopener,noreferrer")}
                      className="h-9 font-semibold text-ink hover:bg-white hover:text-sapphire-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(link)}
                      className="h-9 font-semibold text-ink hover:bg-white hover:text-sapphire-700"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(link.id)}
                      className="h-9 font-semibold text-[#C53030] hover:bg-[#C53030]/10 hover:text-[#C53030]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </article>
                {(index + 1) % 2 === 0 ? <EarningsBanner size="compact" /> : null}
              </Fragment>
              )
            })}
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface)] p-4 shadow-card sm:px-5">
        <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-ink-4">
          <Flame className="h-4 w-4 text-sapphire-500" />
          Link Vault Pro Tips
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] p-4">
              <p className="text-sm font-semibold text-ink">{tip.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-3">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="glass-strong border-2 border-[#C53030]/40 text-ink sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-ink">
              <AlertTriangle className="h-5 w-5 text-[#C53030]" />
              Delete this link?
            </DialogTitle>
            <DialogDescription className="text-ink-4">
              {deletingLink
                ? `This will remove “${deletingLink.offer_name}” from Link Vault. Gold Rush won’t offer it as a saved link anymore.`
                : "This will permanently remove this affiliate link."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isPending}>
              Keep it
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-[#C53030] text-white hover:bg-[#9B2C2C]"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmptyVault({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="page-section-card px-6 py-10 text-center sm:px-10 sm:py-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-200">
        <Link2 className="h-8 w-8 text-sapphire-700" />
      </div>
      <h2 className="ds-h2">No affiliate links yet</h2>
      <p className="ds-subtitle mx-auto mt-2">
        Add your DigiStore or ClickBank links, then pick them in Gold Rush when you make comments.
      </p>

      <ol className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
        {EMPTY_STEPS.map((step) => (
          <li key={step.n} className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface-sub)] p-4">
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-200 text-sm font-bold text-sapphire-700">
              {step.n}
            </span>
            <p className="text-sm font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">{step.body}</p>
          </li>
        ))}
      </ol>

      <Button size="lg" className="mt-8" onClick={onAdd}>
        <Plus className="h-5 w-5" />
        Add your first link
      </Button>
    </section>
  )
}

function HowToUseStrip() {
  return (
    <section className="rounded-2xl border border-[var(--ds-line)] bg-[var(--ds-surface)] p-4 shadow-card sm:px-5">
      <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-4">How to use a saved link</p>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {USE_STEPS.map((step) => (
          <li key={step.n} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--ds-line-sapphire)] bg-sapphire-200 text-xs font-bold text-sapphire-700">
              {step.n}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="text-sm text-ink-3">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
