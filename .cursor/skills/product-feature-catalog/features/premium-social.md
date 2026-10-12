# Premium Social (Social Payouts / 10X)

**Feature ID:** `premium-social`  
**Alias:** `premium-10x`  
**Reference:** BlackBox Cash / NullPing  
**Tier:** PREMIUM  
**Route:** `/social-payouts`

## Description

Bulk-generate ten or more Facebook post variants from a member's offer or site — different hooks, angles, and CTAs. This is the canonical name for the skeleton's legacy `premium-10x` feature.

## User flow

```text
/social-payouts → Select offer from library → Generate 10X posts → Copy each
```

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/social-payouts` | Generate ten posts via AI and save to `site_facebook_posts` |
| `GET /api/premium/social-payouts?siteId=` | List saved posts |

Requires `RAPIDAPI_KEY` for generation. Guard both routes with `featureApiGuard("premium-social")` and an entitlement check.

## Enable

```typescript
enabledFeatures: [..., "premium-social"]
```

Products using older briefs may enable `"premium-10x"` instead; the two IDs are interchangeable aliases.
