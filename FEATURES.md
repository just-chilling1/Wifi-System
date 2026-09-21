# Feature Summary

What Wifi Code actually ships today, using the labels members see in the sidebar. Caveats and fallbacks: [LIMITATIONS.md](LIMITATIONS.md). Sign-in: [LOGIN.md](LOGIN.md).

Wifi Code is a signed-in member area for promoting an affiliate offer: find YouTube Shorts, generate comments that include the member’s link, save that work, then use premium kits for articles, Facebook posts, and traffic-source lists. Members receive full feature access on signup.

## Member path

1. Sign up at `/auth/sign-up` (first name, email, password) or sign in at `/auth/login`. New members pass through `/onboarding` (account setup, then a click-to-call success consultation) and then land on `/dashboard`. Returning members land on `/dashboard`.
2. Dashboard **Start Here** plays three Vimeo videos in order: *Watch This First*, *How The Money Flows*, *Your 5-Minute Tour*. Bonus-training cards sit between them. Primary CTAs go to Gold Rush and the Academy.
3. Day-to-day work: Gold Rush → My Vault / Your Links → Academy. Premium tools live under `/upgrades/*`.
4. Desktop uses the sidebar. Mobile uses a four-tab bar (Home, Gold Rush, Vault, Academy) plus a More sheet (Your Links, Support).

## Core workspace

| UI name | Route | What it does |
|---|---|---|
| Dashboard | `/dashboard` | Home: intro videos, bonus-training cards, premium-upgrade widget, tips, support shortcut. |
| Gold Rush | `/create` | Enter product name, description, and an `https` affiliate URL (paste or pick from Your Links). Search **trending** or **niche** Shorts, then generate a comment pack with the link inside. Packs save to My Vault. |
| My Vault | `/pages` | Library of saved comment packs. Open a pack, copy a comment, jump to the YouTube Short. Empty state sends the member to Gold Rush. |
| Your Links | `/share` | Link Vault: create, edit, delete, and copy affiliate URLs (name, niche, notes). Gold Rush and several premium pages pick from this list. |
| Academy | `/training` | In-app training library: mindset + how-to pairs for Gold Rush, My Vault, and Link Vault, plus a premium-feature video section. |
| Support | `/support` | FAQ plus a contact form. Tickets go to Freshdesk, then Resend; otherwise the mail client opens. |
| Bonus training | `/bonus-training` | Admin-editable scale-training title and outbound CTA (promo-links settings). |

Gold Rush filters Shorts below 50,000 views and ignores generic query words. Comment generation uses RapidAPI when configured, otherwise templates. See [LIMITATIONS.md](LIMITATIONS.md).

## Premium features

The upgrades index is `/upgrades` (“Your Premium Content”). Each tool has its own how-to Vimeo on the page.

| UI name | Route | What it does |
|---|---|---|
| Done-For-You Profit | `/upgrades/dfy-profit` | One affiliate URL + one niche → kit of **5 videos** (with comments), a hosted **authority article**, and **Facebook posts**. Kits save by name (same name overwrites). Articles publish at `/article/[slug]`. |
| Guaranteed High-Ticket Payouts | `/upgrades/high-ticket-payouts` | Catalog of **100** long-form templates across **9 niches**. Weaves the selected offer link into CTAs. Preview, copy plain text or HTML, mark articles used per offer. Cross-platform posting guide (Medium, LinkedIn, Quora, blog). |
| Unlimited | `/upgrades/dfy-vault` | Browse a preloaded vault of high-view Shorts by niche. Lock product name + money link once; each video has **5** comments with the offer inserted. Generations save under the product name. |
| Instant Income | `/upgrades/instant-income` | Writes **5** Facebook-style posts for a chosen niche and offer URL. Named sets upsert into a per-member library (reopen, copy, delete, mark a post used). Includes a Facebook-groups how-to. |
| Automated Profits | `/upgrades/automated-income` | Directory of **100+** traffic sources (forums and similar) by niche. Member pastes a page URL, then follows per-source steps and copy-ready submission text. |
| Reseller & License Rights | `/upgrades/license-rights` | Request form that files a **License Rights** support ticket. Page lists edition contents; the team activates the reseller edition off-app. |
| Cyber Protection | `/upgrades/protector` | Account security overview: email verification, session/encryption status, plan label, and recent-activity style checks. Not a third-party antivirus product. |

Instant Income niches: Weight Loss, Make Money Online, Health & Fitness, Beauty & Skincare, Relationships, Tech & Gadgets, Pets, Home & Garden. Done-For-You Profit uses the same niche list.

High-Ticket niches: Health & Wellness, Finance & Investing, Fitness & Sports, Digital Marketing, Self-Help & Personal Development, Beauty & Skincare, Education & Learning, Business & Entrepreneurship, Travel & Lifestyle.

## Admin and public surfaces

| Surface | Route | Who | What it does |
|---|---|---|---|
| Promo Links panel | `/admin` | Admin role only | Edit exclusive-offer URLs, bonus-training CTA, and related promo copy stored in Supabase. |
| Hosted articles | `/article/[slug]` | Public | DFY Profit authority articles (no member chrome, still noindex). |
| Specialist popup embed | `/embed/specialist-popup` | Public | Start-Up Specialist iframe. Geo + Pacific-hours gate. See [EMBED.md](EMBED.md). |
| Unlock landings | `/unlock/dfy-vault`, `/unlock/instant-income`, `/unlock/automated-income` | Signed-in | Confirm session and revalidate pages. They do not persist a new plan (access is already open on signup). |

Auth pages (`/auth/*`) and password reset stay public. The site is noindex site-wide.

## Config vs pages

Feature IDs, nav labels, and brand copy live in `src/config/` (`features.config.ts`, `navigation.config.ts`, `brand.config.ts`). Premium display names are centralized in `lib/premium-features.ts`. Hiding a feature in config hides the nav item; the route can still open from a bookmark.

## Related docs

- [LIMITATIONS.md](LIMITATIONS.md) — gates, API fallbacks, unlock behavior
- [LOGIN.md](LOGIN.md) — accounts, admin seed, local bypass
- [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) — QA roles and how to get accounts
- [EMBED.md](EMBED.md) — specialist iframe
- [MOBILE_GUIDE.md](MOBILE_GUIDE.md) — viewport and chrome
- [README.md](README.md) — setup
