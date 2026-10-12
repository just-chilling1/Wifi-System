# Asset Activator

**Feature ID:** `asset-activator`  
**Reference:** NullPing (`src/features/money-page/`)  
**Tier:** CORE

## Description

Activation flow that accepts a product URL or product name, researches the offer, and creates a draft money page. The user reviews the generated copy and publishes only when it is ready.

## User flow

```text
/activate → Product URL or product name + optional affiliate URL
  → Analyze product → identify buyers → build money page
  → Review the generated page → edit → publish
  → Generate Pinterest traffic from the live asset
```

## Routes

- `/activate` — activation form and progress stages
- `/money-page/[assetId]` — editor for the generated asset
- `/results` — live asset and performance summary
- `/m/[slug]` — public money page

## APIs

| Endpoint | Purpose | Env vars |
|----------|---------|----------|
| `POST /api/assets/activate` | Create a site from product and affiliate details | `RAPIDAPI_KEY`, optional `SCRAPERAPI_KEY` |
| `GET /api/assets/list` | List the member's assets | Supabase |
| `GET/PATCH /api/assets/[assetId]` | Load and edit an asset | Supabase |
| `GET /api/assets/[assetId]/preview` | Render a draft preview | Supabase |
| `POST /api/assets/upload-image` | Upload a user-selected hero image | Supabase Storage |

Guard every endpoint with `featureApiGuard("asset-activator")` and `getApiUser`.

## Database

The NullPing migration extends `sites` with `product_name`, `product_url`, and `asset_source`. It also adds:

- `site_pins` — generated traffic assets for each site
- `page_visits` — public-page visits, source, country, and optional pin
- `record_page_visit(...)` — security-definer function that records visits only for live sites

## Implementation steps

1. Add `"asset-activator"` to `enabledFeatures`.
2. Keep activation server-side and validate product and affiliate URLs.
3. Store generated copy in the existing `sites` sales-page fields.
4. Require a live status before generating public traffic destinations.
5. Link the editor to `traffic-pins` and `results`.
