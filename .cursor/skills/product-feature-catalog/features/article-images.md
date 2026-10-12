# article-images

**Feature ID:** `article-images`  
**Tier:** CORE

## Description

Generate hero and social share images for an article draft.

## User flow

```
/images?articleId=... → Preview article title
  → Generate hero image from title/niche
  → Save URLs on article record
  → Continue to publish
```

## Routes

`/images`

## APIs

`POST /api/generate-image` — `RAPIDAPI_KEY`, `RAPIDAPI_HOST_IMAGE`

## Implementation steps

1. Add `"article-images"` to `enabledFeatures`
2. Requires `article-wizard` (shared `articles` table)
3. Reuse generate-image API from `image-forge` or shared `src/app/api/generate-image/`
