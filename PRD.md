# PRD — eurotrip2026.kodexarg.com

## AI-First

This project is AI-First. Not a preference — a product definition.

**Mandatory:**
- Use the skills in `.agents/skills/` for every task they cover. Before writing code, check if an applicable skill exists.

**Strongly recommended:**
- MCP servers available in `.mcp.json` (Angular CLI, Cloudflare)
- Claude Code hooks to automate validations and conventions
- Any other AI tooling available in the environment

Any agent working on this project must assume skills, MCPs and hooks are available and use them by default — not as an exception.

---

## Architecture Decision Records

All architectural and design decisions for this project are documented in [`ADRs/`](ADRs/).

| ADR | Title | Status |
|-----|-------|--------|
| [000](ADRs/adr-000-template.md) | Template | template |
| [001](ADRs/adr-001-glossary.md) | Glossary | ready |
| [002](ADRs/adr-002-tech-stack.md) | Tech Stack | accepted |
| [003](ADRs/adr-003-requirements.md) | Requirements | accepted |
| [004](ADRs/adr-004-angular-patterns.md) | Angular Patterns | accepted |
| [005](ADRs/adr-005-design-system.md) | Design System | accepted |
| [006](ADRs/adr-006-dry-and-componentization.md) | DRY and Componentization | accepted |
| [007](ADRs/adr-007-kiss.md) | KISS | accepted |
| [008](ADRs/adr-008-no-comments.md) | No Comments | accepted |
| [009](ADRs/adr-009-routing.md) | Routing System | accepted |

Before implementing any feature, read ADR-003 (requirements) and ADR-004 (patterns) at minimum.

---

## Language rule

**Code and documentation: English. Rendered content: Spanish.**

- All code — variable names, function names, component names, route paths, type names, comments, file names — is written in English.
- All documentation — this PRD, README, inline comments, commit messages — is written in English.
- All text that renders on the page and is visible to the user is written in Spanish.

This applies without exception. When in doubt: if a human reads it in the browser, it's Spanish. If a machine or developer reads it, it's English.

---

## What is this

A personal travel companion site for Gabriel & Vanesa's Europe trip — April 19 to May 10, 2026. Route: Santiago de Chile → Madrid → Barcelona → Palma de Mallorca → Londres → Liverpool (transit) → Roma → Madrid (escala nocturna) → Buenos Aires.

Public to anyone with the link. No login. No accounts.

---

## Design constraints

**Use PrimeNG for everything. Avoid custom frontend code.**

- Every UI element must map to an existing PrimeNG component — no hand-rolled CSS widgets, no custom animations, no bespoke layouts beyond what Tailwind utility classes cover.
- If a PrimeNG component exists for the job (Timeline, Card, Galleria, DataView, Chip, Tag, etc.), use it.
- When a component needs customization or PrimeNG has no equivalent, use **Tailwind v4 utility classes** — not custom CSS or hand-rolled styles.
- Do not be creative with design. Default PrimeNG styling is the target. Theme tokens can be adjusted but component structure stays stock.
- The goal is zero custom component logic on the frontend wherever PrimeNG already solves it.

**Componentization is absolute.**

Every distinct piece of UI is its own component. Components compose other components. Nothing is repeated — if it appears twice, it's a component. DRY and KISS are not guidelines, they are mandatory. A page is an assembly of components, never a monolith. When in doubt, split.

---

## Pages & features

### 1. Calendar

A month-view calendar covering the full trip: April 19 – May 10, 2026. This is the default landing page (`/calendario`).

- Spans two months (April + May) shown as a single continuous view or two adjacent month panels
- Each day cell is color-coded by city (same palette as the Itinerary: Madrid amber, Barcelona coral, Palma gold, Londres blue, Roma rose); travel days get a gradient between the origin and destination colors
- Confirmed events (flights, Sagrada Família, etc.) appear as labeled chips inside the day cell
- Tapping a day navigates to that day's entry in the Itinerary
- Read only. No editing from the UI.
- Optimized for mobile — day cells are large enough to tap comfortably

Source of truth: same D1 data as Itinerary.

---

### 2. Itinerary

A single scrollable vertical timeline of the full trip.

Hierarchy (three levels):
1. **City block** — city name, total nights, date range, color-coded (Madrid amber, Barcelona coral, Palma gold, Londres blue, Roma rose)
2. **Day** — date, optional label (e.g. *"Aniversario"*, *"Toledo — día completo"*)
3. **Activity** — morning / afternoon / evening slot, short description, optional cost hint

Rules:
- Read only. No editing from the UI.
- Wide, generous typography. Designed for mobile reading.
- Confirmed items (flights, Sagrada Família ticket, etc.) are visually marked.
- Transport legs between cities shown inline (AVE, TGV, Frecciarossa, flights) with rough cost reference.

Source of truth: D1. Data changes go direct against the remote — see [`docs/db-workflow.md`](docs/db-workflow.md). Canonical fallback if the DB is lost: [`VIAJE.md`](VIAJE.md) + this file.

---

### 3. Map

A visual representation of the route across Europe.

- Static route drawn between all cities in order: SCL → MAD → BCN → PMI → LON → LPL → ROM → MAD → EZE
- Each city is a labeled pin with dates
- Future: interactive — tapping a pin navigates to that city's detail page
- Future: geolocation — shows the traveler's current position on the map (opt-in, mobile)

---

### 4. Sites (city detail pages)

One page per city: `/madrid`, `/barcelona`, `/palma`, `/londres`, `/roma`. Grouped under the "Sitios" nav item.

Each page contains cards for activities in that city. A card in the `cards` table has one of two types:

| Type | Content |
|------|---------|
| `info` | Reference info — address, phone, opening hours, ticket link |
| `note` | Personal comment — freeform text, markdown, added by Gabriel or Vanesa |

External links live in a separate `card_links` table (1:N per card, with URL + label + tooltip). Photos live in the top-level `photos` table, keyed by city.

Cards can be added at any time before or during the trip. No public editing — write access is internal only (direct SQL against the remote D1, or a future admin path once auth ships).

---

### 5. Photos

A gallery section at `/fotos`, plus inline photos on city pages.

- Photos are uploaded to **Cloudflare R2**
- Each photo record in D1 stores: filename, R2 key, caption, city, date taken, uploader note
- Gallery view: grid or masonry, sorted by date
- Metadata shown inline: city tag, date, caption
- No albums, no pagination initially — lazy load is sufficient

---

## Data & infrastructure

Everything runs on Cloudflare:

| Need | Solution |
|------|---------|
| Database | Cloudflare D1 (SQLite) |
| File storage | Cloudflare R2 (photos) |
| API / server logic | Cloudflare Pages Functions |
| Hosting | Cloudflare Pages (`prod` branch) |
| Domain | `eurotrip2026.kodexarg.com` |

No external services. No third-party databases.

---

## Seed data

Cities and confirmed dates (source of truth: Cloudflare D1 `cities` table):

| City | Arrival | Departure | Nights |
|------|---------|-----------|--------|
| Madrid | Apr 20 | Apr 24 | 4 |
| Barcelona | Apr 24 | Apr 28 | 4 |
| Palma de Mallorca | Apr 28 | May 2 | 4 |
| Londres | May 2 | May 4 | 2 |
| Liverpool (transit) | May 4 | May 4 | 0 |
| Roma | May 4 | May 9 | 5 |
| Madrid (escala nocturna) | May 9 (night) | May 10 (morning) | 0 |

Confirmed bookings (source of truth: D1 `events` table, `confirmed = 1`):
- ✓ Flight SCL → MAD — Iberia, Apr 19 06:40 — USD 1609
- ✓ AirBNB Madrid, Lavapiés (C. del Ave María 42) — Apr 20 → Apr 24 — USD 468.84 (paid)
- ✓ AVE Madrid Atocha → Barcelona Sants — Renfe, Apr 24 08:57
- ✓ Airbnb Barcelona, Poble Sec — Apr 24 → Apr 28 — USD 675.39
- ✓ Park Güell (zona monumental + Casa Museo Gaudí, 2 pax) — Sun Apr 26 — USD 59
- ✓ Sagrada Família (acceso básico + Torre del Nacimiento, 2 pax) — Mon Apr 27 17:00 — ~€36 p/p
- ✓ Vueling BCN → PMI — Apr 28 09:05 — USD 95, locator UMSDND
- ✓ Ryanair FR28 PMI → Londres Stansted — May 2 06:00 → 07:35 — €15.99 (solo bolso de mano)
- ✓ Ryanair FR1935 (Malta Air) Liverpool LPL → Roma Ciampino — May 4 08:50 → 12:30 (solo bolso de mano)
- ✓ Iberia IB0656 FCO T1 → MAD — May 9 20:25 — booking ref KM99T
- ✓ Iberia IB0105 MAD → EZE — May 10 08:45 — booking ref KM99T (physical ticket 075-2533915149)

Accommodations still to confirm (Palma, Londres, Roma, Madrid escala).

---

## Out of scope (for now)

- User authentication or accounts
- Visitor comments
- Real-time weather
- Push notifications
- Social sharing
