# Premium Accelerator

**Feature ID:** `premium-accelerator`  
**Reference:** BlackBox Cash / NullPing  
**Tier:** PREMIUM  
**Route:** `/accelerator`

## Description

A catalog of 200 pre-made sales pages and X threads across niches. Templates are generated once and stored in Supabase (`sites` with `is_template=true` and `template_key=accelerator-{id}`). Members clone a template with their affiliate link; access does not regenerate content.

## User flow

```text
/accelerator → Filter by niche → Enter affiliate link → Use this template
  → Cloned product site + ten X threads in Offers Library
```

## One-time seed (admin)

Set `TEMPLATE_OWNER_ID` and `ACCELERATOR_SEED_SECRET`. Seed in batches through:

```text
POST /api/premium/accelerator/seed?offset=0&limit=25
Header: x-accelerator-seed-secret
```

Repeat with offsets 25, 50, and so on until complete. Never expose the seed secret to the client.

## APIs

| Route | Purpose |
|-------|---------|
| `GET /api/premium/accelerator/templates` | List templates and seed status |
| `POST /api/premium/accelerator/clone` | Clone a template with an affiliate URL |
| `POST /api/premium/accelerator/seed` | Admin batch seed |

Guard member endpoints with `featureApiGuard("premium-accelerator")`; protect seed operations separately.

## Enable

```typescript
enabledFeatures: [..., "premium-accelerator"]
```
