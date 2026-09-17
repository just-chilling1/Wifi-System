# Test Credentials

How QA and local operators get accounts. **This repo does not ship a shared demo login.** Do not commit real emails or passwords. Put them in `.env.local` (gitignored) or the host env. Variable names: `env.example`. Sign-in flow: [LOGIN.md](LOGIN.md).

## Where to sign in

| Environment | Login URL |
|---|---|
| Local | [http://localhost:3000/auth/login](http://localhost:3000/auth/login) |
| Production | `{NEXT_PUBLIC_SITE_URL}/auth/login` |

Sign-up: `/auth/sign-up` (password minimum 6 characters). Password reset: `/auth/forgot-password`. If Supabase email confirmation is on, the member must verify before they can stay signed in.

## Roles

| Role | How you get it | Lands on | Can open |
|---|---|---|---|
| Member | Create at `/auth/sign-up`, or add a user in Supabase → Authentication → Users | `/dashboard` | All member routes. `/admin` redirects to `/dashboard`. |
| Admin | `ADMIN_EMAIL` + `ADMIN_PASSWORD` + `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Open `/auth/login` once so `POST /api/auth/ensure-admin` seeds or updates the user (email confirmed, onboarding complete, `app_metadata.role = admin`). Sign in with those same values. | `/admin` | Promo Links panel. Also treated as admin if the signed-in email matches `ADMIN_EMAIL`. |
| Local bypass | `BYPASS_AUTH=true` or `NEXT_PUBLIC_DEV_BYPASS_AUTH=true` | Protected pages without a session | UI walkthroughs only. Localhost / private LAN, or `NODE_ENV=development`. Never enable in production. |

Members already have full premium-page access on signup. Unlock URLs do not persist a new plan — see [LIMITATIONS.md](LIMITATIONS.md).

## Local fill-in (do not commit)

Copy this table into a note or password manager. Leave the committed copy empty.

| Account | Email | Password | Notes |
|---|---|---|---|
| Admin | value of `ADMIN_EMAIL` | value of `ADMIN_PASSWORD` | Seeded when `/auth/login` loads. Requires `SUPABASE_SERVICE_ROLE_KEY`. |
| Member (create your own) | | | Use a disposable inbox. |
| Member (Supabase dashboard) | | | Authentication → Users → Add user. Confirm email if your project requires it. |

## Other QA secrets (env names only)

| Purpose | Env var | How to use |
|---|---|---|
| Specialist popup force-preview | `NEXT_PUBLIC_SPECIALIST_POPUP_PREVIEW_SECRET` | `/embed/specialist-popup?preview=<secret>`. See [EMBED.md](EMBED.md). |
| Specialist country (dev only) | none | `?debugCountry=US` on the eligibility request in development. |
| Auth bypass | `BYPASS_AUTH` / `NEXT_PUBLIC_DEV_BYPASS_AUTH` | `true` — local only. |

`/dev/*` preview pages work only when `NODE_ENV=development`.

## Production

Use the host’s env (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, service role). Do not reuse local bypass or the specialist preview secret on a public URL unless you intend that QA path. There is no built-in read-only tester role.

## Related docs

- [LOGIN.md](LOGIN.md) — sign-in, seed behavior, public routes
- [FEATURES.md](FEATURES.md) — what each signed-in page does
- [LIMITATIONS.md](LIMITATIONS.md) — gates and unlock behavior
- [EMBED.md](EMBED.md) — popup preview
- [README.md](README.md) — setup
