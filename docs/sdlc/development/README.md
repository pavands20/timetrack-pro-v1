# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

Development plan version 1 is approved. It has 5 sprints, each with a capacity of 20, covering 9 epics, 22 stories and 2 tasks.

- Plan status: approved, version 1.
- Approver and approval date: not stated in input.
- Sprints: Sprint 1 to Sprint 5, capacity 20 each.
- Epics:
  - EPIC-001 Sign-in and account access
  - EPIC-002 User account administration
  - EPIC-003 Clients, projects, tasks and bill rate
  - EPIC-004 Clock in and out with breaks
  - EPIC-005 Weekly timesheet entry
  - EPIC-006 Employee dashboard
  - EPIC-007 Time zone, week start, language and responsive layout
  - EPIC-008 Basic user and project documentation
  - EPIC-009 Manager team view (read-only)
- Epics have no points and no assigned role.
- Stories: US-001 to US-022.
- Tasks: PIPER-e38e8a33, PIPER-0b110d7f.
- Scope note: the plan covers sign-in, user administration, project setup, clock in/out with breaks, weekly timesheets, the dashboard, time zone and UI, documentation, and a read-only manager team view.
- The plan does not include these features from the project description:
  - timesheet submission and approval
  - time off and leave balances
  - labour rules and compliance report
  - reports and CSV/payroll export
  - notifications
  - audit trail

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009, DEV-SPRINT-1, DEV-SPRINT-2, DEV-SPRINT-3, DEV-SPRINT-4, DEV-SPRINT-5

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 covers sign-in, role-restricted access, password reset, and user creation with manager assignment. The input reports no delivery status for this sprint's stories.

- Goal: Sign-in, role-restricted access, password reset, and user creation with manager assignment.
- Capacity: 20.
- Mapped stories (by goal):
  - US-001 Sign in with email and password (5 pts, backend-agent)
  - US-002 Role-restricted access (3 pts, security-agent)
  - US-003 Reset a forgotten password (5 pts, backend-agent)
  - US-004 Create a user account (3 pts, backend-agent)
  - US-005 Assign a manager to an employee (2 pts, backend-agent)
- Mapped points: 18.
- The input does not explicitly assign stories to sprints; this mapping is inferred from the sprint goal text.
- Development status: not reported in this run's input.

**Related:** US-001, US-002, US-003, US-004, US-005, DEV-PLAN-V1

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 covers user editing and deactivation, client/project/task setup with bill rates, and clock in/out. The input reports no delivery status for this sprint's stories.

- Goal: User editing and deactivation, client/project/task setup with bill rates, and clock in/out.
- Capacity: 20.
- Mapped stories (by goal):
  - US-006 Edit and deactivate users (3 pts, backend-agent)
  - US-007 Manage clients (3 pts, backend-agent)
  - US-008 Manage projects with an hourly bill rate (3 pts, backend-agent)
  - US-009 Manage tasks within a project (3 pts, backend-agent)
  - US-010 Clock in and out against a project and task (8 pts, backend-agent)
- Mapped points: 20.
- Mapping is inferred from the goal text.
- Development status: not reported.

**Related:** US-006, US-007, US-008, US-009, US-010, DEV-PLAN-V1

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers breaks, running-entry recovery, weekly timesheet entry, billable marking and UTC/time-zone handling. The input reports no delivery status for this sprint's stories.

- Goal: Breaks, running-entry recovery, weekly timesheet entry, billable marking and UTC/time-zone handling.
- Capacity: 20.
- Mapped stories (by goal):
  - US-011 Record breaks while clocked in (3 pts, backend-agent)
  - US-012 Recover an entry left running (3 pts, backend-agent)
  - US-013 Enter hours by day in a weekly timesheet (8 pts, frontend-agent)
  - US-014 Mark entries billable or non-billable (2 pts, frontend-agent)
  - US-017 Times stored in UTC and shown in my time zone (3 pts, backend-agent)
- Mapped points: 19.
- Mapping is inferred from the goal text.
- Development status: not reported.

**Related:** US-011, US-012, US-013, US-014, US-017, DEV-PLAN-V1

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers editing own entries, the employee dashboard, a responsive English UI and documentation. The input reports no delivery status for this sprint's stories.

- Goal: Editing own entries, employee dashboard, responsive English UI and documentation.
- Capacity: 20.
- Mapped stories (by goal):
  - US-015 Edit and delete my own time entries (3 pts, backend-agent)
  - US-016 See my weekly hours on a dashboard (3 pts, frontend-agent)
  - US-018 English-only, responsive interface (3 pts, frontend-agent)
  - US-019 User and admin guides (3 pts, devops-agent)
- Mapped points: 12.
- Mapping is inferred from the goal text.
- Development status: not reported.

**Related:** US-015, US-016, US-018, US-019, DEV-PLAN-V1

### DEV-SPRINT-5 · approved · source: plan:Sprint 5

Sprint 5 delivers the read-only Manager team view. Its three stories are reported as delivered. Its two supporting tasks have no reported status.

- Goal: Read-only Manager team view, consisting of:
  - reporting-line access enforced on the server
  - a direct-reports list
  - a view of a report's weekly timesheet in the manager's own time zone
- Capacity: 20.
- Stories (all reported delivered at commit f6cc01c3c55f5047f58ec107412c09df7a53e2cb):
  - US-020 List my direct reports (3 pts)
  - US-021 View a direct report's weekly timesheet, read-only (5 pts)
  - US-022 Team access restricted to the reporting line (5 pts)
- Story points: 13.
- Related tasks:
  - PIPER-0b110d7f: Enforce server-side ownership and reporting-line checks on all time data (AC-064), 3 pts, security-agent.
  - PIPER-e38e8a33: Update admin guide and add My team user-guide section (AC-050, AC-065), 2 pts, devops-agent.
- Task sprint assignment and delivery status: not stated in input.

**Related:** US-020, US-021, US-022, PIPER-e38e8a33, PIPER-0b110d7f, EPIC-009, DEV-PLAN-V1

### DEV-US-020 · draft · source: dev:US-020

Ticket US-020, List my direct reports, was delivered. It gives managers a list of the employees who report to them.

- Ticket: US-020 List my direct reports.
- Status: delivered.
- Commit: f6cc01c3c55f5047f58ec107412c09df7a53e2cb (shared with US-021 and US-022).
- Planned: 3 pts, backend-agent, Sprint 5 (EPIC-009).
- Depends conceptually on manager assignment (US-005); the input states no confirmed dependency.
- Review, approval, and test results: not stated in input.

**Related:** US-020, EPIC-009, DEV-SPRINT-5, US-005, US-022

### DEV-US-021 · draft · source: dev:US-021

Ticket US-021, View a direct report's weekly timesheet (read-only), was delivered. Managers can view a report's week without editing it, shown in the manager's own time zone per the sprint goal.

- Ticket: US-021 View a direct report's weekly timesheet (read-only).
- Status: delivered.
- Commit: f6cc01c3c55f5047f58ec107412c09df7a53e2cb (shared).
- Planned: 5 pts, frontend-agent, Sprint 5 (EPIC-009).
- Sprint goal states the timesheet is shown in the manager's own time zone (relates to US-017).
- Review, approval, and test results: not stated in input.

**Related:** US-021, EPIC-009, DEV-SPRINT-5, US-013, US-017, US-022

### DEV-US-022 · draft · source: dev:US-022

Ticket US-022, Team access restricted to the reporting line, was delivered. Managers can only access team data for their own reporting line, enforced on the server.

- Ticket: US-022 Team access restricted to the reporting line.
- Status: delivered.
- Commit: f6cc01c3c55f5047f58ec107412c09df7a53e2cb (shared).
- Planned: 5 pts, security-agent, Sprint 5 (EPIC-009).
- Sprint goal: reporting-line access enforced on the server.
- Related task PIPER-0b110d7f (server-side ownership and reporting-line checks on all time data, AC-064) has no reported delivery status.
- Review, approval, and test results: not stated in input.

**Related:** US-022, EPIC-009, DEV-SPRINT-5, PIPER-0b110d7f, US-002, US-020, US-021

### DEV-TASK-PIPER-0b110d7f · draft · source: plan:PIPER-0b110d7f

Planned task to enforce server-side ownership and reporting-line checks on all time data (AC-064). The input reports no delivery status.

- Task: PIPER-0b110d7f.
- Planned: 3 pts, security-agent.
- Acceptance criterion: AC-064.
- Scope: ownership and reporting-line checks on all time data, which is broader than the team view alone.
- The development run lists no ticket for this task, so completion is unconfirmed.

**Related:** PIPER-0b110d7f, US-022, US-015, US-021

### DEV-TASK-PIPER-e38e8a33 · draft · source: plan:PIPER-e38e8a33

Planned task to update the admin guide and add a My team user-guide section (AC-050, AC-065). The input reports no delivery status.

- Task: PIPER-e38e8a33.
- Planned: 2 pts, devops-agent.
- Acceptance criteria: AC-050, AC-065.
- Relates to US-019 (User and admin guides) and the Manager team view.
- The development run lists no ticket for this task, so completion is unconfirmed.

**Related:** PIPER-e38e8a33, US-019, US-020, US-021

### DEV-RUN-STATUS · draft · source: dev:run

The development run is marked completed but reports tickets only for US-020, US-021 and US-022. The status of every other planned story and task is not stated.

- Run status: completed.
- Tickets reported: US-020, US-021, US-022, all delivered in commit f6cc01c3c55f5047f58ec107412c09df7a53e2cb.
- Not reported in this run: US-001 to US-019, PIPER-e38e8a33, PIPER-0b110d7f.
- Possible gap: the run is "completed", yet only Sprint 5 tickets appear.
  - Sprints 1-4 may have been delivered in earlier runs.
  - This input does not confirm that.
  - Confirm with the development record before treating Sprints 1-4 as built.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022
<!-- sdlc:auto:end narrative -->
