export const PRODUCT_NAME = "Wifi System"

export const brand = {
  productName: PRODUCT_NAME,
  storagePrefix: "wifi_code",
  tagline: "AI-Powered YouTube Engagement",
  authTagline: "Secure member access",
  signupTagline: "Create your account",
  logo: {
    type: "image" as "icon" | "image",
    icon: "Wifi",
    src: "/logo.png?v=20261006",
    iconSrc: "/logo-icon.png?v=20261006",
    wordmarkSrc: "/logo-wordmark.png?v=20261006b",
    alt: PRODUCT_NAME,
    wordmark: true,
  },
  colors: {
    primary: "#8C2637",
    secondary: "#865b5e",
    accent: "#8c2637",
    promoAccent: "#8c2637",
    promoCta: "#8C2637",
    page: "#161214",
    sidebar: "#1E1618",
    panel: "#2A1E22",
    authPage: "#161214",
    textHeading: "#F7F4F4",
    textPrimary: "#F4EEF0",
    textMuted: "#A88E94",
    panelGlass: "#2A1E22",
    borderGlow: "rgba(232, 180, 188, 0.28)",
    borderTeal: "rgba(140, 38, 55, 0.45)",
    border: "rgba(244, 238, 240, 0.14)",
    encryptedGreen: "#8C2637",
    vaultGold: "#8c2637",
  },
  fonts: {
    brand: "Fraunces",
    ui: "Inter",
  },
  get metadata() {
    return {
      title: `${PRODUCT_NAME} - AI-Powered YouTube Engagement Tool`,
      description:
        "Advanced AI system that finds trending YouTube Shorts and generates high-quality engagement comments for maximum reach.",
    }
  },
} as const

export type BrandConfig = typeof brand
