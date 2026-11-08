# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:V1

The development plan is approved at version 1. It has 4 sprints, each with a capacity of 20 points, covering 8 epics, 19 stories and 6 tasks. Stories total 69 points against 80 points of sprint capacity.

- Status: approved, version 1. The approver and approval date are not given in the input.
- Sprints: 4, each with capacity=20 (total 80).
- Epics: EPIC-001 to EPIC-008. Epics have no points and no assigned role.
- Stories: US-001 to US-019, totalling 69 points.
- Tasks: US-010-T1/T2/T3 and US-013-T1/T2/T3. Tasks have no points.
- Role assignment by story:
  - backend-agent: US-001, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 015, 017
  - security-agent: US-002
  - frontend-agent: US-013, 014, 016, 018
  - devops-agent: US-019
- The plan does not explicitly map each story to a sprint. Sprint goals describe the intended content (see DEV-SPRINT-1 to DEV-SPRINT-4).
- Scope observation for human confirmation: the plan's items cover only part of the project description. They cover:
  - sign-in
  - user administration
  - clients, projects and tasks
  - clock in/out and breaks
  - weekly timesheet
  - billable marking
  - dashboard
  - time zone, language and responsive layout
  - documentation
- No plan items exist for these features from the project description:
  - timesheet submission and approval
  - time off and leave balances
  - labour rules and compliance report
  - reports and CSV/payroll export
  - notifications
  - audit trail

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 covers secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment. Capacity is 20 points.

- Goal: Secure sign-in, server-enforced roles, password reset by email, and admin creation of users with manager assignment.
- Capacity: 20.
- The goal content matches US-001 (5), US-002 (3), US-003 (5), US-004 (3) and US-005 (2), totalling 18 points. This mapping is inferred from the goal text; the plan does not assign stories to sprints explicitly.
- All five matching tickets have delivery records (see DEV-US-001 to DEV-US-005).

**Related:** US-001, US-002, US-003, US-004, US-005, EPIC-001, EPIC-002

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 covers completing user administration, setting up clients, projects with bill rates and tasks, and employee clock in/out. Capacity is 20 points.

- Goal: Complete user administration, set up clients, projects with bill rates and tasks, and let employees clock in and out.
- Capacity: 20.
- The goal content matches US-006 (3), US-007 (3), US-008 (3), US-009 (3) and US-010 (8), totalling 20 points. This mapping is inferred from the goal text.
- No delivery records exist for any of these stories.

**Related:** US-006, US-007, US-008, US-009, US-010, EPIC-002, EPIC-003, EPIC-004

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking. Capacity is 20 points.

- Goal: Correct time-zone handling, breaks, recovery of forgotten clock-outs, the weekly timesheet and billable marking.
- Capacity: 20.
- The goal content matches US-017 (3), US-011 (3), US-012 (3), US-013 (8) and US-014 (2), totalling 19 points. This mapping is inferred from the goal text.
- No delivery records exist for any of these stories.

**Related:** US-017, US-011, US-012, US-013, US-014, EPIC-004, EPIC-005, EPIC-007

### DEV-SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 covers editing and deleting own entries, the weekly hours dashboard, a responsive English interface, and user/admin/project documentation. Capacity is 20 points.

- Goal: Edit and delete own entries, weekly hours dashboard, responsive English interface and user/admin/project documentation.
- Capacity: 20.
- The goal content matches US-015 (3), US-016 (3), US-018 (3) and US-019 (3), totalling 12 points. This mapping is inferred from the goal text.
- No delivery records exist for any of these stories.

**Related:** US-015, US-016, US-018, US-019, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### EPIC-001 · approved · source: plan:EPIC-001

Epic: Sign-in and account access. It contains 3 stories totalling 13 points, all delivered.

- US-001: Sign in with email and password. 5 points, backend-agent. Delivered.
- US-002: Role-restricted access. 3 points, security-agent. Delivered.
- US-003: Reset a forgotten password. 5 points, backend-agent. Delivered.

**Related:** US-001, US-002, US-003

### EPIC-002 · approved · source: plan:EPIC-002

Epic: User account administration. It contains 3 stories totalling 8 points; 2 are delivered and US-006 has no delivery record.

- US-004: Create a user account. 3 points, backend-agent. Delivered.
- US-005: Assign a manager to an employee. 2 points, backend-agent. Delivered.
- US-006: Edit and deactivate users. 3 points, backend-agent. No ticket record in the development run.

**Related:** US-004, US-005, US-006

### EPIC-003 · approved · source: plan:EPIC-003

Epic: Clients, projects, tasks and bill rate. It contains 3 stories totalling 9 points, none with delivery records.

- US-007: Manage clients. 3 points, backend-agent. No ticket record.
- US-008: Manage projects with an hourly bill rate. 3 points, backend-agent. No ticket record.
- US-009: Manage tasks within a project. 3 points, backend-agent. No ticket record.

**Related:** US-007, US-008, US-009

### EPIC-004 · approved · source: plan:EPIC-004

Epic: Clock in and out with breaks. It contains 3 stories totalling 14 points, plus 3 tasks under US-010. None have delivery records.

- US-010: Clock in and out against a project and task. 8 points, backend-agent. No ticket record.
  - US-010-T1: Add time_entries migration (backend-agent).
  - US-010-T2: Implement clock status, in and out endpoints (backend-agent).
  - US-010-T3: Build clock page (frontend-agent).
- US-011: Record breaks while clocked in. 3 points, backend-agent. No ticket record.
- US-012: Recover an entry left running. 3 points, backend-agent. No ticket record.

**Related:** US-010, US-010-T1, US-010-T2, US-010-T3, US-011, US-012

### EPIC-005 · approved · source: plan:EPIC-005

Epic: Weekly timesheet entry. It contains 3 stories totalling 13 points, plus 3 tasks under US-013. None have delivery records.

- US-013: Enter hours by day in a weekly timesheet. 8 points, frontend-agent. No ticket record.
  - US-013-T1: Implement timesheet week and cell endpoints (backend-agent).
  - US-013-T2: Build weekly timesheet grid (frontend-agent).
  - US-013-T3: Add timesheet API test suite (qa-agent).
- US-014: Mark entries billable or non-billable. 2 points, frontend-agent. No ticket record.
- US-015: Edit and delete my own time entries. 3 points, backend-agent. No ticket record.

**Related:** US-013, US-013-T1, US-013-T2, US-013-T3, US-014, US-015

### EPIC-006 · approved · source: plan:EPIC-006

Epic: Employee dashboard. It contains 1 story of 3 points, with no delivery record.

- US-016: See my weekly hours on a dashboard. 3 points, frontend-agent. No ticket record.

**Related:** US-016

### EPIC-007 · approved · source: plan:EPIC-007

Epic: Time zone, week start, language and responsive layout. It contains 2 stories totalling 6 points, with no delivery records.

- US-017: Times stored in UTC and shown in my time zone. 3 points, backend-agent. No ticket record.
- US-018: English-only, responsive interface. 3 points, frontend-agent. No ticket record.
- The epic title mentions 'week start', but no story in the input is specifically about week start.

**Related:** US-017, US-018

### EPIC-008 · approved · source: plan:EPIC-008

Epic: Basic user and project documentation. It contains 1 story of 3 points, with no delivery record.

- US-019: User and admin guides. 3 points, devops-agent. No ticket record.

**Related:** US-019

### DEV-RUN · draft · source: dev:run

The development run is reported as 'completed', but only 5 of the 19 planned stories have ticket records. All 5 are marked delivered on a single commit. The two signals conflict, and both are recorded here.

- Version A (run status): completed.
- Version B (ticket records): 5 tickets delivered:
  - US-001 to US-005, all on commit 652228456ccc99486f5f9ec05186cd6593401ae1
  - 18 of 69 story points
  - this is roughly the Sprint 1 scope
- Not present in the input:
  - ticket records for US-006 to US-019
  - records for the 6 tasks (US-010-T1/T2/T3, US-013-T1/T2/T3)
  - test results, code review or acceptance sign-off for any ticket
  - dates
- Open question for a human: is 'completed' meant for the whole plan or only for the delivered subset?
- Status 'draft' is used because no review or approval of the delivered work is recorded.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013, US-014, US-015, US-016, US-017, US-018, US-019

### DEV-US-001 · draft · source: dev:US-001

Ticket US-001, 'Sign in with email and password', is delivered.

- Status: delivered.
- Commit: 652228456ccc99486f5f9ec05186cd6593401ae1.
- Plan: 5 points, backend-agent.
- No test results or acceptance records are provided.

**Related:** US-001, EPIC-001, DEV-SPRINT-1

### DEV-US-002 · draft · source: dev:US-002

Ticket US-002, 'Role-restricted access', is delivered.

- Status: delivered.
- Commit: 652228456ccc99486f5f9ec05186cd6593401ae1.
- Plan: 3 points, security-agent.
- The Sprint 1 goal states roles are server-enforced. No implementation detail or test results are provided.

**Related:** US-002, EPIC-001, DEV-SPRINT-1

### DEV-US-003 · draft · source: dev:US-003

Ticket US-003, 'Reset a forgotten password', is delivered.

- Status: delivered.
- Commit: 652228456ccc99486f5f9ec05186cd6593401ae1.
- Plan: 5 points, backend-agent.
- The Sprint 1 goal describes password reset by email. No test results are provided.

**Related:** US-003, EPIC-001, DEV-SPRINT-1

### DEV-US-004 · draft · source: dev:US-004

Ticket US-004, 'Create a user account', is delivered.

- Status: delivered.
- Commit: 652228456ccc99486f5f9ec05186cd6593401ae1.
- Plan: 3 points, backend-agent.
- No test results are provided.

**Related:** US-004, EPIC-002, DEV-SPRINT-1

### DEV-US-005 · draft · source: dev:US-005

Ticket US-005, 'Assign a manager to an employee', is delivered.

- Status: delivered.
- Commit: 652228456ccc99486f5f9ec05186cd6593401ae1.
- Plan: 2 points, backend-agent.
- No test results are provided.

**Related:** US-005, EPIC-002, DEV-SPRINT-1
<!-- sdlc:auto:end narrative -->
