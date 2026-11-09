"""SQLAlchemy models: users and server-side sessions."""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

ROLES = ("Employee", "Manager", "Payroll Admin", "System Admin")


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "role IN ('Employee', 'Manager', 'Payroll Admin', 'System Admin')", name="ck_users_role"
        ),
        # Emails are stored lowercase, so a plain unique index is case-insensitive.
        Index("ix_users_email", "email", unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(320))
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(20))
    time_zone: Mapped[str] = mapped_column(String(64))
    manager_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class UserSession(Base):
    __tablename__ = "sessions"
    __table_args__ = (Index("ix_sessions_token_hash", "token_hash", unique=True),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    token_hash: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class PasswordToken(Base):
    """A single-use, time-limited link token: a password reset or a new user's first password."""

    __tablename__ = "password_reset_tokens"
    __table_args__ = (
        CheckConstraint("purpose IN ('reset', 'set_initial')", name="ck_password_tokens_purpose"),
        Index("ix_password_reset_tokens_token_hash", "token_hash", unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    token_hash: Mapped[str] = mapped_column(String(64))
    purpose: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Client(Base):
    __tablename__ = "clients"
    __table_args__ = (Index("ix_clients_name_lower", func.lower(text("name")), unique=True),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        Index("ix_projects_client_name_lower", "client_id", func.lower(text("name")), unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id", ondelete="RESTRICT"))
    name: Mapped[str] = mapped_column(String(200))
    # Held for reporting only; never copied onto other rows.
    bill_rate: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    default_billable: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (
        Index("ix_tasks_project_name_lower", "project_id", func.lower(text("name")), unique=True),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="RESTRICT"))
    name: Mapped[str] = mapped_column(String(200))
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TimeEntry(Base):
    """A clock-in/clock-out record. Times are timestamptz (UTC).

    Users may delete their own entries."""

    __tablename__ = "time_entries"
    __table_args__ = (
        Index(
            "ux_time_entries_one_open_per_user",
            "user_id",
            unique=True,
            postgresql_where=text("end_at IS NULL"),
            sqlite_where=text("end_at IS NULL"),
        ),
        Index(
            "ux_time_entries_manual_cell",
            "user_id",
            "project_id",
            "task_id",
            "work_date",
            "billable",
            unique=True,
            postgresql_where=text("source = 'manual'"),
            sqlite_where=text("source = 'manual'"),
        ),
        Index("ix_time_entries_user_start", "user_id", "start_at"),
    )

    source: Mapped[str] = mapped_column(String(10), default="clock", server_default="clock")
    work_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), index=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="RESTRICT"))
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="RESTRICT"))
    billable: Mapped[bool] = mapped_column(Boolean)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Break(Base):
    __tablename__ = "breaks"
    __table_args__ = (
        Index(
            "ux_breaks_one_open_per_entry",
            "time_entry_id",
            unique=True,
            postgresql_where=text("end_at IS NULL"),
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    time_entry_id: Mapped[int] = mapped_column(
        ForeignKey("time_entries.id", ondelete="RESTRICT"), index=True
    )
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


__all__ = [
    "Base",
    "ROLES",
    "Break",
    "Client",
    "PasswordToken",
    "Project",
    "Task",
    "TimeEntry",
    "User",
    "UserSession",
]
