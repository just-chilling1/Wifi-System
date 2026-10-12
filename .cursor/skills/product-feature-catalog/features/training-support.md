# training-support

**Feature ID:** `training`  
**Tier:** CORE

## Description

Training page with Vimeo modules, step-by-step guide, pro tips, checklist, and FAQ. Support page with contact info and help links.

## User flow

**Training:** `/training` → videos + workflow guide + FAQ + CTA  
**Support:** `/support` → email, contact link, FAQ (always on, no flag)

## Skeleton locations

- `src/features/training/pages/TrainingPage.tsx`
- `src/features/support/pages/SupportPage.tsx`

## Config (branding)

| File | Content |
|------|---------|
| `training.config.ts` | Vimeo IDs, page title, external training URL |
| `training-content.config.ts` | FAQ, steps, tips, checklist |
| `support.config.ts` | Email, contact URL, page copy |

## Env vars

None required. Vimeo IDs in config.

## Implementation steps

1. `"training"` is enabled by default
2. Populate configs with product-specific copy using `brand.productName`
3. Run DEVELOPER-SETUP.md §7 prompt before launch
4. Support nav item needs no feature flag
