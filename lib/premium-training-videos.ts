/** Premium upgrade training videos — mindset → how-to pairs (roster 10–21). */
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getVideoThumbnail, type VideoThumbnailSlug } from "@/lib/video-thumbnails"

export const PREMIUM_TRAINING_VIMEO_IDS = {
  dfyProfit: "1226577445",
  accelerator: "1226577449",
  recurringStreams: "1226547482",
  socialPayouts: "1226545479",
  protector: "1226546051",
  licenseRights: "1226547483",
  highTicketPayouts: "1226546591",
} as const

export type PremiumTrainingKey = keyof typeof PREMIUM_TRAINING_VIMEO_IDS

export type PremiumTrainingVideo = {
  slug: string
  moduleKey: PremiumTrainingKey
  title: string
  description: string
  duration: string
  vimeoId: string
  thumbnailSlug?: VideoThumbnailSlug
  feature: string
  badge?: string
}

/** Flat roster for the Academy premium section — mindset then how-to per feature. */
export const PREMIUM_TRAINING_VIDEOS: readonly PremiumTrainingVideo[] = [
  {
    slug: "unlimited-mindset",
    moduleKey: "accelerator",
    title: `${PREMIUM_FEATURE_LABELS.dfyVault} Mindset`,
    description:
      "Treat Unlimited like a library you visit every morning — not a shortcut you open once and forget.",
    duration: "6 min",
    vimeoId: "1226543582",
    thumbnailSlug: "unlimited-mindset",
    feature: PREMIUM_FEATURE_LABELS.dfyVault,
    badge: "Mindset",
  },
  {
    slug: "unlimited",
    moduleKey: "accelerator",
    title: `${PREMIUM_FEATURE_LABELS.dfyVault} Training`,
    description:
      `Watch this first to maximize your results with the 200+ ${PREMIUM_FEATURE_LABELS.dfyVault} videos and ready-made comment packs.`,
    duration: "10 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.accelerator,
    thumbnailSlug: "unlimited",
    feature: PREMIUM_FEATURE_LABELS.dfyVault,
  },
  {
    slug: "instant-income-mindset",
    moduleKey: "recurringStreams",
    title: `${PREMIUM_FEATURE_LABELS.instantIncome} Mindset`,
    description:
      "How to show up to Instant Income so copying posts feels like a daily habit, not a one-off experiment.",
    duration: "6 min",
    vimeoId: "1226543605",
    thumbnailSlug: "instant-income-mindset",
    feature: PREMIUM_FEATURE_LABELS.instantIncome,
    badge: "Mindset",
  },
  {
    slug: "instant-income",
    moduleKey: "recurringStreams",
    title: `${PREMIUM_FEATURE_LABELS.instantIncome} Training`,
    description: "Learn how to copy the 200+ proven Facebook posts and start making money today.",
    duration: "10 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.recurringStreams,
    thumbnailSlug: "instant-income",
    feature: PREMIUM_FEATURE_LABELS.instantIncome,
  },
  {
    slug: "automated-profits-mindset",
    moduleKey: "socialPayouts",
    title: `${PREMIUM_FEATURE_LABELS.automatedIncome} Mindset`,
    description:
      "Why Automated Profits is a set-and-forget traffic layer — and how winners think before they submit a link.",
    duration: "6 min",
    vimeoId: "1226544264",
    thumbnailSlug: "automated-profits-mindset",
    feature: PREMIUM_FEATURE_LABELS.automatedIncome,
    badge: "Mindset",
  },
  {
    slug: "automated-profits",
    moduleKey: "socialPayouts",
    title: `${PREMIUM_FEATURE_LABELS.automatedIncome} Training`,
    description:
      "Learn how to submit your link to 100+ traffic sources and get automated traffic forever.",
    duration: "10 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.socialPayouts,
    thumbnailSlug: "automated-profits",
    feature: PREMIUM_FEATURE_LABELS.automatedIncome,
  },
  {
    slug: "cyber-protection-mindset",
    moduleKey: "protector",
    title: `${PREMIUM_FEATURE_LABELS.protector} Mindset`,
    description:
      `Security habits before you touch a setting — why ${PREMIUM_FEATURE_LABELS.protector} protects the income you've already built.`,
    duration: "6 min",
    vimeoId: "1226544662",
    thumbnailSlug: "cyber-protection-mindset",
    feature: PREMIUM_FEATURE_LABELS.protector,
    badge: "Mindset",
  },
  {
    slug: "cyber-protection",
    moduleKey: "protector",
    title: `${PREMIUM_FEATURE_LABELS.protector} Training`,
    description: `Understand how ${PREMIUM_FEATURE_LABELS.protector} keeps your ${PRODUCT_NAME} account and activity secure.`,
    duration: "8 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.protector,
    thumbnailSlug: "cyber-protection",
    feature: PREMIUM_FEATURE_LABELS.protector,
  },
  {
    slug: "reseller-license-rights-mindset",
    moduleKey: "licenseRights",
    title: `${PREMIUM_FEATURE_LABELS.licenseRights} Mindset`,
    description:
      "What reseller and license rights actually mean for your business — before you request activation.",
    duration: "6 min",
    vimeoId: "1226544973",
    thumbnailSlug: "reseller-license-rights-mindset",
    feature: PREMIUM_FEATURE_LABELS.licenseRights,
    badge: "Mindset",
  },
  {
    slug: "reseller-license-rights",
    moduleKey: "licenseRights",
    title: `${PREMIUM_FEATURE_LABELS.licenseRights} Training`,
    description:
      "Learn how to request activation for the Full Turnkey Reseller & License Rights Edition.",
    duration: "8 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.licenseRights,
    thumbnailSlug: "reseller-license-rights",
    feature: PREMIUM_FEATURE_LABELS.licenseRights,
  },
  {
    slug: "high-ticket-payouts-mindset",
    moduleKey: "highTicketPayouts",
    title: `${PREMIUM_FEATURE_LABELS.highTicketPayouts} Mindset`,
    description:
      "Why authority articles and high-ticket offers need a different headspace — before you pick your first template.",
    duration: "6 min",
    vimeoId: "1226545017",
    thumbnailSlug: "high-ticket-payouts-mindset",
    feature: PREMIUM_FEATURE_LABELS.highTicketPayouts,
    badge: "Mindset",
  },
  {
    slug: "high-ticket-payouts",
    moduleKey: "highTicketPayouts",
    title: `${PREMIUM_FEATURE_LABELS.highTicketPayouts} Training`,
    description:
      "Learn how to pick an authority article, preview it with your offer link inside, and publish it on Medium, LinkedIn, or your own blog.",
    duration: "10 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.highTicketPayouts,
    thumbnailSlug: "high-ticket-payouts",
    feature: PREMIUM_FEATURE_LABELS.highTicketPayouts,
  },
  {
    slug: "done-for-you-profit-mindset",
    moduleKey: "dfyProfit",
    title: `${PREMIUM_FEATURE_LABELS.dfyProfit} Mindset`,
    description:
      "Why one link and one niche is enough to ship a full promo kit — before you run Done-For-You Profit.",
    duration: "6 min",
    vimeoId: "1226574609",
    thumbnailSlug: "done-for-you-profit-mindset",
    feature: PREMIUM_FEATURE_LABELS.dfyProfit,
    badge: "Mindset",
  },
  {
    slug: "done-for-you-profit",
    moduleKey: "dfyProfit",
    title: `${PREMIUM_FEATURE_LABELS.dfyProfit} Training`,
    description:
      "Watch how to paste one affiliate link, pick a niche, and get 5 comment-ready videos, a hosted authority article, and Facebook posts in one run.",
    duration: "10 min",
    vimeoId: PREMIUM_TRAINING_VIMEO_IDS.dfyProfit,
    thumbnailSlug: "done-for-you-profit",
    feature: PREMIUM_FEATURE_LABELS.dfyProfit,
  },
] as const

/** How-to entry per upgrade page (backward compatible). */
export const PREMIUM_TRAINING_MODULES = PREMIUM_TRAINING_VIDEOS.filter(
  (video) => !video.badge,
)

export function getPremiumTrainingVimeoId(key: PremiumTrainingKey) {
  return PREMIUM_TRAINING_VIMEO_IDS[key]
}

export function getPremiumHowToVideo(key: PremiumTrainingKey) {
  return PREMIUM_TRAINING_VIDEOS.find((entry) => entry.moduleKey === key && !entry.badge)
}

export function getPremiumTrainingThumbnail(key: PremiumTrainingKey) {
  const video = getPremiumHowToVideo(key)
  if (!video?.thumbnailSlug) return null
  return getVideoThumbnail({ slug: video.thumbnailSlug })
}
