"""Application entrypoint."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import models  # noqa: F401 -- imported so every table registers on the metadata
from app.config import settings
from app.routers import admin_projects as admin_projects_router
from app.routers import admin_users as admin_users_router
from app.routers import auth as auth_router
from app.routers import clock as clock_router
from app.routers import timesheets as timesheets_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Nothing to do on startup: the schema changes only through Alembic migrations
    (`alembic upgrade head`, which the container runs before it serves).
    """
    yield


_PROD = settings.environment.lower() == "production"

app = FastAPI(
    title="TimeTrack Pro V1",
    description="Time and labour management API: time tracking, timesheets and administration.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url=None if _PROD else "/docs",
    redoc_url=None if _PROD else "/redoc",
    openapi_url=None if _PROD else "/openapi.json",
)

_UNSAFE = {"POST", "PUT", "PATCH", "DELETE"}


@app.middleware("http")
async def require_csrf_header(request: Request, call_next):  # type: ignore[no-untyped-def]
    """State-changing /api requests must carry X-Requested-With (CSRF defence)."""
    if (
        request.method in _UNSAFE
        and request.url.path.startswith("/api")
        and not request.headers.get("x-requested-with")
    ):
        return JSONResponse(
            status_code=403, content={"detail": "You do not have access to this resource."}
        )
    return await call_next(request)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = []
    for err in exc.errors():
        msg = str(err.get("msg", "Invalid value."))
        if err.get("type") == "missing":
            msg = "This field is required."
        elif "email" in msg.lower():
            msg = "Enter a valid email address."
        else:
            msg = msg.removeprefix("Value error, ")
        errors.append({"loc": list(err.get("loc", [])), "msg": msg})
    return JSONResponse(status_code=422, content={"detail": errors})


# The SPA and API share one origin in production; CORS only matters for local dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe."""
    return {"status": "ok"}


app.include_router(clock_router.router)
app.include_router(auth_router.router)
app.include_router(admin_users_router.router)
app.include_router(admin_projects_router.router)
app.include_router(admin_projects_router.catalog_router)
app.include_router(timesheets_router.router)
app.include_router(timesheets_router.entries_router)
