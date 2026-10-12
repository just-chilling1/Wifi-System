# traffic-hub

**Feature ID:** `traffic-hub`  
**Tier:** CORE

## Description

Outreach hub: pick a bridge page and niche, browse promotion targets (forums, blogs, Q&A), generate AI comments, copy and visit links.

## User flow

```
/traffic → Select bridge page + niche
  → Table/cards of outreach targets
  → Generate AI comment per row
  → Copy comment + open target URL
  → Optional: discover new URLs for niche
```

## Routes

`/traffic` — customize label (e.g. "Get Visitors", "Traffic Hub")

## APIs

| Endpoint | Env vars |
|----------|----------|
| `POST /api/generate-comment` | `RAPIDAPI_KEY`, `SCRAPERAPI_KEY` |
| `POST /api/scrape-urls` | `SCRAPERAPI_KEY`, `RAPIDAPI_KEY` |

## Implementation steps

1. Add `"traffic-hub"` to `enabledFeatures`
2. Requires `wealth-sync` (bridges table) or standalone promotion URL field
3. Responsive card layout on mobile (`< md`)
4. `featureApiGuard("traffic-hub")`

## Branding

Nav label from `navigation.config.ts`. No fake platform branding in target names.
