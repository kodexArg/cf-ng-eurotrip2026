# AGENTS.md — eurotrip2026

Agent context for this project. Read this before doing anything.

---

## Must read first

- [`PRD.md`](PRD.md) — product definition, language rule, design constraints
- [`ADRs/adr-003-requirements.md`](ADRs/adr-003-requirements.md) — locked requirements
- [`ADRs/adr-004-angular-patterns.md`](ADRs/adr-004-angular-patterns.md) — how Angular code is written here

## ADRs

All architecture decisions live in [`ADRs/`](ADRs/). Read the relevant ADR before touching its domain.

| ADR | Topic |
|-----|-------|
| [000](ADRs/adr-000-template.md) | Template for new ADRs |
| [001](ADRs/adr-001-glossary.md) | Shared vocabulary — check here for naming |
| [002](ADRs/adr-002-tech-stack.md) | Stack overview + documentation links |
| [003](ADRs/adr-003-requirements.md) | Non-negotiable requirements |
| [004](ADRs/adr-004-angular-patterns.md) | Angular 21 patterns: signals, routing, DI, forms |
| [005](ADRs/adr-005-design-system.md) | PrimeNG first, Tailwind v4 fallback |
| [006](ADRs/adr-006-dry-and-componentization.md) | Absolute componentization, DRY |
| [007](ADRs/adr-007-kiss.md) | KISS — simplest correct solution |
| [008](ADRs/adr-008-no-comments.md) | No inline comments (exceptions: docstrings, TODOs, deviations) |

## Skills

Before writing code, check if a skill covers the task:

| Skill | Use for |
|-------|---------|
| `kdx-angular-component` | Creating components |
| `kdx-angular-forms` | Signal Forms |
| `kdx-angular-http` | `httpResource()`, `HttpClient` |
| `kdx-angular-routing` | Routes, guards, lazy loading |
| `kdx-angular-signals` | Signal-based state |
| `kdx-angular-testing` | Vitest + TestBed |
| `kdx-design-system-use` | PrimeNG component selection |
| `kdx-tailwind-design-system` | Tailwind tokens, utilities |
| `kdx-version` | Tagging releases |

## MCP servers

Both are configured in `.mcp.json`:
- **Angular CLI** — `list_projects`, `build`, `test`, `get_best_practices`
- **Cloudflare** — Pages, D1, R2, Workers

## Key rules (summary)

- Code and docs: **English**. Rendered UI: **Spanish**.
- PrimeNG → Tailwind v4 → nothing else.
- Every UI element is a component.
- No inline comments unless it's a docstring, TODO, or deviation from an ADR.
- `ChangeDetectionStrategy.OnPush` everywhere.
- All routes lazy-loaded.
- `inject()` over constructor injection.
- Signals over RxJS for state.
