# wealth-sync

**Feature ID:** `wealth-sync`  
**Tier:** CORE

## Description

User pastes an affiliate product URL; AI scrapes details and builds a hosted bridge/review page with promotional link.

## User flow

```
/sync → Paste affiliate URL
  → Scan/analyze animation
  → AI generates review page content + SEO
  → Save to bridges → public URL /review/[slug]
/bridges → Manage synced pages, copy links, delete
```

## Routes

| Route | Purpose |
|-------|---------|
| `/sync` | Add product wizard |
| `/bridges` | My pages library |
| `/review/[slug]` | Public bridge page |

## APIs

| Endpoint | Env vars |
|----------|----------|
| `POST /api/analyze-url` | `SCRAPERAPI_KEY` |
| `POST /api/generate-review` | `RAPIDAPI_KEY`, `SCRAPERAPI_KEY` |
| `POST /api/optimize-bridge` | `RAPIDAPI_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

## Supabase

- `bridges` — user_id, affiliate_url, title, content, niche, status, public_slug

## Implementation steps

1. Add `"wealth-sync"` to `enabledFeatures`
2. Sync wizard component + bridges list page
3. Public review route
4. Pairs with `traffic-hub` for promotion

## Branding

Page titles and CTAs on public bridge pages use client's affiliate offer names — not skeleton defaults.
