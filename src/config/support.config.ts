import { brand } from "./brand.config"
import { FREE_TRAINING_URL } from "./offers.config"

// Freshdesk inbox — override with NEXT_PUBLIC_SUPPORT_EMAIL or SUPPORT_EMAIL.
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
  process.env.SUPPORT_EMAIL ||
  "wificode@neoai.freshdesk.com"
export const SUPPORT_PORTAL_URL = "https://neoai.freshdesk.com/support/home"
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`

export const APP_SUPPORT_NAME = brand.productName

export const support = {
  email: SUPPORT_EMAIL,
  contactUrl: "/support#contact",
  helpCenterUrl: SUPPORT_PORTAL_URL,
  pageTitle: "Support",
  pageSubtitle: "Get answers fast, or send us a message — we typically reply within two hours.",
  ctaLabel: "Contact Support",
  headline: "Need Help?",
  subcopy: "Our support team is here for you 24/7",
  stats: [
    { icon: "clock", label: "Avg response", highlight: "under 2 hours", highlightClass: "text-success" },
    { icon: "star", label: "Support rating", highlight: "4.9 / 5", highlightClass: "" },
    { icon: "shield", label: "Satisfaction rate", highlight: "98%", highlightClass: "" },
  ],
  refundPolicy: {
    title: "Refund Policy",
    subtitle: "Satisfaction guarantee terms",
    items: [
      {
        title: "30-Day Guarantee",
        body: "Full refund available within 30 days of an upgrade purchase. No questions asked.",
      },
      {
        title: "Request Procedure",
        body: "Email our support team with your account email and purchase date. We will confirm receipt and begin processing.",
      },
      {
        title: "Processing Timeline",
        body: "Refunds are typically processed within 5–7 business days. You will receive confirmation once complete.",
      },
    ],
  },
} as const

export { FREE_TRAINING_URL }
