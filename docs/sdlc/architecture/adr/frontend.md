<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-07

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Server-rendered templates from the API

## Decision Outcome

Chosen option: React 19, because Approved by the product owner. Written in TypeScript as a responsive SPA covering clock, timesheet, dashboard and admin screens. It is deployed as static files on S3 and CloudFront in eu-west-2, and all Monday-peak interaction runs client-side.

## Consequences

An SPA needs client-side role routing as well as the server checks. The server remains the only authority (NFR-003).
<!-- sdlc:auto:end adr -->