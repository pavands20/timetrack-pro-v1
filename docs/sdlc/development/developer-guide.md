# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `6903b10` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
TimeTrack Pro V1 is a time and labour management web app with two applications in one repository. `frontend/` is a Vite + React 19 single-page app written in TypeScript, using React Router 7 and Tailwind CSS v4. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2, Alembic migrations and PostgreSQL 16. The backend implements these features: sign-in with bearer-token sessions, password reset and first-password emails, System Admin user administration, client/project/task administration with a read-only project catalog, and clock in/out with breaks. The root README says the backend has only a health check, but that is out of date. Several frontend screens call the API through `src/lib/api.ts`; the frontend README says screens may still use seeded sample data. A GitHub Actions workflow deploys on every push to `main`: it pushes the backend Docker image to ECR and publishes the built frontend to AWS Amplify.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- Node.js with npm (the frontend uses Vite 6, React 19 and TypeScript 5)
- Docker with Docker Compose (for the PostgreSQL 16 database in docker-compose.yml)
- PostgreSQL 16 reachable through DATABASE_URL (there is no SQLite fallback)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. docker compose up -d db
2. cd backend
3. python -m venv .venv && source .venv/bin/activate
4. pip install -r requirements.txt
5. Review .env.example and ENVIRONMENT.md. DATABASE_URL defaults to the docker-compose Postgres service, so set it only if your database is elsewhere.
6. alembic upgrade head
7. python -m app.seed
8. uvicorn app.main:app --reload
9. In a second terminal: cd frontend && npm install
10. npm run dev  (Vite proxies /api to http://localhost:8000)
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI service with auto-reload on port 8000. Interactive docs are at /docs unless the environment is production. |
| migrate | `cd backend && alembic upgrade head` | Applies all pending Alembic migrations. Migrations are the only way the schema changes. |
| seed | `cd backend && python -m app.seed` | Runs the seed module. The Docker image runs it after migrating. |
| backend lint | `cd backend && ruff check .` | Lints the Python code with Ruff. |
| backend format | `cd backend && ruff format .` | Formats the Python code with Ruff. |
| backend image | `docker build -t timetrack-backend ./backend` | Builds the backend image. On start the container migrates, seeds, then serves on port 8000. It still needs a reachable database. |
| dev | `cd frontend && npm run dev` | Starts the Vite dev server and proxies /api to the backend on localhost:8000. |
| build | `cd frontend && npm run build` | Bundles the SPA into dist/. This does not typecheck. |
| preview | `cd frontend && npm run preview` | Serves the production build locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit. |
| lint | `cd frontend && npm run lint` | Runs ESLint over the app. This is the gate the platform runs during development. |
| lint:fix | `cd frontend && npm run lint:fix` | Runs ESLint and applies the fixes it can. |
| format | `cd frontend && npm run format` | Formats the frontend with Prettier. |
| format:check | `cd frontend && npm run format:check` | Checks Prettier formatting without writing changes. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer` | Dev container configuration (devcontainer.json). |
| `.github/workflows` | deploy.yml: on push to main, builds and pushes the backend image to ECR and publishes the frontend build to AWS Amplify, using OIDC to authenticate. |
| `.quorq` | Metadata files for the Quorq platform (handoff.json, prepared.json). |
| `backend` | The FastAPI service: requirements.txt, Dockerfile, alembic.ini, pytest.ini and ruff.toml. |
| `backend/app` | Application code: main.py (app, CSRF middleware, error handler, /health), config, database, SQLAlchemy models, auth dependencies and security, mailer, password tokens, seed, and routers/ (auth, admin_users, admin_projects, clock). |
| `backend/migrations` | Alembic environment and numbered versions (0001_users_sessions through 0005_one_open_break). |
| `backend/scripts` | Utility scripts (check_connections.py). |
| `backend/tests` | Pytest suite with conftest.py; files are named by feature and user story, for example test_clock_us010_qa.py. |
| `frontend` | The Vite + React SPA: package.json, vite.config.ts, playwright.config.ts, tsconfig.json, ESLint and Prettier configs. |
| `frontend/src` | SPA source: main.tsx (router and AuthProvider), App.tsx (navigation shell and route table), screens/ (one module per screen, with tests alongside), lib/ (API client, auth, UI and icon components, brand tokens). |
| `frontend/e2e` | Playwright acceptance specs (*.spec.ts). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- All API routes live under /api, with one APIRouter per area (auth, admin-users, admin-projects, catalog, clock). /health is the only exception and is unprefixed.
- Admin endpoints use the dependency require_role("System Admin"). Other protected endpoints use get_current_user.
- POST, PUT, PATCH and DELETE requests to /api must send an X-Requested-With header (CSRF defence). apiFetch adds it automatically.
- Authentication uses server-side sessions. Login returns a token that the frontend stores in localStorage under 'session_token' and sends as 'Authorization: Bearer <token>'. Only a hash of the token is stored in the database.
- Validation failures return 422 with detail as a list of {loc, msg} objects and plain-language messages. Conflicts such as duplicates, archived clients or already being clocked in return 409.
- The schema changes only through Alembic migrations, numbered NNNN_description.py. Nothing is created at startup.
- Timestamps are stored as timestamptz in UTC and returned as ISO-8601 strings with a Z suffix. Local times are derived from each user's time_zone.
- Emails are stored lowercase. Client, project and task names are unique case-insensitively, enforced by lower() indexes.
- Partial unique indexes enforce one open time entry per user and one open break per entry. IntegrityError from concurrent requests is mapped to 409.
- OpenAPI docs (/docs, /redoc, /openapi.json) are disabled when the environment setting is 'production'.
- In the frontend, the '@' import alias points to src/. Admin-only routes are wrapped in AdminOnly. Styling uses Tailwind with brand CSS variables such as var(--brand-*).
- Component tests (*.test.tsx) sit beside the components they cover. Playwright specs live only in e2e/.
- Code is formatted with Prettier and ESLint in the frontend and Ruff in the backend.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests. pytest.ini sets pythonpath so the app package can be imported. |
| backend coverage | `cd backend && pytest --cov=app` | Runs the pytest suite with coverage for the app package (pytest-cov is in requirements.txt). |
| test | `cd frontend && npm test` | Runs Vitest component tests under src/ in jsdom. |
| test:e2e:install | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser that Playwright needs. |
| test:e2e | `cd frontend && npm run test:e2e` | Runs Playwright specs in e2e/. If E2E_BASE_URL is set, tests run against that URL. Otherwise Playwright migrates and boots the backend from backend/.venv on port 8000, then builds and previews the frontend on port 4173. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| POST/PATCH requests to /api return 403 'You do not have access to this resource.' when sent with curl or another client. | Add an X-Requested-With header (for example X-Requested-With: XMLHttpRequest). The CSRF middleware rejects state-changing /api requests that lack it. |
| The backend fails to connect to the database, or tables are missing. | Start Postgres with 'docker compose up -d db', check DATABASE_URL, then run 'alembic upgrade head' from backend/. |
| 'pytest' reports 'No module named app'. | Run pytest from the backend/ directory so pytest.ini (pythonpath = .) is picked up. |
| Playwright cannot start the backend webServer. | Create backend/.venv and install requirements.txt into it, make sure Postgres is reachable through DATABASE_URL, and run 'npm run test:e2e:install' first. |
| Chromium crashes in a container during E2E tests. | The config already passes --disable-dev-shm-usage. Keep workers at 1, since specs share one backend and database. |
| 'npm run build' succeeds but 'npm run typecheck' fails. | This is expected: the build does not typecheck. Fix the reported tsc errors, which are usually untyped useState({}) values, before relying on typecheck. |
| A deployed frontend calls localhost or the wrong API. | VITE_API_BASE_URL must be set at build time, because Vite inlines it into the bundle. When it is unset, calls are relative and only work through the dev proxy. |
| /docs returns 404. | The environment setting is 'production', which disables the OpenAPI docs. Use a non-production environment locally. |
<!-- sdlc:auto:end troubleshooting -->
