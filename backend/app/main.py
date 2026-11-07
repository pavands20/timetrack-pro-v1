"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """The scaffold ships no migrations, so the tables are created from the models
    when the application starts. Replace this with Alembic before anything holds data
    worth keeping.

    This runs on startup and not at import, so importing the application never opens a
    connection. A test can therefore point `get_db` at a database of its own, and a
    deployment whose `DATABASE_URL` names a server that is not up fails where you can
    read the error, not while pytest collects the files.
    """
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="TimeTrack Pro V1",
    description="Build a time and labour management web app for a company of up to 500 employees, similar to Replicon. \u258e \u258e Users and roles: Employee, Manager, Payroll Admin, System Admin. Sign-in with email and password. Admins create users and assign each employee a manager. \u258e \u258e Time tracking: employees clock in and out (with breaks) from the browser, or fill a weekly timesheet by day. Each time entry is charged to a project and task. Entries can be marked billable or non-billable. \u258e \u258e Projects: admins create clients, projects and tasks, with an hourly bill rate per project. \u258e \u258e Timesheet approval: employees submit their week. The manager approves or rejects it with a comment, and a rejected sheet goes back for editing. Approved sheets are locked. \u258e \u258e Time off: employees request leave (annual, sick, unpaid) for full or half days. The manager approves it. Each employee sees their leave balance, which grows by a fixed number of days per month. \u258e \u258e Labour rules: an admin sets the daily and weekly overtime limits, for example 8 h per day and 40 h per week, plus the minimum break after 6 hours. The app flags overtime and missed breaks on the timesheet and in a compliance report. \u258e \u258e Reports: hours by employee, project and week; billable versus non-billable hours; overtime; leave taken. Export to CSV, including a payroll export of approved hours per employee per period. \u258e \u258e Notifications: in-app alerts for a timesheet due, approved or rejected, and a leave request decided. \u258e \u258e Audit: record who changed or approved any timesheet, and when.",
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
