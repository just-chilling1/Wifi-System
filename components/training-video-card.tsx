"use client"

import { useState } from "react"
import { Brain, Clock } from "lucide-react"
import { TrainingVideo } from "@/components/training-video"
import { VideoOverlay } from "@/components/video-overlay"
import { getVideoThumbnail, type VideoThumbnailSlug } from "@/lib/video-thumbnails"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"

export type TrainingCardVideo = {
  id: string
  title: string
  description: string
  duration?: string
  badge?: string
  step?: number
  thumbnailSlug?: VideoThumbnailSlug
}

export function TrainingVideoCard({
  video,
  featured = false,
}: {
  video: TrainingCardVideo
  featured?: boolean
}) {
  const [open, setOpen] = useState(false)
  const hasVideo = Boolean(video.id.trim())
  const thumbnail = getVideoThumbnail({ slug: video.thumbnailSlug, vimeoId: video.id })

  const headerIcon =
    video.badge === "Mindset" ? (
      <Brain className="h-3.5 w-3.5 shrink-0" aria-hidden />
    ) : video.step != null ? (
      video.step
    ) : video.badge ? (
      <span className="text-[11px] font-bold uppercase leading-none">{video.badge.charAt(0)}</span>
    ) : null

  return (
    <>
      <article
        className={
          featured
            ? "surface-media grid gap-6 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)] lg:items-end lg:p-5"
            : "flex h-full flex-col gap-4 rounded-2xl border border-[var(--ds-line)] bg-[var(--layer-elevated)] p-3 sm:p-4"
        }
      >
        <TrainingVideo
          title={video.title}
          thumbnailSrc={thumbnail}
          onPlay={() => {
            if (hasVideo) setOpen(true)
          }}
          caption={hasVideo ? "Play" : "Video coming soon"}
        />

        <div className={featured ? "flex flex-col gap-3 px-1 pb-2 lg:px-2 lg:pb-4" : "flex flex-1 flex-col gap-2 px-1"}>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-xs font-semibold tabular-nums text-[var(--link)]">
              {headerIcon}
            </span>
            {video.badge ? <span className="text-xs font-medium text-[var(--link)]">{video.badge}</span> : null}
          </div>
          <h3 className={featured ? "type-heading-xl" : "type-heading-md"}>{video.title}</h3>
          <p className="type-body-sm">{video.description}</p>
          {video.duration ? (
            <p className="type-caption flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {video.duration}
            </p>
          ) : null}
        </div>
      </article>

      {hasVideo && open ? (
        <VideoOverlay
          videoUrl={buildVimeoEmbedUrl(video.id)}
          title={video.title}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
