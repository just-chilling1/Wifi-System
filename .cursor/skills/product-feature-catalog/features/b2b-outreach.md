# b2b-outreach

**Feature ID:** `b2b-outreach`  
**Tier:** CORE

## Description

B2B affiliate outreach stack in one module: browse offers → allocate leads → generate personalized cold emails → save templates.

## User flow

```
/offers → Browse affiliate offers → set active offer
/leads → Filters → allocate lead batch (business, email, website)
/email-builder → Pick lead + offer → AI generates 3 email variants → save
/saved-emails → Copy saved templates
/activity → Log of leads used
```

## Routes

| Route | Purpose |
|-------|---------|
| `/offers` | Offer library |
| `/leads` | Lead finder |
| `/email-builder` | AI email composer |
| `/saved-emails` | Template library |
| `/activity` | Activity log |

## APIs

| Endpoint | Env vars |
|----------|----------|
| `GET /api/offers` | Supabase |
| `POST /api/offers/generate` | `RAPIDAPI_KEY` |
| `POST /api/leads/allocate` | Supabase + service role |
| `POST /api/leads/mark-used` | Supabase |
| `POST /api/emails/generate` | `RAPIDAPI_KEY` |
| `POST /api/emails/save` | Supabase |

## Supabase

- `offers`, `leads`, `saved_emails`, `user_activity`

## Implementation steps

1. Add `"b2b-outreach"` to `enabledFeatures`
2. Create `src/features/b2b-outreach/` with sub-pages
3. Seed offers + leads
4. Nav group "Outreach" with custom labels
5. `featureApiGuard("b2b-outreach")` on all APIs

## Branding

Offer names and email templates are seeded per client niche — use `brand.productName` in page intros only.
