# premium-recurring

**Feature ID:** `premium-recurring`  
**Tier:** PREMIUM

## Description

Catalog of recurring-commission affiliate offers (subscriptions/memberships) with stats: commission %, cancel rate, earn per visitor.

## User flow

```
/recurring → Grid of recurring offers
  → Filter by niche
  → Copy affiliate link
  → Stats: commission, earn/visitor, cart conv., cancel rate
```

## Routes

`/recurring` — premium nav

## Supabase

- `recurring_offers` — name, niche, commission, cancel_rate, affiliate_url, earn_per_visitor

## Implementation steps

1. Add `"premium-recurring"` to `enabledFeatures`
2. Seed offers table
3. Grid page with copy buttons
