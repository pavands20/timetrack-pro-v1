"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so every table registers on the metadata
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Nothing to do on startup: the schema changes only through Alembic migrations
    (`alembic upgrade head`, which the container runs before it serves).

    Importing the application never opens a connection, so a test can point `get_db`
    at a database of its own.
    """
    yield


app = FastAPI(
    title="TimeTrack Pro V1",
    description="Time and labour management API: time tracking, timesheets and administration.",
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. The platform injects the frontend's real URL as
# ALLOWED_ORIGINS (comma separated); see app/config.py for the local default.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
