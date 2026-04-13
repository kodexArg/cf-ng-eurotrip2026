---
status: ready
created_at: 2026-04-09
updated_at: 2026-04-12
---

# Glossary

## Context

Shared vocabulary reduces ambiguity across code, documentation, and AI-assisted development. This ADR defines how things are named in this project. It is open to extension at any time — new terms are added as the project evolves. Existing definitions may be revised if consensus changes. This is the only ADR that follows an open/closed pattern: always ready, always extendable.

## Decision

**Choice:** Maintain a living glossary as an ADR, extended incrementally.

**Justification:** A single source of truth for naming prevents drift between the PRD, the code, and agent-generated content.

### Terms

| Term | Definition |
|------|-----------|
| **City block** | A top-level itinerary section grouping all days and activities within one city |
| **Day block** | A single calendar date within a city block, containing one or more activity slots |
| **Event** | A row in the `events` table — the unified master record for anything that appears on the itinerary. `type` is one of `traslado` / `hito` / `estadia`, plus an optional `subtype` |
| **Traslado** | An `event` with `type='traslado'`: a between-city transport segment (flight, train, ferry). Optional sub-row in `events_traslado` holds company, vehicle code, fare, seat, duration |
| **Hito** | An `event` with `type='hito'`: a point-in-time activity within a day (visit, food, leisure, transfer, event). The old "Activity" concept |
| **Estadia** | An `event` with `type='estadia'`: an accommodation stay spanning one or more nights. Optional sub-row in `events_estadia` holds accommodation name, address, platform, booking ref, checkin/checkout times |
| **Confirmed** | An event with `confirmed = 1`. Visually distinguished in the UI |
| **City page** | A dedicated route (`/madrid`, `/barcelona`, `/palma`, `/londres`, `/roma`) showing cards for that city |
| **Card** | A row in the `cards` table. Type is `info` (reference data: address, hours, ticket link) or `note` (personal freeform text from Gabriel or Vanesa) |
| **Card link** | A row in the `card_links` table — a 1:N external URL attached to a card, with label and tooltip |
| **Photo** | A row in the `photos` table — metadata for an image stored in Cloudflare R2 (R2 key, caption, city, date taken, uploader note) |
| **Seed** | Historical term. There is no seed step anymore — the remote D1 is the live source, modified directly with `wrangler d1 execute --remote`. Canonical fallback is `VIAJE.md` + `PRD.md` |
| **Admin path** | An internal, non-public route or mechanism for writing data to D1. Gated behind the auth system once it ships |
| **Component** | An Angular standalone component — the atomic unit of all UI in this project |
| **Page component** | A routed component that assembles other components; never contains its own layout logic |
| **Route** | A URL path defined in `app.routes.ts`, always lazy-loaded |

## Consequences

All code, documentation, and AI output in this project should use these terms consistently. When a new concept appears, it is added here before being used elsewhere.
