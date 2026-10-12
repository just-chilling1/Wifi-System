# Extraction Workflow

**Feature ID:** `extraction-workflow`  
**Reference:** BlackBox Cash / Secret Millionaire (`src/features/extraction-workflow/`)  
**Tier:** CORE

## Overview

Connect → scan → extract dashboard. When enabled, this can replace the default developer checklist on `/dashboard` with a product-specific connection and extraction home.

## Routes

- `/dashboard` — connection and extraction dashboard

## API

- `/api/extraction/session` — server-side workflow state

## Database

- `extraction_sessions` — connection status, scan state, and extracted counts

## Components

- `ConnectionStatus`
- `ProfitTicker`
- `GlobalNetworkMap`
- `ExtractionWorkflowProvider`

## Enable

```typescript
enabledFeatures: [..., "extraction-workflow"]
```

Do **not** enable alongside `core-workflow` — pick one primary workflow per product.
