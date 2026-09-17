import Image from "next/image"
import { brand } from "@/config/brand.config"
import { cn } from "@/lib/utils"

type BrandLogoVariant = "icon" | "wordmark"

interface BrandLogoProps {
  variant?: BrandLogoVariant
  /** Pixel size for the icon variant (width = height). Ignored for wordmark. */
  size?: number
  /** Wordmark width in pixels. Height scales automatically. */
  width?: number
  className?: string
  priority?: boolean
}

export function BrandLogo({
  variant = "icon",
  size = 52,
  width = 260,
  className,
  priority = false,
}: BrandLogoProps) {
  if (variant === "wordmark") {
    const height = Math.round(width * (289 / 865))
    return (
      <Image
        src={brand.logo.src}
        alt={brand.logo.alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("h-auto max-w-full object-contain", className)}
        style={{ width, maxWidth: "100%", height: "auto" }}
      />
    )
  }

  return (
    <Image
      src={brand.logo.iconSrc}
      alt={brand.logo.alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  )
}
