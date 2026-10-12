# protector

**Feature ID:** `protector`  
**Tier:** PREMIUM

## Description

Account security theater UI: security score gauge, verification badges, encryption claims, license status. Visual trust layer — no real security settings changed.

## User flow

```
/protector → Security score + verified badge
  → Animated scan effect
  → Checklist (SSL, encryption, license)
```

## Routes

`/protector` — premium nav (e.g. "Account Security")

## APIs

None.

## Implementation steps

1. Add `"protector"` to `enabledFeatures`
2. Static/theater page in `src/features/protector/`
3. Premium nav styling
4. Optional pairing with `dopamine` AccountVerifiedModal

## Branding

Display user's real email/initials from auth — not placeholder names.
