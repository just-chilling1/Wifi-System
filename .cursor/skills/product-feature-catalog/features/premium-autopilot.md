# premium-autopilot

**Feature ID:** `premium-autopilot`  
**Tier:** PREMIUM

## Description

Curated traffic source checklist. User saves a promotion URL, browses forums/groups/directories, copies suggested snippets, marks sources complete.

## User flow

```
/autopilot → Enter promotion URL (saved to profile)
  → Browse sources by category
  → Each row: name, link, optional AI comment
  → Mark complete → progress tracked
```

## Routes

| Route | Nav label (customize) |
|-------|----------------------|
| `/autopilot` | Automated Profits |

## APIs

| Endpoint | Purpose |
|----------|---------|
| `GET/POST /api/autopilot/completions` | Track completed sources |
| `GET /api/premium/settings` | Promotion URL |
| `POST /api/generate-comment` | Optional AI outreach comment |

## Env vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RAPIDAPI_KEY=          # if generate-comment enabled
SCRAPERAPI_KEY=        # if URL discovery enabled
```

## Supabase

- `autopilot_sources` — name, url, category, snippet_template
- `user_autopilot_completions` — user_id, source_id
- `user_settings.promotion_url`

## Implementation steps

1. Add `"premium-autopilot"` to `enabledFeatures`
2. Add to `upgradeNav`
3. Create `src/features/premium-autopilot/pages/AutopilotPage.tsx`
4. Seed traffic sources
5. Optional completions API

## Branding

Customize nav label and page intro. Source names are generic (Reddit, Facebook Groups) — no third-party product names in UI.
