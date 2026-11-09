# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Sign-in, role-restricted access, password reset, and user creation with manager assignment

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign in with email and password | 5 | backend-agent | — |
| US-002 | Story | Role-restricted access | 3 | security-agent | US-001 |
| US-003 | Story | Reset a forgotten password | 5 | backend-agent | US-001 |
| US-004 | Story | Create a user account | 3 | backend-agent | US-002 |
| US-005 | Story | Assign a manager to an employee | 2 | backend-agent | US-004 |

## Sprint 2: Sprint 2

User editing and deactivation, client/project/task setup with bill rates, and clock in/out

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Edit and deactivate users | 3 | backend-agent | US-004 |
| US-007 | Story | Manage clients | 3 | backend-agent | US-002 |
| US-008 | Story | Manage projects with an hourly bill rate | 3 | backend-agent | US-007 |
| US-009 | Story | Manage tasks within a project | 3 | backend-agent | US-008 |
| US-010 | Story | Clock in and out against a project and task | 8 | backend-agent | US-009, US-004 |

## Sprint 3: Sprint 3

Breaks, running-entry recovery, weekly timesheet entry, billable marking and UTC/time-zone handling

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-011 | Story | Record breaks while clocked in | 3 | backend-agent | US-010 |
| US-012 | Story | Recover an entry left running | 3 | backend-agent | US-010 |
| US-013 | Story | Enter hours by day in a weekly timesheet | 8 | frontend-agent | US-009 |
| US-014 | Story | Mark entries billable or non-billable | 2 | frontend-agent | US-013 |
| US-017 | Story | Times stored in UTC and shown in my time zone | 3 | backend-agent | US-010 |

## Sprint 4: Sprint 4

Editing own entries, employee dashboard, responsive English UI and documentation

Capacity: 20 points · Committed: 12

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-015 | Story | Edit and delete my own time entries | 3 | backend-agent | US-013 |
| US-016 | Story | See my weekly hours on a dashboard | 3 | frontend-agent | US-013, US-014 |
| US-018 | Story | English-only, responsive interface | 3 | frontend-agent | US-013 |
| US-019 | Story | User and admin guides | 3 | devops-agent | US-016 |

## Sprint 5: Sprint 5

Read-only Manager team view: reporting-line access enforced on the server, a direct-reports list, and a view of a report's weekly timesheet in their own time zone

Capacity: 20 points · Committed: 13

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-020 | Story | List my direct reports | 3 | backend-agent | US-022 |
| US-021 | Story | View a direct report's weekly timesheet (read-only) | 5 | frontend-agent | US-020, US-022, US-013, US-017 |
| ↳ PIPER-e38e8a33 | Task | Update admin guide and add My team user-guide section (AC-050, AC-065) | 2 | devops-agent | — |
| US-022 | Story | Team access restricted to the reporting line | 5 | security-agent | US-002, US-005, US-006 |
| ↳ PIPER-0b110d7f | Task | Enforce server-side ownership and reporting-line checks on all time data (AC-064) | 3 | security-agent | — |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
