/**
 * Wifi Code exclusive / partner URLs.
 * DO NOT change these strings — revenue links must stay byte-identical.
 */

export const offers = {
  /** Q-LAPS2000 */
  exclusiveOffer1: "https://jvz4.com/c/3547097/442443/",
  /** Free training (Convertri) — also used by EarningsBanner / bonus training */
  exclusiveOffer2:
    "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea",
  /** CashTap AI / Cashapp */
  exclusiveOffer3: "https://jvz1.com/c/3547097/443257/",
  /** Withdraw ad under video overlays */
  videoWithdrawUrl: "https://jvz1.com/c/3547097/442055/",
} as const

export type ExclusiveOfferIcon = "UserPlus" | "Play" | "Wallet"

export interface ExclusiveOffer {
  title: string
  href: string
  cta?: string
  icon: ExclusiveOfferIcon
}

export const exclusiveOffersEnabled = true

export const EXCLUSIVE_OFFER_ICONS: ExclusiveOfferIcon[] = ["UserPlus", "Play", "Wallet"]

/** Always returns the three default partner slots (used by admin + promo-link defaults). */
export function getDefaultExclusiveOffers(): ExclusiveOffer[] {
  return [
    {
      title: "Create your Q-LAPS2000 account",
      cta: "Create Now",
      href: offers.exclusiveOffer1,
      icon: "UserPlus",
    },
    {
      title: "Watch this Free training",
      cta: "Watch Now",
      href: offers.exclusiveOffer2,
      icon: "Play",
    },
    {
      title: "Create your Cashapp Account",
      cta: "CashTap AI",
      href: offers.exclusiveOffer3,
      icon: "Wallet",
    },
  ]
}

export function getExclusiveOffers(): ExclusiveOffer[] {
  if (!exclusiveOffersEnabled) return []
  return getDefaultExclusiveOffers()
}

export const FREE_TRAINING_URL = offers.exclusiveOffer2
export const WELCOME_OFFER_URL = offers.exclusiveOffer1
export const VIDEO_WITHDRAW_URL = offers.videoWithdrawUrl
