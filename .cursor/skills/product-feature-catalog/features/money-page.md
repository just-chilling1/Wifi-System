# Money Page

**Feature ID:** `money-page`  
**Reference:** NullPing (`src/features/money-page/`)  
**Tier:** CORE

## Description

Editor for the generated affiliate sales or review page. Members can choose a copy variation and color theme, edit sections, select or upload a hero image, save an affiliate URL, preview, and publish.

## User flow

```text
/money-page/[assetId] → Load generated product page
  → Choose review variation and color theme
  → Edit copy, affiliate URL, and hero image
  → Preview → publish or unpublish
  → Share the public /m/[slug] URL
```

## Routes

- `/money-page/[assetId]` — authenticated editor
- `/m/[slug]` — public money page
- `/api/assets/[assetId]/preview` — authenticated draft preview

## APIs

| Endpoint | Purpose |
|----------|---------|
| `GET/PATCH /api/assets/[assetId]` | Read and update copy, theme, variation, and affiliate URL |
| `GET /api/assets/[assetId]/hero-options` | Load candidate hero images |
| `POST /api/assets/upload-image` | Upload a custom hero image |
| `POST /api/assets/[assetId]/publish` | Publish the page |
| `POST /api/track/click` | Record affiliate CTA clicks |

Guard authenticated and write endpoints with `featureApiGuard("money-page")`.

## Database

Use the shared `sites` table with `sales_page_json`, `sales_page_html`, `theme_config`, `status`, `slug`, and `armed_links`. The NullPing assets migration adds `product_name`, `product_url`, and `asset_source`; `affiliate_clicks` records CTA activity.

## Implementation steps

1. Add `"money-page"` to `enabledFeatures`.
2. Keep copy variations and color themes in feature configuration, not route components.
3. Sanitize generated HTML and validate every affiliate destination.
4. Allow public rendering only for live pages; draft previews remain authenticated.
5. Link the editor to `asset-activator`, `traffic-pins`, and `results`.
