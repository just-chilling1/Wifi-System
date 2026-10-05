"use client"

import { useState } from "react"
import { Clock, Play } from "lucide-react"
import { VideoOverlay } from "@/components/video-overlay"
import { buildVimeoEmbedUrl } from "@/lib/vimeo"
import { getVideoThumbnail } from "@/lib/video-thumbnails"
import { cn } from "@/lib/utils"
import {
  isPlayableVimeoId,
  type DashboardTrainingVideo,
} from "@/lib/dashboard-training-videos"

type Props = {
  video: DashboardTrainingVideo
}

export function DashboardVideoCard({ video }: Props) {
  const [playing, setPlaying] = useState(false)
  const canPlay = isPlayableVimeoId(video.id)
  const thumbnail = getVideoThumbnail({ slug: video.thumbnailSlug, vimeoId: video.id })

  return (
    <>
      <article
        className={cn(
          "glass-card overflow-hidden transition-[border-color,box-shadow] duration-200",
          "hover:border-[var(--ds-line-sapphire)]",
          video.priority && "accent-card",
        )}
      >
        <div className="px-5 pb-4 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {video.priority ? (
              <span className="inline-flex items-center rounded-full bg-sapphire-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sapphire-700">
                Start here
              </span>
            ) : (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-sapphire-200 px-1.5 text-[12px] font-semibold text-sapphire-700">
                {video.step}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-medium text-text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {video.duration}
            </span>
          </div>
          <h3 className="ds-h3 mt-2">{video.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{video.description}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (canPlay) setPlaying(true)
          }}
          disabled={!canPlay}
          aria-label={canPlay ? `Play ${video.title}` : `${video.title} — coming soon`}
          className="group relative block aspect-video w-full overflow-hidden bg-burgundy-950 text-left disabled:cursor-default"
        >
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              loading={video.priority ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-950)] via-[var(--brand-800)] to-[var(--brand-600)]" />
          )}
          <div className="video-thumb-scrim absolute inset-0" />

          <span className="absolute right-3 top-3 z-10 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {video.duration}
          </span>

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-[var(--brand-50)] shadow-[var(--shadow-brand)] transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100 sm:h-[4.5rem] sm:w-[4.5rem]">
              <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
            </span>
            <span className="inline-flex items-center rounded-full bg-black/70 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
              {canPlay ? "Click to Play Video" : "Video coming soon"}
            </span>
          </span>
        </button>
      </article>

      {playing ? (
        <VideoOverlay
          videoUrl={buildVimeoEmbedUrl(video.id)}
          title={video.title}
          onClose={() => setPlaying(false)}
        />
      ) : null}
    </>
  )
}
