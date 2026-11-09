# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan for TimeTrack Pro V1 is approved at version 1. It spans 4 sprints of capacity 20 each and covers 8 epics, 19 stories and 6 sub-tasks.

- Plan status: approved, version 1.
- Approver and approval date: not stated in input.
- Sprints: Sprint 1, Sprint 2, Sprint 3, Sprint 4. Each has capacity 20.
- Total story points: 69 (US-001 5, US-002 3, US-003 5, US-004 3, US-005 2, US-006 3, US-007 3, US-008 3, US-009 3, US-010 8, US-011 3, US-012 3, US-013 8, US-014 2, US-015 3, US-016 3, US-017 3, US-018 3, US-019 3).
- Epics have no points and no assigned role.
- Sub-tasks (US-010-T1..T3, US-013-T1..T3) have no points.
- Scope note: the plan covers sign-in, user admin, clients/projects/tasks, clock in/out, breaks, the weekly timesheet, billable marking, the dashboard, time zone and responsive UI, and documentation.
- These areas from the project description have no plan items in v1: timesheet submission/approval, time off, labour rules/overtime, reports/CSV/payroll export, notifications, and audit.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 targets secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment. No delivered tickets are reported for these stories.

- Goal (verbatim): Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- Story mapping is inferred from the goal wording; the input gives no explicit sprint-to-item assignment:
  - US-001 Sign in with email and password (5 pts, backend-agent)
  - US-002 Role-restricted access (3 pts, security-agent)
  - US-003 Reset a forgotten password (5 pts, backend-agent)
  - US-004 Create a user account (3 pts, backend-agent)
  - US-005 Assign a manager to an employee (2 pts, backend-agent)
- Inferred total: 18 pts.
- Delivery status: no ticket records in the development run input.

**Related:** US-001, US-002, US-003, US-004, US-005, EPIC-001, EPIC-002

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 targets the rest of user administration, clients, projects with bill rates, tasks, and employee clock in/out. No delivered tickets are reported for these stories.

- Goal (verbatim): Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out.
- Capacity: 20.
- Story mapping is inferred from the goal wording:
  - US-006 Edit and deactivate users (3 pts, backend-agent)
  - US-007 Manage clients (3 pts, backend-agent)
  - US-008 Manage projects with an hourly bill rate (3 pts, backend-agent)
  - US-009 Manage tasks within a project (3 pts, backend-agent)
  - US-010 Clock in and out against a project and task (8 pts, backend-agent)
    - US-010-T1 Add time_entries migration (backend-agent)
    - US-010-T2 Implement clock status, in and out endpoints (backend-agent)
    - US-010-T3 Build clock page (frontend-agent)
- Inferred total: 20 pts.
- Delivery status: no ticket records in the development run input.
- Dependency gap: US-011 and US-012 (breaks, running-entry recovery) are reported delivered, but US-010 (base clock in/out) has no ticket record.

**Related:** US-006, US-007, US-008, US-009, US-010, EPIC-002, EPIC-003, EPIC-004

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 targets correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking. All five matching stories are reported delivered in the development run.

- Goal (verbatim): Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- Story mapping is inferred from the goal wording:
  - US-017 Times stored in UTC and shown in my time zone (3 pts): delivered
  - US-011 Record breaks while clocked in (3 pts): delivered
  - US-012 Recover an entry left running (3 pts): delivered
  - US-013 Enter hours by day in a weekly timesheet (8 pts): delivered
    - Sub-tasks US-013-T1, US-013-T2, US-013-T3 have no individual status
  - US-014 Mark entries billable or non-billable (2 pts): delivered
- Inferred total: 19 pts.
- The delivered ticket set matches this sprint exactly.

**Related:** US-011, US-012, US-013, US-014, US-017, EPIC-004, EPIC-005, EPIC-007

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 targets editing and deleting own entries, a weekly hours dashboard, a responsive English interface, and user/admin/project documentation. No delivered tickets are reported for these stories.

- Goal (verbatim): Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation.
- Capacity: 20.
- Story mapping is inferred from the goal wording:
  - US-015 Edit and delete my own time entries (3 pts, backend-agent)
  - US-016 See my weekly hours on a dashboard (3 pts, frontend-agent)
  - US-018 English-only, responsive interface (3 pts, frontend-agent)
  - US-019 User and admin guides (3 pts, devops-agent)
- Inferred total: 12 pts.
- Delivery status: no ticket records in the development run input.

**Related:** US-015, US-016, US-018, US-019, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### DEV-US-011 · draft · source: dev:US-011

The ticket for recording breaks while clocked in is reported delivered at commit 1792ebc. No tests, review or approval are recorded.

- Ticket: US-011 Record breaks while clocked in.
- Status: delivered.
- Commit: 1792ebc6abc34f0968c0175918f6f2a5f7785524.
- Planned: 3 pts, backend-agent, EPIC-004.
- Depends on US-010 (clock in/out), which has no ticket record.
- Test results, reviewer and acceptance: not provided.

**Related:** US-011, EPIC-004, US-010

### DEV-US-012 · draft · source: dev:US-012

The ticket for recovering a time entry left running is reported delivered at commit 1b0a79e. No tests, review or approval are recorded.

- Ticket: US-012 Recover an entry left running.
- Status: delivered.
- Commit: 1b0a79e33c91d798b4a33b42d060145043651d7d.
- Planned: 3 pts, backend-agent, EPIC-004.
- Depends on US-010 (clock in/out), which has no ticket record.
- Test results, reviewer and acceptance: not provided.

**Related:** US-012, EPIC-004, US-010

### DEV-US-013 · draft · source: dev:US-013

The weekly timesheet ticket (enter hours by day) is reported delivered at commit ac5fed5. It shares this commit with US-014.

- Ticket: US-013 Enter hours by day in a weekly timesheet.
- Status: delivered.
- Commit: ac5fed5172327f2bb9796296aaa23d05441d5363. This is the same commit as US-014.
- Planned: 8 pts, frontend-agent, EPIC-005.
- Planned sub-tasks, with no individual status reported:
  - T1 timesheet week and cell endpoints (backend-agent)
  - T2 weekly timesheet grid (frontend-agent)
  - T3 timesheet API test suite (qa-agent)
- Test suite results: not provided.

**Related:** US-013, US-013-T1, US-013-T2, US-013-T3, EPIC-005, US-014

### DEV-US-014 · draft · source: dev:US-014

The ticket for marking entries billable or non-billable is reported delivered at commit ac5fed5. The commit is shared with the weekly timesheet ticket.

- Ticket: US-014 Mark entries billable or non-billable.
- Status: delivered.
- Commit: ac5fed5172327f2bb9796296aaa23d05441d5363. This is the same commit as US-013.
- Planned: 2 pts, frontend-agent, EPIC-005.
- Test results, reviewer and acceptance: not provided.

**Related:** US-014, EPIC-005, US-013

### DEV-US-017 · draft · source: dev:US-017

The ticket for storing times in UTC and showing them in the user's time zone is reported delivered at commit 3295f5e. No tests, review or approval are recorded.

- Ticket: US-017 Times stored in UTC and shown in my time zone.
- Status: delivered.
- Commit: 3295f5e1cf51a2f3bb48cf97c5f51ed8e29eb513.
- Planned: 3 pts, backend-agent, EPIC-007.
- Test results, reviewer and acceptance: not provided.

**Related:** US-017, EPIC-007

### DEV-RUN-STATUS · draft · source: dev:run

The development run is marked completed but reports only 5 of 19 planned stories. The remaining 14 stories have no ticket record, so their state is undocumented.

- Run status: completed.
- Delivered (5): US-011, US-012, US-013, US-014, US-017.
- No ticket record (14): US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-015, US-016, US-018, US-019.
- Discrepancy (both versions kept):
  - The run says 'completed'.
  - Ticket coverage shows only the Sprint 3 scope.
  - The run may cover a single sprint, or other tickets may be missing from the input. This needs human confirmation.
- Shared commit: US-013 and US-014 share commit ac5fed5.
- Not provided: dates, approvers, test outcomes and deployment details.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-015, US-016, US-018, US-019
<!-- sdlc:auto:end narrative -->
