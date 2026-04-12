---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# Angular Patterns

## Context

Angular 21 introduces patterns that differ significantly from earlier versions. This ADR records the opinionated choices made for this project. Only decisions that could reasonably go either way are declared here — obvious defaults are not. The guiding principle is: prefer what Angular 21, PrimeNG, and the chosen libraries themselves recommend. When the framework has an opinion, follow it.

## Decision

**Choice:** Angular 21 idiomatic patterns throughout, as described below.

**Justification:** Deviating from the framework's own preferred patterns adds cognitive load and breaks compatibility with the skill suite. The framework's opinion is the default; this project does not override it without reason.

### Component model

All components are standalone. `NgModule` is not used. `imports` arrays on each component declare only what that component directly uses. Component files follow the `kdx-angular-component` skill conventions.

### Change detection

`ChangeDetectionStrategy.OnPush` on every component, no exceptions. Zoneless change detection is the target direction.

### Reactivity

Signals are the state primitive: `signal()`, `computed()`, `linkedSignal()`, `effect()`. RxJS is used only at system boundaries — HTTP, interop with libraries that require observables. Signal-based component inputs (`input()`, `output()`) replace `@Input` and `@Output`.

### Dependency injection

`inject()` replaces constructor injection everywhere. No constructor parameters for DI.

### Routing

All routes are lazy-loaded. Route parameters are read via signal inputs. Functional guards replace class-based guards. The route tree lives in `app.routes.ts` and feature-level `*.routes.ts` files.

### HTTP

`httpResource()` for data fetching tied to component lifecycle. `HttpClient` for imperative calls (form submissions, mutations). Interceptors for cross-cutting concerns (auth headers, error handling).

### Forms

Signal Forms API only. No `ReactiveFormsModule`, no template-driven forms.

### Testing

Vitest + JSDOM + TestBed. No Jasmine, no Jest. Component tests use `TestBed`; service tests are plain unit tests.

### File structure

One component per file. Feature folders group related components, services, and routes. Shared primitives live in `shared/`. No barrel files (`index.ts`) unless explicitly needed.

## Consequences

Any pattern not listed here defaults to Angular 21's own recommendation. Introducing a pattern that contradicts this ADR requires a comment in code explaining the deviation and a note in the relevant ADR or a new one.
