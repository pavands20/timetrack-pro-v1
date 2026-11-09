import React from "react";
import { Link } from "react-router-dom";

import { ApiError, apiFetch } from "@/lib/api";
import { brand } from "@/lib/brand";

type Member = { id: number; name: string; time_zone: string };

export default function Screen() {
  const [members, setMembers] = React.useState<Member[] | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let live = true;
    apiFetch<Member[]>("/api/team/members")
      .then((m) => live && setMembers(m))
      .catch((err) => {
        if (!live) return;
        setError(
          err instanceof ApiError && err.status === 403
            ? "Access denied. Only Managers can see this page."
            : "Could not load your team.",
        );
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div
      className="px-4 py-8 md:px-8"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody, minHeight: "100%" }}
    >
      <h1 style={{ fontFamily: brand.fontHeading, fontSize: 32, margin: "0 0 24px" }}>My team</h1>
      {error ? (
        <p role="alert">{error}</p>
      ) : members === null ? (
        <p role="status">Loading your team…</p>
      ) : members.length === 0 ? (
        <p>You have no direct reports.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 640 }}>
          {members.map((m) => (
            <li key={m.id} style={{ borderTop: `1px solid ${brand.neutralColor}`, padding: "12px 0" }}>
              <Link
                to={`/team/${m.id}`}
                style={{ color: brand.accentColor, textDecoration: "underline" }}
              >
                {m.name}
              </Link>
              <span style={{ marginLeft: 12, color: brand.neutralColor }}>{m.time_zone}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
