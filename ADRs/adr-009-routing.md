---
status: accepted
created_at: 2026-04-10
updated_at: 2026-04-10
---

# Routing System

## Context

ADR-004 establishes the baseline: lazy loading, signal inputs for route parameters, functional guards, and the `app.routes.ts` + `feature.routes.ts` file convention. That is not enough to govern routing decisions consistently. Routing touches URL structure, code splitting, navigation primitives, scroll behavior, and 404 handling — each of which can go several ways. This ADR records the full contract so there is one authoritative place to look.

The app is CSR deployed on Cloudflare Pages. All routes resolve client-side; a `_redirects` rule in `public/` sends every path to `index.html`.

## Decision

**Choice:** Angular Router with `PathLocationStrategy`, fully lazy-loaded feature routes, signal inputs for parameters, functional guards and resolvers.

- **Discarded:** Hash routing (`HashLocationStrategy`) — ugly URLs; not needed because Cloudflare Pages handles SPA fallback natively.
- **Discarded:** Eager route loading — increases the initial bundle with no benefit; contradicts the lazy-loading rule.
- **Discarded:** `ActivatedRoute` injection for parameters — the old pattern; `withComponentInputBinding()` makes signal inputs the correct approach.

**Justification:** These choices follow Angular 21's own recommendations and the Cloudflare Pages deployment model. No custom mechanism is introduced when the platform or framework already provides the right primitive.

### URL strategy

`PathLocationStrategy` (clean URLs, no `#`). The Cloudflare Pages `_redirects` file in `public/` contains the SPA fallback rule and is the only place where redirect behavior is configured.

### Lazy loading

Every route except the root application shell is lazy-loaded via dynamic `import()`. No eagerly-loaded feature routes. This is the only code-splitting boundary managed at the route level.

### Route tree

`app.routes.ts` is the root route file. Feature-level routes live in a `*.routes.ts` file co-located with the feature folder. Route definitions do not appear inside component files.

### Route paths

kebab-case, English, matching the feature name. No abbreviations unless they are universally understood without context.

### Route parameters

Read exclusively via signal inputs (`input()`) enabled by `withComponentInputBinding()` in `app.config.ts`. `ActivatedRoute` is not injected for parameter access.

### Guards

Functional guards only. No class-based `CanActivate` or its equivalents. Guard functions live in a `guards/` directory under the relevant feature, or in `shared/guards/` when reused across features.

### Resolvers

Functional resolvers only. Used only when data must be available before the component renders and `httpResource()` inside the component is not a sufficient alternative. Resolvers are not the default data-fetching mechanism.

### Scroll behavior

`withInMemoryScrolling({ scrollPositionRestoration: 'top' })` is configured once in `app.config.ts`. Per-route scroll overrides are not introduced.

### In-template navigation

`routerLink` directive for all link-based navigation. Imperative `router.navigate()` is reserved for programmatic redirects after an action completes (e.g., post-submission redirect).

### 404

A wildcard `**` route at the root level in `app.routes.ts` catches all unmatched paths.

## Consequences

Route parameters are always typed signal inputs on the component — no `paramMap` subscriptions anywhere in the codebase.

Adding a route requires: a `*.routes.ts` file, a lazy `import()` in the parent route file, and optionally a guard or resolver. Nothing else.

Any deviation from these rules requires an inline comment citing this ADR and an explanation of why the deviation is justified.
