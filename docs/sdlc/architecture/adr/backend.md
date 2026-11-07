<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-07

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Other Python REST frameworks

## Decision Outcome

Chosen option: FastAPI 0.115, because Approved. Pydantic models give field-level validation for hours, rates and emails (NFR-013). Dependencies implement session and role checks on every route. The same image also runs the retention job, so no separate worker technology is needed.

## Consequences

Session handling is custom (a sessions table) rather than a third-party auth service. This keeps data in-region and makes deactivation immediate, at the cost of some code to own.
<!-- sdlc:auto:end adr -->