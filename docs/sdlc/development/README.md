# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

Development plan version 1 is approved. It spans 4 sprints of capacity 20 each. It organises 19 user stories under 8 epics, plus implementation tasks for US-010 and US-013.

Plan status: approved, version 1.

Sprints (capacity 20 each):
- Sprint 1: Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Sprint 2: Complete user administration; set up clients, projects with bill rates, and tasks; let employees clock in and out.
- Sprint 3: Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Sprint 4: Edit and delete own entries, weekly hours dashboard, responsive English interface, and user/admin/project documentation.

Backlog (points, assigned role):
- EPIC-001 Sign-in and account access (unassigned)
  - US-001 Sign in with email and password (5, backend-agent)
  - US-002 Role-restricted access (3, security-agent)
  - US-003 Reset a forgotten password (5, backend-agent)
- EPIC-002 User account administration (unassigned)
  - US-004 Create a user account (3, backend-agent)
  - US-005 Assign a manager to an employee (2, backend-agent)
  - US-006 Edit and deactivate users (3, backend-agent)
- EPIC-003 Clients, projects, tasks and bill rate (unassigned)
  - US-007 Manage clients (3, backend-agent)
  - US-008 Manage projects with an hourly bill rate (3, backend-agent)
  - US-009 Manage tasks within a project (3, backend-agent)
- EPIC-004 Clock in and out with breaks (unassigned)
  - US-010 Clock in and out against a project and task (8, backend-agent)
    - US-010-T1 Add time_entries migration (backend-agent)
    - US-010-T2 Implement clock status, in and out endpoints (backend-agent)
    - US-010-T3 Build clock page (frontend-agent)
  - US-011 Record breaks while clocked in (3, backend-agent)
  - US-012 Recover an entry left running (3, backend-agent)
- EPIC-005 Weekly timesheet entry (unassigned)
  - US-013 Enter hours by day in a weekly timesheet (8, frontend-agent)
    - US-013-T1 Implement timesheet week and cell endpoints (backend-agent)
    - US-013-T2 Build weekly timesheet grid (frontend-agent)
    - US-013-T3 Add timesheet API test suite (qa-agent)
  - US-014 Mark entries billable or non-billable (2, frontend-agent)
  - US-015 Edit and delete my own time entries (3, backend-agent)
- EPIC-006 Employee dashboard (unassigned)
  - US-016 See my weekly hours on a dashboard (3, frontend-agent)
- EPIC-007 Time zone, week start, language and responsive layout (unassigned)
  - US-017 Times stored in UTC and shown in my time zone (3, backend-agent)
  - US-018 English-only, responsive interface (3, frontend-agent)
- EPIC-008 Basic user and project documentation (unassigned)
  - US-019 User and admin guides (3, devops-agent)

Total story points: 69 across 19 stories, against 80 points of sprint capacity.

The input gives no mapping of individual items to sprints beyond the sprint goals.

Scope note: the plan covers only a V1 subset of the project description. It does not include timesheet approval, time off, labour rules and overtime, reports and CSV/payroll export, notifications, or audit.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-RUN-1 · draft · source: dev:run

The development run is reported as 'completed'. Only 5 ticket outcomes are recorded: 3 delivered, 1 failed and 1 skipped. The run-level status conflicts with the ticket-level results.

Run status as reported: completed.

Ticket outcomes:
- US-001: failed, no commit.
- US-002: delivered, commit 9c75752a7a93df0da23f5db5ff9fefe5b17baa4e.
- US-003: skipped, no commit.
- US-004: delivered, commit 9c75752a7a93df0da23f5db5ff9fefe5b17baa4e.
- US-005: delivered, commit 9c75752a7a93df0da23f5db5ff9fefe5b17baa4e.

Conflict (both versions recorded):
- Version A: the run status says 'completed'.
- Version B: the ticket list shows 1 failed ticket, 1 skipped ticket, and no outcome at all for 14 of the 19 planned stories (US-006 to US-019).

The input does not explain:
- why the run is marked completed;
- why US-003 was skipped;
- why US-001 failed.

**Related:** US-001, US-002, US-003, US-004, US-005

### US-001 · draft · source: dev:US-001

Sign in with email and password failed in the development run. No commit was produced.

- Ticket: US-001 Sign in with email and password.
- Epic: EPIC-001.
- Points: 5. Role: backend-agent. Planned in Sprint 1.
- Result: failed. Commit: none.
- No failure reason is given in the input.
- Impact on the plan: this was the core of the Sprint 1 goal ('Secure sign-in'). Email/password sign-in is not confirmed as built.

**Related:** EPIC-001, DEV-PLAN-V1

### US-002 · draft · source: dev:US-002

Role-restricted access was delivered in commit 9c75752a. It maps to the Sprint 1 goal of server-enforced roles.

- Ticket: US-002 Role-restricted access.
- Epic: EPIC-001.
- Points: 3. Role: security-agent. Planned in Sprint 1.
- Result: delivered.
- Commit: 9c75752a7a93df0da23f5db5ff9fefe5b17baa4e. This is shared with US-004 and US-005.
- Observation: this was delivered while US-001 (sign-in) in the same epic failed. The input does not state how roles are exercised without a delivered sign-in.

**Related:** EPIC-001, DEV-PLAN-V1, US-001

### US-003 · draft · source: dev:US-003

Password reset by email was skipped in the development run. No commit was produced.

- Ticket: US-003 Reset a forgotten password.
- Epic: EPIC-001.
- Points: 5. Role: backend-agent. Planned in Sprint 1.
- Result: skipped. Commit: none.
- No reason for skipping is given in the input.

**Related:** EPIC-001, DEV-PLAN-V1

### US-004 · draft · source: dev:US-004

Admin creation of user accounts was delivered in commit 9c75752a.

- Ticket: US-004 Create a user account.
- Epic: EPIC-002.
- Points: 3. Role: backend-agent. Planned in Sprint 1.
- Result: delivered.
- Commit: 9c75752a7a93df0da23f5db5ff9fefe5b17baa4e. This is shared with US-002 and US-005.

**Related:** EPIC-002, DEV-PLAN-V1

### US-005 · draft · source: dev:US-005

Assigning a manager to an employee was delivered in commit 9c75752a.

- Ticket: US-005 Assign a manager to an employee.
- Epic: EPIC-002.
- Points: 2. Role: backend-agent. Planned in Sprint 1.
- Result: delivered.
- Commit: 9c75752a7a93df0da23f5db5ff9fefe5b17baa4e. This is shared with US-002 and US-004.

**Related:** EPIC-002, DEV-PLAN-V1, US-004

### DEV-UNREPORTED · draft · source: plan:version-1

14 planned stories (US-006 to US-019) have no ticket outcome in the development run. Their implementation status is unknown and must not be assumed.

Stories in the approved plan with no ticket result, commit or status in the development input:
- US-006 Edit and deactivate users
- US-007 Manage clients
- US-008 Manage projects with an hourly bill rate
- US-009 Manage tasks within a project
- US-010 Clock in and out against a project and task, including tasks T1-T3
- US-011 Record breaks while clocked in
- US-012 Recover an entry left running
- US-013 Enter hours by day in a weekly timesheet, including tasks T1-T3
- US-014 Mark entries billable or non-billable
- US-015 Edit and delete my own time entries
- US-016 See my weekly hours on a dashboard
- US-017 Times stored in UTC and shown in my time zone
- US-018 English-only, responsive interface
- US-019 User and admin guides

This covers Sprint 1 through Sprint 4 scope, apart from the five reported tickets.

This gap conflicts with the run status of 'completed' (see DEV-RUN-1). For that reason, no end-user guide is produced for these capabilities.

**Related:** US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019
<!-- sdlc:auto:end narrative -->
