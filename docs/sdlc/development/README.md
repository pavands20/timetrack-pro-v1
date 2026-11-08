# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

Plan version 1 is approved. It has 4 sprints of 20 points each and 19 stories grouped under 8 epics. Total estimated story points are 69. Approver and approval date were not provided.

- Status: approved, version 1. No approver or date was given.
- Capacity: 4 sprints × 20 = 80 points. Estimated stories total 69 points.
- EPIC-001 Sign-in and account access:
  - US-001 Sign in with email and password (5, backend-agent)
  - US-002 Role-restricted access (3, security-agent)
  - US-003 Reset a forgotten password (5, backend-agent)
- EPIC-002 User account administration:
  - US-004 Create a user account (3, backend-agent)
  - US-005 Assign a manager to an employee (2, backend-agent)
  - US-006 Edit and deactivate users (3, backend-agent)
- EPIC-003 Clients, projects, tasks and bill rate:
  - US-007 Manage clients (3, backend-agent)
  - US-008 Manage projects with an hourly bill rate (3, backend-agent)
  - US-009 Manage tasks within a project (3, backend-agent)
- EPIC-004 Clock in and out with breaks:
  - US-010 Clock in and out against a project and task (8, backend-agent). Tasks:
    - US-010-T1 time_entries migration (backend-agent)
    - US-010-T2 clock status, in and out endpoints (backend-agent)
    - US-010-T3 clock page (frontend-agent)
  - US-011 Record breaks while clocked in (3, backend-agent)
  - US-012 Recover an entry left running (3, backend-agent)
- EPIC-005 Weekly timesheet entry:
  - US-013 Enter hours by day in a weekly timesheet (8, frontend-agent). Tasks:
    - US-013-T1 timesheet week and cell endpoints (backend-agent)
    - US-013-T2 weekly timesheet grid (frontend-agent)
    - US-013-T3 timesheet API test suite (qa-agent)
  - US-014 Mark entries billable or non-billable (2, frontend-agent)
  - US-015 Edit and delete my own time entries (3, backend-agent)
- EPIC-006 Employee dashboard:
  - US-016 See my weekly hours on a dashboard (3, frontend-agent)
- EPIC-007 Time zone, week start, language and responsive layout:
  - US-017 Times stored in UTC and shown in my time zone (3, backend-agent)
  - US-018 English-only, responsive interface (3, frontend-agent)
- EPIC-008 Basic user and project documentation:
  - US-019 User and admin guides (3, devops-agent)
- Epics have no points and no assigned role.
- Scope observation: the project description also lists the following, but none appear as plan items in this input:
  - timesheet submission and approval/locking
  - time off and leave balances
  - labour-rule overtime and break flags
  - compliance reports
  - reports and CSV/payroll export
  - notifications
  - audit trail
- Whether these were deferred is not stated.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 targets sign-in, roles, password reset and user creation with manager assignment. Capacity is 20 points.

- Goal: secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- The input does not state an explicit story-to-sprint assignment. The goal text corresponds to US-001 through US-005.
- No ticket outcomes for US-001 to US-005 were reported in the development run.

**Related:** DEV-PLAN-V1, EPIC-001, EPIC-002

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 targets finishing user administration, setting up clients/projects/tasks with bill rates, and clock in/out. Capacity is 20 points.

- Goal: complete user administration; set up clients, projects with bill rates and tasks; let employees clock in and out.
- Capacity: 20.
- The goal text corresponds to US-006 through US-010. No explicit assignment was given.
- Reported outcomes:
  - US-006: delivered
  - US-007: failed
  - US-008: skipped
  - US-009: skipped
  - US-010: delivered

**Related:** DEV-PLAN-V1, EPIC-002, EPIC-003, EPIC-004

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 targets time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking. Capacity is 20 points.

- Goal: correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- The goal text corresponds to US-011, US-012, US-013, US-014 and US-017. No explicit assignment was given.
- No ticket outcomes were reported for these stories.

**Related:** DEV-PLAN-V1, EPIC-004, EPIC-005, EPIC-007

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 targets editing and deleting own entries, the weekly hours dashboard, a responsive English interface and documentation. Capacity is 20 points.

- Goal: edit and delete own entries, weekly hours dashboard, responsive English interface, and user/admin/project documentation.
- Capacity: 20.
- The goal text corresponds to US-015, US-016, US-018 and US-019. No explicit assignment was given.
- No ticket outcomes were reported for these stories.

**Related:** DEV-PLAN-V1, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### DEV-RUN · draft · source: dev:run

The development run is marked 'completed', but its ticket results show only partial delivery. 2 of the 5 reported tickets were delivered, 1 failed and 2 were skipped. Both versions are recorded because they conflict.

- Run status reported: completed.
- Ticket results reported: 5 of 19 planned stories.
  - Delivered: US-006, US-010. Both have commit 111d78c63446bfc73e4f033933fe1fda7f7bd12f.
  - Failed: US-007. No commit.
  - Skipped: US-008, US-009. No commit.
- Conflict:
  - Version A: the run status says 'completed'.
  - Version B: the ticket list shows a failure and skips, and gives no outcome for 14 stories.
  - The input does not say which reflects the true scope of the run.
- Delivered points: 11 (US-006 = 3, US-010 = 8) out of 69 planned.
- No dates, reviewers, test results or failure/skip reasons were provided.

**Related:** US-006, US-007, US-008, US-009, US-010, DEV-UNREPORTED

### DEV-US-006 · draft · source: dev:US-006

US-006 (Edit and deactivate users) was delivered. Its commit is shared with US-010.

- Status: delivered.
- Commit: 111d78c63446bfc73e4f033933fe1fda7f7bd12f.
- Estimate: 3 points, backend-agent.
- No review, approval or test result was provided.

**Related:** US-006, EPIC-002, DEV-SPRINT-2

### DEV-US-007 · draft · source: dev:US-007

US-007 (Manage clients) failed. No commit was produced.

- Status: failed.
- Commit: none.
- Estimate: 3 points, backend-agent.
- No failure reason or follow-up action was provided.

**Related:** US-007, EPIC-003, DEV-SPRINT-2

### DEV-US-008 · draft · source: dev:US-008

US-008 (Manage projects with an hourly bill rate) was skipped. No commit was produced.

- Status: skipped.
- Commit: none.
- Estimate: 3 points, backend-agent.
- No reason for skipping was given. The input does not say whether it relates to the US-007 failure.

**Related:** US-008, EPIC-003, DEV-SPRINT-2

### DEV-US-009 · draft · source: dev:US-009

US-009 (Manage tasks within a project) was skipped. No commit was produced.

- Status: skipped.
- Commit: none.
- Estimate: 3 points, backend-agent.
- No reason for skipping was given.

**Related:** US-009, EPIC-003, DEV-SPRINT-2

### DEV-US-010 · draft · source: dev:US-010

US-010 (Clock in and out against a project and task) was delivered in the same commit as US-006. Project and task management (US-008, US-009) was skipped, so the input does not show how projects and tasks become available to clock against.

- Status: delivered.
- Commit: 111d78c63446bfc73e4f033933fe1fda7f7bd12f, shared with US-006.
- Estimate: 8 points, backend-agent.
- Planned tasks:
  - T1: time_entries migration
  - T2: clock status/in/out endpoints
  - T3: clock page (frontend-agent)
  - No individual task outcomes were reported.
- Dependency observation: the story charges entries to a project and task, but US-008 and US-009 were skipped and US-007 failed. The input does not explain how project/task data is provided. This needs human confirmation.
- No test results were provided.

**Related:** US-010, US-010-T1, US-010-T2, US-010-T3, US-008, US-009, EPIC-004, DEV-SPRINT-2

### DEV-UNREPORTED · draft · source: dev:run

14 planned stories have no ticket result in the development run. Their implementation state is unknown and is not assumed here.

- Stories with no reported outcome:
  - US-001, US-002, US-003, US-004, US-005
  - US-011, US-012, US-013 (with tasks T1–T3), US-014, US-015
  - US-016, US-017, US-018, US-019
- These cover sign-in, roles, password reset, user creation, manager assignment, breaks, entry recovery, weekly timesheet, billable marking, entry editing, dashboard, time zones, responsive UI and guides.
- They are not recorded as delivered, failed or skipped. A human should confirm their status.

**Related:** US-001, US-002, US-003, US-004, US-005, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019
<!-- sdlc:auto:end narrative -->
