import React from "react";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";

import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { brand } from "@/lib/brand";

type Day = { date: string; manual_minutes: number; clocked_minutes: number };
type Row = {
  project_id: number;
  project_name: string;
  client_name: string;
  task_id: number;
  task_name: string;
  billable: boolean;
  days: Day[];
};
type Entry = {
  id: number;
  date: string;
  minutes: number;
  project_name: string;
  task_name: string;
  billable: boolean;
};
type Week = {
  user_name: string;
  time_zone: string;
  entries: Entry[];
  rows: Row[];
  day_totals_minutes: number[];
  week_total_minutes: number;
  billable_minutes: number;
  non_billable_minutes: number;
};

const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
const cell = { padding: "8px 12px", textAlign: "left" as const };

export default function Screen() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [weekStart, setWeekStart] = React.useState(
    () =>
      DateTime.now()
        .setZone(user?.time_zone || "UTC")
        .startOf("week")
        .toISODate() as string,
  );
  const [data, setData] = React.useState<Week | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let live = true;
    setData(null);
    setError("");
    apiFetch<Week>(`/api/team/members/${userId}/timesheets/${weekStart}`)
      .then((d) => live && setData(d))
      .catch((err) => {
        if (!live) return;
        setError(
          err instanceof ApiError && err.status === 403
            ? "Access denied. This person is not one of your direct reports."
            : "Could not load this timesheet.",
        );
      });
    return () => {
      live = false;
    };
  }, [userId, weekStart]);

  const shift = (weeks: number) =>
    setWeekStart((w) => DateTime.fromISO(w).plus({ weeks }).toISODate() as string);
  const start = DateTime.fromISO(weekStart);
  const dates = Array.from({ length: 7 }, (_, i) => start.plus({ days: i }));

  return (
    <div
      className="px-4 py-8 md:px-8"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody, minHeight: "100%" }}
    >
      <h1 style={{ fontFamily: brand.fontHeading, fontSize: 32, margin: "0 0 16px" }}>
        {data ? `${data.user_name}’s timesheet` : "Team timesheet"}
      </h1>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <button type="button" aria-label="Previous week" onClick={() => shift(-1)}>
          ‹ Previous week
        </button>
        <span>
          {dates[0].toFormat("ccc d LLL")} – {dates[6].toFormat("ccc d LLL yyyy")}
        </span>
        <button type="button" aria-label="Next week" onClick={() => shift(1)}>
          Next week ›
        </button>
      </div>
      {error ? (
        <p role="alert">{error}</p>
      ) : !data ? (
        <p role="status">Loading timesheet…</p>
      ) : (
        <>
          <p>
            Times and days are shown in the time zone <strong>{data.time_zone}</strong>. This view
            is read-only.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              aria-label="Timesheet grid"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={cell}>Project / task</th>
                  {dates.map((d) => (
                    <th key={d.toISODate()} style={cell}>
                      {d.toFormat("ccc d LLL")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={`${r.project_id}-${r.task_id}-${r.billable}`}>
                    <td style={cell}>
                      {r.client_name} / {r.project_name} / {r.task_name} ·{" "}
                      {r.billable ? "Billable" : "Non-billable"}
                    </td>
                    {r.days.map((d) => (
                      <td key={d.date} style={cell}>
                        {fmt(d.manual_minutes + d.clocked_minutes)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th style={cell}>Daily total</th>
                  {data.day_totals_minutes.map((m, i) => (
                    <td key={i} style={cell}>
                      {fmt(m)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <p>Weekly total: {fmt(data.week_total_minutes)} h</p>
          <p>Billable: {fmt(data.billable_minutes)} h</p>
          <p>Non-billable: {fmt(data.non_billable_minutes)} h</p>
          <h2 style={{ fontFamily: brand.fontHeading, fontSize: 22, margin: "16px 0 8px" }}>
            Entries
          </h2>
          {data.entries.length === 0 ? (
            <p>No entries this week.</p>
          ) : (
            <ul aria-label="Entries" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {data.entries.map((e) => (
                <li key={e.id} style={{ padding: "8px 0" }}>
                  {e.date} · {e.project_name} / {e.task_name} · {fmt(e.minutes)} h ·{" "}
                  {e.billable ? "Billable" : "Non-billable"}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
