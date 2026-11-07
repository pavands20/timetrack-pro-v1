# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan for TimeTrack Pro V1 is approved at version 1. It has 4 sprints, 8 epics, 19 stories and 6 tasks. No approver or approval date was given.

- Plan status: approved, version 1.
- Approver and approval date: not provided in the input.
- Sprints: 4 (Sprint 1 to Sprint 4), each with capacity 20.
- Epics: EPIC-001 to EPIC-008. No epic has points or an assigned role.
- Stories: US-001 to US-019, 69 story points in total.
- Tasks: US-010-T1, US-010-T2 and US-010-T3 (under US-010); US-013-T1, US-013-T2 and US-013-T3 (under US-013). Tasks have no points.
- Agent roles assigned to stories:
  - backend-agent: US-001, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-015, US-017
  - security-agent: US-002
  - frontend-agent: US-013, US-014, US-016, US-018
  - devops-agent: US-019
- Execution status: none provided. No ticket states, completion records, commits or test results appear in the input.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 covers secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment. Capacity is 20 points.

- Goal (verbatim): Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- Story mapping: INFERRED from the goal text. The input does not explicitly assign stories to sprints.
  - US-001 Sign in with email and password: 5 pts
  - US-002 Role-restricted access: 3 pts
  - US-003 Reset a forgotten password: 5 pts
  - US-004 Create a user account: 3 pts
  - US-005 Assign a manager to an employee: 2 pts
- Inferred load: 18 of 20 points.
- Outcome: not reported.

**Related:** US-001, US-002, US-003, US-004, US-005

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 completes user administration, sets up clients, projects with bill rates and tasks, and delivers employee clock in and out. Capacity is 20 points.

- Goal (verbatim): Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out.
- Capacity: 20.
- Story mapping: INFERRED from the goal text.
  - US-006 Edit and deactivate users: 3 pts
  - US-007 Manage clients: 3 pts
  - US-008 Manage projects with an hourly bill rate: 3 pts
  - US-009 Manage tasks within a project: 3 pts
  - US-010 Clock in and out against a project and task: 8 pts
- Inferred load: 20 of 20 points, which is full capacity.
- Outcome: not reported.

**Related:** US-006, US-007, US-008, US-009, US-010

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking. Capacity is 20 points.

- Goal (verbatim): Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- Story mapping: INFERRED from the goal text.
  - US-017 Times stored in UTC and shown in my time zone: 3 pts
  - US-011 Record breaks while clocked in: 3 pts
  - US-012 Recover an entry left running: 3 pts
  - US-013 Enter hours by day in a weekly timesheet: 8 pts
  - US-014 Mark entries billable or non-billable: 2 pts
- Inferred load: 19 of 20 points.
- Outcome: not reported.

**Related:** US-017, US-011, US-012, US-013, US-014

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers editing and deleting own entries, the weekly hours dashboard, a responsive English interface, and user, admin and project documentation. Capacity is 20 points.

- Goal (verbatim): Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation.
- Capacity: 20.
- Story mapping: INFERRED from the goal text.
  - US-015 Edit and delete my own time entries: 3 pts
  - US-016 See my weekly hours on a dashboard: 3 pts
  - US-018 English-only, responsive interface: 3 pts
  - US-019 User and admin guides: 3 pts
- Inferred load: 12 of 20 points, leaving 8 points of unused capacity.
- Outcome: not reported.

**Related:** US-015, US-016, US-018, US-019

### EPIC-001 · approved · source: plan:EPIC-001

Sign-in and account access: email/password sign-in, role-restricted access and password reset. 13 points across 3 stories.

- Epic: Sign-in and account access. No points or role assigned.
- Stories:
  - US-001 Sign in with email and password: 5 pts, backend-agent
  - US-002 Role-restricted access: 3 pts, security-agent. The Sprint 1 goal states these roles are server-enforced.
  - US-003 Reset a forgotten password: 5 pts, backend-agent. The Sprint 1 goal specifies reset by email.
- Roles from the project description: Employee, Manager, Payroll Admin, System Admin.
- Implementation status: not reported.

**Related:** US-001, US-002, US-003, DEV-SPRINT-1

### EPIC-002 · approved · source: plan:EPIC-002

User account administration: create users, assign managers, and edit or deactivate users. 8 points across 3 stories.

- Epic: User account administration. No points or role assigned.
- Stories:
  - US-004 Create a user account: 3 pts, backend-agent
  - US-005 Assign a manager to an employee: 2 pts, backend-agent
  - US-006 Edit and deactivate users: 3 pts, backend-agent
- Implementation status: not reported.

**Related:** US-004, US-005, US-006, DEV-SPRINT-1, DEV-SPRINT-2

### EPIC-003 · approved · source: plan:EPIC-003

Clients, projects, tasks and bill rate: admin management of clients, projects with an hourly bill rate, and tasks within projects. 9 points across 3 stories.

- Epic: Clients, projects, tasks and bill rate. No points or role assigned.
- Stories:
  - US-007 Manage clients: 3 pts, backend-agent
  - US-008 Manage projects with an hourly bill rate: 3 pts, backend-agent
  - US-009 Manage tasks within a project: 3 pts, backend-agent
- Implementation status: not reported.

**Related:** US-007, US-008, US-009, DEV-SPRINT-2

### EPIC-004 · approved · source: plan:EPIC-004

Clock in and out with breaks: browser clock in and out against a project and task, break recording, and recovery of entries left running. 14 points across 3 stories. US-010 is broken into 3 tasks.

- Epic: Clock in and out with breaks. No points or role assigned.
- Stories:
  - US-010 Clock in and out against a project and task: 8 pts, backend-agent
    - US-010-T1 Add time_entries migration: backend-agent
    - US-010-T2 Implement clock status, in and out endpoints: backend-agent
    - US-010-T3 Build clock page: frontend-agent
  - US-011 Record breaks while clocked in: 3 pts, backend-agent
  - US-012 Recover an entry left running: 3 pts, backend-agent. The Sprint 3 goal describes this as recovery of forgotten clock-outs.
- Implementation status: not reported.

**Related:** US-010, US-010-T1, US-010-T2, US-010-T3, US-011, US-012, DEV-SPRINT-2, DEV-SPRINT-3

### EPIC-005 · approved · source: plan:EPIC-005

Weekly timesheet entry: day-by-day weekly timesheet, billable or non-billable marking, and editing or deleting own entries. 13 points across 3 stories. US-013 is broken into 3 tasks, including an API test suite.

- Epic: Weekly timesheet entry. No points or role assigned.
- Stories:
  - US-013 Enter hours by day in a weekly timesheet: 8 pts, frontend-agent
    - US-013-T1 Implement timesheet week and cell endpoints: backend-agent
    - US-013-T2 Build weekly timesheet grid: frontend-agent
    - US-013-T3 Add timesheet API test suite: qa-agent
  - US-014 Mark entries billable or non-billable: 2 pts, frontend-agent
  - US-015 Edit and delete my own time entries: 3 pts, backend-agent
- Note: US-013 is owned by frontend-agent, but its tasks span backend-agent, frontend-agent and qa-agent.
- Implementation and test status: not reported.

**Related:** US-013, US-013-T1, US-013-T2, US-013-T3, US-014, US-015, DEV-SPRINT-3, DEV-SPRINT-4

### EPIC-006 · approved · source: plan:EPIC-006

Employee dashboard: a weekly hours dashboard for the employee. 3 points in 1 story.

- Epic: Employee dashboard. No points or role assigned.
- Stories:
  - US-016 See my weekly hours on a dashboard: 3 pts, frontend-agent
- Implementation status: not reported.

**Related:** US-016, DEV-SPRINT-4

### EPIC-007 · approved · source: plan:EPIC-007

Time zone, week start, language and responsive layout: times are stored in UTC and shown in the user's time zone, and the interface is English-only and responsive. 6 points across 2 stories.

- Epic: Time zone, week start, language and responsive layout. No points or role assigned.
- Stories:
  - US-017 Times stored in UTC and shown in my time zone: 3 pts, backend-agent
  - US-018 English-only, responsive interface: 3 pts, frontend-agent
- Note: the epic title mentions week start, but no story or task names week-start configuration explicitly.
- Implementation status: not reported.

**Related:** US-017, US-018, DEV-SPRINT-3, DEV-SPRINT-4

### EPIC-008 · approved · source: plan:EPIC-008

Basic user and project documentation: user and admin guides. 3 points in 1 story.

- Epic: Basic user and project documentation. No points or role assigned.
- Stories:
  - US-019 User and admin guides: 3 pts, devops-agent
- The Sprint 4 goal describes this work as user/admin/project documentation.
- Implementation status: not reported.

**Related:** US-019, DEV-SPRINT-4

### DEV-SCOPE-GAP · draft

Several capabilities in the project description have no item in plan v1. They may be intentionally deferred, but the input does not say so. This needs human confirmation.

- This entry compares the project description with the plan items. It records an observation, not a decision.
- Capabilities in the project description with no matching plan item (US-001 to US-019):
  - Timesheet submission and manager approve/reject with a comment, return of rejected sheets for editing, and locking of approved sheets
  - Time off: annual, sick and unpaid leave requests for full or half days, manager approval, and a leave balance that accrues monthly
  - Labour rules: admin-set daily and weekly overtime limits and a minimum break after 6 hours, with overtime and missed-break flags and a compliance report
  - Reports: hours by employee, project and week; billable vs non-billable; overtime; leave taken; CSV export; payroll export of approved hours
  - In-app notifications: timesheet due, approved or rejected; leave request decided
  - Audit trail of who changed or approved a timesheet, and when
- The Payroll Admin role is named in the description. No plan item specifically addresses Payroll Admin functions.
- No rationale for omitting these capabilities was provided.

**Related:** DEV-PLAN-V1

### DEV-STATUS · draft

There is no development execution data. Build progress, completed stories and test outcomes cannot be documented, and no user guide is produced.

- The development input contains only the approved plan.
- The input does not include:
  - Ticket or story statuses
  - Completion dates
  - Code changes
  - Pull requests
  - Test results, including from the US-013-T3 timesheet API test suite
  - Sprint reviews
- Nothing is recorded as built or working until execution evidence is provided.
- The user guide has been withheld until development completion is confirmed.

**Related:** DEV-PLAN-V1
<!-- sdlc:auto:end narrative -->
