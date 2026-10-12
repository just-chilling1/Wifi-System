# core-workflow

**Feature ID:** `core-workflow`  
**Tier:** CORE

## Description

Four-step affiliate reply workflow: find topics, analyze demand, discover threads, generate AI reply copy.

## User flow

```
/dashboard → Search (enter niche keyword)
  → LLM expands keywords, cached in Supabase
  → User picks variation → lazy-load posts per chip
Analysis → Score threads, opportunity metrics
Radar → Matching threads (forums, Reddit, YouTube)
Replies → Generate reply variants → copy / save
```

## Routes to implement

| Route | Label (customize in navigation.config.ts) |
|-------|---------------------------------------------|
| `/search` | Step 1: Enter Topic |
| `/analysis` | Step 2: Check Demand |
| `/radar` | Step 3: Find Ads |
| `/replies` | Step 4: Create Replies |

## Skeleton module

`src/features/core-workflow/` — pages, `CoreWorkflowProvider`, `WorkflowNavContext`

## APIs

| Endpoint | Purpose | Env vars |
|----------|---------|----------|
| `POST /api/search` | Keyword expansion | `RAPIDAPI_KEY`, `RAPIDAPI_HOST` |
| `POST /api/analysis` | Thread analysis | `SCRAPERAPI_KEY`, `RAPIDAPI_KEY` |
| `POST /api/radar` | Fetch threads | `RAPIDAPI_KEY`, `RAPIDAPI_HOST_REDDIT`, `RAPIDAPI_HOST_YOUTUBE`, `SCRAPERAPI_KEY` |
| `POST /api/replies` | Generate replies | `RAPIDAPI_KEY`, `RAPIDAPI_HOST` |

Guard each route: `featureApiGuard("core-workflow")`.

## Supabase tables

- `keyword_variations` — parent_keyword, variations
- `search_history` — keyword, user_id
- `saved_keywords`, `saved_replies`

## Implementation steps

1. Add `"core-workflow"` to `enabledFeatures`
2. Uncomment `workflowSteps` in `navigation.config.ts` (already defined)
3. Implement pages under `src/features/core-workflow/pages/`
4. Add API routes under `src/app/api/`
5. Migration for tables above
6. Add keys to `.env.local.example`
7. Label all steps using `brand.productName` in page headers

## Related

`dopamine` for dashboard engagement; `premium-dfy`, `premium-instant`, `premium-autopilot` for upsells.
