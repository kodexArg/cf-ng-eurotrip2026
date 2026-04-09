---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# KISS

## Context

Angular 21 already generates a significant amount of boilerplate. Adding unnecessary abstractions, over-engineering simple features, or writing code that could be omitted makes the project harder to read and maintain — both for humans and for AI agents picking up the codebase cold. At the same time, excessive cleverness in the name of brevity produces code that is hard to follow. KISS cuts in both directions.

## Decision

**Choice:** Write the simplest code that correctly solves the problem. No more, no less.

**Justification:** Complexity that is not load-bearing is waste. Angular, PrimeNG, and TypeScript already provide most of the scaffolding needed — the job is to connect them, not to reinvent them.

### What this means in practice

Before writing any piece of code, ask: is this already provided by Angular, PrimeNG, or the TypeScript standard library? If yes, use it directly.

Abstractions are introduced only when they remove real repetition (see ADR-006) or encapsulate a genuinely reusable pattern. Abstractions built for hypothetical future use are rejected.

When two implementations are equally correct, choose the one a developer unfamiliar with the codebase would understand faster. Declarative over clever. A clear `@if` block is better than a cryptic ternary chain. Named variables are better than inline expressions that require parsing.

Generic solutions are not introduced for single use cases. A helper function used once is not a helper function — it is inline code.

Configuration, feature flags, and extension points are not added speculatively. If the requirement doesn't exist today, neither does the code for it.

### What this does not mean

KISS does not mean writing less code at the expense of clarity. A well-named intermediate variable that explains intent is not complexity — it is communication. KISS means simple, not terse.

## Consequences

Any abstraction, utility, or pattern that serves a single current use case will be challenged and likely removed. Speculative architecture is rejected at review time.
