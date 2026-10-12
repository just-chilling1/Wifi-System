# premium-instant

**Feature ID:** `premium-instant`  
**Tier:** PREMIUM

## Description

Pre-written social posts (typically Facebook) with images. User filters by niche, copies post text, downloads image. Optional `{affiliate_link}` placeholder replaced from user settings.

## User flow

```
/instant → Filter by category/niche
  → Card: image + post copy
  → Copy Post → clipboard
  → Optional: substitute user's affiliate URL
```

## Routes

| Route | Nav label (customize) |
|-------|----------------------|
| `/instant` | Instant Income |

## APIs

Usually none — seeded Supabase content. Optional:

- `GET /api/premium/settings` — user affiliate URL for placeholders

## Env vars

Supabase only. Optional `RAPIDAPI_KEY` + `RAPIDAPI_HOST_IMAGE` for admin image seeding.

## Supabase

- `instant_income_posts` — title, niche, body, image_url, category
- `user_settings.affiliate_url`

## Implementation steps

1. Add `"premium-instant"` to `enabledFeatures`
2. Add to `upgradeNav` — customize label (e.g. "Social Posts", "Instant Income")
3. Create `src/features/premium-instant/pages/InstantPage.tsx`
4. Seed posts table
5. Copy-to-clipboard + image download UI

## Branding

All post copy is seeded per product niche — no generic placeholder brand names in seed data.
