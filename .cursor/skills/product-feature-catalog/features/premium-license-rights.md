# Premium License Rights

**Feature ID:** `premium-license-rights`  
**Reference:** BlackBox Cash / NullPing  
**Tier:** PREMIUM  
**Route:** `/license-rights`

## Description

Turnkey reseller and license-rights edition. Members request activation through a support ticket titled **License Rights**. The page lists locked deliverables — reseller license, rebrandable assets, sales pages, and support docs — until the team activates the account manually.

There is no dedicated database table or admin UI in the reference flow. A successful submit stores a pending flag in user-scoped localStorage so the page shows “Request received — awaiting team activation” after reload.

## User flow

```text
/license-rights → request form (email + message)
  → POST /api/support { email, message, subject: "License Rights" }
  → Freshdesk ticket (Resend fallback)
  → Pending panel in localStorage
```

Mailto fallback uses subject `License Rights` if the API cannot send.

## API

Reuse the shared support endpoint; do not create a separate premium API:

- `POST /api/support` — accept an optional sanitized `subject` (maximum 80 characters), prefix the provider subject with the configured product name, and include the request type in the body.

## Persistence

| Key | Scope |
|-----|-------|
| `{brand.storagePrefix}_license_rights_request_{userId}` | Client localStorage JSON `{ email, submittedAt }` |

Activation is manual. Clearing the pending panel only resets the local flag.

## Enable

```typescript
enabledFeatures: [..., "premium-license-rights"]
```

## Env vars

`FRESHDESK_API_KEY`, `FRESHDESK_DOMAIN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
