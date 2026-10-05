import { getVideoThumbnailPath, type VideoThumbnailSlug } from "@/lib/video-thumbnails"
import { cn } from "@/lib/utils"

type PremiumFeatureThumbnailProps = {
  slug: VideoThumbnailSlug
  alt: string
  className?: string
  /** `card` = wide banner; `chip` = compact sidebar tile. */
  variant?: "card" | "chip"
}

export function PremiumFeatureThumbnail({
  slug,
  alt,
  className,
  variant = "card",
}: PremiumFeatureThumbnailProps) {
  const src = getVideoThumbnailPath(slug)

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-burgundy-950",
        variant === "card" ? "aspect-video w-full" : "h-14 w-20 rounded-lg",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="video-thumb-scrim absolute inset-0" aria-hidden />
    </div>
  )
}
