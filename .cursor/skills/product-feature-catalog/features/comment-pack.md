# Comment Pack (Gold Rush)

**Feature ID:** `comment-pack`  
**Reference:** Robinhood / YouTube Gold Rush  
**Tier:** CORE

## Description

YouTube and social comment-pack workflow for affiliate promotion. Find video opportunities, generate helpful comment variants, and save them for user-reviewed copy/paste.

## Routes

- `/create` — Find video opportunities and generate comment packs
- `/pages` — My Vault (saved packs)
- `/share` — Affiliate link vault
- `/article/[slug]` — Public comment-pack viewer (public route in `proxy.ts`)

## APIs

The reference app also tracks engagement through click/open endpoints. Keep generation and tracking server-side and user-scoped.

## Database

Reference `scripts/001_create_schema.sql` in Robinhood:

- `pages`
- `videos`
- `niches`
- `offers`

## Enable

```typescript
enabledFeatures: [..., "comment-pack"]
```

Update `navigation.config.ts` workflow steps and `bottomNavTabs` for this product type. Do not automate third-party posting.
