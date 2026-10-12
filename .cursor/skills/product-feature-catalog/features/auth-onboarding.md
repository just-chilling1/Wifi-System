# auth-onboarding

**Feature ID:** _(built-in — not a feature flag)_  
**Tier:** CORE

## Description

Sign up, login, forgot password, email verification, and first-run onboarding slides. Ships with the skeleton shell.

## User flow

1. User visits `/login` or `/signup`
2. After signup → optional email verify → `/onboarding` or `/dashboard`
3. Onboarding slides from `onboarding-content.ts`
4. Forgot password → email → `/reset-password`

## Skeleton locations

| Route | Path |
|-------|------|
| Login | `src/app/login/page.tsx` |
| Signup | `src/app/signup/page.tsx` |
| Onboarding | `src/app/onboarding/page.tsx` |
| Auth callback | `src/app/auth/callback/route.ts` |

## Config

- `src/config/onboarding-content.ts` — slide copy, partner CTA URL
- `src/config/brand.config.ts` — product name, colors
- `NEXT_PUBLIC_APP_URL` — redirect URLs

## Env vars

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`

## Implementation

Customize onboarding copy and branding only. See [SUPABASE_AUTH_SETUP.md](../../../../SUPABASE_AUTH_SETUP.md).
