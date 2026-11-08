"""Outgoing email over SMTP, as a FastAPI dependency so tests can swap in a fake."""

import smtplib
from email.message import EmailMessage

from app.config import settings


class SmtpMailer:
    def send(self, to: str, subject: str, body: str) -> None:
        msg = EmailMessage()
        msg["From"] = settings.smtp_from
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_port != 25:
                smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(msg)


def get_mailer() -> SmtpMailer:
    return SmtpMailer()
