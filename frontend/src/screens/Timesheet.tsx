// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { DateTime } from "luxon";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CSS2 = `
.ts-navs{display:flex;gap:8px}
.ts-day .ts-note{text-align:center;overflow-wrap:anywhere}
.ts-retry{margin-top:8px;width:auto}
`;

const CSS = `
.ts-root{container-type:inline-size;display:grid;gap:24px;color:var(--ts-text);font-family:var(--ts-body);color-scheme:dark;font-size:14px;line-height:1.5}
.ts-root *{box-sizing:border-box}
.ts-root h1,.ts-root h2,.ts-root h3{margin:0;font-family:var(--ts-head);font-weight:400}
.ts-root p{margin:0}
.ts-eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ts-muted)}
.ts-top{display:grid;grid-template-columns:repeat(12,1fr);gap:16px;align-items:end}
.ts-c-title{grid-column:1/-1}
.ts-c-back{grid-column:span 6}
.ts-c-add{grid-column:span 6}
.ts-mid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px;align-items:start}
.ts-c-sum{grid-column:1/-1}
.ts-c-save{grid-column:1/-1}
@container (min-width:700px){
  .ts-c-title{grid-column:span 6}
  .ts-c-back{grid-column:span 2}
  .ts-c-add{grid-column:span 4}
  .ts-c-sum{grid-column:span 8}
  .ts-c-save{grid-column:span 4}
}
.ts-title{font-size:clamp(26px,5.2cqw,38px);line-height:1.15;letter-spacing:-.01em;color:var(--ts-text)}
.ts-rule{display:block;width:48px;height:1px;background:var(--ts-accent);margin-top:16px}
.ts-panel{background:var(--ts-surface);border:1px solid var(--ts-hair);border-radius:6px}
.ts-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:44px;padding:0 16px;border-radius:6px;border:1px solid var(--ts-hair);background:transparent;color:var(--ts-text);font:inherit;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background-color .15s,border-color .15s,transform .1s}
.ts-btn:hover{background:color-mix(in srgb,var(--ts-text) 8%,transparent);border-color:color-mix(in srgb,var(--ts-text) 28%,transparent)}
.ts-btn:active{transform:translateY(1px)}
.ts-btn:disabled{opacity:.6;cursor:progress}
.ts-btn-accent{border-color:var(--ts-accent);color:var(--ts-accent)}
.ts-btn-accent:hover{background:color-mix(in srgb,var(--ts-accent) 14%,transparent);border-color:var(--ts-accent)}
.ts-btn-primary{background:var(--ts-accent);border-color:var(--ts-accent);color:var(--ts-bg)}
.ts-btn-primary:hover{background:color-mix(in srgb,var(--ts-accent) 85%,white);border-color:color-mix(in srgb,var(--ts-accent) 85%,white)}
.ts-btn-danger{border-color:var(--ts-danger);color:var(--ts-danger);width:auto}
.ts-btn-danger:hover{background:color-mix(in srgb,var(--ts-danger) 14%,transparent);border-color:var(--ts-danger)}
.ts-btn-auto{width:auto}
.ts-root :is(button,input,select):focus-visible{outline:2px solid var(--ts-accent);outline-offset:2px}
.ts-field{width:100%;min-height:44px;padding:0 12px;background:var(--ts-field);color:var(--ts-text);border:1px solid var(--ts-hair);border-radius:6px;font:inherit;font-size:14px;transition:border-color .15s,background-color .15s}
.ts-field:hover{border-color:color-mix(in srgb,var(--ts-text) 28%,transparent)}
.ts-field[aria-invalid=true]{border-color:var(--ts-danger)}
.ts-field::placeholder{color:var(--ts-muted)}
.ts-field:disabled{opacity:.5;cursor:not-allowed}
.ts-hours{text-align:center;padding:0 4px;font-variant-numeric:tabular-nums}
.ts-sel+.ts-sel{margin-top:8px}
.ts-check{display:inline-flex;align-items:center;gap:8px;min-height:44px;cursor:pointer}
.ts-check input{width:18px;height:18px;margin:0;accent-color:var(--ts-accent);cursor:pointer}
.ts-src{display:inline-flex;align-items:center;gap:4px;margin-top:8px;padding:2px 8px;border:1px solid var(--ts-hair);border-radius:4px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted)}
.ts-src-clock{color:var(--ts-accent);border-color:color-mix(in srgb,var(--ts-accent) 45%,transparent)}
.ts-note{font-size:12px;color:var(--ts-muted);margin-top:4px}
.ts-ico{width:16px;height:16px;flex:none}
.ts-num{font-variant-numeric:tabular-nums}

/* narrow: each entry is a stacked card */
.ts-table{display:block;position:relative;width:100%;border-collapse:collapse}
.ts-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ts-table tbody{display:block}
.ts-table tr.ts-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px 8px;padding:16px;border-top:1px solid var(--ts-hair);animation:ts-in .5s ease-out}
.ts-table td{display:block;padding:0;min-width:0}
.ts-proj,.ts-bill{grid-column:1/-1}
.ts-total{grid-column:span 3;align-self:center}
.ts-del{grid-column:span 1;justify-self:end}
.ts-daylabel{display:block;margin-bottom:4px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ts-muted);text-align:center}
.ts-narrow-only{display:inline}
.ts-wide-only{display:none}
.ts-totalfig{font-family:var(--ts-head);font-size:20px;font-variant-numeric:tabular-nums}
.ts-delbtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;min-width:44px;padding:0 12px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--ts-muted);font:inherit;font-size:14px;cursor:pointer;transition:color .15s,background-color .15s,border-color .15s}
.ts-delbtn:hover{color:var(--ts-danger);border-color:color-mix(in srgb,var(--ts-danger) 50%,transparent);background:color-mix(in srgb,var(--ts-danger) 10%,transparent)}
.ts-table tr.ts-confirm{display:block;padding:16px;background:color-mix(in srgb,var(--ts-danger) 8%,transparent);border-top:1px solid color-mix(in srgb,var(--ts-danger) 40%,transparent)}
.ts-confirm-body{display:flex;flex-wrap:wrap;gap:12px 16px;align-items:center;justify-content:space-between}
.ts-confirm-actions{display:flex;gap:8px;flex-wrap:wrap}
.ts-th{padding:12px 8px;font-size:12px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:var(--ts-muted);text-align:center;border-bottom:1px solid var(--ts-hair)}
.ts-th-first{text-align:left;padding-left:16px}
.ts-th small{display:block;font-size:12px;letter-spacing:.02em;text-transform:none;color:var(--ts-muted);font-variant-numeric:tabular-nums}
.ts-today{display:block;font-size:12px;letter-spacing:.1em;color:var(--ts-accent)}
.ts-empty{padding:48px 24px;text-align:center;border-top:1px solid var(--ts-hair);display:grid;justify-items:center;gap:12px}
.ts-empty h3{font-size:22px}
.ts-empty p{max-width:52ch;color:var(--ts-muted)}
.ts-alert{display:flex;gap:12px;margin-top:16px;padding:12px 16px;border:1px solid var(--ts-danger);border-radius:6px;background:color-mix(in srgb,var(--ts-danger) 8%,transparent)}
.ts-alert ul{margin:8px 0 0;padding-left:16px}
.ts-alert:focus-visible{outline:2px solid var(--ts-accent);outline-offset:2px}
.ts-link{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0;border:0;background:none;color:var(--ts-accent);font:inherit;font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:4px;text-decoration-color:color-mix(in srgb,var(--ts-accent) 40%,transparent)}
.ts-link:hover{text-decoration-color:var(--ts-accent)}
@keyframes ts-in{from{background:color-mix(in srgb,var(--ts-accent) 14%,transparent)}to{background:transparent}}

@container (min-width:560px){
  .ts-table tr.ts-row{grid-template-columns:repeat(7,1fr)}
  .ts-total{grid-column:span 5}
  .ts-del{grid-column:span 2}
}
/* wide: a true ledger table */
@container (min-width:900px){
  .ts-table{display:table}
  .ts-table thead{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal;display:table-header-group}
  .ts-table tbody{display:table-row-group}
  .ts-table tr{display:table-row}
  .ts-table tr.ts-row{padding:0;border:0;gap:0}
  .ts-table th,.ts-table td{display:table-cell}
  .ts-table td{padding:16px 6px;vertical-align:middle;border-top:1px solid var(--ts-hair)}
  .ts-table td.ts-proj{padding-left:16px;padding-right:12px;min-width:260px}
  .ts-table td.ts-bill{width:128px}
  .ts-table td.ts-day{width:68px}
  .ts-table td.ts-total{width:80px;text-align:center}
  .ts-table td.ts-del{width:64px;text-align:center}
  .ts-hours{max-width:64px;min-height:40px;display:block;margin:0 auto}
  .ts-daylabel,.ts-narrow-only{display:none}
  .ts-wide-only{display:inline}
  .ts-table tr.ts-confirm{display:table-row;padding:0}
  .ts-table tr.ts-confirm td{padding:16px}
  .ts-delbtn{padding:0}
}
@media (prefers-reduced-motion:reduce){.ts-root *{animation:none!important;transition:none!important}}
`;

function parseHours(v) {
  const s = String(v).trim().replace(",", ".");
  if (s === "") return { ok: true, n: 0 };
  if (!/^-?\d*\.?\d+$/.test(s))
    return { ok: false, n: 0, msg: "enter hours as a number, like 7.5." };
  const n = Number(s);
  if (n < 0) return { ok: false, n: 0, msg: "hours can't be negative." };
  if (n > 24) return { ok: false, n: 0, msg: "a day can't have more than 24 hours." };
  return { ok: true, n };
}
const toMinutes = (h) => Math.round(parseHours(h).n * 60);
const toHours = (m) => (m ? String(Number((m / 60).toFixed(4))) : "");
const fmt = (min) => (min === 0 ? "0" : (min / 60).toFixed(1));

const rowsFrom = (week) =>
  week.rows.map((r) => ({
    key: `s${r.project_id}-${r.task_id}-${r.billable}`,
    saved: true,
    project: String(r.project_id),
    task: String(r.task_id),
    projectName: r.project_name,
    taskName: r.task_name,
    billable: r.billable,
    origBillable: r.billable,
    touched: true,
    hours: r.days.map((d) => toHours(d.manual_minutes)),
    orig: r.days.map((d) => d.manual_minutes),
    clocked: r.days.map((d) => d.clocked_minutes),
    entryIds: r.days.flatMap((d) => [d.manual_entry_id, ...d.clocked_entry_ids]).filter(Boolean),
  }));

const detailText = (err) => {
  const d = err instanceof ApiError ? err.body?.detail : null;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]?.msg) return d[0].msg;
  return "";
};

export default function Screen() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const tz = user?.time_zone || "UTC";
  const [offset, setOffset] = React.useState(0);
  const now = DateTime.now().setZone(tz);
  const start = now.startOf("week").plus({ weeks: offset });
  const weekStart = start.toISODate();
  const dates = DAYS.map((_, i) => start.plus({ days: i }));
  const todayIso = now.toISODate();

  const [catalog, setCatalog] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [serverWeek, setServerWeek] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [focusKey, setFocusKey] = React.useState(null);
  const counter = React.useRef(1);
  const alertRef = React.useRef(null);
  const loadId = React.useRef(0);

  const guard = (err) => {
    if (err instanceof ApiError && err.status === 401) {
      navigate("/sign-in");
      return true;
    }
    return false;
  };

  const load = React.useCallback(() => {
    const id = ++loadId.current;
    setLoading(true);
    setLoadError(false);
    setErrors([]);
    setNotice("");
    Promise.all([apiFetch("/api/projects"), apiFetch(`/api/timesheets/${weekStart}`)])
      .then(([cat, week]) => {
        if (id !== loadId.current) return;
        if (!Array.isArray(cat) || !week || !Array.isArray(week.rows))
          throw new Error("Unexpected response");
        setCatalog(cat);
        setServerWeek(week);
        setRows(rowsFrom(week));
      })
      .catch((err) => {
        if (id === loadId.current && !guard(err)) setLoadError(true);
      })
      .finally(() => {
        if (id === loadId.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  React.useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  React.useEffect(() => {
    if (focusKey) {
      const el = document.getElementById("proj-" + focusKey);
      if (el) el.focus();
      setFocusKey(null);
    }
  }, [focusKey]);

  React.useEffect(() => {
    if (errors.length && alertRef.current) alertRef.current.focus();
  }, [errors]);

  const findProject = (id) => catalog.find((p) => String(p.id) === String(id));
  const rowLabel = (r, ri) =>
    r.projectName ? `${r.projectName} / ${r.taskName || "no task"}` : `Row ${ri + 1}`;

  const dayTotals = DAYS.map((_, i) =>
    rows.reduce((s, r) => s + toMinutes(r.hours[i]) + r.clocked[i], 0),
  );
  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);
  const rowTotal = (r) =>
    r.hours.reduce((s, h) => s + toMinutes(h), 0) + r.clocked.reduce((a, b) => a + b, 0);
  const invalid = (key) => errors.some((e) => e.key === key);

  const patchRow = (key, patch, clearKeys) => {
    setRows((l) => l.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    if (clearKeys) setErrors((e) => e.filter((x) => !clearKeys.includes(x.key)));
    setNotice("");
  };
  const setHour = (r, i, val) => {
    const hours = r.hours.slice();
    hours[i] = val;
    patchRow(r.key, { hours }, [`${r.key}:${i}`]);
  };
  const changeProject = (r, pid) => {
    const p = findProject(pid);
    const first = p ? p.tasks[0] : null;
    patchRow(
      r.key,
      {
        project: pid,
        projectName: p ? p.name : "",
        task: first ? String(first.id) : "",
        taskName: first ? first.name : "",
        billable: r.touched ? r.billable : p ? p.default_billable !== false : true,
      },
      [`${r.key}:proj`],
    );
  };
  const changeTask = (r, tid) => {
    const p = findProject(r.project);
    const t = p ? p.tasks.find((x) => String(x.id) === tid) : null;
    patchRow(r.key, { task: tid, taskName: t ? t.name : "" }, [`${r.key}:proj`]);
  };
  const addRow = () => {
    const key = "n" + counter.current++;
    setRows((l) => [
      ...l,
      {
        key,
        saved: false,
        project: "",
        task: "",
        projectName: "",
        taskName: "",
        billable: true,
        touched: false,
        hours: ["", "", "", "", "", "", ""],
        orig: [0, 0, 0, 0, 0, 0, 0],
        clocked: [0, 0, 0, 0, 0, 0, 0],
        entryIds: [],
      },
    ]);
    setNotice("");
    setFocusKey(key);
  };
  const removeRow = (key) => {
    setRows((l) => l.filter((r) => r.key !== key));
    setErrors((e) => e.filter((x) => !x.key.startsWith(key + ":")));
    setNotice("Row removed. Totals updated.");
    const add = document.getElementById("ts-add");
    if (add) add.focus();
  };

  const onSave = async () => {
    const errs = [];
    rows.forEach((r, ri) => {
      const label = rowLabel(r, ri);
      if (!r.project || !r.task)
        errs.push({ key: `${r.key}:proj`, msg: `Row ${ri + 1}: choose a project and a task.` });
      r.hours.forEach((h, i) => {
        const p = parseHours(h);
        if (!p.ok) errs.push({ key: `${r.key}:${i}`, msg: `${label}, ${DAYS[i]}: ${p.msg}` });
      });
    });
    DAYS.forEach((d, i) => {
      if (dayTotals[i] > 1440)
        errs.push({
          key: `day:${i}`,
          msg: `${d}: the day adds up to more than 24 hours, including clocked time.`,
        });
    });
    setNotice("");
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);

    const cells = [];
    const meta = [];
    rows.forEach((r, ri) => {
      r.hours.forEach((h, i) => {
        const minutes = toMinutes(h);
        if (minutes === r.orig[i]) return;
        cells.push({
          project_id: Number(r.project),
          task_id: Number(r.task),
          billable: r.saved ? r.origBillable : r.billable,
          date: dates[i].toISODate(),
          minutes,
        });
        meta.push({ key: r.key, day: i, ri });
      });
    });

    setSaving(true);
    try {
      let week = serverWeek;
      if (cells.length)
        week = await apiFetch("/api/timesheets/cells", {
          method: "PUT",
          body: JSON.stringify({ week_start: weekStart, cells }),
        });
      let patched = false;
      for (const r of rows) {
        if (!r.saved || r.billable === r.origBillable) continue;
        const sr = week.rows.find(
          (x) =>
            String(x.project_id) === r.project &&
            String(x.task_id) === r.task &&
            x.billable === r.origBillable,
        );
        const ids = sr
          ? sr.days.flatMap((d) => [d.manual_entry_id, ...d.clocked_entry_ids]).filter(Boolean)
          : [];
        for (const id of ids) {
          await apiFetch(`/api/time-entries/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ billable: r.billable }),
          });
          patched = true;
        }
      }
      if (patched) week = await apiFetch(`/api/timesheets/${weekStart}`);
      const keep = rows.filter((r) => !r.saved && r.hours.every((h) => h.trim() === ""));
      setServerWeek(week);
      setRows([...rowsFrom(week), ...keep]);
      setNotice(
        `Timesheet saved. Totals are up to date · ${DateTime.now().setZone(tz).toFormat("d LLL HH:mm")} ${tz}`,
      );
    } catch (err) {
      if (guard(err)) return;
      const d = err instanceof ApiError ? err.body?.detail : null;
      const out = [];
      if (err instanceof ApiError && err.status === 422 && Array.isArray(d)) {
        for (const x of d) {
          const loc = x.loc || [];
          const m = loc[1] === "cells" ? meta[loc[2]] : null;
          if (m) {
            const field = loc[3];
            const label = rowLabel(rows[m.ri], m.ri);
            const isCell = field === "minutes" || field === "date";
            out.push({
              key: isCell ? `${m.key}:${m.day}` : `${m.key}:proj`,
              msg: `${label}, ${DAYS[m.day]}: ${x.msg}`,
            });
          } else out.push({ key: `save:${out.length}`, msg: x.msg });
        }
      } else
        out.push({
          key: "save",
          msg: detailText(err) || "Could not save the timesheet. Try again.",
        });
      setErrors(out);
    } finally {
      setSaving(false);
    }
  };

  const rootStyle = {
    "--ts-bg": brand.backgroundColor,
    "--ts-surface": `color-mix(in srgb, ${brand.primaryColor} 5%, ${brand.backgroundColor})`,
    "--ts-field": `color-mix(in srgb, black 18%, ${brand.backgroundColor})`,
    "--ts-hair": `color-mix(in srgb, ${brand.primaryColor} 12%, transparent)`,
    "--ts-text": brand.primaryColor,
    "--ts-muted": brand.neutralColor,
    "--ts-accent": brand.accentColor,
    "--ts-danger": "hsl(6 62% 72%)",
    "--ts-head": brand.fontHeading,
    "--ts-body": brand.fontBody,
    paddingBottom: 32,
  };

  const clients = [...new Set(catalog.map((p) => p.client_name))];
  const projectOptions = clients.map((c) => (
    <optgroup key={c} label={c}>
      {catalog
        .filter((p) => p.client_name === c)
        .map((p) => (
          <option key={p.id} value={String(p.id)}>
            {p.name}
          </option>
        ))}
    </optgroup>
  ));

  const title = `Timesheet: ${dates[0].toFormat("d LLL")} – ${dates[6].toFormat("d LLL yyyy")}`;
  const onWeek = (n) => {
    setOffset((o) => o + n);
  };

  if (loading || loadError) {
    return (
      <div className="ts-root" style={rootStyle}>
        <style>{CSS}</style>
        <style>{CSS2}</style>
        {loadError ? (
          <div className="ts-alert" role="alert">
            <div>
              <p>Could not load the timesheet.</p>
              <button type="button" className="ts-btn ts-btn-auto ts-retry" onClick={load}>
                Try again
              </button>
            </div>
          </div>
        ) : (
          <p role="status">Loading timesheet…</p>
        )}
      </div>
    );
  }

  return (
    <div className="ts-root" style={rootStyle}>
      <style>{CSS}</style>
      <style>{CSS2}</style>

      <div className="ts-top">
        <div className="ts-c-title" data-wf="b-0-0">
          <p className="ts-eyebrow" style={{ marginBottom: 12 }}>
            Monday to Sunday · {tz}
          </p>
          <h1 className="ts-title">{title}</h1>
          <span className="ts-rule" aria-hidden="true" />
        </div>
        <div className="ts-c-back">
          <div className="ts-navs">
            <button
              type="button"
              className="ts-btn"
              data-wf="b-0-1"
              onClick={() => onWeek(-1)}
              aria-label="Previous week"
            >
              <Icons.ChevronLeft className="ts-ico" aria-hidden="true" />
              Prev
            </button>
            <button
              type="button"
              className="ts-btn"
              onClick={() => onWeek(1)}
              aria-label="Next week"
            >
              Next
              <Icons.ChevronRight className="ts-ico" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="ts-c-add">
          <button
            type="button"
            id="ts-add"
            className="ts-btn ts-btn-accent"
            data-wf="b-0-2"
            onClick={addRow}
          >
            <Icons.Plus className="ts-ico" aria-hidden="true" /> Add row
          </button>
        </div>
      </div>

      <section className="ts-panel" data-wf="b-1-0" aria-labelledby="ts-week-hours">
        <div
          style={{
            padding: "16px 16px 12px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "baseline",
          }}
        >
          <h2
            id="ts-week-hours"
            className="ts-eyebrow"
            style={{ fontFamily: "var(--ts-body)", fontSize: 12 }}
          >
            Week hours
          </h2>
          <p className="ts-note" style={{ margin: 0 }}>
            Dates and clocked entries are shown in {tz} time and stored in UTC.
          </p>
        </div>
        <table className="ts-table">
          <thead>
            <tr>
              <th scope="col" className="ts-th ts-th-first" data-wf="i-1-0-0">
                Project / Task
              </th>
              <th scope="col" className="ts-th" data-wf="i-1-0-1">
                Billable
              </th>
              {DAYS.map((d, i) => (
                <th key={d} scope="col" className="ts-th">
                  {d}
                  <small>{dates[i].toFormat("d LLL")}</small>
                  {dates[i].toISODate() === todayIso ? (
                    <span className="ts-today">Today</span>
                  ) : null}
                </th>
              ))}
              <th scope="col" className="ts-th" data-wf="i-1-0-9">
                Total
              </th>
              <th scope="col" className="ts-th" data-wf="i-1-0-10">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const p = findProject(r.project);
              const label = rowLabel(r, ri);
              const hasClock = r.clocked.some((m) => m > 0);
              return (
                <tr className="ts-row" key={r.key}>
                  <td className="ts-proj">
                    <div className="ts-sel">
                      <label htmlFor={`proj-${r.key}`} className="sr-only">
                        Project for {label}
                      </label>
                      <select
                        id={`proj-${r.key}`}
                        className="ts-field"
                        value={r.project}
                        disabled={r.saved}
                        aria-invalid={invalid(`${r.key}:proj`) ? "true" : undefined}
                        onChange={(e) => changeProject(r, e.target.value)}
                      >
                        {r.saved ? (
                          <option value={r.project}>{r.projectName}</option>
                        ) : (
                          <>
                            <option value="">Choose a project</option>
                            {projectOptions}
                          </>
                        )}
                      </select>
                    </div>
                    <div className="ts-sel">
                      <label htmlFor={`task-${r.key}`} className="sr-only">
                        Task for {label}
                      </label>
                      <select
                        id={`task-${r.key}`}
                        className="ts-field"
                        value={r.task}
                        disabled={r.saved || !p}
                        aria-invalid={invalid(`${r.key}:proj`) ? "true" : undefined}
                        onChange={(e) => changeTask(r, e.target.value)}
                      >
                        {r.saved ? (
                          <option value={r.task}>{r.taskName}</option>
                        ) : (
                          <>
                            <option value="">
                              {p ? "Choose a task" : "Choose a project first"}
                            </option>
                            {(p ? p.tasks : []).map((t) => (
                              <option key={t.id} value={String(t.id)}>
                                {t.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                    {hasClock ? (
                      <span className="ts-src ts-src-clock">
                        <Icons.Clock
                          className="ts-ico"
                          aria-hidden="true"
                          style={{ width: 12, height: 12 }}
                        />{" "}
                        Clocked
                      </span>
                    ) : (
                      <span className="ts-src">
                        <Icons.Edit
                          className="ts-ico"
                          aria-hidden="true"
                          style={{ width: 12, height: 12 }}
                        />{" "}
                        {r.saved ? "Entered by hand" : "New row"}
                      </span>
                    )}
                  </td>
                  <td className="ts-bill">
                    <label className="ts-check" htmlFor={`bill-${r.key}`}>
                      <input
                        id={`bill-${r.key}`}
                        type="checkbox"
                        checked={r.billable}
                        onChange={(e) =>
                          patchRow(r.key, { billable: e.target.checked, touched: true })
                        }
                      />
                      <span>{r.billable ? "Billable" : "Non-billable"}</span>
                      <span className="sr-only"> for {label}</span>
                    </label>
                  </td>
                  {DAYS.map((d, i) => (
                    <td key={d} className="ts-day">
                      <span className="ts-daylabel" aria-hidden="true">
                        {d}
                      </span>
                      <label htmlFor={`h-${r.key}-${i}`} className="sr-only">
                        Hours on {d} {dates[i].toFormat("d LLL")} for {label}
                      </label>
                      <input
                        id={`h-${r.key}-${i}`}
                        className="ts-field ts-hours"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="–"
                        value={r.hours[i]}
                        aria-invalid={invalid(`${r.key}:${i}`) ? "true" : undefined}
                        aria-describedby={`hint-${r.key}-${i}`}
                        onChange={(e) => setHour(r, i, e.target.value)}
                      />
                      <span id={`hint-${r.key}-${i}`} className="sr-only">
                        {invalid(`${r.key}:${i}`)
                          ? "Invalid hours. Use a number from 0 to 24."
                          : "Hours from 0 to 24."}
                      </span>
                      {r.clocked[i] > 0 ? (
                        <span className="ts-note">+ {fmt(r.clocked[i])} h clocked</span>
                      ) : null}
                    </td>
                  ))}
                  <td className="ts-total">
                    <span className="ts-narrow-only ts-eyebrow" style={{ marginRight: 8 }}>
                      Row total
                    </span>
                    <span className="ts-totalfig">{fmt(rowTotal(r))}</span>
                    <span className="ts-narrow-only ts-num" style={{ color: "var(--ts-muted)" }}>
                      {" "}
                      h
                    </span>
                  </td>
                  <td className="ts-del">
                    {r.saved ? null : (
                      <button
                        type="button"
                        className="ts-delbtn"
                        aria-label={`Remove ${label}`}
                        title="Remove this row"
                        onClick={() => removeRow(r.key)}
                      >
                        <Icons.X className="ts-ico" aria-hidden="true" />
                        <span className="ts-narrow-only">Remove</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <div className="ts-empty">
            <span style={{ color: "var(--ts-accent)" }}>
              <Icons.Calendar
                className="ts-ico"
                aria-hidden="true"
                style={{ width: 28, height: 28 }}
              />
            </span>
            <h3>No hours on this week yet</h3>
            <p>
              Add a row to charge time to a project and task, or clock in from Home. Clocked entries
              land on their day by themselves.
            </p>
            <button type="button" className="ts-btn ts-btn-accent ts-btn-auto" onClick={addRow}>
              <Icons.Plus className="ts-ico" aria-hidden="true" /> Add row
            </button>
          </div>
        ) : null}
      </section>

      <div className="ts-mid">
        <div className="ts-c-sum" data-wf="b-2-0">
          <p className="ts-num" style={{ fontSize: 15, lineHeight: 1.7 }}>
            Daily totals: {dayTotals.map(fmt).join(" · ")}. Week total:{" "}
            <strong
              style={{
                fontFamily: "var(--ts-head)",
                fontWeight: 400,
                fontSize: 22,
                color: "var(--ts-accent)",
              }}
            >
              {fmt(weekTotal)} h
            </strong>
            . Clocked entries appear on their day.
          </p>
          {errors.length ? (
            <div className="ts-alert" role="alert" tabIndex={-1} ref={alertRef}>
              <Icons.AlertCircle
                className="ts-ico"
                aria-hidden="true"
                style={{ color: "var(--ts-danger)", marginTop: 4 }}
              />
              <div>
                <strong>Timesheet not saved.</strong> Nothing you typed has been lost. Fix{" "}
                {errors.length === 1 ? "this" : `these ${errors.length}`} and save again:
                <ul>
                  {errors.map((e) => (
                    <li key={e.key + e.msg}>{e.msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        <div className="ts-c-save">
          <button
            type="button"
            className="ts-btn ts-btn-primary"
            data-wf="b-2-1"
            onClick={onSave}
            disabled={saving}
          >
            <Icons.Check className="ts-ico" aria-hidden="true" />{" "}
            {saving ? "Saving…" : "Save timesheet"}
          </button>
          <p role="status" className="ts-note" style={{ marginTop: 12, fontSize: 13 }}>
            {notice}
          </p>
        </div>
      </div>

      <div data-wf="b-3-0">
        <button type="button" className="ts-link" onClick={() => navigate("home")}>
          <Icons.ArrowLeft className="ts-ico" aria-hidden="true" /> Back to home and clock
        </button>
      </div>
    </div>
  );
}
