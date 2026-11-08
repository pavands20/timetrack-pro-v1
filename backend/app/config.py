"""Runtime settings, read from the environment with a working local default for each.

The platform always provides ALLOWED_ORIGINS, SECRET_KEY, JWT_SECRET_KEY and MEDIA_ROOT;
DATABASE_URL and the SMTP_* settings come from the project's services. Nothing here is a
real secret: the defaults only make a bare local run work.

- SECRET_KEY is the shared API bearer the generated frontend sends. It is public, so it
  must never be used to sign anything.
- JWT_SECRET_KEY is private and is the only key that may sign tokens or sessions.
"""

import os
from dataclasses import dataclass, field
from pathlib import Path

_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
# Matches the Postgres service in docker-compose.yml.
_DEV_DATABASE_URL = "postgresql+psycopg://app:app@localhost:5432/app"


def _split(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    database_url: str = field(
        default_factory=lambda: os.getenv("DATABASE_URL") or _DEV_DATABASE_URL
    )
    allowed_origins: list[str] = field(
        default_factory=lambda: _split(os.getenv("ALLOWED_ORIGINS", "")) or list(_DEV_ORIGINS)
    )
    secret_key: str = field(default_factory=lambda: os.getenv("SECRET_KEY", "dev-secret-key"))
    jwt_secret_key: str = field(
        default_factory=lambda: os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key")
    )
    media_root: Path = field(default_factory=lambda: Path(os.getenv("MEDIA_ROOT", "./media")))
    smtp_host: str = field(default_factory=lambda: os.getenv("SMTP_HOST", "localhost"))
    smtp_port: int = field(default_factory=lambda: int(os.getenv("SMTP_PORT", "587")))
    smtp_user: str = field(default_factory=lambda: os.getenv("SMTP_USER", ""))
    smtp_password: str = field(default_factory=lambda: os.getenv("SMTP_PASSWORD", ""))
    smtp_from: str = field(default_factory=lambda: os.getenv("SMTP_FROM", "no-reply@localhost"))
    # Where emailed links point; defaults to the first allowed origin (the SPA).
    app_url: str = field(default_factory=lambda: os.getenv("APP_URL", ""))
    environment: str = field(default_factory=lambda: os.getenv("ENVIRONMENT", "development"))
    # Secure cookies only; switch off for plain-http local development.
    cookie_secure: bool = field(
        default_factory=lambda: os.getenv("COOKIE_SECURE", "true").lower() != "false"
    )
    session_ttl_hours: int = field(default_factory=lambda: int(os.getenv("SESSION_TTL_HOURS", "8")))
    bootstrap_admin_email: str = field(
        default_factory=lambda: os.getenv("BOOTSTRAP_ADMIN_EMAIL", "")
    )
    bootstrap_admin_password: str = field(
        default_factory=lambda: os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "")
    )


settings = Settings()
