# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `02fe7f2` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
TimeTrack Pro V1 is a time and labour management web app in one repository with two applications. `frontend/` is a Vite + React 19 single-page app (TypeScript, Tailwind CSS 4, React Router 7, Luxon). It has screens for sign-in, a home dashboard, a weekly timesheet, admin users, admin projects and help, and it calls the API through `src/lib/api.ts`. `backend/` is a FastAPI service using SQLAlchemy 2, Alembic and PostgreSQL 16 (psycopg 3). It has routers for: auth (login/logout/me and password reset), admin user management, admin clients/projects/tasks, a project catalog, clock in/out with breaks, weekly timesheets with manual hour cells, time-entry editing, deletion and fixing a missing end time, and a weekly dashboard. Sessions are opaque bearer tokens; only their hashes are stored server-side. All timestamps are stored in UTC, and dates are computed in each user's time zone. Note: parts of the README files are out of date. They say the backend has only a health check and the screens run on sample data, but the code shows implemented routers and an API client with authentication. Deployment runs through GitHub Actions: the API goes to a Docker image in ECR, and the frontend goes to AWS Amplify.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- Node.js with npm (for the Vite frontend)
- Docker with Docker Compose (docker-compose.yml provides PostgreSQL 16 as the `db` service)
- Playwright Chromium, only for end-to-end tests (installed with `npm run test:e2e:install`)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Start PostgreSQL from the repository root: `docker compose up -d db` (user/password/database are all `app`, on port 5432).
2. Create the backend virtualenv where the Playwright config expects it: `cd backend && python -m venv .venv && source .venv/bin/activate`
3. Install backend dependencies: `pip install -r requirements.txt`
4. Set `DATABASE_URL` only if you are not using the docker-compose database. The backend reads it via `app/config.py` and defaults to the compose Postgres service. See `.env.example` and `ENVIRONMENT.md` for the other settings.
5. Apply migrations: `alembic upgrade head`
6. Seed the database (the container does this on start): `python -m app.seed`
7. Run the API: `uvicorn app.main:app --reload` (serves on http://localhost:8000; interactive docs at /docs outside production)
8. In a second terminal: `cd frontend && npm install`
9. Start the frontend: `npm run dev`. Vite proxies `/api` to http://localhost:8000, so `VITE_API_BASE_URL` can stay unset locally.
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| api | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service with auto-reload on port 8000. |
| migrate | `cd backend && alembic upgrade head` | Applies all pending Alembic migrations (the only way the schema changes). |
| seed | `cd backend && python -m app.seed` | Seeds the database, as the container does after migrating. |
| db | `docker compose up -d db` | Starts the PostgreSQL 16 container defined in docker-compose.yml. |
| dev | `cd frontend && npm run dev` | Starts the Vite dev server with `/api` proxied to localhost:8000. |
| build | `cd frontend && npm run build` | Bundles the SPA into `dist/`. It does not typecheck. |
| preview | `cd frontend && npm run preview` | Serves the production build locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit` over `src/`. |
| lint (frontend) | `cd frontend && npm run lint` | Runs ESLint over the app (`npm run lint:fix` applies fixes). The platform uses this as a gate. |
| format (frontend) | `cd frontend && npm run format` | Formats with Prettier (`npm run format:check` only verifies). |
| lint (backend) | `cd backend && ruff check .` | Lints the backend with Ruff. |
| format (backend) | `cd backend && ruff format .` | Formats the backend with Ruff. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration (devcontainer.json). |
| `.github/workflows/` | deploy.yml: on push to main, builds and pushes the backend image to ECR, then builds the frontend and deploys it to AWS Amplify. |
| `.quorq/` | Metadata files from the Quorq AI SDLC platform (handoff.json, prepared.json). |
| `backend/` | FastAPI service: Dockerfile, requirements.txt, alembic.ini, pytest.ini, ruff.toml. |
| `backend/app/` | Application package: main.py (app, CSRF middleware, CORS, /health, router registration), config.py, database.py (engine, session, get_db), models.py (SQLAlchemy models), auth_deps.py / security.py / password_tokens.py / access.py (auth and access control), mailer.py, seed.py, and routers/ (one module per feature area: auth, admin_users, admin_projects, clock, timesheets, time_entries, dashboard). |
| `backend/migrations/` | Alembic environment and numbered versions (0001_users_sessions through 0006_manual_time_entries). |
| `backend/scripts/` | Utility scripts (check_connections.py). |
| `backend/tests/` | Pytest suite with shared fixtures in conftest.py. Test files are named per feature and user story, e.g. test_clock_us010_qa.py. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, eslint.config.js, playwright.config.ts, .prettierrc. |
| `frontend/src/` | App source: main.tsx (router + AuthProvider), App.tsx (shell and route table), screens/ (one module per screen with tests beside it), lib/ (api.ts client, auth.tsx, ui.tsx, icons.tsx, brand.ts, navigate.ts), content/ (markdown guides), index.css. |
| `frontend/e2e/` | Playwright acceptance specs (*.spec.ts) per feature. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Each backend feature has its own router in `app/routers/` under an `/api/...` prefix, registered in `app/main.py`. Dependencies use `Annotated` aliases such as `Db`, `Me` and `Admin` (`require_role("System Admin")`).
- The schema changes only through Alembic migrations named `000N_description.py`. Nothing creates tables on startup.
- State-changing `/api` requests (POST/PUT/PATCH/DELETE) must send an `X-Requested-With` header or they get a 403. The frontend `apiFetch` adds it automatically.
- Auth uses a bearer token returned by `POST /api/auth/login`. The frontend stores it in localStorage and sends `Authorization: Bearer <token>`; the server stores only the token hash in `sessions`.
- Times are stored as timestamptz in UTC and returned as ISO-8601 with a `Z` suffix. Week and day boundaries use the user's `time_zone`, and weeks run Monday to Sunday.
- Validation errors return 422 with `detail: [{loc, msg}]` and plain-language messages. Conflicts such as duplicates, already clocked in, or concurrent saves return 409. Database uniqueness (including partial unique indexes) is the final guard, and `IntegrityError` is mapped to 409.
- Admin screens and endpoints are restricted to the `System Admin` role, on the frontend via `AdminOnly` and on the backend via `require_role`.
- Frontend imports use the `@/` alias for `src/`. Vitest component tests sit next to their component as `*.test.tsx`; Playwright specs live in `e2e/`.
- Linting and formatting: Ruff on the backend; ESLint plus Prettier on the frontend.
- API docs (/docs, /redoc, /openapi.json) are turned off when the environment setting is `production`.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in `tests/` (pytest.ini sets `pythonpath = .`). The tests need the PostgreSQL database. |
| frontend unit | `cd frontend && npm test` | Runs Vitest component tests under `src/` in jsdom. |
| e2e browser install | `cd frontend && npm run test:e2e:install` | Downloads Playwright's Chromium. |
| e2e | `cd frontend && npm run test:e2e` | Runs the Playwright specs in `e2e/`. Without `E2E_BASE_URL`, it boots the backend from `backend/.venv` (after running migrations) and a preview build on port 4173. With `E2E_BASE_URL` set, it runs against that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| POST/PUT/PATCH/DELETE to `/api` returns 403 "You do not have access to this resource." | Send the `X-Requested-With` header (for example `XMLHttpRequest`), or call the API through `apiFetch` in `src/lib/api.ts`. |
| The backend cannot connect to the database, or tables are missing. | Start Postgres with `docker compose up -d db`, check `DATABASE_URL` (see `.env.example`), then run `alembic upgrade head` in `backend/`. |
| `pytest` fails with `ModuleNotFoundError: app`. | Run `pytest` from the `backend/` directory so pytest.ini's `pythonpath = .` applies. |
| The Playwright run fails to start the backend. | The config runs `.venv/bin/alembic` and `.venv/bin/python` inside `backend/`. Create `backend/.venv`, install requirements.txt into it, and have Postgres running. Alternatively, set `E2E_BASE_URL` to point at a running app. |
| `npm run build` succeeds but the code has type errors. | The build does not typecheck. Run `npm run typecheck` and fix the errors it reports. |
| /docs returns 404. | API docs are turned off when the environment setting is `production`. Use a non-production environment locally. |
| Port 5432 or 8000 is already in use. | Stop the other local Postgres or server process. docker-compose maps the database to 5432, and the Vite proxy expects the API on 8000. |
| Concern: `.github/workflows/deploy.yml` hard-codes values named `VITE_API_SECRET_KEY` / `NEXT_PUBLIC_API_SECRET_KEY`. Anything passed to the build this way is inlined into the public frontend bundle. | Do not treat those values as secrets. If they are meant to be secret, rotate them and stop passing them to the frontend build. The included frontend code (`api.ts`) only reads `VITE_API_BASE_URL`. |
<!-- sdlc:auto:end troubleshooting -->
