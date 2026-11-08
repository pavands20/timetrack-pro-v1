# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /_qa_protected | _protected | `backend/tests/test_auth_us001_qa.py:121` | — |
| GET | /admin-only | admin_only | `backend/tests/test_auth_foundation.py:153` | — |
| GET | /api/admin/users | list_users | `backend/app/routers/admin_users.py:103` | — |
| POST | /api/admin/users | create_user | `backend/app/routers/admin_users.py:108` | — |
| PATCH | /api/admin/users/{user_id} | update_user | `backend/app/routers/admin_users.py:129` | — |
| POST | /api/admin/users/{user_id}/deactivate | deactivate_user | `backend/app/routers/admin_users.py:153` | AC-016: the user can no longer sign in; their records are kept. |
| POST | /api/auth/login | login | `backend/app/routers/auth.py:51` | — |
| POST | /api/auth/logout | logout | `backend/app/routers/auth.py:80` | — |
| GET | /api/auth/me | me | `backend/app/routers/auth.py:96` | — |
| POST | /api/auth/password-reset/confirm | confirm_password_reset | `backend/app/routers/auth.py:134` | — |
| POST | /api/auth/password-reset/request | request_password_reset | `backend/app/routers/auth.py:121` | — |
| GET | /health | health | `backend/app/main.py:79` | Liveness probe. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/time-entries/{id}
- GET /api/admin/clients
- GET /api/clock/status
- GET /api/dashboard/week
- GET /api/projects
- GET /api/timesheets/{week_start}
- PATCH /api/admin/clients/{id}
- PATCH /api/admin/projects/{id}
- PATCH /api/admin/tasks/{id}
- PATCH /api/admin/users/{id}
- PATCH /api/time-entries/{id}
- PATCH /api/time-entries/{id}/end
- POST /api/admin/clients
- POST /api/admin/projects
- POST /api/admin/projects/{id}/tasks
- POST /api/admin/users/{id}/deactivate
- POST /api/clock/breaks/end
- POST /api/clock/breaks/start
- POST /api/clock/in
- POST /api/clock/out
- PUT /api/timesheets/cells

**Code only:**

- GET /_qa_protected
- GET /admin-only
- PATCH /api/admin/users/{user_id}
- POST /api/admin/users/{user_id}/deactivate
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `e6355de`
<!-- sdlc:auto:end source -->
