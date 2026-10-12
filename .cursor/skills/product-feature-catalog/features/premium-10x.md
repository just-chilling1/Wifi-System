# premium-10x

**Feature ID:** `premium-10x`  
**Alias:** `premium-social`  
**Tier:** PREMIUM

## Description

Legacy name for `premium-social`: generate many social post variants (10+) from one article or campaign — different hooks, angles, and CTAs.

## User flow

```
/10x or /social → Select article from portfolio
  → AI generates post batch
  → Copy each individually
```

## Routes

`/10x` — legacy premium nav section. New products should use `/social`.

## APIs

`POST /api/generate-posts` — `RAPIDAPI_KEY` (or the `/api/social/generate` endpoint from the canonical guide)

Optional: `user_powerups` table for entitlement gating.

## Implementation steps

1. Add `"premium-10x"` or `"premium-social"` to `enabledFeatures`; both IDs resolve to the same capability
2. Requires `portfolio` / `articles`
3. Premium upsell page styling
