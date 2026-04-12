---
status: accepted
created_at: 2026-04-09
updated_at: 2026-04-09
---

# No Comments

## Context

Inline comments in source code frequently describe what the code does rather than why it does it. When code is well-named and follows the patterns established in this project's ADRs, the what is already self-evident. Comments that restate the obvious add noise, drift out of sync with the code they describe, and signal that the underlying code may need to be clarified instead of annotated.

## Decision

**Choice:** Inline comments in source code are prohibited, with three narrow exceptions.

**Justification:** Code that requires a comment to be understood is usually code that should be rewritten. Good naming, small components, and idiomatic patterns (ADR-004, ADR-006, ADR-007) make the code self-documenting. Comments become a crutch that delays the harder work of writing clear code.

### Prohibited

Narrative comments that describe what a block of code does. Commented-out code. Explanations of standard patterns already established in the ADRs or the Angular documentation.

### Permitted

**Docstrings:** Public API documentation on services, exported functions, and public component inputs/outputs. These describe the contract, not the implementation.

**TODOs:** Temporary markers for known incomplete work. Format: `// TODO: <description>`. Must be tracked and resolved — they are not permanent.

**Deviation comments:** When code deliberately departs from an established pattern (ADR-004, ADR-005, ADR-006, ADR-007, ADR-008), a single-line comment is required explaining what the deviation is and why it was necessary. No deviation is accepted without this comment and without the user's acknowledgment.

### The test

Before adding a comment, ask: can this be made clear by renaming a variable, extracting a function, or restructuring the code? If yes, do that instead.

## Consequences

Comments that do not fall into the three permitted categories are removed at review time. A comment explaining a deviation implicitly flags that deviation for human review.
