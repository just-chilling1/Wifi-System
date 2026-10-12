# article-wizard

**Feature ID:** `article-wizard`  
**Tier:** CORE

## Description

AI article creation pipeline: niche → headline suggestions → full SEO article with CTAs and affiliate placeholders.

## User flow

```
/create → Enter niche / product URL
  → AI suggests headlines → pick one
  → AI generates full article
  → Save draft → continue to article-images
```

## Routes

`/create` — customize label in nav (e.g. "Create Article", "Power Write")

## APIs

| Endpoint | Env vars |
|----------|----------|
| `POST /api/generate` | `RAPIDAPI_KEY` |
| `POST /api/suggest-headlines` | `RAPIDAPI_KEY` |
| `POST /api/suggest-tags` | `RAPIDAPI_KEY` |
| `POST /api/scrape-link` | `SCRAPERAPI_KEY` |
| `GET/POST /api/articles` | Supabase |

## Supabase

- `articles` — id, user_id, title, body, niche, status, seo_meta

## Implementation steps

1. Add `"article-wizard"` to `enabledFeatures`
2. Multi-step wizard UI in `src/features/article-wizard/`
3. Chain to `article-images` → `article-publish` → `portfolio`
