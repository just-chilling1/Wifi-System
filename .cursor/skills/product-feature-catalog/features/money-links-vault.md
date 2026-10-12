# money-links-vault

**Feature ID:** `money-links-vault`  
**Tier:** CORE

## Description

Save affiliate links with labels, niches, and notes. One-click copy. Optional image attachment from image-forge.

## User flow

```
/link-vault → Add link (label, URL, niche)
  → Grid/list with copy button
  → Edit / delete
```

## Routes

`/link-vault` or `/money-links`

## APIs

Supabase CRUD via client or `GET/POST/DELETE /api/links`

## Supabase

- `money_links` — user_id, label, url, niche, image_id, created_at

## Implementation steps

1. Add `"money-links-vault"` to `enabledFeatures`
2. Create `src/features/money-links-vault/`
3. Migration for `money_links`
