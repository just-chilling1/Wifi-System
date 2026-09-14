/**
 * Academy Track B — mindset → how-to pairs per core tool.
 * Premium modules live in lib/premium-training-videos.ts.
 */
import type { VideoThumbnailSlug } from "@/lib/video-thumbnails"

export type AcademyTrainingVideo = {
  slug: string
  title: string
  description: string
  duration: string
  vimeoId: string
  thumbnailSlug: VideoThumbnailSlug
  /** Shown on how-to walkthroughs (1–3). Mindset videos use badge instead. */
  step?: number
  /** e.g. "Mindset" for belief videos before the click-by-click how-to. */
  badge?: string
}

export const ACADEMY_TRAINING_VIDEOS: readonly AcademyTrainingVideo[] = [
  {
    slug: "gold-rush-mindset",
    title: "Gold Rush Mindset",
    description:
      "How to think before you click — the beliefs that turn Gold Rush from a slot machine into a daily craft.",
    duration: "6 min",
    vimeoId: "1225645047",
    thumbnailSlug: "gold-rush-mindset",
    badge: "Mindset",
  },
  {
    slug: "gold-rush",
    title: "Gold Rush Training",
    description:
      "Learn how to use the Gold Rush Generator to find viral opportunities and generate money-making comments.",
    duration: "10 min",
    vimeoId: "1226575131",
    thumbnailSlug: "gold-rush",
    step: 1,
  },
  {
    slug: "my-vault-mindset",
    title: "My Vault Mindset",
    description:
      "Why My Vault is the memory of your operation — and how to treat saved packs like assets, not clutter.",
    duration: "6 min",
    vimeoId: "1225645046",
    thumbnailSlug: "my-vault-mindset",
    badge: "Mindset",
  },
  {
    slug: "my-vault",
    title: "My Vault Training",
    description:
      "Master the My Vault system to manage your comment packs and track your results effectively.",
    duration: "12 min",
    vimeoId: "1226577448",
    thumbnailSlug: "my-vault",
    step: 2,
  },
  {
    slug: "link-vault-mindset",
    title: "Link Vault Mindset",
    description:
      "Your affiliate link is the coupon with your name on it — beliefs that make Your Links trustworthy before Gold Rush opens.",
    duration: "6 min",
    vimeoId: "1226573904",
    thumbnailSlug: "link-vault-mindset",
    badge: "Mindset",
  },
  {
    slug: "link-vault",
    title: "Link Vault Training",
    description:
      "Save, name, and reuse affiliate URLs in Your Links so Gold Rush always has a clean link ready to go.",
    duration: "8 min",
    vimeoId: "1226575132",
    thumbnailSlug: "link-vault",
    step: 3,
  },
] as const
