# article-publish

**Feature ID:** `article-publish`  
**Tier:** CORE

## Description

Preview article, edit SEO meta, publish or export HTML for external sites.

## User flow

```
/publish?articleId=... → Rendered preview
  → Edit meta title, description, tags
  → Copy HTML / publish to public URL / manual instructions
  → status = published
```

## Routes

`/publish` — optional public `/article/[slug]` for hosted pages

## APIs

| Endpoint | Purpose |
|----------|---------|
| `POST /api/seo-meta` | Generate meta description |
| `PATCH /api/articles` | Update status, published_url |

## Env vars

`NEXT_PUBLIC_APP_URL` if hosting public article pages.

## Implementation steps

1. Add `"article-publish"` to `enabledFeatures`
2. Publish page + optional public route
3. `featureApiGuard("article-publish")` on write APIs
