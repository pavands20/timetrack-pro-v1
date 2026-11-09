<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-09

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- None needed beyond PostgreSQL

## Decision Outcome

Chosen option: PostgreSQL 16, because Approved. It runs as Amazon RDS in eu-west-2 with KMS encryption. timestamptz stores UTC. Partial unique indexes enforce one running entry and one open break. The users.manager_id self-reference with a partial index answers the direct-report check in one indexed query. Weekly totals are simple GROUP BY queries on (user_id, work_date).

## Consequences

The week view depends on a correct work_date derived from the owner's time zone at write time. A later time-zone change does not move existing entries, which is acceptable for this MVP.
<!-- sdlc:auto:end adr -->