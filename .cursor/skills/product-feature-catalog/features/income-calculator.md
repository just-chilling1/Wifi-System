# income-calculator

**Feature ID:** `income-calculator`  
**Tier:** CORE

## Description

Interactive income planner: sliders for visitors, conversion %, commission — shows projected daily/weekly/monthly earnings.

## User flow

```
/calculator → Adjust inputs → live calculated totals
  → Optional CTA to add products or upgrade
```

## Routes

`/calculator`

## APIs

None — client-side math.

## Implementation steps

1. Add `"income-calculator"` to `enabledFeatures`
2. Calculator page with formatted currency
3. Labels from `navigation.config.ts` (e.g. "Income Planner")
