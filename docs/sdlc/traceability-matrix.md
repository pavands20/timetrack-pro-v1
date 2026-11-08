# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign in with email and password | US-001 | 1 | GET /api/auth/me, POST /api/auth/login, POST /api/auth/logout, auth_service, db, sessions, users, web_spa | backend/Dockerfile, backend/app/auth_deps.py, backend/app/config.py, backend/app/main.py, backend/app/models.py +14 more | — | failed | succeeded | 3/3 tested · 3/3 passing | — |
| US-002 | EPIC-001 | Role-restricted access | US-002 | 1 | GET /api/auth/me, api, auth_service, sessions, users, web_spa | — | 9c75752 | delivered | not run | 3/3 tested · 0/3 passing | — |
| US-003 | EPIC-001 | Reset a forgotten password | US-003 | 1 | POST /api/auth/password-reset/confirm, POST /api/auth/password-reset/request, auth_service, db, mailer, password_tokens, users, web_spa | — | — | skipped | not run | 3/3 tested · 0/3 passing | — |
| US-004 | EPIC-002 | Create a user account | US-004 | 1 | GET /api/admin/users, POST /api/admin/users, admin_service, db, users, web_spa | backend/tests/test_admin_users_qa.py, frontend/e2e/admin-users.spec.ts, frontend/src/screens/AdminUsers.test.tsx, frontend/src/screens/AdminUsers.tsx | 9c75752 | delivered | succeeded | 3/3 tested · 0/3 passing | — |
| US-005 | EPIC-002 | Assign a manager to an employee | US-005 | 1 | PATCH /api/admin/users/{id}, admin_service, users, web_spa | — | 9c75752 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-006 | EPIC-002 | Edit and deactivate users | US-006 | 2 | PATCH /api/admin/users/{id}, POST /api/admin/users/{id}/deactivate, admin_service, auth_service, sessions, users, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-007 | EPIC-003 | Manage clients | US-007 | 2 | GET /api/admin/clients, PATCH /api/admin/clients/{id}, POST /api/admin/clients, admin_service, clients, db, projects, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-008 | EPIC-003 | Manage projects with an hourly bill rate | US-008 | 2 | PATCH /api/admin/projects/{id}, POST /api/admin/projects, admin_service, clients, db, projects, web_spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-009 | EPIC-003 | Manage tasks within a project | US-009 | 2 | GET /api/projects, PATCH /api/admin/tasks/{id}, POST /api/admin/projects/{id}/tasks, admin_service, projects, tasks, time_service, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-010 | EPIC-004 | Clock in and out against a project and task | US-010, US-010-T1, US-010-T2, US-010-T3 | 2 | GET /api/clock/status, GET /api/projects, POST /api/clock/in, POST /api/clock/out, db, projects, tasks, time_entries, time_service, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-011 | EPIC-004 | Record breaks while clocked in | US-011 | 3 | POST /api/clock/breaks/end, POST /api/clock/breaks/start, POST /api/clock/out, breaks, db, time_entries, time_service, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-012 | EPIC-004 | Recover an entry left running | US-012 | 3 | GET /api/clock/status, PATCH /api/time-entries/{id}/end, breaks, time_entries, time_service, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-013 | EPIC-005 | Enter hours by day in a weekly timesheet | US-013, US-013-T1, US-013-T2, US-013-T3 | 3 | GET /api/timesheets/{week_start}, PUT /api/timesheets/cells, api, projects, tasks, time_entries, time_service, web_spa | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-014 | EPIC-005 | Mark entries billable or non-billable | US-014 | 3 | POST /api/clock/in, PUT /api/timesheets/cells, projects, time_entries, time_service, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-015 | EPIC-005 | Edit and delete my own time entries | US-015 | 4 | DELETE /api/time-entries/{id}, PATCH /api/time-entries/{id}, time_entries, time_service, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-016 | EPIC-006 | See my weekly hours on a dashboard | US-016 | 4 | GET /api/dashboard/week, time_entries, time_service, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-017 | EPIC-007 | Times stored in UTC and shown in my time zone | US-017 | 3 | GET /api/clock/status, time_entries, time_service, users, web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-018 | EPIC-007 | English-only, responsive interface | US-018 | 4 | web_spa | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-019 | EPIC-008 | User and admin guides | US-019 | 4 | web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
<!-- sdlc:auto:end matrix -->
