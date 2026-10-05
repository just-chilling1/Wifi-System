import { brand } from "@/config/brand.config"

/** CSS custom properties derived from brand.config — inject via BrandStyleProvider */
export function getBrandCssVars(): Record<string, string> {
  return {
    "--bb-canvas": brand.colors.page,
    "--bb-surface": brand.colors.panel,
    "--bb-surface-sub": brand.colors.sidebar,
    "--bg-page": brand.colors.page,
    "--bg-sidebar": brand.colors.sidebar,
    "--bg-panel": brand.colors.panel,
    "--bg-panel-glass": brand.colors.panelGlass,
    "--bg-border": brand.colors.border,
    "--bg-border-glow": brand.colors.borderGlow,
    "--bg-border-teal": brand.colors.borderTeal,
    "--bg-glass": brand.colors.panelGlass,
    "--brand-primary": brand.colors.primary,
    "--brand-primary-readable": "#E8B4BC",
    "--brand-secondary": brand.colors.secondary,
    "--brand-tint": "#3A2228",
    "--promo-accent": brand.colors.promoAccent,
    "--promo-cta": brand.colors.promoCta,
    "--text-heading": brand.colors.textHeading,
    "--text-primary": brand.colors.textPrimary,
    "--text-muted": brand.colors.textMuted,
    "--sidebar-gap": "2rem",
    "--mobile-header-h": "3.5rem",
    "--sidebar-shell-bg": brand.colors.sidebar,
    "--ds-canvas": brand.colors.page,
    "--ds-surface": brand.colors.panel,
    "--ds-surface-sub": brand.colors.sidebar,
    "--background": brand.colors.page,
    "--foreground": brand.colors.textPrimary,
    "--secondary": brand.colors.secondary,
    "--accent": brand.colors.accent,
    "--primary": brand.colors.primary,
    "--primary-hover": "#65101E",
    "--primary-foreground": "#F7F4F4",
  }
}

export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}
