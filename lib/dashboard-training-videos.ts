/** Dashboard Track A videos (1–3). */
import { PRODUCT_NAME } from "@/lib/brand"
import type { VideoThumbnailSlug } from "@/lib/video-thumbnails"

export type DashboardTrainingVideo = {
  id: string
  title: string
  description: string
  duration: string
  step: 1 | 2 | 3
  priority?: boolean
  thumbnailSlug: VideoThumbnailSlug
}

export const DASHBOARD_TRAINING_VIDEOS: readonly DashboardTrainingVideo[] = [
  {
    id: "1225645049",
    title: "Watch This First",
    description:
      "Before you touch a single tool — watch this. It kills the night-one doubt and shows you exactly what you bought.",
    duration: "11 min",
    step: 1,
    priority: true,
    thumbnailSlug: "watch-this-first",
  },
  {
    id: "1225645048",
    title: "How The Money Flows",
    description:
      `Where the money comes from, who pays you, and what every word inside ${PRODUCT_NAME} actually means — in plain language.`,
    duration: "14 min",
    step: 2,
    thumbnailSlug: "how-the-money-flows",
  },
  {
    id: "1226575133",
    title: "Your 5-Minute Tour",
    description:
      "A quick walkthrough of where everything lives in the app — so you never feel lost when you start working.",
    duration: "4 min",
    step: 3,
    thumbnailSlug: "your-5-minute-tour",
  },
]

export function isPlayableVimeoId(id: string): boolean {
  return /^\d{7,}$/.test(id.trim())
}
