# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

The TimeTrack Pro V1 delivery plan is approved at version 1. It has 5 sprints of 20-point capacity each, covering 9 epics, 22 stories and 2 tasks. The plan covers sign-in, user administration, project setup, clock in/out, weekly timesheets, the employee dashboard, the UI and time-zone foundation, documentation and a read-only manager team view.

- Plan status: approved, version 1. The approver and approval date are not stated in the input.
- Sprints: 5, each with capacity 20.
- Epics and stories (points, assigned agent role):
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
    - US-010 Clock in and out against a project and task (8, backend-agent)
    - US-011 Record breaks while clocked in (3, backend-agent)
    - US-012 Recover an entry left running (3, backend-agent)
  - EPIC-005 Weekly timesheet entry:
    - US-013 Enter hours by day in a weekly timesheet (8, frontend-agent)
    - US-014 Mark entries billable or non-billable (2, frontend-agent)
    - US-015 Edit and delete my own time entries (3, backend-agent)
  - EPIC-006 Employee dashboard:
    - US-016 See my weekly hours on a dashboard (3, frontend-agent)
  - EPIC-007 Time zone, week start, language and responsive layout:
    - US-017 Times stored in UTC and shown in my time zone (3, backend-agent)
    - US-018 English-only, responsive interface (3, frontend-agent)
  - EPIC-008 Basic user and project documentation:
    - US-019 User and admin guides (3, devops-agent)
  - EPIC-009 Manager team view (read-only):
    - US-020 List my direct reports (3, backend-agent)
    - US-021 View a direct report's weekly timesheet, read-only (5, frontend-agent)
    - US-022 Team access restricted to the reporting line (5, security-agent)
- Tasks:
  - PIPER-e38e8a33 Update admin guide and add My team user-guide section (AC-050, AC-065) (2, devops-agent)
  - PIPER-0b110d7f Enforce server-side ownership and reporting-line checks on all time data (AC-064) (3, security-agent)
- Epics carry no points and no assigned role.
- Scope observation:
  - The project description also lists timesheet submission/approval/locking, time off and leave balances, labour-rule overtime and break flags, a compliance report, reports and CSV/payroll export, notifications, and timesheet audit.
  - None of these appear as items in plan v1.
  - The input does not say whether they were deferred or descoped.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, PIPER-e38e8a33, PIPER-0b110d7f

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 targets sign-in, role-restricted access, password reset, and user creation with manager assignment. The input contains no delivery record for these stories.

- Goal: Sign-in, role-restricted access, password reset, and user creation with manager assignment.
- Capacity: 20.
- Matching stories by goal text:
  - US-001 (5)
  - US-002 (3)
  - US-003 (5)
  - US-004 (3)
  - US-005 (2)
- The input does not explicitly assign items to sprints. This mapping is inferred from the goal wording.
- Delivery status: not reported in this development run.

**Related:** DEV-PLAN-V1, EPIC-001, EPIC-002, US-001, US-002, US-003, US-004, US-005

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 targets user editing and deactivation, client/project/task setup with bill rates, and clock in/out. The input contains no delivery record for these stories.

- Goal: User editing and deactivation, client/project/task setup with bill rates, and clock in/out.
- Capacity: 20.
- Matching stories by goal text:
  - US-006 (3)
  - US-007 (3)
  - US-008 (3)
  - US-009 (3)
  - US-010 (8)
- This mapping is inferred from the goal wording.
- Delivery status: not reported in this development run.

**Related:** DEV-PLAN-V1, EPIC-002, EPIC-003, EPIC-004, US-006, US-007, US-008, US-009, US-010

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 targets breaks, running-entry recovery, weekly timesheet entry, billable marking, and UTC/time-zone handling. The input contains no delivery record for these stories.

- Goal: Breaks, running-entry recovery, weekly timesheet entry, billable marking and UTC/time-zone handling.
- Capacity: 20.
- Matching stories by goal text:
  - US-011 (3)
  - US-012 (3)
  - US-013 (8)
  - US-014 (2)
  - US-017 (3)
- This mapping is inferred from the goal wording.
- Delivery status: not reported in this development run.

**Related:** DEV-PLAN-V1, EPIC-004, EPIC-005, EPIC-007, US-011, US-012, US-013, US-014, US-017

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 targets editing own entries, the employee dashboard, a responsive English UI, and documentation. All four matching stories are recorded as delivered in the completed development run.

- Goal: Editing own entries, employee dashboard, responsive English UI and documentation.
- Capacity: 20.
- Matching stories by goal text, all delivered:
  - US-015 (3)
  - US-016 (3)
  - US-018 (3)
  - US-019 (3)
- Planned points for these stories total 12 against a capacity of 20.
- See DEV-US-015, DEV-US-016, DEV-US-018 and DEV-US-019 for commits.

**Related:** DEV-PLAN-V1, EPIC-005, EPIC-006, EPIC-007, EPIC-008, US-015, US-016, US-018, US-019

### DEV-SPRINT-5 · approved · source: plan:Sprint 5

Sprint 5 targets a read-only Manager team view. Reporting-line access is enforced on the server, managers get a direct-reports list, and they can view a report's weekly timesheet in their own time zone. Two follow-up tasks are also planned. The input contains no delivery record for any of this.

- Goal: Read-only Manager team view:
  - reporting-line access enforced on the server
  - a direct-reports list
  - a view of a report's weekly timesheet in the manager's own time zone
- Capacity: 20.
- Matching stories by goal text:
  - US-020 (3)
  - US-021 (5)
  - US-022 (5)
- Related tasks:
  - PIPER-0b110d7f Enforce server-side ownership and reporting-line checks on all time data (AC-064) (3, security-agent)
  - PIPER-e38e8a33 Update admin guide and add My team user-guide section (AC-050, AC-065) (2, devops-agent)
- The sprint mapping is inferred from the goal wording.
- Delivery status: not reported in this development run.

**Related:** DEV-PLAN-V1, EPIC-009, US-020, US-021, US-022, PIPER-e38e8a33, PIPER-0b110d7f

### DEV-US-015 · draft · source: dev:US-015

Editing and deleting one's own time entries is recorded as delivered.

- Ticket: US-015 Edit and delete my own time entries.
- Status: delivered.
- Commit: 19b54af593c72af1f458845f9b5ff36d5588f5d9.
- Planned: 3 points, backend-agent.
- The input provides no review, test results or acceptance sign-off.

**Related:** US-015, EPIC-005, DEV-SPRINT-4

### DEV-US-016 · draft · source: dev:US-016

The employee weekly-hours dashboard is recorded as delivered. It shares a commit with US-018.

- Ticket: US-016 See my weekly hours on a dashboard.
- Status: delivered.
- Commit: 1fe2e39152c5552a8e0ef16dc2033e3e48570eb4. This is the same commit as US-018.
- Planned: 3 points, frontend-agent.
- The input provides no review, test results or acceptance sign-off.

**Related:** US-016, EPIC-006, DEV-SPRINT-4, DEV-US-018

### DEV-US-018 · draft · source: dev:US-018

The English-only, responsive interface is recorded as delivered. It shares a commit with US-016.

- Ticket: US-018 English-only, responsive interface.
- Status: delivered.
- Commit: 1fe2e39152c5552a8e0ef16dc2033e3e48570eb4. This is the same commit as US-016.
- Planned: 3 points, frontend-agent.
- The input provides no review, test results or acceptance sign-off.

**Related:** US-018, EPIC-007, DEV-SPRINT-4, DEV-US-016

### DEV-US-019 · draft · source: dev:US-019

The user and admin guides are recorded as delivered. A follow-up task (PIPER-e38e8a33) to update the admin guide and add a My team section is planned but has no delivery record.

- Ticket: US-019 User and admin guides.
- Status: delivered.
- Commit: 365176003d3825ff68b7ce673b5b7363926fab5e.
- Planned: 3 points, devops-agent.
- Follow-up task PIPER-e38e8a33 (AC-050, AC-065) is not reported in this run.
- The input provides no review, test results or acceptance sign-off.

**Related:** US-019, EPIC-008, DEV-SPRINT-4, PIPER-e38e8a33

### DEV-GAP-UNREPORTED · draft · source: dev:run-status

The development run is marked completed but lists only 4 delivered tickets. The other 18 planned stories and both tasks have no delivery record in this input, and their status is unknown.

- Run status: completed.
- Tickets reported: US-015, US-016, US-018, US-019.
- Not reported, status unknown:
  - Stories: US-001 to US-014, US-017, US-020, US-021, US-022.
  - Tasks: PIPER-e38e8a33, PIPER-0b110d7f.
- They may have been delivered in earlier runs not included in this input, or may still be pending.
- Action: a human should confirm their status before treating any of them as built.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-017, US-020, US-021, US-022, PIPER-e38e8a33, PIPER-0b110d7f
<!-- sdlc:auto:end narrative -->
