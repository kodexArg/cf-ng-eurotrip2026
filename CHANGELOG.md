# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The project does not use semantic versioning — entries are grouped by deploy date.

## [Unreleased]

### Open

- `event-form.ts` (381 LOC) Signal Forms migration blocked. ADR-004 mandates
  Signal Forms API but provides no concrete shape and no reference
  implementation exists in the codebase. Needs either a seeded reference
  component or a concrete pattern example in ADR-004 before the refactor
  can proceed.
- 16 ESLint errors + 1 warning present after first lint run. Top rules:
  `@typescript-eslint/no-unused-vars` (8), `@angular-eslint/no-output-native`
  (5), `no-empty` (3). Scheduled for a fix-only wave.

## 2026-04-15 — Frontend cleanup pass (waves 2–4)

### Added

- **Design token layer** at `src/app/shared/theme/`:
  - `colors.ts` — `CITY_COLORS`, `EVENT_TYPE_COLORS`, `ACTIVITY_TIPO_COLORS`.
  - `spacing.ts` — marker popup + dialog dimensions.
  - `typography.ts` — marker popup font-size constants.
- **Constants layer** at `src/app/shared/constants/`:
  - `event-types.ts` — `EVENT_TYPES` const object (complements existing
    `EventType` union + type guards in `shared/models/event.model.ts`).
  - `cities.ts` — `CITY_SLUGS` + `CITY_ROUTE_SLUGS`.
  - `icons.ts` — semantic `ICONS` record for PrimeIcons reused across files.
- **Component sub-parts** folders:
  - `calendario/day-detail-dialog/parts/` — `event-detail-row.ts`,
    `traslado-detail.ts`, `estadia-detail.ts`.
  - `reservas/booking-card/parts/` — `location-row.ts`, `maps-link-button.ts`,
    `traslado-body.ts`, `estadia-body.ts`, `hito-body.ts`.
- `mapa/map-utils/geometry.ts` — `bearing()`, `makeArrowIcon()`,
  `makeIconBadge()` extracted from `route-renderer.ts`.
- TSDoc `/** */` blocks with `@remarks` input-variant documentation on
  every Angular `@Component` class across shared/, calendario/, itinerario/,
  reservas/, mapa/, sitios/, fotos/, home/, modificaciones/ (31 components).
- ESLint flat config (`eslint.config.js`) with `angular-eslint` + typescript-eslint
  recommended rules. `npm run lint` script wired.
- `migrations/0059_iberia_scl_mad_arrival_time.sql` — sets `timestamp_out`
  on `ev-leg-scl-mad` (was missing, caused `—` render in /reservas).
- `/*.png` root-scoped rule in `.gitignore` (does not affect `public/**/*.png`
  assets).

### Changed

- **`day-detail-dialog.ts`**: 464 → 240 LOC (−48%). Template row rendering
  delegated to the three new `parts/*` components.
- **`booking-card.ts`**: 313 → 122 LOC (−61%, two waves). First wave
  extracted `location-row` + `maps-link-button`; second wave extracted the
  three branch bodies (`traslado-body`, `estadia-body`, `hito-body`).
- **`itinerary.ts`**: 242 → 230 LOC. Intermediate `payload` and
  `cityEventMap` computeds extracted; `MS_PER_DAY` + `dateToUtcMs` hoisted
  to module scope so the clustering loop no longer constructs `Date` per
  iteration.
- **`marker-factory.ts`**, **`day-detail-dialog.ts`**, **`event-slot.ts`**,
  **`activity.model.ts`**, **`home.ts`**, **`city-map.ts`** — consume theme
  tokens instead of inline hex / rgba / px literals.
- **`app.routes.ts`**, **`home.ts`**, **`itinerary-filter.service.ts`**,
  **`event-form.ts`**, **`city-map.ts`** — consume `CITY_SLUGS` /
  `EVENT_TYPES` instead of inline slug / type string literals.
- **`route-renderer.ts`** — now imports `bearing`, `makeArrowIcon`,
  `makeIconBadge` from `./geometry`.

### Fixed

- `/calendario` day-detail dialog: Spanish locale casing — `"De Mayo"` →
  `"de Mayo"` (removed errant `capitalize` Tailwind class on the title
  wrapper).
- `/calendario` day-detail dialog: removed redundant `pi-dollar` icon that
  rendered `"$ USD 812.71"` (now `"USD 812.71"`).

### Removed

- ~30 hardcoded color / rgba / px literals in the six hottest frontend
  files — all replaced by token imports from `shared/theme/`.
- Inline `bearing` + `makeArrowIcon` + `makeIconBadge` definitions from
  `route-renderer.ts`.
- Inline row-helper methods (`rowIconColor`, `rowBorderColor`, `rowBgColor`,
  `formatDuration`, `trasladoRoute`) from `day-detail-dialog.ts` — now
  owned by the relevant child `parts/` component.

### Verified

- Production QA pass with Playwright MCP across all 7 public routes
  (`/calendario`, `/itinerario`, `/mapa`, `/sitios`, `/fotos`, `/reservas`,
  `/modificaciones`) and the day-detail dialog. Zero console errors or
  warnings on any page.
- `npm run build` green after every wave (3.7–4.0s).
- Auth wall on `/modificaciones` confirmed still in place.
