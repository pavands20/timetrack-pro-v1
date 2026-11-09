<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-09

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Other Python REST frameworks

## Decision Outcome

Chosen option: FastAPI 0.115, because Approved. Pydantic models give field-level validation for hours, rates and emails (NFR-013). Dependencies implement session, role, ownership and reporting-line checks on every route, so the team view's access rule is one reusable dependency. The same image also runs the retention job.

## Consequences

Session handling is custom (a sessions table) rather than a third-party auth service. This keeps data in-region and makes deactivation and reassignment take effect immediately, at the cost of some code to own.
<!-- sdlc:auto:end adr -->