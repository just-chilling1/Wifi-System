# niche-finder

**Feature ID:** `niche-finder`  
**Tier:** CORE

## Description

Discover profitable sub-niches from a broad topic. One-click jump into product wizard with niche pre-filled.

## User flow

```
/find-niche → Enter broad topic
  → AI returns sub-niches + signals
  → "Create product" → /new?niche=...
```

## Routes

`/find-niche`

## APIs

`POST /api/find-niche` — `RAPIDAPI_KEY`

## Implementation steps

1. Add `"niche-finder"` to `enabledFeatures`
2. Link CTA to `product-wizard` with query param
3. Can ship standalone or bundled with `product-wizard`

## Branding

Use "topic" / "smaller topic" in UI copy per client preference — configure in page strings.
