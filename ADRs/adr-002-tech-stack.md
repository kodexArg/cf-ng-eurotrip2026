---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# Tech Stack

## Context

This project is built on an opinionated starter template. The stack is fixed and not up for debate on a per-feature basis. This ADR records what is in use and where the authoritative documentation for each layer lives.

## Decision

**Choice:** Angular 21 CSR + PrimeNG + Tailwind v4 + Cloudflare-only infrastructure.

**Justification:** The stack was chosen before this ADR. It is declared here for traceability.

### Stack

| Layer | Technology | Reference |
|-------|-----------|-----------|
| Framework | Angular 21 — standalone, OnPush, signals, zoneless | `README.md` |
| UI library | PrimeNG 21 — Aura theme | `README.md` |
| Styling | Tailwind CSS v4 + `tailwindcss-primeui` bridge | `README.md` |
| HTTP | `httpResource()` + `HttpClient` | skill: `kdx-angular-http` |
| State | Signals — `signal()`, `computed()`, `linkedSignal()` | skill: `kdx-angular-signals` |
| Forms | Signal Forms API | skill: `kdx-angular-forms` |
| Testing | Vitest + JSDOM + TestBed | skill: `kdx-angular-testing` |
| Routing | Functional guards, lazy routes, signal inputs | skill: `kdx-angular-routing` |
| Language | TypeScript 5.9 strict | `tsconfig.json` |
| Build | `@angular/build` (esbuild) | `angular.json` |
| Database | Cloudflare D1 (SQLite) | Cloudflare docs |
| Storage | Cloudflare R2 | Cloudflare docs |
| API | Cloudflare Pages Functions | `functions/` |
| Hosting | Cloudflare Pages — `prod` branch | `.github/workflows/deploy.yml` |
| Domain | `eurotrip2026.kodexarg.com` | Cloudflare DNS |

## Consequences

No technology outside this stack is introduced without a new ADR. Skills in `.agents/skills/` are the canonical implementation reference for each layer.
