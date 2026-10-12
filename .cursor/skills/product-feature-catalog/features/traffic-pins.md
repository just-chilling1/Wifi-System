# Traffic Pins

**Feature ID:** `traffic-pins`  
**Reference:** NullPing (`src/features/traffic/`)  
**Tier:** CORE

## Description

Pinterest traffic workspace that generates a batch of ready-to-post pins for a money page. Each pin includes an image, headline, title, description, keywords, and a tracked destination.

## User flow

```text
/traffic/[assetId] → Select a money page
  → Generate ten pins (or regenerate an existing batch)
  → Download images and copy title/description
  → Post manually to Pinterest
  → Visitors arrive at the money page with source and pin tracking
```

Draft money pages must be published before their pin destinations can work.

## Routes

- `/traffic` — asset picker
- `/traffic/[assetId]` — pin workspace
- `/api/pins/[pinId]/image` — generated/downloadable pin image

## APIs

| Endpoint | Purpose | Env vars |
|----------|---------|----------|
| `GET/POST /api/pins/generate` | Load or generate pins for a site | `RAPIDAPI_KEY`, optional image/search keys |
| `GET /api/pins/quota` | Read daily generation quota | Supabase |
| `GET /api/assets/[assetId]` | Load destination site data | Supabase |

Guard every endpoint with `featureApiGuard("traffic-pins")`. Keep posting user-driven; do not automate Pinterest.

## Database

- `site_pins` — site_id, batch_id, title, headline, description, keywords, image URLs
- `page_visits` — site_id, optional pin_id, source, country, timestamp
- `thread_generation_log` — daily generation quota

The NullPing migration also stores image identity metadata to avoid reusing backgrounds across batches.

## Implementation steps

1. Add `"traffic-pins"` to `enabledFeatures`.
2. Require a user-owned site and cap generation with a server-side daily quota.
3. Build pin copy with product context and preserve image provenance.
4. Generate tracking destinations with `src=pinterest` and the pin ID.
5. Link every pin batch to `money-page` and `results`.
