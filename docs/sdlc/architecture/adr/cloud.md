<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-08

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v2.

## Considered Options

- AWS
- None (residency met in eu-west-2 or eu-west-1)

## Decision Outcome

Chosen option: AWS, because Approved. ECS Fargate, RDS, S3 and CloudFront, Secrets Manager, EventBridge Scheduler and SES are all available in the UK and EU regions, which meets NFR-006 and GDPR/UK GDPR. S3 and CloudFront are added only to host the static SPA build, because the approved components have no static web host of their own.

## Consequences

Fargate costs a little more than self-managed EC2, but it removes server patching for a small team.
<!-- sdlc:auto:end adr -->