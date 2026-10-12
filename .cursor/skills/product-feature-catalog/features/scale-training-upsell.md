# scale-training-upsell

**Feature ID:** `scale-upsell`  
**Tier:** CORE

## Description

External scale-training sales page: video embed, benefits list, button to client checkout URL (Digistore24, etc.). No in-app purchase.

## User flow

`/scale-training` → watch VSL → click CTA → external checkout

## Skeleton

- Route: `src/app/scale-training/page.tsx` (or `src/features/scale-upsell/`)
- Nav: `resourceNav` in `navigation.config.ts`

## Config

Checkout URL in page config or `brand.config.ts` client links section. Optional `promos.config.ts` slot.

## Implementation steps

1. Add `"scale-upsell"` to `enabledFeatures`
2. Set CTA URL from client
3. Customize copy with `brand.productName`
