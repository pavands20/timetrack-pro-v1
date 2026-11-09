# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan for TimeTrack Pro V1 is approved at version 1. It has 4 sprints of capacity 20 each and a backlog of 8 epics and 19 user stories. Some stories are broken into tasks.

- Plan status: approved, version 1. The input does not state an approver or an approval date.
- Sprints: Sprint 1 to Sprint 4, capacity 20 each.
- Epics:
  - EPIC-001 Sign-in and account access: US-001, US-002, US-003
  - EPIC-002 User account administration: US-004, US-005, US-006
  - EPIC-003 Clients, projects, tasks and bill rate: US-007, US-008, US-009
  - EPIC-004 Clock in and out with breaks: US-010, US-011, US-012
  - EPIC-005 Weekly timesheet entry: US-013, US-014, US-015
  - EPIC-006 Employee dashboard: US-016
  - EPIC-007 Time zone, week start, language and responsive layout: US-017, US-018
  - EPIC-008 Basic user and project documentation: US-019
- Epics have no points and no assigned role.
- The epic-to-story grouping follows plan item order. The input does not state parent links explicitly.
- Total story points: 69.
- Scope note: the plan backlog does not include these features from the project description:
  - timesheet approval
  - time off and leave balances
  - labour-rule and overtime flags
  - reports and CSV or payroll export
  - notifications
  - audit trail
  The input gives no reason for leaving them out.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 covers secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment. The input contains no delivery records for this sprint's stories.

- Goal: Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- Related stories, inferred from the goal wording because the input does not assign items to sprints explicitly:
  - US-001 Sign in with email and password (5 pts, backend-agent)
  - US-002 Role-restricted access (3 pts, security-agent)
  - US-003 Reset a forgotten password (5 pts, backend-agent)
  - US-004 Create a user account (3 pts, backend-agent)
  - US-005 Assign a manager to an employee (2 pts, backend-agent)
  - Inferred total: 18 pts.
- Delivery: the development run lists no ticket for US-001 to US-005. Their implementation status is not recorded in the input.

**Related:** US-001, US-002, US-003, US-004, US-005

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 covers completing user administration, setting up clients, projects with bill rates and tasks, and clock in/out. Every story implied by this goal has a ticket marked delivered.

- Goal: Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out.
- Capacity: 20.
- Related stories, inferred from the goal wording:
  - US-006 Edit and deactivate users (3 pts)
  - US-007 Manage clients (3 pts)
  - US-008 Manage projects with an hourly bill rate (3 pts)
  - US-009 Manage tasks within a project (3 pts)
  - US-010 Clock in and out against a project and task (8 pts)
  - Inferred total: 20 pts, which equals capacity.
- Delivery: all 5 tickets have status=delivered. See DEV-US-006 to DEV-US-010.

**Related:** US-006, US-007, US-008, US-009, US-010

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking. The input contains no delivery records for this sprint's stories.

- Goal: Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- Related stories, inferred from the goal wording:
  - US-017 Times stored in UTC and shown in my time zone (3 pts, backend-agent)
  - US-011 Record breaks while clocked in (3 pts, backend-agent)
  - US-012 Recover an entry left running (3 pts, backend-agent)
  - US-013 Enter hours by day in a weekly timesheet (8 pts, frontend-agent), with tasks:
    - US-013-T1 Implement timesheet week and cell endpoints (backend-agent)
    - US-013-T2 Build weekly timesheet grid (frontend-agent)
    - US-013-T3 Add timesheet API test suite (qa-agent)
  - US-014 Mark entries billable or non-billable (2 pts, frontend-agent)
  - Inferred total: 19 pts.
- Delivery: the development run lists no ticket for these stories.

**Related:** US-011, US-012, US-013, US-014, US-017

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers editing and deleting own entries, the weekly hours dashboard, a responsive English interface, and user/admin/project documentation. The input contains no delivery records for this sprint's stories.

- Goal: Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation.
- Capacity: 20.
- Related stories, inferred from the goal wording:
  - US-015 Edit and delete my own time entries (3 pts, backend-agent)
  - US-016 See my weekly hours on a dashboard (3 pts, frontend-agent)
  - US-018 English-only, responsive interface (3 pts, frontend-agent)
  - US-019 User and admin guides (3 pts, devops-agent)
  - Inferred total: 12 pts.
- Delivery: the development run lists no ticket for these stories.

**Related:** US-015, US-016, US-018, US-019

### DEV-US-006 · draft · source: dev:US-006

The ticket for editing and deactivating user accounts is marked delivered in commit 94104b8.

- Ticket: US-006 Edit and deactivate users.
- Status: delivered.
- Commit: 94104b8a0ac8be3016ca7c15902ca9d2e309d9c1.
- Plan: 3 pts, backend-agent, EPIC-002 User account administration.
- Not stated in the input: implementation details, review or approval, test results, delivery date.
- Dependency note: this story extends user creation (US-004). The input has no delivery record for US-004.

**Related:** US-006, US-004, DEV-SPRINT-2

### DEV-US-007 · draft · source: dev:US-007

The ticket for managing clients is marked delivered in commit 386ab35. This commit is shared with US-008, US-009 and US-010.

- Ticket: US-007 Manage clients.
- Status: delivered.
- Commit: 386ab355e9434eaa52df0bebc9a8a9060d456873, shared with US-008, US-009 and US-010.
- Plan: 3 pts, backend-agent, EPIC-003.
- Not stated in the input: implementation details, review or approval, test results, delivery date.

**Related:** US-007, DEV-SPRINT-2

### DEV-US-008 · draft · source: dev:US-008

The ticket for managing projects with an hourly bill rate is marked delivered in shared commit 386ab35.

- Ticket: US-008 Manage projects with an hourly bill rate.
- Status: delivered.
- Commit: 386ab355e9434eaa52df0bebc9a8a9060d456873, shared with US-007, US-009 and US-010.
- Plan: 3 pts, backend-agent, EPIC-003.
- Not stated in the input: implementation details, review or approval, test results, delivery date.

**Related:** US-008, US-007, DEV-SPRINT-2

### DEV-US-009 · draft · source: dev:US-009

The ticket for managing tasks within a project is marked delivered in shared commit 386ab35.

- Ticket: US-009 Manage tasks within a project.
- Status: delivered.
- Commit: 386ab355e9434eaa52df0bebc9a8a9060d456873, shared with US-007, US-008 and US-010.
- Plan: 3 pts, backend-agent, EPIC-003.
- Not stated in the input: implementation details, review or approval, test results, delivery date.

**Related:** US-009, US-008, DEV-SPRINT-2

### DEV-US-010 · draft · source: dev:US-010

The ticket for clocking in and out against a project and task is marked delivered in shared commit 386ab35. The plan breaks this story into 3 tasks, but the run does not report them individually.

- Ticket: US-010 Clock in and out against a project and task.
- Status: delivered.
- Commit: 386ab355e9434eaa52df0bebc9a8a9060d456873, shared with US-007, US-008 and US-009.
- Plan: 8 pts, backend-agent, EPIC-004.
- Planned tasks (no individual status in the run):
  - US-010-T1 Add time_entries migration (backend-agent)
  - US-010-T2 Implement clock status, in and out endpoints (backend-agent)
  - US-010-T3 Build clock page (frontend-agent)
- Out of scope here: breaks (US-011) and recovery of a running entry (US-012) are separate stories with no delivery record.
- Not stated in the input: review or approval, test results, delivery date.

**Related:** US-010, US-008, US-009, DEV-SPRINT-2

### DEV-RUN-STATUS · draft · source: dev:run

The development run is reported as "completed", but it lists tickets for only 5 of the 19 planned stories. The other 14 stories have no delivery record in this input. This conflict is recorded here and not resolved.

- Version A (run status): Development run status = completed.
- Version B (ticket list): only US-006, US-007, US-008, US-009 and US-010 appear, all with status=delivered.
- Stories with no ticket or status in the run:
  - US-001, US-002, US-003, US-004, US-005
  - US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019
- Missing foundations: sign-in (US-001), role enforcement (US-002) and user creation (US-004) are prerequisites for the delivered features. Their status is unknown from this input.
- Possible explanations, none confirmed by the input:
  - the run covered only Sprint 2
  - the ticket list is truncated
  - the other stories were not built
- Delivered commits:
  - 94104b8a0ac8be3016ca7c15902ca9d2e309d9c1 (US-006)
  - 386ab355e9434eaa52df0bebc9a8a9060d456873 (US-007 to US-010)
- Action for a human: confirm the true delivery status of the 14 unlisted stories before downstream phases rely on them.

**Related:** US-001, US-002, US-003, US-004, US-005, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019
<!-- sdlc:auto:end narrative -->
