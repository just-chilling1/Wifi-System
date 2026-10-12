# Premium Done-For-You Profit

**Feature ID:** `premium-dfy-profit`  
**Reference:** BlackBox Cash / NullPing  
**Tier:** PREMIUM  
**Route:** `/dfy-profit`

## Description

One-click affiliate promo kit. The user enters an affiliate link and picks a niche; the app generates:

1. A hosted sales page from a ready-made template
2. A 10-post X story thread with three visuals
3. A copy-ready authority article preview
4. Exactly three Facebook posts promoting the sales page, with visuals on two variants

Sales pages reuse `sites`; Facebook posts, X threads, and the authority article are saved to the offer library. The article is not published as a public site post.

## User flow

```text
/dfy-profit → affiliate link + niche → Generate
  → POST /api/premium/dfy-profit/start
  → POST /api/premium/dfy-profit/x-thread
  → POST /api/premium/dfy-profit/article
  → POST /api/premium/dfy-profit/posts
  → Results panel with article preview and copy buttons
```

Stages run sequentially from the client so each AI call stays within the route limit. Failed article or post stages can be retried independently.

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/premium/dfy-profit/start` | Scrape offer, select a template, and create a live sales page |
| `POST /api/premium/dfy-profit/article` | Save a copyable authority article |
| `POST /api/premium/dfy-profit/posts` | Generate three Facebook posts and save image URLs |
| `POST /api/premium/dfy-profit/x-thread` | Generate a ten-post X story thread and save three image URLs |

Guard every endpoint with `featureApiGuard("premium-dfy-profit")` and an entitlement check.

## Module shape

```text
src/features/dfy-profit/
  pages/DfyProfitPage.tsx
  components/DfyResultPanel.tsx
  lib/pick-random-template.ts
  lib/generate-authority-article.ts
```

## Enable

```typescript
enabledFeatures: [..., "premium-dfy-profit"]
```

## Env vars

`RAPIDAPI_KEY`, `RAPIDAPI_HOST`, optional `SCRAPERAPI_KEY` and `PIXABAY_API_KEY`.
