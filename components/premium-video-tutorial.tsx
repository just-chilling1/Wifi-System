"use client"

import { useState } from "react"
import { Clock, Play, Sparkles } from "lucide-react"
import { VideoOverlay } from "@/components/video-overlay"
import { getVideoThumbnail, type VideoThumbnailSlug } from "@/lib/video-thumbnails"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"
import {
  getPremiumHowToVideo,
  getPremiumTrainingThumbnail,
  type PremiumTrainingKey,
} from "@/lib/premium-training-videos"

interface PremiumVideoTutorialProps {
  vimeoId?: string
  premiumKey?: PremiumTrainingKey
  thumbnailSlug?: VideoThumbnailSlug
  title: string
  description: string
  iframeTitle: string
  thumbnailSrc?: string | null
}

/** Blackbox-shaped premium training video card (brass play control). */
export function PremiumVideoTutorial({
  vimeoId = "",
  premiumKey,
  thumbnailSlug,
  title,
  description,
  iframeTitle,
  thumbnailSrc,
}: PremiumVideoTutorialProps) {
  const [open, setOpen] = useState(false)
  const catalogVideo = premiumKey ? getPremiumHowToVideo(premiumKey) : undefined
  const resolvedVimeoId = vimeoId.trim() || catalogVideo?.vimeoId || ""
  const hasVideo = Boolean(resolvedVimeoId)
  const poster =
    thumbnailSrc ??
    (premiumKey ? getPremiumTrainingThumbnail(premiumKey) : null) ??
    getVideoThumbnail({ slug: thumbnailSlug ?? catalogVideo?.thumbnailSlug, vimeoId: resolvedVimeoId })

  const handlePlay = () => {
    if (hasVideo) setOpen(true)
  }

  return (
    <>
      <section className="glass-card overflow-hidden p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative bg-black/40 md:w-1/2">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <button
                type="button"
                onClick={handlePlay}
                disabled={!hasVideo}
                aria-label={hasVideo ? `Play ${iframeTitle}` : `${iframeTitle} — coming soon`}
                className="absolute inset-0 block w-full cursor-pointer text-left disabled:cursor-default"
              >
                {poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poster}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-burgundy-950 via-burgundy-800 to-burgundy-700" />
                )}
                <div className="video-thumb-scrim absolute inset-0" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-grad-sapphire text-white opacity-90 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105">
                    <Play className="ml-1 h-8 w-8 fill-current" />
                  </span>
                  {hasVideo ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                      ▶ Click to Play Video
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                      <Clock size={12} />
                      Training video coming soon
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2 md:p-10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-sapphire-700" strokeWidth={1.75} />
              <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-sapphire-700">
                Watch First
              </span>
            </div>
            <h2 className="text-2xl font-medium text-ink">{title}</h2>
            <p className="leading-relaxed text-ink-3">{description}</p>
          </div>
        </div>
      </section>

      {hasVideo && open ? (
        <VideoOverlay
          videoUrl={buildVimeoEmbedUrl(resolvedVimeoId)}
          title={title}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
