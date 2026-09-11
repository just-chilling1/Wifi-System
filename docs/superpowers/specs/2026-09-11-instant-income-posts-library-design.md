# Instant Income — Posts Library

**Date:** 2026-09-11  
**Status:** Approved

## Summary

Save each Instant Income generation as a named post set. One set per custom label (upsert). Persist account-wide in Supabase. Library on the Instant Income page lists sets by label for re-copying.

## Decisions

| Decision | Choice |
| --- | --- |
| Naming | Custom label (prefill from URL host) |
| Uniqueness | One set per user + label (case-insensitive) |
| Persistence | Database |
| Storage | `instant_income_post_sets` with jsonb posts |

## Data model

`public.instant_income_post_sets`:

- `id` uuid PK
- `user_id` uuid → users ON DELETE CASCADE
- `name` text NOT NULL (display label)
- `affiliate_url` text NOT NULL
- `niche` text NOT NULL
- `posts` jsonb NOT NULL — array of `{ id, body }` personalized strings
- `created_at`, `updated_at` timestamptz

Unique index on `(user_id, lower(trim(name)))`. RLS: own rows only.

## Behavior

1. Label field required before generate (default from URL hostname when link changes).
2. Generate personalizes niche templates, upserts set by label, shows results + refreshes library.
3. Library: list sets (name, niche, post count, updated); open expands/copies posts; delete optional.

## Out of scope

- Link Vault picker
- Mark-as-used per post
- Sharing sets
