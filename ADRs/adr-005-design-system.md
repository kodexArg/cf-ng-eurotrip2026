---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-11
---

# Design System

## Context

Defines where UI elements come from and in what order, so every developer and agent makes consistent choices.

## Decision

### Allowed, in order

1. **PrimeNG component** — first choice for any UI need. Customize via Aura theme tokens only, never override internals.
2. **Tailwind v4 utility** — for layout, spacing, or anything PrimeNG doesn't cover. Use `tailwindcss-primeui` tokens when available.
3. **Custom Angular component** — when 1 and 2 are insufficient, extract a dedicated component (see ADR-006). No raw custom CSS blocks.

No other UI library or template is permitted.

### Units

Use `rem` for all values. `px` is not permitted, except for single-pixel borders (`1px`).

### Testing

Every component wrapping PrimeNG has a Vitest test covering rendering and interaction logic.

## Consequences

Pages assemble components — they carry no styles of their own. Any styling need that bypasses levels 1–3 above is rejected.
