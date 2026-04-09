---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# Design System

## Context

A consistent visual language requires explicit rules about where UI elements come from. Without a declared hierarchy, every developer (or agent) makes individual choices about which tool to reach for, leading to inconsistency and unmaintainable styles. This ADR establishes the hierarchy and the conditions under which each level is used.

## Decision

**Choice:** PrimeNG first, Tailwind v4 second, nothing else.

**Justification:** PrimeNG's component library covers the vast majority of UI needs. Using it as the primary source ensures visual consistency, accessibility, and test coverage by default. Tailwind v4 covers gaps and customization without introducing custom CSS logic. Anything beyond these two requires explicit justification.

### Hierarchy

**Level 1 — PrimeNG:** If a PrimeNG component exists for the need, it is used. Timeline, Card, Galleria, DataView, Chip, Tag, Button, Menu, Panel, Skeleton, Toast, Dialog — all PrimeNG. Theme customization happens through Aura theme tokens, not by overriding component internals.

**Level 2 — Tailwind v4:** When PrimeNG has no equivalent or a component needs layout/spacing adjustments, Tailwind v4 utility classes are applied. The `tailwindcss-primeui` bridge means PrimeNG's design tokens are available as Tailwind utilities — use them.

**Level 3 — Custom:** Any visual element that cannot be satisfied by levels 1 or 2 requires a comment in the component explaining why, and must be accepted by the user before merging. This level should almost never be reached.

### Testing

Every component that wraps a PrimeNG component has a corresponding Vitest test using TestBed. Visual regression is not required, but rendering and interaction logic is covered.

### Structure

All UI lives in components (see ADR-006). A page is never styled directly — it assembles components that carry their own styles via PrimeNG and Tailwind.

## Consequences

Introducing a third-party UI library other than PrimeNG is not permitted without a new ADR. Custom CSS classes that duplicate what Tailwind or PrimeNG already provides are rejected.
