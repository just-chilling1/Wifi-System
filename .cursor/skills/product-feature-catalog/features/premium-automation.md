# premium-automation

**Feature ID:** `premium-automation`  
**Tier:** PREMIUM

## Description

Publishing calendar — assign articles to dates, planning UI. Typically a scheduler/reminder tool rather than live auto-posting to external platforms.

## User flow

```
/automation → Calendar view
  → Assign article to date
  → Reminder / checklist for manual publish
```

## Routes

`/automation`

## Supabase

- `scheduled_posts` — user_id, article_id, scheduled_at, status

## Implementation steps

1. Add `"premium-automation"` to `enabledFeatures`
2. Calendar component + CRUD for scheduled_posts
3. Set user expectations in copy (planning tool)
