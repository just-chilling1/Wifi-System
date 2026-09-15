# Known Limitations

Operator notes for current product behavior. These are intentional constraints or best-effort fallbacks, not a bug list. Auth walkthrough: [LOGIN.md](LOGIN.md). Embed gate: [EMBED.md](EMBED.md). Mobile chrome: [MOBILE_GUIDE.md](MOBILE_GUIDE.md).

## Auth and access

- There is no shared demo login. Use a real test user or create one in Supabase.
- Email confirmation is a Supabase Auth setting, not something this app overrides. If confirmation is on, the member must verify before they can stay signed in.
- `BYPASS_AUTH` / `NEXT_PUBLIC_DEV_BYPASS_AUTH` only apply on localhost / private LAN, or when `NODE_ENV=development`. Never set these in production.
- `/dev/*` preview routes are blocked outside development (redirect to `/dashboard`).
- Missing Supabase env vars fail closed in production (redirect to `/auth/login`). In local development the request may continue without a session.
- Signed-in members who have not finished onboarding are sent to `/onboarding` on every protected route. Admins skip onboarding and go to `/admin`.
- Upgrade unlock URLs (`/unlock/dfy-vault`, `/unlock/instant-income`, `/unlock/automated-income`) confirm the session and revalidate pages. They do **not** persist `upgrade_level`. Members already receive full feature access on signup. There is no FeatureGuard: a bookmarked premium route still loads if the member is signed in.
- `/admin` is role-gated (`app_metadata.role = admin`). Non-admins are redirected to `/dashboard`.

## Public surfaces

- `/auth/*`, `/article`, `/embed` (including the specialist popup), and the specialist eligibility/tracking APIs stay public. Everything else requires a session (unless local bypass is on).
- The whole site sends `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` and `robots.txt` disallows `/` for all user agents, including common AI crawlers.
- Hosted articles under `/article/` render without the member shell. They are still noindex.

## Start-Up Specialist popup

- Shows only to **US/Canada** IPs, **Monday–Friday 08:30–17:30 Pacific**. Everyone else sees nothing. The gate is server-side and **fails closed** when country cannot be resolved (unknown IP, private IP, missing GeoIP hit).
- Production on DigitalOcean has no country header. Eligibility uses `do-connecting-ip` (or other client-IP headers) plus GeoIP. VPNs, carrier CGNAT, and stale GeoIP data can hide or show the popup incorrectly.
- Localhost almost never has a public client IP, so the popup stays hidden unless you use the preview secret (`EMBED.md`) or, in development only, `?debugCountry=US`.
- Dismiss is **per browser session** (`sessionStorage` inside the iframe). A new tab/session can see it again. If `sessionStorage` is blocked, dismiss may not persist.
- Embed click events store visitor country + device. `user_id` is empty unless the visitor is logged into this app.
- `tel:` CTAs work on phones; desktop visitors get a tel link with no in-app dialer.
- Do not add `X-Frame-Options` / `frame-ancestors` restrictions on the embed host, or third-party iframes break.

## Affiliate links

Saved and fetched offer URLs must be public `https` with no credentials, no custom port, and no private/local host. `http://`, `localhost`, RFC1918, and link-local addresses are rejected. Cloaked or bot-blocked offer pages still save, but product-name scrape then falls back to the hostname stem (for example `example.com` → “Example”).

## External APIs and fallbacks

AI and video search are best-effort. Missing keys or provider errors should not crash a generation; they degrade.

| Capability | Preferred | If missing or failing |
|---|---|---|
| Comment / article / Facebook post AI | `RAPIDAPI_KEY` (+ optional `RAPIDAPI_HOST`) | Niche or product templates. Kits still complete. |
| YouTube Shorts search (Gold Rush, DFY Vault) | `YOUTUBE_API_KEY` | RapidAPI search (aggressively rate-limited), then empty results |
| Article / catalog images | `PIXABAY_API_KEY` | Keyworded stock URLs (LoremFlickr-style) |
| Offer-page scrape | Live fetch of the affiliate URL | Name derived from the hostname; empty blurb |
| Support tickets | Freshdesk, then Resend | Client falls back to `mailto:` |

`README.md` still mentions optional `OPENAI_API_KEY`. Runtime generation uses RapidAPI (`chatgpt-42.p.rapidapi.com` by default), not a first-party OpenAI env var.

In-memory process state is **not** shared across instances and resets on deploy:

- DFY Vault library cache: 30 minutes, per Node process.
- Support quota: 5 tickets per user per rolling hour, per process. A new instance can accept more tickets than the documented cap.

Estimated click counts and viral scores on video cards are **heuristic** (view-count formulas clamped to a small range). They are not measured traffic. Copy already says individual results vary.

## Gold Rush

- Shorts under **50,000 views** are dropped.
- Generic words (`money`, `free`, `course`, …) are ignored when building search queries so results stay niche-specific. A product described only in those words can return few or no videos.
- Without `YOUTUBE_API_KEY` and a working RapidAPI search, the result list is empty. There is no canned sample library on this path.

## Instant Income

- Generates **5** Facebook-style posts per run for a **fixed niche list** (Weight Loss, Make Money Online, Health & Fitness, Beauty & Skincare, Relationships, Tech & Gadgets, Pets, Home & Garden).
- Library uniqueness is one set per member + label (case-insensitive). Saving the same label overwrites the previous posts.
- No Link Vault picker, no per-post mark-as-used, and no sharing of sets.
- If AI is down, posts still generate from niche templates that name the offer and include the link.

## High-Ticket Payouts

- “Mark as Used” is per member + offer link + catalog article. Paste-mode links are keyed by a hash of the normalized URL (no vault id).
- The toggle is disabled until a valid affiliate URL is selected.
- Not implemented: auto-mark on copy, “hide used” filters, or usage shared with other upgrades.

## Done-For-You Profit

- The full kit (article, comments, Facebook posts) is designed to finish even with `RAPIDAPI_KEY` unset, using templates.
- Offer scrape is best-effort (8s timeout, follows redirects, refuses unsafe final URLs). Cloaking pages produce generic copy.
- Hosted articles are public at `/article/[slug]` and noindex.

## Support

- API accepts signed-in members only. Message must be at least 10 characters.
- Quota is 5 requests / user / hour **per server process** (see above).
- Freshdesk domain defaults to `robinhood` unless `FRESHDESK_DOMAIN` is set. If both Freshdesk and Resend are unconfigured or fail, the UI opens the member’s mail client instead of filing a ticket.

## Mobile and PWA

- Bottom tab bar is `lg:hidden`; desktop uses the sidebar. Verify at iPhone SE (375), Pro Max (430), and Android (~412) before shipping visual changes — see [MOBILE_GUIDE.md](MOBILE_GUIDE.md).
- Feature flags in `src/config/features.config.ts` hide nav items when a module is disabled. The route can still be opened from a bookmark unless auth middleware redirects.

## Related docs

- [LOGIN.md](LOGIN.md) — sign-in, admin seed, local bypass
- [EMBED.md](EMBED.md) — specialist iframe, preview secret, click tracking
- [MOBILE_GUIDE.md](MOBILE_GUIDE.md) — viewport, PWA, chrome
- [README.md](README.md) — setup and env overview
