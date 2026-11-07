# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign in with email and password | 5 | backend-agent | — |
| US-002 | Story | Role-restricted access | 3 | security-agent | US-001 |
| US-003 | Story | Reset a forgotten password | 5 | backend-agent | US-001 |
| US-004 | Story | Create a user account | 3 | backend-agent | US-002 |
| US-005 | Story | Assign a manager to an employee | 2 | backend-agent | US-004 |

## Sprint 2: Sprint 2

Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Edit and deactivate users | 3 | backend-agent | US-004 |
| US-007 | Story | Manage clients | 3 | backend-agent | US-002 |
| US-008 | Story | Manage projects with an hourly bill rate | 3 | backend-agent | US-007 |
| US-009 | Story | Manage tasks within a project | 3 | backend-agent | US-008 |
| US-010 | Story | Clock in and out against a project and task | 8 | backend-agent | US-009 |
| ↳ US-010-T1 | Task | Add time_entries migration | — | backend-agent | — |
| ↳ US-010-T2 | Task | Implement clock status, in and out endpoints | — | backend-agent | — |
| ↳ US-010-T3 | Task | Build clock page | — | frontend-agent | — |

## Sprint 3: Sprint 3

Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-011 | Story | Record breaks while clocked in | 3 | backend-agent | US-010 |
| US-012 | Story | Recover an entry left running | 3 | backend-agent | US-010 |
| US-013 | Story | Enter hours by day in a weekly timesheet | 8 | frontend-agent | US-010, US-017 |
| ↳ US-013-T1 | Task | Implement timesheet week and cell endpoints | — | backend-agent | — |
| ↳ US-013-T2 | Task | Build weekly timesheet grid | — | frontend-agent | — |
| ↳ US-013-T3 | Task | Add timesheet API test suite | — | qa-agent | — |
| US-014 | Story | Mark entries billable or non-billable | 2 | frontend-agent | US-013, US-008 |
| US-017 | Story | Times stored in UTC and shown in my time zone | 3 | backend-agent | US-010 |

## Sprint 4: Sprint 4

Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation

Capacity: 20 points · Committed: 12

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-015 | Story | Edit and delete my own time entries | 3 | backend-agent | US-013, US-002 |
| US-016 | Story | See my weekly hours on a dashboard | 3 | frontend-agent | US-013, US-014 |
| US-018 | Story | English-only, responsive interface | 3 | frontend-agent | US-016, US-015 |
| US-019 | Story | User and admin guides | 3 | devops-agent | US-016, US-006, US-009 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
