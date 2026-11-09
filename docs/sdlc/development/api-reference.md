# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /_qa_protected | _protected | `backend/tests/test_auth_us001_qa.py:99` | — |
| GET | /admin-only | admin_only | `backend/tests/test_auth_foundation.py:129` | — |
| GET | /api/admin/clients | list_clients | `backend/app/routers/admin_projects.py:171` | — |
| POST | /api/admin/clients | create_client | `backend/app/routers/admin_projects.py:185` | — |
| PATCH | /api/admin/clients/{client_id} | update_client | `backend/app/routers/admin_projects.py:196` | — |
| POST | /api/admin/projects | create_project | `backend/app/routers/admin_projects.py:215` | — |
| PATCH | /api/admin/projects/{project_id} | update_project | `backend/app/routers/admin_projects.py:315` | — |
| POST | /api/admin/projects/{project_id}/tasks | create_task | `backend/app/routers/admin_projects.py:238` | — |
| PATCH | /api/admin/tasks/{task_id} | update_task | `backend/app/routers/admin_projects.py:303` | — |
| GET | /api/admin/users | list_users | `backend/app/routers/admin_users.py:103` | — |
| POST | /api/admin/users | create_user | `backend/app/routers/admin_users.py:108` | — |
| PATCH | /api/admin/users/{user_id} | update_user | `backend/app/routers/admin_users.py:129` | — |
| POST | /api/admin/users/{user_id}/deactivate | deactivate_user | `backend/app/routers/admin_users.py:153` | AC-016: the user can no longer sign in; their records are kept. |
| POST | /api/auth/login | login | `backend/app/routers/auth.py:51` | — |
| POST | /api/auth/logout | logout | `backend/app/routers/auth.py:69` | — |
| GET | /api/auth/me | me | `backend/app/routers/auth.py:81` | — |
| POST | /api/auth/password-reset/confirm | confirm_password_reset | `backend/app/routers/auth.py:119` | — |
| POST | /api/auth/password-reset/request | request_password_reset | `backend/app/routers/auth.py:106` | — |
| POST | /api/clock/breaks/end | break_end | `backend/app/routers/clock.py:189` | — |
| POST | /api/clock/breaks/start | break_start | `backend/app/routers/clock.py:168` | — |
| POST | /api/clock/in | clock_in | `backend/app/routers/clock.py:129` | — |
| POST | /api/clock/out | clock_out | `backend/app/routers/clock.py:200` | — |
| GET | /api/clock/status | clock_status | `backend/app/routers/clock.py:123` | — |
| GET | /api/dashboard/week | get_dashboard_week | `backend/app/routers/dashboard.py:20` | — |
| PATCH | /api/time-entries/{entry_id}/end | end_entry | `backend/app/routers/time_entries.py:38` | — |
| PUT | /api/timesheets/cells | put_cells | `backend/app/routers/timesheets.py:253` | — |
| GET | /api/timesheets/{week_start} | get_week | `backend/app/routers/timesheets.py:189` | — |
| GET | /health | health | `backend/app/main.py:84` | Liveness probe. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/time-entries/{id}
- GET /api/projects
- PATCH /api/admin/clients/{id}
- PATCH /api/admin/projects/{id}
- PATCH /api/admin/tasks/{id}
- PATCH /api/admin/users/{id}
- PATCH /api/time-entries/{id}
- PATCH /api/time-entries/{id}/end
- POST /api/admin/projects/{id}/tasks
- POST /api/admin/users/{id}/deactivate

**Code only:**

- GET /_qa_protected
- GET /admin-only
- PATCH /api/admin/clients/{client_id}
- PATCH /api/admin/projects/{project_id}
- PATCH /api/admin/tasks/{task_id}
- PATCH /api/admin/users/{user_id}
- PATCH /api/time-entries/{entry_id}/end
- POST /api/admin/projects/{project_id}/tasks
- POST /api/admin/users/{user_id}/deactivate
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `02fe7f2`
<!-- sdlc:auto:end source -->
