# launchpad

**Feature ID:** `launchpad`  
**Tier:** CORE

## Description

Launch checklist guiding users through connect affiliate program → create content → share link → track results. Instructional UI with step completion tracking.

## User flow

```
/launchpad → Checklist steps with instructions
  → Mark steps complete
  → Links to other enabled modules (image-forge, link-vault, etc.)
```

## Routes

`/launchpad`

## APIs

None — or Supabase for persisted progress.

## Implementation steps

1. Add `"launchpad"` to `enabledFeatures`
2. Define steps in config file (e.g. `launchpad.config.ts`)
3. Create page with checklist UI
4. Step copy references `brand.productName`
