# premium-infinite

**Feature ID:** `premium-infinite`  
**Tier:** PREMIUM

## Description

Batch-generate multiple full articles from a single niche input.

## User flow

```
/infinite → Enter niche + count (e.g. 5)
  → Progress UI while generating
  → All saved as drafts in portfolio
```

## APIs

Sequential `POST /api/generate` + `POST /api/articles` — `RAPIDAPI_KEY`

## Implementation steps

1. Add `"premium-infinite"` to `enabledFeatures`
2. Batch job UI with rate limiting
3. Requires `article-wizard` APIs
