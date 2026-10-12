# portfolio

**Feature ID:** `portfolio`  
**Tier:** CORE

## Description

Library of all article drafts and published pieces. Filter, open, edit, delete.

## User flow

```
/saved → Grid: title, niche, status, date
  → Open → edit / re-publish / delete
  → Filter: draft | published
```

## Routes

`/saved` or `/portfolio`

## APIs

`GET /api/articles`, `DELETE /api/articles`

## Implementation steps

1. Add `"portfolio"` to `enabledFeatures`
2. List page reading `articles` table
3. Depends on `article-wizard` migration
