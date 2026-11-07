# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /health | health | `backend/app/main.py:57` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /api/time-entries/{id}
- GET /api/admin/clients
- GET /api/admin/users
- GET /api/auth/me
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
- POST /api/admin/users
- POST /api/admin/users/{id}/deactivate
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/password-reset/confirm
- POST /api/auth/password-reset/request
- POST /api/clock/breaks/end
- POST /api/clock/breaks/start
- POST /api/clock/in
- POST /api/clock/out
- PUT /api/timesheets/cells
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `036db17`
<!-- sdlc:auto:end source -->
