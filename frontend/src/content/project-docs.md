## Stack

- **Frontend:** React and TypeScript single-page app built with Vite (folder `frontend/`).
- **Backend:** Python FastAPI service (folder `backend/`).
- **Database:** PostgreSQL 16, with schema changes made only through Alembic migrations.
- Times are stored in UTC and shown in each user's time zone. The week starts on Monday.
- Authentication uses hashed passwords and bearer session tokens. Password reset is by email.

## Setup

1. Start PostgreSQL 16: `docker compose up -d db`.
2. Copy `.env.example` to `.env` and set the values described below.
3. Backend: install `backend/requirements.txt`, run `alembic upgrade head` from `backend/`, then `uvicorn app.main:app`.
4. Create the first System Admin by setting `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` and running the seed script (`python -m app.seed`). It only creates an admin when no user exists.
5. Frontend: in `frontend/` run `npm install`, then `npm run dev` (or `npm run build` to serve the static files). The dev server proxies `/api` to the backend on port 8000.
6. Sign in as the admin and create users, managers, clients, projects and tasks.

## Configuration

All settings are environment variables read in `backend/app/config.py`. Each has a local default.

| Setting                    | Purpose                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | SQLAlchemy URL of the PostgreSQL database, for example `postgresql+psycopg://USER:PASSWORD@HOST:5432/DB`. |
| `ALLOWED_ORIGINS`          | Comma-separated browser origins allowed to call the API (CORS). Defaults to local dev origins.            |
| `SECRET_KEY`               | Application secret. Set a long random value outside development.                                          |
| `JWT_SECRET_KEY`           | Signing secret for tokens. Set a long random value outside development.                                   |
| `MEDIA_ROOT`               | Folder for stored media files. Default `./media`.                                                         |
| `SMTP_HOST`                | Mail server host (default `localhost`).                                                                   |
| `SMTP_PORT`                | Mail server port (default `587`). STARTTLS is used on any port except 25.                                 |
| `SMTP_USER`                | Mail server user name. Login is skipped when empty.                                                       |
| `SMTP_PASSWORD`            | Mail server password.                                                                                     |
| `SMTP_FROM`                | Sender address (default `no-reply@localhost`).                                                            |
| `APP_URL`                  | Base URL used in emailed links. Defaults to the first allowed origin.                                     |
| `ENVIRONMENT`              | `development` (default) or `production`.                                                                  |
| `SESSION_TTL_HOURS`        | Session lifetime in hours (default `8`).                                                                  |
| `BOOTSTRAP_ADMIN_EMAIL`    | Email of the first System Admin created by the seed script.                                               |
| `BOOTSTRAP_ADMIN_PASSWORD` | Password for that first admin. Use a strong value and never commit it.                                    |

### Email service API key and SMTP

Email is sent over SMTP. The credentials your email service provides map onto the `SMTP_*` settings:

- The service's SMTP host is `SMTP_HOST` and its port is `SMTP_PORT`.
- The service's user name is `SMTP_USER`.
- The **email service API key** is used as the SMTP password, so set it as `SMTP_PASSWORD`.
- `SMTP_FROM` must be a sender address the service allows.

There is no separate API key setting. Without these, sign-in works but password-reset and invitation emails are not delivered.

## Hosting region and privacy

- Personal data, including employee identities and working hours, must be hosted in an EU or UK region. Keep the database, API and backups there.
- Password-reset email must also be handled in an EU or UK region, so choose an email service and SMTP host in that region.
- The product must comply with GDPR and UK GDPR. Access to personal data is limited by role.
- Time records are kept for a configurable retention period, 6 years by default.
- The product is designed for up to 500 users.
