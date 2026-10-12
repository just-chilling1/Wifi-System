# image-forge

**Feature ID:** `image-forge`  
**Tier:** CORE

## Description

AI image generator for marketing: enter a prompt or pick a template, generate, save to library, download.

## User flow

```
/image-forge → Prompt or template
  → Generate → preview
  → Save to library / download
  → Optional link to money-links-vault
```

## Routes

`/image-forge` — add to `navigation.config.ts` with custom label

## APIs

| Endpoint | Env vars |
|----------|----------|
| `POST /api/generate-image` | `RAPIDAPI_KEY`, `RAPIDAPI_HOST_IMAGE` |
| `POST /api/chat` | `RAPIDAPI_KEY` (optional captions) |

## Supabase

- `generated_images` — user_id, prompt, image_url, created_at
- Optional Supabase Storage bucket for images

## Implementation steps

1. Add `"image-forge"` to `enabledFeatures`
2. Create `src/features/image-forge/`
3. Implement `/api/generate-image` with `featureApiGuard("image-forge")`
4. Migration + storage bucket
