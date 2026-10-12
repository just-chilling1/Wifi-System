---
name: product-feature-catalog
description: >-
  Catalog of CORE and PREMIUM features for product-skeleton. Use when choosing
  or implementing a feature module. All UI uses the current product branding
  from brand.config.ts and NEXT_PUBLIC_PRODUCT_NAME.
---

# Product Feature Catalog

For humans: start with [DEVELOPER-SETUP.md](../../../DEVELOPER-SETUP.md) Steps 7–8.

## Cursor workflow

1. Open [catalog-index.md](catalog-index.md) — pick feature by description (CORE / PREMIUM).
2. Read `features/<guide>.md` for flow, APIs, tables, implementation steps.
3. Env vars are at the bottom of `catalog-index.md`.
4. Enable ID in `src/config/features.config.ts`; wire `navigation.config.ts`.
5. Use `brand.productName` for all copy.

## Prompt

```text
Implement feature "<FEATURE_ID>" in product-skeleton.
Read catalog-index.md and features/<guide>.md.
Enable in features.config.ts. Use brand.productName. No hardcoded API keys.
```

## Files

- [catalog-index.md](catalog-index.md) — feature list + env vars
- `features/*.md` — per-feature guides
- `src/config/features.config.ts` — `FEATURE_CATALOG`
