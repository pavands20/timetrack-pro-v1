# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `036db17` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
TimeTrack Pro V1 is a Quorq-generated repository for a planned time and labour management app. It contains two applications. `frontend/` is a Vite 6 + React 19 + TypeScript single-page app, using react-router-dom 7 and Tailwind CSS 4. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2 and Pydantic 2. Both are early scaffolds. Per the READMEs, the frontend screens render seeded sample data and do not call the API yet. `src/lib/api.ts` (`apiFetch`, `API_BASE_URL`) is the intended seam for wiring them up. The backend has no models or routers yet; its only route is `GET /health`. The backend uses SQLite (`./app.db`) by default and switches to Postgres when `DATABASE_URL` is set. A `docker-compose.yml` provides a Postgres 16 container, and `backend/Dockerfile` packages the API on Python 3.12. The frontend README also lists `src/App.tsx` and `src/screens/`. `main.tsx` imports `@/App`, but neither path appears in the provided file tree.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the version in backend/Dockerfile) with pip
- Node.js with npm (no version is pinned in the repo; Vite 6 needs a current LTS)
- Docker with Compose (optional: to run Postgres 16 from docker-compose.yml or to build the backend image)
- Chromium for Playwright (installed via `npm run test:e2e:install`; only needed for e2e tests)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. cd backend
2. pip install -r requirements.txt
3. uvicorn app.main:app --reload
4. (new terminal, from the repo root) cd frontend
5. npm install
6. npm run dev
7. Optional: to use Postgres instead of the default SQLite, run `docker compose up -d db` from the repo root. Then set DATABASE_URL to a SQLAlchemy URL for the compose credentials (user/password/db all `app`, port 5432, psycopg driver), e.g. `postgresql+psycopg://app:app@localhost:5432/app`, before starting uvicorn.
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| backend dev | `cd backend && uvicorn app.main:app --reload` | Starts the FastAPI API with auto-reload (default port 8000). Creates tables from the models on startup. |
| backend lint | `cd backend && ruff check .` | Lints the backend with Ruff (config in backend/ruff.toml). |
| backend format | `cd backend && ruff format .` | Formats the backend code with Ruff. |
| database | `docker compose up -d db` | Starts a Postgres 16 container on port 5432 (user/password/db: app) with a persistent volume. |
| dev | `cd frontend && npm run dev` | Starts the Vite dev server (the backend's default CORS allows http://localhost:5173). |
| build | `cd frontend && npm run build` | Bundles the SPA with Vite. This does not typecheck. |
| preview | `cd frontend && npm run preview` | Serves the production build locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit` over src/. |
| lint | `cd frontend && npm run lint` | Runs ESLint over the app; the platform uses this as a gate. Use `npm run lint:fix` to auto-fix. |
| format | `cd frontend && npm run format` | Formats the frontend with Prettier. `npm run format:check` only checks. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration (devcontainer.json). |
| `.quorq/` | Platform handoff metadata (handoff.json) from the Quorq SDLC platform. |
| `backend/` | FastAPI service: requirements.txt, Dockerfile, pytest.ini, ruff.toml. |
| `backend/app/` | Application package: main.py (app, CORS, lifespan, /health), database.py (engine, SessionLocal, Base, get_db), models.py (SQLAlchemy models, none yet), schemas.py (Pydantic models incl. StubResponse), routers/ (generated routers, none yet). |
| `backend/tests/` | Pytest suite: conftest.py fixtures and test_health.py. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, eslint.config.js, .prettierrc, playwright.config.ts, index.html. |
| `frontend/src/` | App source: main.tsx entry (BrowserRouter + App), index.css, test-setup.ts, lib/ (api.ts client, ui.tsx components, icons.tsx, navigate.ts). |
| `frontend/e2e/` | Playwright acceptance specs (example.spec.ts). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Frontend imports use the `@/` alias for `frontend/src` (configured in vite.config.ts and tsconfig.json).
- Vitest component tests live beside their components under `src/` as `*.test\|spec.ts(x)`. Playwright specs live only in `e2e/` and are excluded from Vitest.
- All API calls should go through `apiFetch` in `src/lib/api.ts`. It uses VITE_API_BASE_URL (default http://localhost:8000). It sends a Bearer token: the stored session token if present, otherwise VITE_API_SECRET_KEY.
- Screens currently render seeded sample data. Wire them to real endpoints one screen at a time.
- TypeScript runs with `strict` but has `noImplicitAny` and `strictNullChecks` disabled. `vite build` does not typecheck; run `npm run typecheck` separately.
- Frontend style is enforced by ESLint 9 (typescript-eslint, react-hooks, react-refresh) and Prettier. Backend style is enforced by Ruff.
- Backend layout: one router module per architecture component in `app/routers/`. SQLAlchemy models inherit `app.database.Base` in `models.py`. Pydantic schemas go in `schemas.py`.
- Unimplemented generated routes return a typed `StubResponse` (status `not_implemented`) rather than raising.
- DB sessions come from the request-scoped `get_db` dependency. Tables are created with `Base.metadata.create_all` at startup; there are no migrations yet (the code notes Alembic should replace this).
- Backend configuration comes from env vars: DATABASE_URL (default `sqlite:///./app.db`) and ALLOWED_ORIGINS (comma-separated; defaults to localhost/127.0.0.1:5173).
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests (pythonpath set to backend/ via pytest.ini). |
| test | `cd frontend && npm test` | Runs Vitest component tests under src/ in jsdom (passes when there are no tests). |
| e2e install | `cd frontend && npm run test:e2e:install` | Downloads the Chromium browser for Playwright. |
| e2e | `cd frontend && npm run test:e2e` | Runs Playwright specs in e2e/. Without E2E_BASE_URL it boots the backend from backend/.venv on port 8000 and a built preview on port 4173. With E2E_BASE_URL set it runs against that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Browser calls to the API fail with CORS errors. | The API only allows http://localhost:5173 and http://127.0.0.1:5173 by default. Use the Vite dev server on that port, or set ALLOWED_ORIGINS (comma-separated) to your frontend origin. |
| `pytest` fails with `ModuleNotFoundError: No module named 'app'`. | Run pytest from the `backend/` directory so pytest.ini (`pythonpath = .`) is picked up. |
| The backend fails on startup when DATABASE_URL points at Postgres. | Tables are created at startup, so the database must be reachable. Start it with `docker compose up -d db` and wait for its healthcheck to pass. Make sure the URL matches the compose credentials (app/app/app on port 5432). |
| `npm run test:e2e` cannot start the backend web server. | The Playwright config runs `../backend/.venv/bin/python`, so backend requirements must be installed into a virtualenv at `backend/.venv`. Alternatively, set E2E_BASE_URL to an already running app. |
| Playwright reports a missing browser executable. | Run `npm run test:e2e:install` in frontend/ to download Chromium. |
| `npm run build` succeeds but `npm run typecheck` reports errors. | Expected: the build does not typecheck generated screens. The README cites untyped `useState({})` as a common cause; fix those errors before treating the code as maintained. |
| Frontend API calls go to the wrong host. | Set VITE_API_BASE_URL at build or dev time; it defaults to http://localhost:8000. |
<!-- sdlc:auto:end troubleshooting -->
