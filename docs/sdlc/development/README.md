# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

The development plan for TimeTrack Pro V1 is approved at version 1. It has 4 sprints of capacity 20 each, covering 8 epics and 19 stories (69 story points in total).

- Plan status: approved; version: 1.
- Approver and approval date: not stated in input.
- Sprints: 4, each with capacity 20 (total capacity 80).
- Epics: EPIC-001 to EPIC-008 (no points, unassigned).
- Stories: US-001 to US-019; total story points = 69.
- Tasks: US-010-T1/T2/T3 and US-013-T1/T2/T3 (no points).
- Roles assigned:
  - backend-agent
  - security-agent (US-002)
  - frontend-agent
  - qa-agent (US-013-T3)
  - devops-agent (US-019)
- Scope note: the plan contains no stories for these capabilities from the project description:
  - timesheet submission/approval and locking
  - time off and leave balances
  - labour rules (overtime / break flags, compliance report)
  - reports and CSV/payroll export
  - in-app notifications
  - timesheet audit trail
- The input gives no rationale for this V1 scoping.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 focuses on secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.

- Goal (verbatim): Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- Stories matching the goal wording (the input does not explicitly assign stories to sprints):
  - US-001 (5 pts, backend-agent)
  - US-002 (3 pts, security-agent)
  - US-003 (5 pts, backend-agent)
  - US-004 (3 pts, backend-agent)
  - US-005 (2 pts, backend-agent)
  - Total: ~18 pts.
- Delivery: no ticket or commit records provided for these stories.

**Related:** DEV-PLAN-V1, US-001, US-002, US-003, US-004, US-005

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 targets completing user administration, setting up clients, projects with bill rates and tasks, and employee clock in/out.

- Goal (verbatim): Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out.
- Capacity: 20.
- Stories matching the goal wording (inferred, not explicitly assigned):
  - US-006 (3 pts)
  - US-007 (3 pts)
  - US-008 (3 pts)
  - US-009 (3 pts)
  - US-010 (8 pts), with tasks:
    - T1: add time_entries migration
    - T2: implement clock status, in and out endpoints
    - T3: build clock page (frontend-agent)
  - Total: ~20 pts.
- Delivery: no ticket or commit records provided for these stories or tasks.

**Related:** DEV-PLAN-V1, US-006, US-007, US-008, US-009, US-010, US-010-T1, US-010-T2, US-010-T3

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 targets correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.

- Goal (verbatim): Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- Stories matching the goal wording (inferred, not explicitly assigned):
  - US-017 (3 pts, backend-agent)
  - US-011 (3 pts, backend-agent)
  - US-012 (3 pts, backend-agent)
  - US-013 (8 pts, frontend-agent), with tasks:
    - T1: timesheet week and cell endpoints (backend-agent)
    - T2: weekly timesheet grid (frontend-agent)
    - T3: timesheet API test suite (qa-agent)
  - US-014 (2 pts, frontend-agent)
  - Total: ~19 pts.
- Delivery: no ticket or commit records provided. No test results for US-013-T3 provided.

**Related:** DEV-PLAN-V1, US-011, US-012, US-013, US-013-T1, US-013-T2, US-013-T3, US-014, US-017

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers editing and deleting own entries, the weekly hours dashboard, a responsive English interface, and user/admin/project documentation. All four matching stories have delivered tickets.

- Goal (verbatim): Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation.
- Capacity: 20.
- Stories matching the goal wording:
  - US-015 (3 pts)
  - US-016 (3 pts)
  - US-018 (3 pts)
  - US-019 (3 pts)
  - Total: 12 pts.
- Delivery: all four tickets are recorded as delivered (see DEV-TICKET entries).

**Related:** DEV-PLAN-V1, US-015, US-016, US-018, US-019

### DEV-EPICS · approved · source: plan:version-1

Breakdown of the 8 planned epics into their stories, with points and assigned roles.

- EPIC-001 Sign-in and account access:
  - US-001 Sign in with email and password (5, backend)
  - US-002 Role-restricted access (3, security)
  - US-003 Reset a forgotten password (5, backend)
- EPIC-002 User account administration:
  - US-004 Create a user account (3, backend)
  - US-005 Assign a manager to an employee (2, backend)
  - US-006 Edit and deactivate users (3, backend)
- EPIC-003 Clients, projects, tasks and bill rate:
  - US-007 Manage clients (3, backend)
  - US-008 Manage projects with an hourly bill rate (3, backend)
  - US-009 Manage tasks within a project (3, backend)
- EPIC-004 Clock in and out with breaks:
  - US-010 Clock in and out against a project and task (8, backend; tasks T1-T3)
  - US-011 Record breaks while clocked in (3, backend)
  - US-012 Recover an entry left running (3, backend)
- EPIC-005 Weekly timesheet entry:
  - US-013 Enter hours by day in a weekly timesheet (8, frontend; tasks T1-T3)
  - US-014 Mark entries billable or non-billable (2, frontend)
  - US-015 Edit and delete my own time entries (3, backend)
- EPIC-006 Employee dashboard:
  - US-016 See my weekly hours on a dashboard (3, frontend)
- EPIC-007 Time zone, week start, language and responsive layout:
  - US-017 Times stored in UTC and shown in my time zone (3, backend)
  - US-018 English-only, responsive interface (3, frontend)
  - Note: the epic title mentions 'week start', but no story for it is listed.
- EPIC-008 Basic user and project documentation:
  - US-019 User and admin guides (3, devops)

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### DEV-RUN · draft · source: dev:run

The development run is marked completed, but delivery is recorded for only 4 of the 19 planned stories.

- Run status: completed.
- Tickets recorded as delivered: US-015, US-016, US-018, US-019.
- No reviewer, merge, test or acceptance information was provided.
- Conflict to resolve: 'completed' run status vs. no ticket records for 15 planned stories. See DEV-GAP-UNRECORDED.

**Related:** US-015, US-016, US-018, US-019

### DEV-TICKET-US-015 · draft · source: dev:US-015

Ticket US-015 (Edit and delete my own time entries) is delivered.

- Status: delivered.
- Commit: 19b54af593c72af1f458845f9b5ff36d5588f5d9.
- Planned: 3 pts, backend-agent.
- No implementation detail, review or test results provided.

**Related:** US-015, EPIC-005, DEV-SPRINT-4

### DEV-TICKET-US-016 · draft · source: dev:US-016

Ticket US-016 (See my weekly hours on a dashboard) is delivered. It shares a commit with US-018.

- Status: delivered.
- Commit: 1fe2e39152c5552a8e0ef16dc2033e3e48570eb4 (same commit as US-018).
- Planned: 3 pts, frontend-agent.
- No implementation detail, review or test results provided.

**Related:** US-016, EPIC-006, DEV-SPRINT-4, US-018

### DEV-TICKET-US-018 · draft · source: dev:US-018

Ticket US-018 (English-only, responsive interface) is delivered. It shares a commit with US-016.

- Status: delivered.
- Commit: 1fe2e39152c5552a8e0ef16dc2033e3e48570eb4 (same commit as US-016).
- Planned: 3 pts, frontend-agent.
- No implementation detail, review or test results provided.

**Related:** US-018, EPIC-007, DEV-SPRINT-4, US-016

### DEV-TICKET-US-019 · draft · source: dev:US-019

Ticket US-019 (User and admin guides) is delivered.

- Status: delivered.
- Commit: 365176003d3825ff68b7ce673b5b7363926fab5e.
- Planned: 3 pts, devops-agent.
- Guide contents were not provided in the input.

**Related:** US-019, EPIC-008, DEV-SPRINT-4

### DEV-GAP-UNRECORDED · draft

15 planned stories have no ticket, status or commit in the development input, so whether they were implemented cannot be confirmed.

- Stories with no delivery record:
  - US-001 to US-014
  - US-017
- Tasks with no delivery record:
  - US-010-T1/T2/T3
  - US-013-T1/T2/T3
- They are not documented as delivered or as not delivered.
- Delivered stories US-015 and US-016 depend functionally on time entries and timesheets (US-010, US-013), whose delivery is unrecorded.
- Needs confirmation from the development record before any usage documentation is written for these features.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-017
<!-- sdlc:auto:end narrative -->
