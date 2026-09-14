"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { ArrowRight, Check, X } from "lucide-react"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"

import { usePromoLinks } from "@/context/PromoLinksContext"

/** Turn a YouTube or Vimeo link into an embeddable, autoplaying URL. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)

    if (u.hostname === "player.vimeo.com" || /(^|\.)vimeo\.com$/.test(u.hostname)) {
      const id =
        u.hostname === "player.vimeo.com"
          ? u.pathname.split("/").filter(Boolean).pop()
          : u.pathname.split("/").filter(Boolean)[0]
      if (!id) return null
      return `${buildVimeoEmbedUrl(id)}&autoplay=1`
    }

    if (/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(u.hostname)) {
      let id = ""
      if (u.hostname.includes("youtu.be")) {
        id = u.pathname.split("/")[1] || ""
      } else if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2] || ""
      } else {
        id = u.searchParams.get("v") || ""
      }
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
    }

    return null
  } catch {
    return null
  }
}

interface VideoOverlayProps {
  videoUrl: string
  title?: string
  onClose: () => void
}

/**
 * Full-screen video player with Account Verified / Withdraw ad under the player.
 * Flex column: header + ad are shrink-0; video absorbs leftover height so the
 * ad is always fully visible without scrolling.
 */
export function VideoOverlay({ videoUrl, title, onClose }: VideoOverlayProps) {
  const { settings } = usePromoLinks()
  const withdrawUrl = settings.videoWithdrawUrl
  const embedUrl = toEmbedUrl(videoUrl)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-3 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Video player"}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="relative flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-none border-0 border-[var(--border)] sm:h-[min(92dvh,56rem)] sm:rounded-2xl sm:border"
        style={{
          backgroundColor: "rgba(5, 10, 8, 0.92)",
          boxShadow: "0 0 0 1px rgba(0,163,108,0.10) inset, 0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div
          className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <p className="flex-1 truncate text-sm font-bold text-white">{title || "Now Playing"}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative min-h-0 w-full flex-1 bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title || "Video"}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20"
              >
                Open video in a new tab
              </a>
            </div>
          )}
        </div>

        <div
          className="relative flex-shrink-0 overflow-hidden border-t border-emerald-400/15 px-5 py-4 sm:px-6"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="banner-blob-left pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#00a36c]/30 blur-3xl" />
          <div className="banner-blob-right pointer-events-none absolute -right-14 -bottom-24 h-52 w-52 rounded-full bg-[#22d38b]/25 blur-3xl" />
          <div className="ad-emerald-pulse pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00a36c]/[0.12] via-transparent to-[#22d38b]/[0.12]" />
          <div className="ad-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <div className="flex flex-1 items-center gap-4">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#00a36c", boxShadow: "0 0 22px rgba(0,163,108,0.45)" }}
              >
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#22d38b]">
                  Account Verified
                </p>
                <p className="mt-1 text-base font-semibold leading-snug text-white">
                  Congratulations! You&apos;re eligible to withdraw{" "}
                  <span className="font-extrabold text-[#22d38b]">$416.34</span>
                </p>
                <p className="mt-0.5 text-xs font-medium text-emerald-100/55">
                  Available balance from your activity
                </p>
              </div>
            </div>
            <a
              href={withdrawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ad-cta-glow flex h-12 w-full flex-shrink-0 items-center justify-center gap-2 rounded-full bg-[#00a36c] px-7 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#03b879] active:translate-y-0 sm:w-auto"
            >
              Withdraw Now
              <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
