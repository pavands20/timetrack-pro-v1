# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan is approved at version 1. It has 4 sprints of capacity 20 each and covers 8 epics, 19 stories and 6 tasks.

- Plan status: approved; version: 1.
- Sprints: Sprint 1 to Sprint 4, capacity 20 each.
- Epics: EPIC-001 to EPIC-008. No points or role assigned to any epic.
- Stories: US-001 to US-019, 2 to 8 points each, 70 points in total.
- Tasks: US-010-T1, US-010-T2, US-010-T3, US-013-T1, US-013-T2, US-013-T3. No points on any task.
- Agent roles used: backend-agent, security-agent, frontend-agent, qa-agent, devops-agent.
- No approver or approval date was provided in the input.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 covers secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment. Capacity is 20 points.

- Goal (verbatim): Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- Stories matching the goal (inferred from goal text; the input gives no explicit story-to-sprint assignment): US-001 (5), US-002 (3), US-003 (5), US-004 (3), US-005 (2). Total: 18 points.
- Delivery: no ticket records for these stories in the development run input.

**Related:** US-001, US-002, US-003, US-004, US-005, EPIC-001, EPIC-002

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 completes user administration, sets up clients, projects with bill rates, and tasks, and adds clock in and out. Capacity is 20 points.

- Goal (verbatim): Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out.
- Capacity: 20.
- Stories matching the goal (inferred from goal text): US-006 (3), US-007 (3), US-008 (3), US-009 (3), US-010 (8). Total: 20 points.
- Delivery: no ticket records for these stories or for tasks US-010-T1 to T3 in the development run input.

**Related:** US-006, US-007, US-008, US-009, US-010, EPIC-002, EPIC-003, EPIC-004

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking. Capacity is 20 points.

- Goal (verbatim): Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- Stories matching the goal (inferred from goal text): US-017 (3), US-011 (3), US-012 (3), US-013 (8), US-014 (2). Total: 19 points.
- Delivery: no ticket records for these stories or for tasks US-013-T1 to T3 in the development run input.

**Related:** US-017, US-011, US-012, US-013, US-014, EPIC-004, EPIC-005, EPIC-007

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers editing and deleting own entries, the weekly hours dashboard, a responsive English interface, and user, admin and project documentation. All four matching stories are recorded as delivered.

- Goal (verbatim): Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation.
- Capacity: 20.
- Stories matching the goal: US-015 (3), US-016 (3), US-018 (3), US-019 (3). Total: 12 points.
- Delivery: all four have status=delivered in the development run (see DEV-US-015, DEV-US-016, DEV-US-018, DEV-US-019).

**Related:** US-015, US-016, US-018, US-019, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### DEV-EPIC-001 · approved · source: plan:EPIC-001

Epic for sign-in and account access, made up of three stories. No delivery is recorded for any of them.

- US-001 Sign in with email and password: 5 pts, backend-agent.
- US-002 Role-restricted access: 3 pts, security-agent.
- US-003 Reset a forgotten password: 5 pts, backend-agent.
- Delivery status: not provided in the input.

**Related:** US-001, US-002, US-003

### DEV-EPIC-002 · approved · source: plan:EPIC-002

Epic for user account administration, made up of three stories. No delivery is recorded for any of them.

- US-004 Create a user account: 3 pts, backend-agent.
- US-005 Assign a manager to an employee: 2 pts, backend-agent.
- US-006 Edit and deactivate users: 3 pts, backend-agent.
- Delivery status: not provided in the input.

**Related:** US-004, US-005, US-006

### DEV-EPIC-003 · approved · source: plan:EPIC-003

Epic for clients, projects, tasks and bill rate, made up of three stories. No delivery is recorded for any of them.

- US-007 Manage clients: 3 pts, backend-agent.
- US-008 Manage projects with an hourly bill rate: 3 pts, backend-agent.
- US-009 Manage tasks within a project: 3 pts, backend-agent.
- Delivery status: not provided in the input.

**Related:** US-007, US-008, US-009

### DEV-EPIC-004 · approved · source: plan:EPIC-004

Epic for clock in and out with breaks. US-010 is broken into three tasks. No delivery is recorded for any story or task.

- US-010 Clock in and out against a project and task: 8 pts, backend-agent.
  - US-010-T1 Add time_entries migration: backend-agent.
  - US-010-T2 Implement clock status, in and out endpoints: backend-agent.
  - US-010-T3 Build clock page: frontend-agent.
- US-011 Record breaks while clocked in: 3 pts, backend-agent.
- US-012 Recover an entry left running: 3 pts, backend-agent.
- Delivery status: not provided in the input.

**Related:** US-010, US-011, US-012

### DEV-EPIC-005 · approved · source: plan:EPIC-005

Epic for weekly timesheet entry. US-013 is broken into three tasks, including an API test suite. Only US-015 is recorded as delivered.

- US-013 Enter hours by day in a weekly timesheet: 8 pts, frontend-agent.
  - US-013-T1 Implement timesheet week and cell endpoints: backend-agent.
  - US-013-T2 Build weekly timesheet grid: frontend-agent.
  - US-013-T3 Add timesheet API test suite: qa-agent.
- US-014 Mark entries billable or non-billable: 2 pts, frontend-agent.
- US-015 Edit and delete my own time entries: 3 pts, backend-agent. Delivered (see DEV-US-015).
- Delivery status for US-013, its tasks, and US-014: not provided.
- Test suite results for US-013-T3: not provided.

**Related:** US-013, US-014, US-015

### DEV-EPIC-006 · approved · source: plan:EPIC-006

Epic for the employee dashboard. Its single story, US-016, is recorded as delivered.

- US-016 See my weekly hours on a dashboard: 3 pts, frontend-agent. Delivered (see DEV-US-016).

**Related:** US-016

### DEV-EPIC-007 · approved · source: plan:EPIC-007

Epic for time zone, week start, language and responsive layout. US-018 is recorded as delivered. US-017 has no delivery record.

- US-017 Times stored in UTC and shown in my time zone: 3 pts, backend-agent. Delivery status: not provided.
- US-018 English-only, responsive interface: 3 pts, frontend-agent. Delivered (see DEV-US-018).
- The epic title mentions week start, but no story in the plan names week start explicitly.

**Related:** US-017, US-018

### DEV-EPIC-008 · approved · source: plan:EPIC-008

Epic for basic user and project documentation. Its single story, US-019, is recorded as delivered.

- US-019 User and admin guides: 3 pts, devops-agent. Delivered (see DEV-US-019).

**Related:** US-019

### DEV-US-015 · draft · source: dev:US-015

The ticket to edit and delete own time entries was delivered at commit 19b54af.

- Ticket: US-015 Edit and delete my own time entries.
- Status: delivered.
- Commit: 19b54af593c72af1f458845f9b5ff36d5588f5d9.
- Planned: 3 pts, backend-agent.
- No review, test result or delivery date was provided.

**Related:** US-015, EPIC-005, DEV-SPRINT-4

### DEV-US-016 · draft · source: dev:US-016

The weekly hours dashboard ticket was delivered at commit 1fe2e39. It shares that commit with US-018.

- Ticket: US-016 See my weekly hours on a dashboard.
- Status: delivered.
- Commit: 1fe2e39152c5552a8e0ef16dc2033e3e48570eb4. The same commit is recorded for US-018.
- Planned: 3 pts, frontend-agent.
- No review, test result or delivery date was provided.

**Related:** US-016, EPIC-006, DEV-SPRINT-4, DEV-US-018

### DEV-US-018 · draft · source: dev:US-018

The English-only, responsive interface ticket was delivered at commit 1fe2e39. It shares that commit with US-016.

- Ticket: US-018 English-only, responsive interface.
- Status: delivered.
- Commit: 1fe2e39152c5552a8e0ef16dc2033e3e48570eb4. The same commit is recorded for US-016.
- Planned: 3 pts, frontend-agent.
- No review, test result or delivery date was provided.

**Related:** US-018, EPIC-007, DEV-SPRINT-4, DEV-US-016

### DEV-US-019 · draft · source: dev:US-019

The user and admin guides ticket was delivered at commit 3651760.

- Ticket: US-019 User and admin guides.
- Status: delivered.
- Commit: 365176003d3825ff68b7ce673b5b7363926fab5e.
- Planned: 3 pts, devops-agent.
- The guide content itself was not provided in the input.
- No review or delivery date was provided.

**Related:** US-019, EPIC-008, DEV-SPRINT-4

### DEV-GAP-001 · draft · source: dev:run

The development run is marked completed but lists tickets for only 4 of 19 stories. The state of the other 15 stories and all 6 tasks is not recorded in this input.

- Run status: completed.
- Tickets with a record: US-015, US-016, US-018, US-019 (all delivered).
- Stories with no ticket, commit or status in this input: US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-017.
- Tasks with no status: US-010-T1, US-010-T2, US-010-T3, US-013-T1, US-013-T2, US-013-T3.
- Possible explanations: this run may cover only Sprint 4, or earlier delivery records may be held elsewhere. The input does not say which, so this needs human confirmation.
- Gaps in the full project description (not in the approved v1 plan, so presumably outside this V1 scope; needs human confirmation):
  - Timesheet submission and approval.
  - Time off and leave balances.
  - Labour rules and compliance report.
  - Reports and CSV/payroll export.
  - Notifications.
  - Audit trail.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-017
<!-- sdlc:auto:end narrative -->
