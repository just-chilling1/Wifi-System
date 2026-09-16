# Login & Access

Auth is Supabase email/password. Do not commit real passwords — keep them in `.env.local` (local) or the host env (Vercel). See `env.example` for the variable names.

## Member account

1. Open `/auth/login` (local: [http://localhost:3000/auth/login](http://localhost:3000/auth/login); production follows `NEXT_PUBLIC_SITE_URL`).
2. Sign in with an existing member email and password, **or** create one at `/auth/sign-up` (minimum 6 characters).
3. New members go to `/onboarding`. After onboarding they land on `/dashboard`.
4. Password reset: `/auth/forgot-password` → email from Resend with a `wificodemembers.com` link → `/auth/callback` → `/auth/reset-password`. Requires `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` on the host.

Whether sign-up requires email confirmation is a Supabase Auth setting (Authentication → Providers → Email). If confirmation is on, the user must verify before they can stay signed in.

There is no shared demo login in the repo. Use your own test user, or create one in the Supabase dashboard (Authentication → Users). Role table and QA fill-in: [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md).

## Admin (Promo Links panel)

Set these in `.env.local`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SUPABASE_SERVICE_ROLE_KEY` (required to seed/update the admin user)

Opening `/auth/login` calls `POST /api/auth/ensure-admin`, which creates or updates that admin user, confirms the email, marks onboarding complete, and sets `app_metadata.role = admin`. Sign in with those same credentials. Admins skip onboarding and go to `/admin`. Non-admins who hit `/admin` are redirected to `/dashboard`.

## Local preview without a session

For UI walkthroughs only, set `BYPASS_AUTH=true` or `NEXT_PUBLIC_DEV_BYPASS_AUTH=true` in `.env.local`. This only applies on localhost / private LAN (or `NODE_ENV=development`). Never enable it in production.

## Public routes (no login)

`/auth/*`, `/article`, `/embed` (including the specialist popup), and the specialist eligibility/tracking APIs stay public. See `EMBED.md` for iframe preview (`?preview=` + `NEXT_PUBLIC_SPECIALIST_POPUP_PREVIEW_SECRET`). Product-wide caveats (geo hours, API fallbacks, unlocks) are in [LIMITATIONS.md](LIMITATIONS.md).
