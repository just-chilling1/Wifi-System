import {
  exclusiveOffersEnabled,
  EXCLUSIVE_OFFER_ICONS,
  getDefaultExclusiveOffers,
  type ExclusiveOffer,
  type ExclusiveOfferIcon,
  offers,
} from "@/config/offers.config"
import { brand } from "@/config/brand.config"

export const DEFAULT_SCALE_TRAINING_URL = "https://www.jvzoo.com/c/86517/415009"

export const DEFAULT_EXTERNAL_TRAINING_TITLE =
  "Wake Up With An Extra $1,000–$5,000 In Your Bank Account Tomorrow"
export const DEFAULT_EXTERNAL_TRAINING_CTA = "Watch The Free Training >>"
export const DEFAULT_SCALE_TRAINING_TITLE = `Scale Your ${brand.productName} To $1,000+ Per Day`
export const DEFAULT_SCALE_TRAINING_CTA = "Click Here To Access Training >>"

export interface PromoLinksSettings {
  exclusiveOffersEnabled: boolean
  exclusiveOffers: ExclusiveOffer[]
  externalTrainingUrl: string
  externalTrainingTitle: string
  externalTrainingCtaLabel: string
  videoWithdrawUrl: string
  scaleTrainingUrl: string
  scaleTrainingTitle: string
  scaleTrainingCtaLabel: string
}

export function getDefaultPromoLinks(): PromoLinksSettings {
  return {
    exclusiveOffersEnabled,
    exclusiveOffers: getDefaultExclusiveOffers(),
    externalTrainingUrl: offers.exclusiveOffer2,
    externalTrainingTitle: DEFAULT_EXTERNAL_TRAINING_TITLE,
    externalTrainingCtaLabel: DEFAULT_EXTERNAL_TRAINING_CTA,
    videoWithdrawUrl: offers.videoWithdrawUrl,
    scaleTrainingUrl: DEFAULT_SCALE_TRAINING_URL,
    scaleTrainingTitle: DEFAULT_SCALE_TRAINING_TITLE,
    scaleTrainingCtaLabel: DEFAULT_SCALE_TRAINING_CTA,
  }
}

export function getVisibleExclusiveOffers(settings: PromoLinksSettings): ExclusiveOffer[] {
  if (!settings.exclusiveOffersEnabled) return []
  return settings.exclusiveOffers.filter((o) => o.title.trim() && o.href.trim())
}

const HTTPS_URL_PATTERN = /^https:\/\/.+/i

export function isValidPromoUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  if (!HTTPS_URL_PATTERN.test(trimmed)) return false
  try {
    new URL(trimmed)
    return true
  } catch {
    return false
  }
}

function readText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

function isExclusiveOfferIcon(value: unknown): value is ExclusiveOfferIcon {
  return value === "UserPlus" || value === "Play" || value === "Wallet"
}

function normalizeOffer(raw: unknown, index: number, fallback: ExclusiveOffer): ExclusiveOffer {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const ctaRaw =
    typeof o.cta === "string" ? o.cta.trim() : typeof o.subtitle === "string" ? o.subtitle.trim() : ""
  return {
    title: typeof o.title === "string" ? o.title : fallback.title,
    href: typeof o.href === "string" ? o.href : fallback.href,
    cta: ctaRaw || fallback.cta,
    icon: isExclusiveOfferIcon(o.icon) ? o.icon : (EXCLUSIVE_OFFER_ICONS[index] ?? fallback.icon),
  }
}

function padExclusiveOffers(list: ExclusiveOffer[]): ExclusiveOffer[] {
  const defaults = getDefaultExclusiveOffers()
  const next = [...list]
  while (next.length < 3) {
    next.push(defaults[next.length] ?? defaults[0])
  }
  return next.slice(0, 3)
}

export interface PromoLinksRow {
  id: number
  exclusive_offers_enabled: boolean
  exclusive_offers: ExclusiveOffer[]
  external_training_url: string
  external_training_title?: string | null
  external_training_cta_label?: string | null
  video_withdraw_url: string
  scale_training_url: string
  scale_training_title?: string | null
  scale_training_cta_label?: string | null
  updated_at?: string
}

export function rowToPromoLinks(row: PromoLinksRow | null | undefined): PromoLinksSettings {
  const defaults = getDefaultPromoLinks()
  if (!row) return defaults

  const rawList = Array.isArray(row.exclusive_offers) ? row.exclusive_offers : defaults.exclusiveOffers
  const offersList = padExclusiveOffers(
    rawList.map((item, index) => normalizeOffer(item, index, defaults.exclusiveOffers[index] ?? defaults.exclusiveOffers[0])),
  )

  return {
    exclusiveOffersEnabled: row.exclusive_offers_enabled ?? defaults.exclusiveOffersEnabled,
    exclusiveOffers: offersList,
    externalTrainingUrl: row.external_training_url?.trim() || defaults.externalTrainingUrl,
    externalTrainingTitle: readText(row.external_training_title, defaults.externalTrainingTitle),
    externalTrainingCtaLabel: readText(row.external_training_cta_label, defaults.externalTrainingCtaLabel),
    videoWithdrawUrl: row.video_withdraw_url?.trim() || defaults.videoWithdrawUrl,
    scaleTrainingUrl: row.scale_training_url?.trim() || defaults.scaleTrainingUrl,
    scaleTrainingTitle: readText(row.scale_training_title, defaults.scaleTrainingTitle),
    scaleTrainingCtaLabel: readText(row.scale_training_cta_label, defaults.scaleTrainingCtaLabel),
  }
}

export function promoLinksToRow(settings: PromoLinksSettings): Omit<PromoLinksRow, "id" | "updated_at"> {
  return {
    exclusive_offers_enabled: settings.exclusiveOffersEnabled,
    exclusive_offers: settings.exclusiveOffers,
    external_training_url: settings.externalTrainingUrl.trim(),
    external_training_title: settings.externalTrainingTitle.trim(),
    external_training_cta_label: settings.externalTrainingCtaLabel.trim(),
    video_withdraw_url: settings.videoWithdrawUrl.trim(),
    scale_training_url: settings.scaleTrainingUrl.trim(),
    scale_training_title: settings.scaleTrainingTitle.trim(),
    scale_training_cta_label: settings.scaleTrainingCtaLabel.trim(),
  }
}

export function validatePromoLinksSettings(settings: PromoLinksSettings): string | null {
  if (!isValidPromoUrl(settings.externalTrainingUrl)) {
    return "Free member training URL must be a valid https:// link."
  }
  if (!settings.externalTrainingTitle.trim()) {
    return "Training & banners needs headline text."
  }
  if (!settings.externalTrainingCtaLabel.trim()) {
    return "Training & banners needs button text."
  }
  if (!isValidPromoUrl(settings.videoWithdrawUrl)) {
    return "Video overlay withdraw URL must be a valid https:// link."
  }
  if (!isValidPromoUrl(settings.scaleTrainingUrl)) {
    return "Scale Training URL must be a valid https:// link."
  }
  if (!settings.scaleTrainingTitle.trim()) {
    return "Scale Training needs headline text."
  }
  if (!settings.scaleTrainingCtaLabel.trim()) {
    return "Scale Training needs button text."
  }

  for (let i = 0; i < settings.exclusiveOffers.length; i++) {
    const offer = settings.exclusiveOffers[i]
    if (!offer.title.trim()) {
      return `Exclusive offer ${i + 1} needs a title.`
    }
    if (!isValidPromoUrl(offer.href)) {
      return `Exclusive offer ${i + 1} URL must be a valid https:// link.`
    }
  }

  return null
}
