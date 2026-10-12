# dopamine-engagement

**Feature ID:** `dopamine`  
**Tier:** CORE

## Description

Engagement layer: social proof toasts, rolling earnings counters, withdraw popup, trust bar, milestone tracker, free-training modal. Config-driven — disable widgets that don't fit the product.

## User flow

Widgets appear on dashboard and workflow pages based on `dopamine.config.ts` and `promos.config.ts` slots.

## Skeleton locations

- `src/features/dopamine/components/` — reference components
- `src/config/dopamine.config.ts` — enable/disable each widget
- `src/config/promos.config.ts` — CTA URLs for modals and toasts
- `src/components/layout/Shell.tsx` — `PromoOrchestrator`

## APIs

None — client-side timers and config data.

## Implementation steps

1. Add `"dopamine"` to `enabledFeatures`
2. Tune `dopamine.config.ts`
3. Set promo `ctaUrl` values in `promos.config.ts`

## Branding

All headlines and CTA copy come from `promos.config.ts` and `brand.config.ts` — never hardcode dollar amounts unless client approves.
