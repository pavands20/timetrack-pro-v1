# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `c1c419c` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
TimeTrack Pro V1 is a time and labour management web app with two applications in one repository. `backend/` is a FastAPI service using SQLAlchemy 2.0 models on PostgreSQL 16, with Alembic migrations. It covers session auth (sign-in, sign-out, current user, password reset), System Admin user administration, client/project/task administration, clock in/out with breaks, ending a forgotten entry, and a weekly manual timesheet. `frontend/` is a Vite + React 19 single-page app using React Router 7 and Tailwind 4. Its screens are SignIn, Home, Timesheet, AdminUsers, AdminProjects and Help. It calls the API through `src/lib/api.ts`, which sends a Bearer session token and an `X-Requested-With` header. In local dev, Vite proxies `/api` to `http://localhost:8000`. In deployment, `VITE_API_BASE_URL` is baked into the build. GitHub Actions deploys on pushes to `main`: the backend image goes to ECR and the frontend to AWS Amplify. Parts of the root README are out of date. It says the backend has only a health check, but the backend now has the routers listed above.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the version in backend/Dockerfile) with pip
- Node.js with npm
- Docker with Compose, to run the PostgreSQL 16 service in docker-compose.yml
- PostgreSQL 16 reachable through DATABASE_URL (there is no SQLite fallback)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. docker compose up -d db
2. cd backend
3. python -m venv .venv && . .venv/bin/activate
4. pip install -r requirements.txt
5. alembic upgrade head
6. python -m app.seed
7. uvicorn app.main:app --reload
8. (in a second terminal) cd frontend
9. npm install
10. npm run dev
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| db | `docker compose up -d db` | Starts PostgreSQL 16 (user, password and database all `app`) on port 5432, with a persistent volume. |
| migrate | `cd backend && alembic upgrade head` | Applies the Alembic migrations in backend/migrations/versions. This is the only way the schema changes. |
| seed | `cd backend && python -m app.seed` | Runs the seed module. The container runs this after migrating and before serving. |
| api | `cd backend && uvicorn app.main:app --reload` | Serves the FastAPI app on port 8000 with auto-reload. /health is the liveness probe; /docs and /redoc are available outside production. |
| dev | `cd frontend && npm run dev` | Starts the Vite dev server and proxies /api to http://localhost:8000. |
| build | `cd frontend && npm run build` | Bundles the SPA into frontend/dist. Does not typecheck. |
| preview | `cd frontend && npm run preview` | Serves the production build locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit` over src/. |
| lint (frontend) | `cd frontend && npm run lint` | Runs ESLint over the app. The platform uses this as a gate during development. `npm run lint:fix` applies the fixes it can. |
| format (frontend) | `cd frontend && npm run format` | Formats the app with Prettier. `npm run format:check` only checks. |
| lint (backend) | `cd backend && ruff check .` | Lints Python code with Ruff, configured in backend/ruff.toml. |
| format (backend) | `cd backend && ruff format .` | Formats Python code with Ruff. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container definition (devcontainer.json). |
| `.github/workflows/` | deploy.yml: on push to main, builds and pushes the backend image to ECR, then builds the frontend and deploys it to an AWS Amplify branch. |
| `.quorq/` | Quorq platform metadata (handoff.json, prepared.json). |
| `backend/` | FastAPI service: Dockerfile, requirements.txt, alembic.ini, pytest.ini, ruff.toml. |
| `backend/app/` | Application package. Contains main.py (app, CSRF middleware, validation error handler, CORS, router wiring), config, database (engine and the get_db session dependency), models, auth helpers (auth_deps, security, password_tokens), mailer, access, seed, and routers/ with one module per API area: auth, admin_users, admin_projects, clock, time_entries, timesheets. |
| `backend/migrations/` | Alembic environment and numbered revisions 0001 to 0006: users and sessions, password tokens, clients, projects and tasks, time entries, one open break per entry, manual entries. |
| `backend/scripts/` | Utility scripts (check_connections.py). |
| `backend/tests/` | Pytest suite (conftest.py plus files named by user story, e.g. test_clock_us010_qa.py). |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, eslint.config.js, .prettierrc, playwright.config.ts. |
| `frontend/src/` | App code: main.tsx (router and AuthProvider), App.tsx (navigation shell and route table), screens/ (one module per screen, with tests beside them), lib/ (api client, auth context, UI kit, icons, brand tokens). |
| `frontend/e2e/` | Playwright acceptance specs (auth, clock, breaks, timezone, admin users and projects, and others). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Each API area has its own APIRouter with an `/api/...` prefix, included in app/main.py. Only /health sits outside /api.
- Dependencies use Annotated aliases: `Db` (get_db), `Me` (get_current_user), `Admin` (require_role("System Admin")).
- POST, PUT, PATCH and DELETE requests to /api must send an `X-Requested-With` header, or the CSRF middleware returns 403. apiFetch adds this header automatically.
- Auth uses a Bearer token. Login returns `token`; the frontend keeps it in localStorage under `session_token`. The server stores only a hash of each session token.
- Validation errors are 422 responses with `detail` as a list of `{loc, msg}`. Messages are plain user-facing sentences. Conflicts and unique-index races (IntegrityError) return 409.
- Times are stored as timestamptz in UTC and returned as ISO-8601 strings with a `Z` suffix. Local dates and times are computed from each user's `time_zone` (an IANA zone).
- Emails are stored lowercase. Client, project and task names are unique case-insensitively through `lower(name)` indexes.
- The schema changes only through Alembic migrations; nothing creates tables at startup.
- Roles are fixed: Employee, Manager, Payroll Admin, System Admin. Admin routes and screens are restricted to System Admin.
- In the frontend, the `@/` import alias maps to `src/`. Styling uses Tailwind with brand CSS variables (`var(--brand-*)`).
- Test files are named after user stories (`us001`, `us010`, and so on). Vitest component tests sit beside their components; Playwright specs live in e2e/.
- Python is linted and formatted with Ruff; TypeScript with ESLint and Prettier.
- /docs, /redoc and /openapi.json are disabled when the configured environment is `production`.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs backend/tests. pytest.ini sets pythonpath=. so tests can import `app`. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests under src/ in jsdom. |
| e2e browser install | `cd frontend && npm run test:e2e:install` | Installs Chromium for Playwright. |
| e2e | `cd frontend && npm run test:e2e` | Runs the Playwright specs in e2e/. Without E2E_BASE_URL, it migrates and boots the backend from backend/.venv, then builds and previews the frontend on port 4173. With E2E_BASE_URL set, it tests that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| The backend fails to start or connect to the database. | Run `docker compose up -d db` and wait for the healthcheck. Make sure DATABASE_URL points at a running PostgreSQL 16; it defaults to the docker-compose service. |
| API errors because tables are missing. | Run `alembic upgrade head` from backend/. |
| POST, PUT, PATCH or DELETE requests from curl or another client get 403 "You do not have access to this resource." | Add an `X-Requested-With: XMLHttpRequest` header. For authenticated routes, also send `Authorization: Bearer <token>`. |
| API calls fail while running `npm run dev`. | Start the backend on port 8000. The Vite dev server proxies /api to http://localhost:8000. |
| Playwright cannot start the backend. | Create the virtualenv at backend/.venv and install requirements there; the e2e config runs `.venv/bin/alembic` and `.venv/bin/python`. Have PostgreSQL running, then run `npm run test:e2e:install` for Chromium. |
| `npm run build` succeeds, but the code has type errors. | `build` does not typecheck. Run `npm run typecheck` and fix the reported errors. |
| /docs returns 404. | API docs are disabled when the configured environment is production. Run with a non-production environment setting. |
| deploy.yml contains literal values for NEXT_PUBLIC_API_SECRET_KEY and VITE_API_SECRET_KEY. | Anything inlined into the frontend bundle is public. Review whether these values are meant to be secret; if so, move them out of the workflow and the client bundle. |
<!-- sdlc:auto:end troubleshooting -->
