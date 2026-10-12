# Feature Catalog

**CORE** = main product workflow · **PREMIUM** = upsell / power-up module

This index is the union of the feature IDs identified across all ten app analyses. A product can enable only the modules it needs; the shipped skeleton still enables training only.

Enable a feature via its **Feature ID** in `src/config/features.config.ts`. Full descriptions also live in `FEATURE_CATALOG` in that file.

---

## Union source map

The catalog combines the app analyses instead of treating one product as the default:

| Source app | Contributions represented here |
|------------|--------------------------------|
| AI Wealth | `wealth-sync`, `traffic-hub`, `income-calculator` |
| Profit Loop | `b2b-outreach` |
| BatteryProfits | `article-wizard`, `article-images`, `article-publish`, `portfolio`, `premium-10x`, `premium-infinite`, `premium-automation` |
| CashTap AI | `core-workflow` and shared engagement patterns |
| BlackBox Cash | `blog-builder`, `extraction-workflow`, `comment-pack`, and premium campaign modules |
| Secret Millionaire | `blog-builder` and extraction workflow variants |
| NullPing Cash | `asset-activator`, `money-page`, `traffic-pins`, `results` |
| Q-Labs 2000 | `image-forge`, `money-links-vault`, `launchpad` |
| Robinhood / YouTube Gold Rush | `comment-pack` and public pack tracking |
| Click Clone Profits | `product-wizard`, `niche-finder` |

Existing IDs retain their guides and reference implementations; this task registers the union and documents the remaining port work without copying full feature code.

---

## Foundation

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `training` | CORE | Training page: videos, FAQ, workflow guide, checklist | [training-support](features/training-support.md) |
| `dopamine` | CORE | Social proof toasts, earnings counters, popups, trust bar | [dopamine-engagement](features/dopamine-engagement.md) |
| `scale-upsell` | CORE | Scale-training sales page with external checkout link | [scale-training-upsell](features/scale-training-upsell.md) |

Auth, onboarding, support, and home dashboard are **built into the skeleton** (not feature flags). See [auth-onboarding](features/auth-onboarding.md).

---

## Affiliate reply workflow

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `core-workflow` | CORE | Search → analysis → radar → AI-generated replies | [core-workflow](features/core-workflow.md) |
| `extraction-workflow` | CORE | Extract, filter, and save prospects or conversations from supported sources | [extraction-workflow](features/extraction-workflow.md) |

---

## Content & publishing

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `blog-builder` | CORE | Plan, draft, optimize, and publish SEO blog content | [blog-builder](features/blog-builder.md) |
| `article-wizard` | CORE | AI article: niche → headlines → full body | [article-wizard](features/article-wizard.md) |
| `article-images` | CORE | Hero and social images for drafts | [article-images](features/article-images.md) |
| `article-publish` | CORE | Preview, SEO meta, publish or export HTML | [article-publish](features/article-publish.md) |
| `portfolio` | CORE | Saved drafts and published articles library | [portfolio](features/portfolio.md) |
| `comment-pack` | CORE | Reusable batches of helpful, platform-aware comments and replies | [comment-pack](features/comment-pack.md) |
| `premium-10x` | PREMIUM | Legacy alias for bulk social post variants | [premium-social](features/premium-social.md) |
| `premium-infinite` | PREMIUM | Batch-generate multiple articles from one niche | [premium-infinite](features/premium-infinite.md) |
| `premium-automation` | PREMIUM | Publishing calendar and scheduled posts | [premium-automation](features/premium-automation.md) |

---

## Image & link affiliate

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `image-forge` | CORE | AI image generator from prompts or templates | [image-forge](features/image-forge.md) |
| `asset-activator` | CORE | Turn approved assets into channel-ready posts, images, and CTAs | [asset-activator](features/asset-activator.md) |
| `money-links-vault` | CORE | Save, label, and copy affiliate links | [money-links-vault](features/money-links-vault.md) |
| `money-page` | CORE | Hosted conversion or bridge page around an offer and CTA | [money-page](features/money-page.md) |
| `launchpad` | CORE | Launch checklist: connect, create, share, track | [launchpad](features/launchpad.md) |

---

## B2B outreach

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `b2b-outreach` | CORE | Offers library → lead finder → AI email builder | [b2b-outreach](features/b2b-outreach.md) |

---

## Bridge pages & traffic

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `wealth-sync` | CORE | Affiliate URL → AI bridge/review page | [wealth-sync](features/wealth-sync.md) |
| `traffic-hub` | CORE | Outreach targets and AI comments for promotion | [traffic-hub](features/traffic-hub.md) |
| `traffic-pins` | CORE | Create and track Pinterest-style pins that send visitors to a target page | [traffic-pins](features/traffic-pins.md) |
| `income-calculator` | CORE | Income projection from traffic and commission | [income-calculator](features/income-calculator.md) |
| `results` | CORE | Dashboard for traffic, content, lead, and conversion progress | [results](features/results.md) |
| `premium-recurring` | PREMIUM | Recurring-commission offer catalog | [premium-recurring](features/premium-recurring.md) |

---

## Digital products

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `product-wizard` | CORE | Niche → ebook → sales page → publish | [product-wizard](features/product-wizard.md) |
| `niche-finder` | CORE | Discover sub-niches → start product wizard | [niche-finder](features/niche-finder.md) |

---

## Premium upsells (shared pattern)

| Feature ID | Tier | Description | Guide |
|------------|------|-------------|-------|
| `premium-dfy` | PREMIUM | Done-for-you vault (keywords, articles, images, leads, products) | [premium-dfy](features/premium-dfy.md) |
| `premium-dfy-profit` | PREMIUM | Done-for-you profit campaigns with monetization-ready assets and launch steps | [premium-dfy-profit](features/premium-dfy-profit.md) |
| `premium-instant` | PREMIUM | Pre-written social posts with images | [premium-instant](features/premium-instant.md) |
| `premium-autopilot` | PREMIUM | Traffic source checklist with promotion URL | [premium-autopilot](features/premium-autopilot.md) |
| `premium-social` | PREMIUM | Bulk social post variants from one article or campaign | [premium-social](features/premium-social.md) |
| `premium-accelerator` | PREMIUM | Advanced growth playbooks for repeatable campaigns | [premium-accelerator](features/premium-accelerator.md) |
| `premium-license-rights` | PREMIUM | Licensed content library with usage rights and attribution records | [premium-license-rights](features/premium-license-rights.md) |
| `protector` | PREMIUM | Account security score and trust UI | [protector](features/protector.md) |

`premium-10x` is a legacy alias for `premium-social`; either ID can be used in a product preset and both resolve to the same capability.

---

## Quick pick by product type

| Building… | Enable these CORE features |
|-----------|------------------------------|
| Affiliate / reply app | `core-workflow`, `extraction-workflow`, `comment-pack`, `dopamine`, `training` |
| SEO / content site | `blog-builder`, `article-wizard`, `article-images`, `article-publish`, `portfolio` |
| Image + link affiliate | `image-forge`, `asset-activator`, `money-links-vault`, `money-page`, `launchpad` |
| B2B outreach SaaS | `b2b-outreach`, `training` |
| Bridge + traffic app | `wealth-sync`, `money-page`, `traffic-hub`, `traffic-pins`, `income-calculator`, `results` |
| Digital product launcher | `product-wizard`, `niche-finder` |
| Monetized app (any) | Add `premium-dfy`, `premium-instant`, `premium-autopilot` as needed |

Preset arrays: `src/config/features.config.example.ts` includes affiliate, content, money-site, NullPing asset, YouTube comment, image/link, bridge/traffic, B2B, and digital-product stacks.

---

## Environment variables (by feature)

Copy **names** into `.env.local`. Never commit real keys.

### Universal (every product)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin |
| `NEXT_PUBLIC_APP_URL` | App domain |
| `NEXT_PUBLIC_PRODUCT_NAME` | Software name → `brand.productName` |
| `WEBHOOK_SIGNUP_URL` | Optional signup webhook |
| `APP_URL` | Legacy app URL name used by some source apps |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for hosted pages |

### AI text (RapidAPI)

| Variable | Features |
|----------|----------|
| `RAPIDAPI_KEY` | `core-workflow`, `extraction-workflow`, `blog-builder`, `comment-pack`, `asset-activator`, `article-wizard`, `b2b-outreach`, `wealth-sync`, `traffic-hub`, `traffic-pins`, `product-wizard`, `premium-dfy-profit`, `premium-social`, `premium-infinite` |
| `RAPIDAPI_HOST` | ChatGPT host |
| `RAPIDAPI_HOST_CHATGPT` | Explicit ChatGPT host alias |
| `RAPIDAPI_HOST_REDDIT` | Reddit provider host |
| `RAPIDAPI_HOST_YOUTUBE` | YouTube provider host |
| `RAPIDAPI_IMAGE_HOST` | Image provider host |
| `RAPIDAPI_IMAGE_PATH` | Image provider path |
| `RAPIDAPI_NANO_MODEL` | Optional text model override |
| `OPENAI_API_KEY` | Optional article/image provider |
| `GEMINI_API_KEY` | Optional image provider |
| `GEMINI_IMAGE_MODEL` | Optional Gemini image model |
| `PIXABAY_API_KEY` | Optional stock image provider |

### AI images

| Variable | Features |
|----------|----------|
| `RAPIDAPI_HOST_IMAGE` | `image-forge`, `article-images`, `asset-activator`, `traffic-pins`, `premium-instant`, `premium-dfy` |

### Scraping

| Variable | Features |
|----------|----------|
| `SCRAPERAPI_KEY` | `core-workflow`, `extraction-workflow`, `article-wizard`, `wealth-sync`, `traffic-hub` |
| `SCRAPER_API_KEY` | Legacy scraper key alias used by blog-builder |

### Support and premium seed

| Variable | Features |
|----------|----------|
| `FRESHDESK_DOMAIN` | Shared support and license-rights requests |
| `FRESHDESK_API_KEY` | Shared support and license-rights requests |
| `RESEND_API_KEY` | Support email fallback |
| `RESEND_FROM_EMAIL` | Support email sender |
| `TEMPLATE_OWNER_ID` | Premium accelerator seed owner |
| `ACCELERATOR_SEED_SECRET` | Premium accelerator seed endpoint |
| `RECURRING_SEED_SECRET` | Premium recurring seed endpoint |

### Optional product-specific

`YOUTUBE_API_KEY`, `PINTEREST_TOKEN`, `INSTAGRAM_TOKEN`, `STOCK_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SPECIALIST_POPUP_PREVIEW_SECRET`, `IMAGE_RESOLUTION_CONCURRENCY`, `TEXT_GENERATION_CONCURRENCY`, and product-specific daily-limit variables.

Vimeo IDs → `training.config.ts`, not env.

### Supabase tables

Add migrations when implementing: `articles`, `bridges`, `offers`, `leads`, `projects`, `dfy_*`, `instant_income_posts`, `autopilot_sources`, etc. Each feature guide lists its tables.

API routes: use `getApiUser` + `featureApiGuard(featureId)` from `src/lib/`.
