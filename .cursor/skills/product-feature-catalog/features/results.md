# Results

**Feature ID:** `results`  
**Reference:** NullPing (`src/features/results/`)  
**Tier:** CORE

## Description

Performance view for activated assets. It reports live money pages, generated traffic assets, real visitors, affiliate clicks, per-asset CTR, and a recent activity feed. Empty states must never invent metrics.

## User flow

```text
/results → Load the member's assets
  → Review live pages, pins, visitors, and affiliate clicks
  → Open an asset, preview its page, or generate traffic
  → Follow the recent activity feed
```

## Routes

- `/results` — authenticated results dashboard
- `/api/results` — user-scoped summary payload

## API

`GET /api/results` loads member-owned `sites`, counts `site_pins`, `page_visits`, and `affiliate_clicks`, and builds the activity feed. Return a warning when an optional metrics table is not available rather than substituting fake values.

Guard the endpoint with `featureApiGuard("results")` and `getApiUser`.

## Database

- `sites` — live/draft asset status and public paths
- `site_pins` — traffic asset counts and batch activity
- `page_visits` — real public-page visits
- `affiliate_clicks` — CTA click counts

The results activity helper merges visits, affiliate clicks, pin batches, and publish events into one time-sorted feed.

## Implementation steps

1. Add `"results"` to `enabledFeatures`.
2. Query only assets owned by the authenticated user.
3. Calculate CTR from visits and clicks server-side.
4. Provide loading, empty, schema-warning, and error states.
5. Link rows to `money-page`, public previews, and `traffic-pins`.
