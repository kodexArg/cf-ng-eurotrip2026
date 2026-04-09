---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# Requirements

## Context

This ADR declares the product requirements that are already decided and binding. It does not debate alternatives — these are constraints, not proposals. The PRD (`PRD.md`) holds the full feature description; this ADR records the non-negotiable decisions that shape everything built on top.

## Decision

**Choice:** The following requirements are accepted and locked.

**Infrastructure and platform:**
- The entire stack runs exclusively on Cloudflare. No external services, no third-party databases, no outside APIs.
- Persistence: Cloudflare D1 for structured data, Cloudflare R2 for photos.
- Server logic: Cloudflare Pages Functions only.
- Deployment: Cloudflare Pages, `prod` branch, auto-deployed via GitHub Actions on every push.

**Access and security:**
- The site is public — no authentication, no accounts, no login.
- Write access (adding cards, uploading photos) is internal only. No public write surface.

**Language:**
- All code, documentation, variable names, routes, and comments are in English.
- All text rendered in the browser is in Spanish.

**AI tooling:**
- Skills in `.agents/skills/` are mandatory for any task they cover.
- MCP servers (Angular CLI, Cloudflare) and Claude Code hooks are strongly recommended.

**Design and frontend:**
- PrimeNG is used for all UI. Tailwind v4 is the fallback for customization.
- No custom CSS components. No hand-rolled widgets.
- Every UI element is a standalone Angular component.
- DRY and KISS are mandatory, not optional.

**Content:**
- The itinerary is read-only from the UI. Data lives in D1, seeded from `context/`.
- City detail cards can be added at any time via internal tooling.
- Photos are stored in R2 with metadata in D1.

## Consequences

Any feature proposal that contradicts the above requires either an updated ADR or explicit user approval before implementation. These requirements are the first thing any agent working on this project must read.
