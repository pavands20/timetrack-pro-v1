// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { DateTime } from "luxon";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const { Input, Label, Select } = UI;

const { User, Home, Clock } = Icons;

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const pad = (n) => String(n).padStart(2, "0");
const fmtH = (min) => (min / 60).toFixed(1);
const fmtHM = (min) => `${Math.floor(min / 60)}:${pad(Math.round(min % 60))}`;
const msOf = (iso) => DateTime.fromISO(iso, { zone: "utc" }).toMillis();
const detailOf = (err) => {
  const d = err instanceof ApiError ? err.body?.detail : null;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]?.msg) return d[0].msg;
  return "Something went wrong. Try again.";
};

export default function Screen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const signOut = async () => {
    try {
      await logout();
    } finally {
      navigate("sign-in");
    }
  };
  const tz = user?.time_zone || "UTC";
  const fmtTime = (ms) => DateTime.fromMillis(ms, { zone: tz }).toFormat("HH:mm");

  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const [week, setWeek] = React.useState(null);
  const [weekError, setWeekError] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [entry, setEntry] = React.useState(null);
  const [projectId, setProjectId] = React.useState("");
  const [taskId, setTaskId] = React.useState("");
  const [billable, setBillable] = React.useState("billable");
  const [clockError, setClockError] = React.useState("");
  const [notice, setNotice] = React.useState(null);

  const project = projects.find((p) => String(p.id) === String(projectId));
  const onBreak = !!(entry && entry.on_break);
  const startLocal = entry ? DateTime.fromISO(entry.start_at, { zone: "utc" }).setZone(tz) : null;
  const stale = !!(
    startLocal && startLocal.startOf("day") < DateTime.fromMillis(now, { zone: tz }).startOf("day")
  );
  const INPUT_FMT = "yyyy-MM-dd'T'HH:mm";
  const [endValue, setEndValue] = React.useState("");
  const [endError, setEndError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const staleId = stale ? entry.id : null;
  React.useEffect(() => {
    if (staleId === null) return;
    const s = DateTime.fromISO(entry.start_at, { zone: "utc" }).setZone(tz);
    let c = s.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });
    if (c <= s) c = s.plus({ hours: 1 });
    setEndValue(c.toFormat(INPUT_FMT));
    setEndError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staleId, tz]);
  const days = week
    ? week.days.map((d) => ({ b: d.billable_minutes, n: d.non_billable_minutes, date: d.date }))
    : DAY_NAMES.map(() => ({ b: 0, n: 0, date: "" }));
  const totalB = week ? week.billable_minutes : 0;
  const totalN = week ? week.non_billable_minutes : 0;
  const total = week ? week.total_minutes : 0;
  const todayIso = DateTime.fromMillis(now, { zone: tz }).toISODate();
  const weekRange = week
    ? `${DateTime.fromISO(week.week_start).toFormat("ccc d")} to ${DateTime.fromISO(week.week_end).toFormat("ccc d LLL yyyy")}`
    : "";
  const maxDay = Math.max(600, ...days.map((d) => d.b + d.n));

  const say = (kind, text) => setNotice({ kind, text, at: Date.now() });
  const guard = (err) => {
    if (err instanceof ApiError && err.status === 401) {
      navigate("/sign-in");
      return true;
    }
    return false;
  };

  const loadWeek = React.useCallback(() => {
    setWeekError(false);
    apiFetch("/api/dashboard/week")
      .then((w) => setWeek(w))
      .catch((err) => {
        if (!guard(err)) setWeekError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  React.useEffect(() => {
    let live = true;
    Promise.all([apiFetch("/api/projects"), apiFetch("/api/clock/status")])
      .then(([list, status]) => {
        if (!live) return;
        if (!Array.isArray(list) || !status) throw new Error("Unexpected response");
        setProjects(list);
        const e = status.entry;
        const p = (e && list.find((x) => x.id === e.project_id)) || list[0];
        setEntry(e);
        if (p) {
          setProjectId(String(p.id));
          setTaskId(String(e ? e.task_id : (p.tasks[0]?.id ?? "")));
          setBillable((e ? e.billable : p.default_billable) ? "billable" : "non-billable");
        }
      })
      .catch((err) => {
        if (live && !guard(err)) say("error", "Could not load the clock. Try again.");
      });
    return () => {
      live = false;
    };
  }, []);

  const changeProject = (id) => {
    const p = projects.find((x) => String(x.id) === id);
    setProjectId(id);
    setTaskId(String(p?.tasks[0]?.id ?? ""));
    setBillable(p?.default_billable ? "billable" : "non-billable");
    setClockError("");
  };

  const clockIn = async () => {
    setClockError("");
    try {
      const e = await apiFetch("/api/clock/in", {
        method: "POST",
        body: JSON.stringify({
          project_id: Number(projectId),
          task_id: Number(taskId),
          billable: billable === "billable",
        }),
      });
      setEntry(e);
      say("ok", `Clocked in at ${fmtTime(msOf(e.start_at))} on ${e.project_name}, ${e.task_name}.`);
    } catch (err) {
      if (guard(err)) return;
      if (err instanceof ApiError && err.status === 422) setClockError(detailOf(err));
      else say("error", detailOf(err));
    }
  };
  const breakCall = async (path) => {
    try {
      const e = await apiFetch(`/api/clock/breaks/${path}`, { method: "POST" });
      setEntry(e);
      if (path === "start")
        say(
          "ok",
          `Break started at ${fmtTime(msOf(e.break_started_at))}. It will not count towards your hours.`,
        );
      else say("ok", `Break ended at ${fmtTime(Date.now())}. Back on the clock.`);
    } catch (err) {
      if (guard(err)) return;
      say("error", detailOf(err));
    }
  };
  const startBreak = () => breakCall("start");
  const endBreak = () => breakCall("end");
  const clockOut = async () => {
    setClockError("");
    try {
      const r = await apiFetch("/api/clock/out", { method: "POST" });
      setEntry(null);
      const day = DateTime.fromISO(r.work_date, { zone: tz }).toFormat("ccc d LLL");
      say("ok", `${fmtHM(r.duration_minutes)} h added to ${day}`);
      loadWeek();
    } catch (err) {
      if (guard(err)) return;
      say("error", detailOf(err));
    }
  };

  const saveEnd = async () => {
    const end = DateTime.fromFormat(endValue, INPUT_FMT, { zone: tz });
    if (!end.isValid) {
      setEndError("Enter a valid end date and time.");
      return;
    }
    if (end <= startLocal) {
      setEndError("End time must be after the start time.");
      return;
    }
    setEndError("");
    setSaving(true);
    try {
      const r = await apiFetch(`/api/time-entries/${entry.id}/end`, {
        method: "PATCH",
        body: JSON.stringify({ end_at: end.toUTC().toISO({ suppressMilliseconds: true }) }),
      });
      setEntry(null);
      const day = DateTime.fromISO(r.work_date, { zone: tz }).toFormat("ccc d LLL");
      say("ok", `${fmtHM(r.duration_minutes)} h added to ${day}`);
      loadWeek();
      try {
        const status = await apiFetch("/api/clock/status");
        setEntry(status.entry);
      } catch (err) {
        guard(err);
      }
    } catch (err) {
      if (!guard(err)) setEndError(detailOf(err));
    } finally {
      setSaving(false);
    }
  };

  const C = {
    bg: brand.backgroundColor,
    fg: brand.primaryColor,
    muted: brand.neutralColor,
    accent: brand.accentColor,
    surface: `color-mix(in srgb, ${brand.primaryColor} 5%, ${brand.backgroundColor})`,
    raised: `color-mix(in srgb, ${brand.primaryColor} 9%, ${brand.backgroundColor})`,
    line: `color-mix(in srgb, ${brand.primaryColor} 12%, transparent)`,
  };
  const label = {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.muted,
    fontWeight: 500,
  };
  const panel = {
    backgroundColor: C.surface,
    border: `1px solid ${C.line}`,
    borderRadius: brand.radius,
    padding: 24,
  };
  const serif = { fontFamily: brand.fontHeading };
  const num = { fontVariantNumeric: "tabular-nums" };
  const field = {
    width: "100%",
    minHeight: 44,
    padding: "8px 12px",
    backgroundColor: C.bg,
    color: C.fg,
    border: `1px solid ${C.line}`,
    borderRadius: brand.radius,
    fontSize: 15,
    fontFamily: brand.fontBody,
  };

  const actionBtn = (primary, dim) => ({
    minHeight: 48,
    padding: "12px 16px",
    borderRadius: brand.radius,
    fontSize: 15,
    fontWeight: 500,
    fontFamily: brand.fontBody,
    cursor: "pointer",
    backgroundColor: primary ? C.accent : "transparent",
    color: primary ? C.bg : C.fg,
    border: `1px solid ${primary ? C.accent : C.line}`,
    opacity: dim ? 0.5 : 1,
  });

  const primaryAction = !entry ? "in" : onBreak ? "endbreak" : "out";

  let statusLine;
  if (!entry) {
    statusLine = <>Not clocked in. Pick a project and task, then clock in.</>;
  } else {
    statusLine = onBreak ? (
      <>
        On a break since{" "}
        <strong style={{ ...num, color: C.accent, fontWeight: 600 }}>
          {fmtTime(msOf(entry.break_started_at))}
        </strong>
        .
      </>
    ) : (
      <>
        In progress since{" "}
        <strong style={{ ...num, color: C.accent, fontWeight: 600 }}>
          {fmtTime(msOf(entry.start_at))}
        </strong>
        .
      </>
    );
  }

  return (
    <div
      className="tt"
      style={{
        backgroundColor: C.bg,
        color: C.fg,
        fontFamily: brand.fontBody,
        minHeight: "100%",
        padding: "32px 16px",
      }}
    >
      <style>{`
        .tt button:focus-visible, .tt select:focus-visible, .tt input:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        .tt .tt-btn { transition: background-color .15s ease, border-color .15s ease, transform .1s ease; }
        .tt .tt-btn:hover { background-color: ${C.raised}; }
        .tt .tt-btn[data-primary="true"]:hover { background-color: color-mix(in srgb, ${C.accent} 88%, ${C.fg}); }
        .tt .tt-btn:active { transform: translateY(1px); }
        .tt .tt-link:hover span.tt-ul { border-bottom-color: ${C.accent}; }
        .tt select:disabled, .tt input:disabled { opacity: .55; cursor: not-allowed; }
        .tt .tt-bar { transition: height .4s ease; }
        .tt .tt-in { animation: ttin .28s ease both; }
        @keyframes ttin { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .tt *, .tt .tt-in { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="mx-auto grid grid-cols-12 gap-6" style={{ maxWidth: 1040 }}>
        {/* Row 1 */}
        <div data-wf="b-0-0" className="col-span-12 sm:col-span-8">
          <div
            style={{ width: 48, height: 1, backgroundColor: C.accent, marginBottom: 16 }}
            aria-hidden="true"
          />
          <h1 style={{ ...serif, fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
            Home
          </h1>
          <p style={{ color: C.muted, margin: "8px 0 0", fontSize: 15 }}>
            {week ? `Week of ${weekRange} · ` : ""}
            {fmtTime(now)} in {tz}
          </p>
        </div>
        <div className="col-span-12 sm:col-span-4 flex sm:justify-end items-start">
          <button
            data-wf="b-0-1"
            type="button"
            className="tt-btn"
            style={actionBtn(false)}
            onClick={signOut}
          >
            Sign out
          </button>
        </div>

        {stale && (
          <section
            role="alert"
            aria-labelledby="stale-h"
            className="col-span-12"
            style={{ ...panel, borderColor: C.accent }}
          >
            <h2 id="stale-h" style={{ ...serif, fontSize: 20, fontWeight: 700, margin: 0 }}>
              You are still clocked in
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.5 }}>
              You are still clocked in since {startLocal.toFormat("ccc d LLL HH:mm")}. What was the
              correct end time?
            </p>
            <div className="flex flex-wrap gap-3 items-end" style={{ marginTop: 16 }}>
              <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                <Label htmlFor="stale-end" style={{ ...label, display: "block", marginBottom: 8 }}>
                  Correct end time
                </Label>
                <input
                  id="stale-end"
                  type="datetime-local"
                  value={endValue}
                  onChange={(e) => {
                    setEndValue(e.target.value);
                    setEndError("");
                  }}
                  aria-invalid={!!endError}
                  aria-describedby={endError ? "stale-err" : undefined}
                  style={{ ...field, colorScheme: "dark" }}
                />
              </div>
              <button
                type="button"
                className="tt-btn"
                data-primary="true"
                disabled={saving}
                style={{ ...actionBtn(true, saving), flex: "1 1 120px" }}
                onClick={saveEnd}
              >
                Save
              </button>
            </div>
            {endError && (
              <p id="stale-err" style={{ margin: "12px 0 0", fontSize: 14 }}>
                {endError}
              </p>
            )}
          </section>
        )}

        {/* Row 2 */}
        {/* Row 3 */}
        <section
          data-wf="b-2-0"
          aria-labelledby="hw-h"
          className="col-span-12 lg:col-span-4"
          style={panel}
        >
          <h2 id="hw-h" style={{ ...label, margin: 0 }}>
            Hours this week
          </h2>
          <p
            style={{
              ...serif,
              ...num,
              fontSize: 56,
              lineHeight: 1,
              margin: "16px 0 4px",
              color: C.accent,
              fontWeight: 700,
            }}
          >
            {fmtH(total)} <span style={{ fontSize: 24, color: C.muted, fontWeight: 400 }}>h</span>
          </p>
          {weekError ? (
            <div role="alert" style={{ marginTop: 16, fontSize: 14, color: C.muted }}>
              <p style={{ margin: "0 0 8px" }}>Could not load your weekly hours.</p>
              <button
                type="button"
                className="tt-btn"
                style={actionBtn(false, false)}
                onClick={loadWeek}
              >
                Try again
              </button>
            </div>
          ) : !week ? null : !week.has_entries ? (
            <div style={{ marginTop: 16, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
              Nothing recorded yet this week. Clock in below, or{" "}
              <button
                type="button"
                onClick={() => navigate("timesheet")}
                style={{
                  color: C.fg,
                  textDecoration: "underline",
                  background: "none",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                fill in the weekly timesheet
              </button>
              .
            </div>
          ) : (
            <>
              <div
                aria-hidden="true"
                style={{
                  display: "flex",
                  height: 4,
                  margin: "24px 0 16px",
                  backgroundColor: C.line,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  className="tt-bar"
                  style={{ width: `${(totalB / total) * 100}%`, backgroundColor: C.accent }}
                />
              </div>
              <dl style={{ margin: 0 }}>
                <div
                  data-wf="i-2-0-0"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  <dt style={{ fontSize: 15 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        backgroundColor: C.accent,
                        marginRight: 8,
                      }}
                    />
                    Billable
                  </dt>
                  <dd style={{ margin: 0, ...num, fontSize: 15 }}>{fmtH(totalB)} h</dd>
                </div>
                <div
                  data-wf="i-2-0-1"
                  style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}
                >
                  <dt style={{ fontSize: 15 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        border: `1px solid ${C.muted}`,
                        marginRight: 8,
                      }}
                    />
                    Non-billable
                  </dt>
                  <dd style={{ margin: 0, ...num, fontSize: 15 }}>{fmtH(totalN)} h</dd>
                </div>
              </dl>
            </>
          )}
        </section>

        <section
          data-wf="b-2-1"
          aria-labelledby="chart-h"
          className="col-span-12 lg:col-span-8"
          style={panel}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h2 id="chart-h" style={{ ...label, margin: 0 }}>
              Hours per day, Mon to Sun
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: C.muted, display: "flex", gap: 16 }}>
              <span>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    backgroundColor: C.accent,
                    marginRight: 6,
                  }}
                />
                Billable
              </span>
              <span>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    border: `1px solid ${C.muted}`,
                    marginRight: 6,
                  }}
                />
                Non-billable
              </span>
            </p>
          </div>
          <div style={{ position: "relative", marginTop: 24, height: 208 }}>
            {[4, 8].map((h) => (
              <div
                key={h}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 32 + ((h * 60) / maxDay) * 160,
                  borderTop: `1px ${h === 8 ? "dashed" : "solid"} ${C.line}`,
                  fontSize: 11,
                  color: C.muted,
                  ...num,
                }}
              >
                <span style={{ position: "absolute", right: 0, top: -16 }}>{h} h</span>
              </div>
            ))}
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 8,
                height: "100%",
                position: "relative",
              }}
            >
              {days.map((d, i) => {
                const tot = d.b + d.n;
                const runningDay = stale && i === 3;
                const hB = (d.b / maxDay) * 160;
                const hN = (d.n / maxDay) * 160;
                return (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <span className="sr-only">
                      {DAY_FULL[i]} {d.date}: {fmtH(tot)} hours, {fmtH(d.b)} billable, {fmtH(d.n)}{" "}
                      non-billable{runningDay ? ", entry still running" : ""}
                      {d.date === todayIso ? ", today" : ""}
                    </span>
                    <div
                      aria-hidden="true"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          ...num,
                          fontSize: 13,
                          marginBottom: 4,
                          color: tot ? C.fg : C.muted,
                        }}
                      >
                        {runningDay ? "running" : tot ? fmtH(tot) : "0.0"}
                      </span>
                      <div
                        style={{
                          width: "60%",
                          maxWidth: 40,
                          height: 160,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                      >
                        {runningDay ? (
                          <div
                            style={{
                              height: 48,
                              border: `1px dashed ${C.accent}`,
                              borderBottom: 0,
                            }}
                          />
                        ) : (
                          <>
                            <div
                              className="tt-bar"
                              style={{
                                height: hN,
                                border: d.n ? `1px solid ${C.muted}` : 0,
                                borderBottom: 0,
                                backgroundColor: "transparent",
                              }}
                            />
                            <div
                              className="tt-bar"
                              style={{ height: hB, backgroundColor: C.accent }}
                            />
                          </>
                        )}
                      </div>
                      <div style={{ width: "100%", borderTop: `1px solid ${C.muted}` }} />
                      <span
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: d.date === todayIso ? C.accent : C.muted,
                          fontWeight: d.date === todayIso ? 600 : 400,
                          borderBottom:
                            d.date === todayIso ? `1px solid ${C.accent}` : "1px solid transparent",
                        }}
                      >
                        {DAY_NAMES[i]}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {stale && (
            <p style={{ margin: "16px 0 0", fontSize: 13, color: C.muted }}>
              The running entry from {startLocal.toFormat("cccc")} is not counted until you set its
              end time.
            </p>
          )}
        </section>

        {/* Row 4 */}
        <form
          data-wf="b-3-0"
          aria-labelledby="clock-h"
          onSubmit={(e) => e.preventDefault()}
          className="col-span-12 lg:col-span-8"
          style={panel}
        >
          <h2 id="clock-h" style={{ ...serif, fontSize: 22, fontWeight: 700, margin: 0 }}>
            Clock{" "}
            <span
              style={{
                ...label,
                textTransform: "none",
                letterSpacing: "0.02em",
                fontSize: 13,
                fontFamily: brand.fontBody,
                fontWeight: 400,
              }}
            >
              (times shown in {tz})
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: 24 }}>
            <div>
              <Label
                htmlFor="clock-project"
                style={{ ...label, display: "block", marginBottom: 8 }}
              >
                Project
              </Label>
              <Select
                data-wf="i-3-0-0"
                id="clock-project"
                value={projectId}
                disabled={!!entry}
                onChange={(e) => changeProject(e.target.value)}
                style={field}
              >
                {projects.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted }}>
                {project ? project.client_name : ""}
              </p>
            </div>
            <div>
              <Label htmlFor="clock-task" style={{ ...label, display: "block", marginBottom: 8 }}>
                Task
              </Label>
              <Select
                data-wf="i-3-0-1"
                id="clock-task"
                value={taskId}
                disabled={!!entry}
                onChange={(e) => setTaskId(e.target.value)}
                style={field}
              >
                {(project ? project.tasks : []).map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label
                htmlFor="clock-billable"
                style={{ ...label, display: "block", marginBottom: 8 }}
              >
                Billable / Non-billable
              </Label>
              <Select
                data-wf="i-3-0-2"
                id="clock-billable"
                value={billable}
                disabled={!!entry}
                onChange={(e) => setBillable(e.target.value)}
                style={field}
              >
                <option value="billable">Billable</option>
                <option value="non-billable">Non-billable</option>
              </Select>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted }}>
                Project default: {project && project.default_billable ? "billable" : "non-billable"}
              </p>
            </div>
          </div>
          {clockError && (
            <p role="alert" style={{ margin: "16px 0 0", fontSize: 14 }}>
              {clockError}
            </p>
          )}
          {entry && (
            <p style={{ margin: "16px 0 0", fontSize: 13, color: C.muted }}>
              Choices are locked while an entry is running.
            </p>
          )}
        </form>

        <div
          data-wf="b-3-1"
          className="col-span-12 lg:col-span-4"
          style={{
            ...panel,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ ...label, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.Clock width={16} height={16} aria-hidden="true" /> Status
          </h2>
          <p role="status" style={{ ...serif, fontSize: 20, lineHeight: 1.4, margin: "16px 0 0" }}>
            Status: {statusLine}
          </p>
          {entry && !stale && (
            <p style={{ margin: "12px 0 0", fontSize: 14, color: C.muted, ...num }}>
              Worked so far: {fmtHM(Math.max(0, Math.round((now - msOf(entry.start_at)) / 60000)))}
            </p>
          )}
        </div>

        {/* Row 5 */}
        <button
          data-wf="b-4-0"
          type="button"
          className="tt-btn col-span-6 lg:col-span-3"
          data-primary={primaryAction === "in"}
          aria-disabled={!!entry}
          style={actionBtn(primaryAction === "in", !!entry)}
          onClick={clockIn}
        >
          Clock in
        </button>
        <button
          data-wf="b-4-1"
          type="button"
          className="tt-btn col-span-6 lg:col-span-3"
          data-primary="false"
          disabled={!entry || onBreak || stale}
          style={actionBtn(false, !entry || onBreak || stale)}
          onClick={startBreak}
        >
          Start break
        </button>
        <button
          data-wf="b-4-2"
          type="button"
          className="tt-btn col-span-6 lg:col-span-3"
          data-primary={primaryAction === "endbreak"}
          disabled={!onBreak}
          style={actionBtn(primaryAction === "endbreak", !onBreak)}
          onClick={endBreak}
        >
          End break
        </button>
        <button
          data-wf="b-4-3"
          type="button"
          className="tt-btn col-span-6 lg:col-span-3"
          data-primary={primaryAction === "out"}
          aria-disabled={!entry || stale}
          style={actionBtn(primaryAction === "out", !entry || stale)}
          onClick={clockOut}
        >
          Clock out
        </button>

        <div className="col-span-12" style={{ minHeight: 24, marginTop: -8 }}>
          {notice && (
            <p
              key={notice.at}
              role="status"
              className="tt-in"
              style={{
                margin: 0,
                fontSize: 14,
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                lineHeight: 1.5,
              }}
            >
              {notice.kind === "ok" ? (
                <Icons.CheckCircle
                  width={16}
                  height={16}
                  aria-hidden="true"
                  style={{ color: C.accent, flexShrink: 0, marginTop: 3 }}
                />
              ) : (
                <Icons.AlertCircle
                  width={16}
                  height={16}
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: 3 }}
                />
              )}
              <span>
                <strong style={{ fontWeight: 600 }}>
                  {notice.kind === "ok" ? "Done. " : "Not allowed. "}
                </strong>
                {notice.text}
              </span>
            </p>
          )}
        </div>

        {/* Row 6 */}
        <div className="col-span-12" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
          <button
            data-wf="b-5-0"
            type="button"
            className="tt-link"
            onClick={() => navigate("timesheet")}
            style={{
              background: "none",
              border: 0,
              color: C.fg,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              minHeight: 44,
              padding: 0,
            }}
          >
            <Icons.Calendar width={18} height={18} aria-hidden="true" style={{ color: C.accent }} />
            <span
              className="tt-ul"
              style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 2 }}
            >
              Open weekly timesheet
            </span>
            <Icons.ArrowRight width={16} height={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
