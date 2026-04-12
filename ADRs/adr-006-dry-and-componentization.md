---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# DRY and Componentization

## Context

In Angular projects, the temptation to inline logic and markup into page components is persistent — especially in AI-assisted development where generating a large working component is faster than decomposing it into smaller ones. This project explicitly rejects that pattern. Componentization is not a refactoring step performed later; it is the first step.

## Decision

**Choice:** Absolute componentization from the first iteration.

**Justification:** Small, focused components are independently testable, reusable across routes, and comprehensible in isolation. A page that is a monolith is a liability. The cost of splitting is low; the cost of not splitting compounds over time.

### Rules

Every distinct visual or logical unit is its own component. A component does one thing. If two parts of the UI share structure, markup, or behavior — even partially — they are extracted into a shared component before being used a second time.

A page component has one responsibility: assembling child components into a layout. It contains no template logic of its own beyond structural directives needed for that assembly.

Data flows down via inputs. Events flow up via outputs. Side effects belong in services or effects, not in templates.

DRY applies to templates, TypeScript logic, and styles equally. A repeated `@if` block is a component. A repeated color class sequence is a Tailwind component or a token. A repeated API call pattern is a service method.

### When to split

If a block of template has a clear semantic meaning that could be named, it is a component. If a block appears in more than one place, it is a component. If a component file exceeds roughly 100 lines of template, question whether it should be split.

## Consequences

Code review (human or AI) should flag any template duplication or page-level markup that belongs in a child component. No exceptions to DRY are accepted without explicit justification in a code comment.
