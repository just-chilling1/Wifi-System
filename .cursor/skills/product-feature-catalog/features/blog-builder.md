# Blog Builder

**Feature ID:** `blog-builder`  
**Reference implementation:** BlackBox Cash / Secret Millionaire (`src/features/blog-builder/`)  
**Tier:** CORE

## Workflow

1. `/arm-links` — Add affiliate link (Content Reserve)
2. `/territory` — Pick a niche
3. `/theme` — Choose template, colors, and fonts
4. `/deploy` — Generate with AI and publish

## Resource routes

- `/link-vault` — Manage saved links
- `/asset` — My websites vault
- `/sites/[siteSlug]` — Public hosted site (no auth)

## API routes

Session/vault: `session`, `link-vault`

Generation: `create-site`, `publish`, `generate-deploy-batch`, `generate-one-post`, `deploy-state`, `scrape`, `trend-angles`, `prefetch-images`, `attach-site-images`, `quota`, `track-click`, `site`, `posts/[postId]`

Guard authenticated and write routes with `featureApiGuard("blog-builder")`.

## Database

- `blog_builder_sessions`, `link_vault` — kickoff
- `sites`, `posts`, `affiliate_clicks`, `affiliate_scrape_cache` — generation
- `sites.theme_config` jsonb — user theme overrides from Step 3

## Enable

```typescript
enabledFeatures: ["training", "blog-builder", "dopamine"]
```

## Env vars

```text
SUPABASE_SERVICE_ROLE_KEY
RAPIDAPI_KEY
RAPIDAPI_HOST
PIXABAY_API_KEY
RAPIDAPI_IMAGE_HOST
SCRAPER_API_KEY
TEXT_GENERATION_CONCURRENCY
```

BlackBox and Secret Millionaire use the same feature ID with different route flavors; keep one white-label guide and configure the labels/routes per product.
