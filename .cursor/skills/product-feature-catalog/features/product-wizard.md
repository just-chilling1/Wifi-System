# product-wizard

**Feature ID:** `product-wizard`  
**Tier:** CORE

## Description

Multi-step digital product builder: niche → sub-topic → problems → outline → chapters → sales page → publish with payment link.

## User flow

```
/new → 5-step wizard
  → Save project → /project/[id]
  → Set payment link (PayPal/Stripe)
  → Publish → public /s/[slug]
/projects → All saved projects
```

## Routes

| Route | Purpose |
|-------|---------|
| `/new` | Full wizard |
| `/project/[id]` | Project detail + publish |
| `/projects` | Project grid |
| `/s/[slug]` | Public sales page |

## APIs (implement incrementally)

| Endpoint | Step |
|----------|------|
| `POST /api/generate/subniches` | Sub-topics |
| `POST /api/generate/problems` | Pain points |
| `POST /api/generate/outline` | Chapters |
| `POST /api/generate/chapter` | Content |
| `POST /api/generate/book` | Assembly |
| `POST /api/generate/salespage` | Sales HTML |
| `POST /api/generate/finalize` | Complete |
| `POST /api/project/[id]/publish` | Go live |
| `POST /api/project/[id]/payment-link` | Payment URL |

## Env vars

```
RAPIDAPI_KEY=
RAPIDAPI_HOST=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SITE_URL=
```

## Supabase

- `projects`, `project_artifacts`, `project_settings`

## Implementation steps

1. Add `"product-wizard"` to `enabledFeatures`
2. Port wizard components to `src/features/product-wizard/`
3. Implement API pipeline in phases
4. Public sales page route
5. Never hardcode API keys — env only

## Branding

Wizard step labels and product output use client niche terminology. `brand.productName` in shell only.
