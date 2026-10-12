# premium-dfy

**Feature ID:** `premium-dfy`  
**Tier:** PREMIUM

## Description

Done-for-you vault: pre-loaded assets users browse, copy, or claim. Variant depends on product type:

- Keywords / reply templates
- Full articles
- AI images + captions
- B2B lead lists
- Hosted landing pages
- Digital products (ebook + sales page)

## User flow

```
/dfy → Grid of cards (preview, niche, earnings claim)
  → Detail view → copy / claim
  → Claimed items appear in user's library
```

## Routes

| Route | Nav label (customize) |
|-------|----------------------|
| `/dfy` | Done-For-You |

## APIs

| Endpoint | When needed |
|----------|-------------|
| `POST /api/dfy/claim` | Digital products / articles with claim flow |
| `GET /api/dfy` | List vault items |

## Env vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # seeding + claim routes
```

## Supabase

Seed one table matching asset type: `dfy_keywords`, `dfy_articles`, `dfy_images`, `dfy_leads`, `dfy_products`, or generic `dfy_items`. Optional `user_claims`.

## Implementation steps

1. Add `"premium-dfy"` to `enabledFeatures`
2. Add to `upgradeNav` in `navigation.config.ts`
3. Create `src/features/premium-dfy/pages/DfyPage.tsx`
4. SQL seed script for vault content
5. Premium section styling in sidebar
6. All card copy uses product niche terminology from client brief

## Branding

Route label in `navigation.config.ts` (e.g. "Done-For-You", "Ready-Made Pages"). User-facing headlines from config, not hardcoded.
