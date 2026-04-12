---
status: ready
created_at: 2026-04-09
updated_at: 2026-04-09
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
| **Activity** | A single event within a day block, assigned to a time slot (morning, afternoon, evening) |
| **Time slot** | One of: `morning`, `afternoon`, `evening` |
| **City page** | A dedicated route (`/madrid`, `/barcelona`, etc.) showing cards for that city |
| **Card** | The atomic content unit on a city page. Has a type: `info`, `link`, `note`, or `photo` |
| **Info card** | A card type holding structured reference data: address, phone, hours, ticket link |
| **Link card** | A card type holding one or more curated external URLs, verified as safe |
| **Note card** | A card type holding personal freeform text from Gabriel or Vanesa |
| **Photo card** | A card type referencing one or more photos stored in R2 |
| **Seed** | The initial dataset loaded into D1 from the `context/` files |
| **Transport leg** | A between-city travel segment shown inline in the itinerary (flight, train) |
| **Confirmed** | An item (booking, ticket, flight) that is locked and visually distinguished |
| **Admin path** | An internal, non-public route or mechanism for writing data to D1 |
| **Component** | An Angular standalone component — the atomic unit of all UI in this project |
| **Page component** | A routed component that assembles other components; never contains its own layout logic |
| **Route** | A URL path defined in `app.routes.ts`, always lazy-loaded |

## Consequences

All code, documentation, and AI output in this project should use these terms consistently. When a new concept appears, it is added here before being used elsewhere.
