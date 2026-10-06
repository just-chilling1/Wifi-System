import Image from "next/image"
import { brand } from "@/config/brand.config"
import { cn } from "@/lib/utils"

type BrandLogoVariant = "icon" | "wordmark"

interface BrandLogoProps {
  variant?: BrandLogoVariant
  /** Pixel size of the mark. */
  size?: number
  className?: string
  priority?: boolean
}

export function BrandLogo({
  variant = "icon",
  size = 32,
  className,
  priority = false,
}: BrandLogoProps) {
  const mark = (
    <Image
      src={brand.logo.iconSrc}
      alt={variant === "wordmark" ? "" : brand.logo.alt}
      width={size}
      height={size}
      priority={priority}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  )

  if (variant === "wordmark") {
    const wordHeight = Math.round(size * 0.72)
    const wordWidth = Math.round(wordHeight * (452 / 98))
    return (
      <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
        {mark}
        <Image
          src={brand.logo.wordmarkSrc}
          alt={brand.logo.alt}
          width={wordWidth}
          height={wordHeight}
          priority={priority}
          className="h-auto max-w-full object-contain"
          style={{ height: wordHeight, width: "auto", maxWidth: "100%" }}
        />
      </span>
    )
  }

  return <span className={cn("inline-flex shrink-0", className)}>{mark}</span>
}
