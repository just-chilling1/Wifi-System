"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, Copy, Trash2, Youtube, MessageSquare, AlertTriangle, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
interface PageActionsProps {
  pageId: string
  affiliateLink: string
  videoUrl?: string
  comments: string[]
  stacked?: boolean
}

export function PageActions({ pageId, affiliateLink, videoUrl, comments, stacked = false }: PageActionsProps) {
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const openTracked = useRef(false)
  const router = useRouter()

  const handleDelete = async () => {
    setConfirmOpen(false)
    setLoading(true)
    const supabase = createClient()

    await supabase.from("pages").delete().eq("id", pageId)

    router.refresh()
    setLoading(false)
  }

  const track = (endpoint: "track-open" | "track-click") => {
    fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId }),
    })
      .then(() => router.refresh())
      .catch(() => {})
  }

  const handleToggleComments = () => {
    const next = !expanded
    setExpanded(next)
    if (next && !openTracked.current) {
      openTracked.current = true
      track("track-open")
    }
  }

  const handleCopyOne = async (idx: number) => {
    const text = comments[idx]
    if (!text) return
    await navigator.clipboard.writeText(text)
    track("track-click")
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1200)
  }

  const handleCopyAll = async () => {
    if (comments.length === 0) return
    await navigator.clipboard.writeText(comments.join("\n\n"))
    track("track-click")
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1200)
  }

  return (
    <div className="space-y-3">
      <div
        className={
          stacked
            ? "flex flex-col gap-2"
            : "flex flex-col gap-2 sm:flex-row sm:items-center"
        }
      >
        <Button
          type="button"
          onClick={handleToggleComments}
          className="h-11 w-full rounded-xl border-2 border-transparent text-sm font-semibold text-white shadow-none sm:flex-1"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
          {expanded ? "Hide Comments" : "View Comments"}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-11 min-w-0 flex-1 rounded-xl border-2 border-[var(--ds-line-strong)] bg-white px-4 text-sm font-semibold shadow-none hover:border-sapphire-700 hover:bg-sapphire-100 hover:text-sapphire-700 hover:shadow-none sm:min-w-[9.5rem] sm:flex-none"
          >
            <a href={videoUrl || affiliateLink} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4" />
              Open Video
            </a>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            aria-label="Delete pack"
            className="h-11 w-11 shrink-0 rounded-xl border-2 border-[#C53030]/30 px-0 text-[#C53030] shadow-none hover:border-[#C53030] hover:bg-[#C53030]/15 hover:text-[#9B2C2C] hover:shadow-none"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2.5 rounded-xl border border-[var(--ds-line-sapphire)] bg-[var(--ds-sapphire-100)] p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="min-w-0 text-sm font-semibold leading-snug text-ink">
              {comments.length} comment{comments.length === 1 ? "" : "s"} — copy and paste on the video
            </p>
            <Button
              type="button"
              onClick={handleCopyAll}
              variant="outline"
              size="sm"
              className="h-8 w-full rounded-lg text-xs font-semibold sm:w-auto"
            >
              {copiedAll ? <Check className="h-3.5 w-3.5 text-[#16875c]" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedAll ? "Copied" : "Copy All"}
            </Button>
          </div>

          {comments.length === 0 ? (
            <p className="text-sm text-text-secondary">No comments found in this pack.</p>
          ) : (
            comments.map((comment, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2.5 rounded-xl border border-[var(--ds-line)] bg-white p-3 sm:flex-row sm:items-start"
              >
                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sapphire-200 text-[10px] font-bold text-sapphire-700">
                    {idx + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink">{comment}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => handleCopyOne(idx)}
                  size="sm"
                  className="h-8 w-full shrink-0 rounded-lg text-xs font-bold sm:w-auto"
                >
                  {copiedIdx === idx ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedIdx === idx ? "Copied" : "Copy"}
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="glass-strong border-2 border-[#C53030]/40 text-ink sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-ink">
              <AlertTriangle className="w-5 h-5 text-[#C53030]" />
              Delete this pack?
            </DialogTitle>
            <DialogDescription className="text-ink-4">
              This will permanently remove this comment pack. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
              className="glass border-2 border-[var(--border)] text-ink font-bold rounded-xl"
            >
              Keep It
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-[#C53030] hover:bg-[#9B2C2C] text-white font-black rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
