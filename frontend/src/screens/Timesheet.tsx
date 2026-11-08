// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Home } = Icons;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_MS = 86400000;
const WEEK_START = { cur: Date.UTC(2026, 10, 2), prev: Date.UTC(2026, 9, 26) };
const TODAY = Date.UTC(2026, 10, 7);

const CATALOG = [
  {
    id: 'c1', name: 'Northwind Logistics', archived: false,
    projects: [{
      id: 'p1', name: 'Route optimisation', defaultBillable: true, archived: false,
      tasks: [
        { id: 't1', name: 'Analysis', archived: false },
        { id: 't2', name: 'Development', archived: false },
        { id: 't3', name: 'Stakeholder reporting', archived: false },
        { id: 't4', name: 'Legacy import', archived: true },
      ],
    }],
  },
  {
    id: 'c2', name: 'Harbourline Studio', archived: false,
    projects: [{
      id: 'p2', name: 'Brand site rebuild', defaultBillable: true, archived: false,
      tasks: [
        { id: 't5', name: 'Design review', archived: false },
        { id: 't6', name: 'Front-end build', archived: false },
        { id: 't7', name: 'Content migration', archived: false },
      ],
    }],
  },
  {
    id: 'c3', name: 'Internal', archived: false,
    projects: [{
      id: 'p3', name: 'Team operations', defaultBillable: false, archived: false,
      tasks: [
        { id: 't8', name: 'Admin & planning', archived: false },
        { id: 't9', name: 'Training', archived: false },
        { id: 't10', name: 'Recruiting support', archived: false },
      ],
    }],
  },
];

const INIT_CUR = [
  { id: 'e1', project: 'p1', task: 't1', billable: true, source: 'manual', note: '', fresh: false, hours: ['3', '3.5', '4', '', '', '', ''] },
  { id: 'e2', project: 'p1', task: 't2', billable: true, source: 'clock', note: 'Mon–Thu · latest Thu 09:04–12:04 GMT', fresh: false, hours: ['4', '4', '3', '3', '', '', ''] },
  { id: 'e3', project: 'p3', task: 't8', billable: false, source: 'manual', note: '', fresh: false, hours: ['1', '', '1', '', '', '', ''] },
];
const INIT_PREV = [
  { id: 'e4', project: 'p1', task: 't2', billable: true, source: 'clock', note: 'Mon–Fri · latest Fri 08:58–14:58 GMT, 30 min break', fresh: false, hours: ['6', '6.5', '7', '6', '5.5', '', ''] },
  { id: 'e5', project: 'p2', task: 't5', billable: true, source: 'manual', note: '', fresh: false, hours: ['2', '1.5', '1', '2', '1.5', '', ''] },
  { id: 'e6', project: 'p3', task: 't9', billable: false, source: 'manual', note: '', fresh: false, hours: ['', '', '', '', '1', '', ''] },
];

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
  const s = String(v).trim().replace(',', '.');
  if (s === '') return { ok: true, n: 0 };
  if (!/^-?\d*\.?\d+$/.test(s)) return { ok: false, n: 0, msg: 'enter hours as a number, like 7.5.' };
  const n = Number(s);
  if (n < 0) return { ok: false, n: 0, msg: "hours can't be negative." };
  if (n > 24) return { ok: false, n: 0, msg: "a day can't have more than 24 hours." };
  return { ok: true, n };
}
const fmt = (n) => (n === 0 ? '0' : n.toFixed(1));
const findProject = (id) => {
  for (const c of CATALOG) for (const p of c.projects) if (p.id === id) return { client: c, project: p };
  return null;
};
const rowLabel = (r) => {
  const f = findProject(r.project);
  if (!f) return '';
  const t = f.project.tasks.find((x) => x.id === r.task);
  return `${f.project.name}${t ? ' / ' + t.name : ''}`;
};
const dayText = (ms) => {
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

export default function Screen() {
  const navigate = useNavigate();
  const [weekKey, setWeekKey] = React.useState('cur');
  const [weeks, setWeeks] = React.useState({ cur: INIT_CUR, prev: INIT_PREV });
  const [saved, setSaved] = React.useState({ cur: INIT_CUR, prev: INIT_PREV });
  const [errors, setErrors] = React.useState([]);
  const [confirmId, setConfirmId] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [focusId, setFocusId] = React.useState(null);
  const counter = React.useRef(1);
  const alertRef = React.useRef(null);

  const rows = weeks[weekKey];
  const start = WEEK_START[weekKey];
  const dates = DAYS.map((_, i) => start + i * DAY_MS);
  const endYear = new Date(dates[6]).getUTCFullYear();
  const title = `Timesheet: ${dayText(dates[0])} – ${dayText(dates[6])} ${endYear}`;

  const dayTotals = DAYS.map((_, i) => rows.reduce((s, r) => s + parseHours(r.hours[i]).n, 0));
  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);
  const rowTotal = (r) => r.hours.reduce((s, h) => s + parseHours(h).n, 0);
  const dirty = JSON.stringify(rows) !== JSON.stringify(saved[weekKey]);
  const invalid = (key) => errors.some((e) => e.key === key);

  React.useEffect(() => {
    if (!saving) return undefined;
    const t = setTimeout(() => {
      const clean = rows.map((r) => ({ ...r, fresh: false }));
      setWeeks((w) => ({ ...w, [weekKey]: clean }));
      setSaved((s) => ({ ...s, [weekKey]: clean }));
      setSavedAt(
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date())
      );
      setNotice('Timesheet saved. Totals are up to date.');
      setSaving(false);
    }, 600);
    return () => clearTimeout(t);
  }, [saving]);

  React.useEffect(() => {
    if (focusId) {
      const el = document.getElementById('proj-' + focusId);
      if (el) el.focus();
      setFocusId(null);
    }
  }, [focusId]);

  React.useEffect(() => {
    if (errors.length && alertRef.current) alertRef.current.focus();
  }, [errors]);

  const patchRow = (id, patch, clearKeys) => {
    setWeeks((w) => ({ ...w, [weekKey]: w[weekKey].map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
    if (clearKeys) setErrors((e) => e.filter((x) => !clearKeys.includes(x.key)));
    setNotice('');
  };
  const setHour = (r, i, val) => {
    const hours = r.hours.slice();
    hours[i] = val;
    patchRow(r.id, { hours }, [`${r.id}:${i}`]);
  };
  const changeProject = (r, pid) => {
    const f = findProject(pid);
    const first = f ? f.project.tasks.find((t) => !t.archived) : null;
    patchRow(
      r.id,
      { project: pid, task: first ? first.id : '', billable: f && r.fresh ? f.project.defaultBillable : r.billable },
      [`${r.id}:proj`]
    );
  };
  const addRow = () => {
    const id = 'n' + counter.current++;
    const row = { id, project: '', task: '', billable: true, source: 'manual', note: '', fresh: true, hours: ['', '', '', '', '', '', ''] };
    setWeeks((w) => ({ ...w, [weekKey]: [...w[weekKey], row] }));
    setNotice('');
    setFocusId(id);
  };
  const deleteRow = (id) => {
    setWeeks((w) => ({ ...w, [weekKey]: w[weekKey].filter((r) => r.id !== id) }));
    setErrors((e) => e.filter((x) => !x.key.startsWith(id + ':')));
    setConfirmId(null);
    setNotice('Entry removed from this week. Totals updated.');
    const add = document.getElementById('ts-add');
    if (add) add.focus();
  };
  const switchWeek = () => {
    setWeekKey(weekKey === 'cur' ? 'prev' : 'cur');
    setErrors([]);
    setConfirmId(null);
    setNotice('');
  };
  const onSave = () => {
    const errs = [];
    rows.forEach((r, ri) => {
      const label = rowLabel(r) || `Row ${ri + 1}`;
      if (!r.project || !r.task) errs.push({ key: `${r.id}:proj`, msg: `Row ${ri + 1}: choose a project and a task.` });
      r.hours.forEach((h, i) => {
        const p = parseHours(h);
        if (!p.ok) errs.push({ key: `${r.id}:${i}`, msg: `${label}, ${DAYS[i]}: ${p.msg}` });
      });
    });
    DAYS.forEach((d, i) => {
      if (dayTotals[i] > 24) errs.push({ key: `day:${i}`, msg: `${d}: the day adds up to more than 24 hours.` });
    });
    if (errs.length) {
      setErrors(errs);
      setNotice('');
      return;
    }
    setErrors([]);
    setNotice('');
    setSaving(true);
  };

  const rootStyle = {
    '--ts-bg': brand.backgroundColor,
    '--ts-surface': `color-mix(in srgb, ${brand.primaryColor} 5%, ${brand.backgroundColor})`,
    '--ts-field': `color-mix(in srgb, black 18%, ${brand.backgroundColor})`,
    '--ts-hair': `color-mix(in srgb, ${brand.primaryColor} 12%, transparent)`,
    '--ts-text': brand.primaryColor,
    '--ts-muted': brand.neutralColor,
    '--ts-accent': brand.accentColor,
    '--ts-danger': 'hsl(6 62% 72%)',
    '--ts-head': brand.fontHeading,
    '--ts-body': brand.fontBody,
    paddingBottom: 32,
  };

  const projectOptions = CATALOG.filter((c) => !c.archived).map((c) => (
    <optgroup key={c.id} label={c.name}>
      {c.projects.filter((p) => !p.archived).map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </optgroup>
  ));
  const taskOptions = (r) => {
    const f = findProject(r.project);
    if (!f) return [];
    return f.project.tasks
      .filter((t) => !t.archived || t.id === r.task)
      .map((t) => <option key={t.id} value={t.id}>{t.name}{t.archived ? ' (archived)' : ''}</option>);
  };

  const statusNode = saving ? (
    <span className="inline-flex items-center gap-2"><Icons.Clock className="ts-ico" aria-hidden="true" /> Saving timesheet…</span>
  ) : dirty ? (
    <span className="inline-flex items-center gap-2"><Icons.Edit className="ts-ico" aria-hidden="true" /> Unsaved changes</span>
  ) : (
    <span className="inline-flex items-center gap-2" style={{ color: brand.accentColor }}>
      <Icons.CheckCircle className="ts-ico" aria-hidden="true" /> All changes saved{savedAt ? ` · ${savedAt} GMT` : ''}
    </span>
  );

  return (
    <div className="ts-root" style={rootStyle}>
      <style>{CSS}</style>

      <div className="ts-top">
        <div className="ts-c-title" data-wf="b-0-0">
          <p className="ts-eyebrow" style={{ marginBottom: 12 }}>Monday to Sunday · Europe/London</p>
          <h1 className="ts-title">{title}</h1>
          <span className="ts-rule" aria-hidden="true" />
        </div>
        <div className="ts-c-back">
          <button
            type="button"
            className="ts-btn"
            data-wf="b-0-1"
            onClick={switchWeek}
            aria-label={weekKey === 'cur' ? 'Go to last week, 26 Oct to 1 Nov' : 'Go to this week, 2 Nov to 8 Nov'}
          >
            {weekKey === 'cur' ? <Icons.ChevronLeft className="ts-ico" aria-hidden="true" /> : null}
            {weekKey === 'cur' ? 'Last week' : 'This week'}
            {weekKey === 'cur' ? null : <Icons.ChevronRight className="ts-ico" aria-hidden="true" />}
          </button>
        </div>
        <div className="ts-c-add">
          <button type="button" id="ts-add" className="ts-btn ts-btn-accent" data-wf="b-0-2" onClick={addRow}>
            <Icons.Plus className="ts-ico" aria-hidden="true" /> Add row
          </button>
        </div>
      </div>

      <section className="ts-panel" data-wf="b-1-0" aria-labelledby="ts-week-hours">
        <div style={{ padding: '16px 16px 12px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <h2 id="ts-week-hours" className="ts-eyebrow" style={{ fontFamily: 'var(--ts-body)', fontSize: 12 }}>Week hours</h2>
          <p className="ts-note" style={{ margin: 0 }}>Clocked entries are shown in Europe/London time and stored in UTC.</p>
        </div>
        <table className="ts-table">
          <thead>
            <tr>
              <th scope="col" className="ts-th ts-th-first" data-wf="i-1-0-0">Project / Task</th>
              <th scope="col" className="ts-th" data-wf="i-1-0-1">Billable</th>
              {DAYS.map((d, i) => (
                <th key={d} scope="col" className="ts-th" data-wf={`i-1-0-${i + 2}`}>
                  {d}
                  <small>{dayText(dates[i])}</small>
                  {dates[i] === TODAY ? <span className="ts-today">Today</span> : null}
                </th>
              ))}
              <th scope="col" className="ts-th" data-wf="i-1-0-9">Total</th>
              <th scope="col" className="ts-th" data-wf="i-1-0-10">Delete</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const f = findProject(r.project);
              const label = rowLabel(r) || `row ${ri + 1}`;
              return (
                <React.Fragment key={r.id}>
                  <tr className="ts-row">
                    <td className="ts-proj">
                      <div className="ts-sel">
                        <label htmlFor={`proj-${r.id}`} className="sr-only">Project for {label}</label>
                        <select
                          id={`proj-${r.id}`}
                          className="ts-field"
                          value={r.project}
                          aria-invalid={invalid(`${r.id}:proj`) ? 'true' : undefined}
                          onChange={(e) => changeProject(r, e.target.value)}
                        >
                          <option value="">Choose a project</option>
                          {projectOptions}
                        </select>
                      </div>
                      <div className="ts-sel">
                        <label htmlFor={`task-${r.id}`} className="sr-only">Task for {label}</label>
                        <select
                          id={`task-${r.id}`}
                          className="ts-field"
                          value={r.task}
                          disabled={!f}
                          aria-invalid={invalid(`${r.id}:proj`) ? 'true' : undefined}
                          onChange={(e) => patchRow(r.id, { task: e.target.value }, [`${r.id}:proj`])}
                        >
                          <option value="">{f ? 'Choose a task' : 'Choose a project first'}</option>
                          {taskOptions(r)}
                        </select>
                      </div>
                      {r.source === 'clock' ? (
                        <>
                          <span className="ts-src ts-src-clock"><Icons.Clock className="ts-ico" aria-hidden="true" style={{ width: 12, height: 12 }} /> Clocked</span>
                          <p className="ts-note">{r.note}</p>
                        </>
                      ) : (
                        <span className="ts-src"><Icons.Edit className="ts-ico" aria-hidden="true" style={{ width: 12, height: 12 }} /> {r.fresh ? 'New row' : 'Entered by hand'}</span>
                      )}
                    </td>
                    <td className="ts-bill">
                      <label className="ts-check" htmlFor={`bill-${r.id}`}>
                        <input
                          id={`bill-${r.id}`}
                          type="checkbox"
                          checked={r.billable}
                          onChange={(e) => patchRow(r.id, { billable: e.target.checked })}
                        />
                        <span>{r.billable ? 'Billable' : 'Non-billable'}</span>
                      </label>
                    </td>
                    {DAYS.map((d, i) => (
                      <td key={d} className="ts-day">
                        <label htmlFor={`h-${r.id}-${i}`} className="ts-daylabel" aria-hidden="true">{d}</label>
                        <span className="sr-only">Hours on {d} {dayText(dates[i])} for {label}</span>
                        <input
                          id={`h-${r.id}-${i}`}
                          className="ts-field ts-hours"
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          placeholder="–"
                          value={r.hours[i]}
                          aria-invalid={invalid(`${r.id}:${i}`) ? 'true' : undefined}
                          aria-describedby={`hint-${r.id}-${i}`}
                          onChange={(e) => setHour(r, i, e.target.value)}
                        />
                        <span id={`hint-${r.id}-${i}`} className="sr-only">{invalid(`${r.id}:${i}`) ? 'Invalid hours. Use a number from 0 to 24.' : 'Hours from 0 to 24.'}</span>
                      </td>
                    ))}
                    <td className="ts-total">
                      <span className="ts-narrow-only ts-eyebrow" style={{ marginRight: 8 }}>Row total</span>
                      <span className="ts-totalfig">{fmt(rowTotal(r))}</span>
                      <span className="ts-narrow-only ts-num" style={{ color: 'var(--ts-muted)' }}> h</span>
                    </td>
                    <td className="ts-del">
                      <button
                        type="button"
                        className="ts-delbtn"
                        aria-label={`Delete ${label}`}
                        title="Delete this row"
                        onClick={() => setConfirmId(r.id)}
                      >
                        <Icons.X className="ts-ico" aria-hidden="true" />
                        <span className="ts-narrow-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                  {confirmId === r.id ? (
                    <tr className="ts-confirm" onKeyDown={(e) => { if (e.key === 'Escape') setConfirmId(null); }}>
                      <td colSpan={11}>
                        <div className="ts-confirm-body" role="group" aria-label={`Confirm deleting ${label}`}>
                          <p style={{ maxWidth: '60ch' }}>
                            Delete <strong>{label}</strong> and its <span className="ts-num">{fmt(rowTotal(r))} h</span> from this week? This can’t be undone.
                          </p>
                          <div className="ts-confirm-actions">
                            <button type="button" className="ts-btn ts-btn-auto" autoFocus onClick={() => setConfirmId(null)}>Keep entry</button>
                            <button type="button" className="ts-btn ts-btn-danger" onClick={() => deleteRow(r.id)}>
                              <Icons.Trash className="ts-ico" aria-hidden="true" /> Delete entry
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <div className="ts-empty">
            <span style={{ color: 'var(--ts-accent)' }}><Icons.Calendar className="ts-ico" aria-hidden="true" style={{ width: 28, height: 28 }} /></span>
            <h3>No hours on this week yet</h3>
            <p>Add a row to charge time to a project and task, or clock in from Home. Clocked entries land on their day by themselves.</p>
            <button type="button" className="ts-btn ts-btn-accent ts-btn-auto" onClick={addRow}>
              <Icons.Plus className="ts-ico" aria-hidden="true" /> Add row
            </button>
          </div>
        ) : null}
      </section>

      <div className="ts-mid">
        <div className="ts-c-sum" data-wf="b-2-0">
          <p className="ts-num" style={{ fontSize: 15, lineHeight: 1.7 }}>
            Daily totals: {dayTotals.map(fmt).join(' · ')}. Week total:{' '}
            <strong style={{ fontFamily: 'var(--ts-head)', fontWeight: 400, fontSize: 22, color: 'var(--ts-accent)' }}>{fmt(weekTotal)} h</strong>
            . Clocked entries appear on their day.
          </p>
          {errors.length ? (
            <div className="ts-alert" role="alert" tabIndex={-1} ref={alertRef}>
              <Icons.AlertCircle className="ts-ico" aria-hidden="true" style={{ color: 'var(--ts-danger)', marginTop: 4 }} />
              <div>
                <strong>Timesheet not saved.</strong> Nothing you typed has been lost. Fix {errors.length === 1 ? 'this' : `these ${errors.length}`} and save again:
                <ul>
                  {errors.map((e) => <li key={e.key}>{e.msg}</li>)}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        <div className="ts-c-save">
          <button type="button" className="ts-btn ts-btn-primary" data-wf="b-2-1" onClick={onSave} disabled={saving}>
            <Icons.Check className="ts-ico" aria-hidden="true" /> {saving ? 'Saving…' : 'Save timesheet'}
          </button>
          <p role="status" className="ts-note" style={{ marginTop: 12, fontSize: 13 }}>
            {statusNode}
            {notice ? <span style={{ display: 'block', marginTop: 4 }}>{notice}</span> : null}
          </p>
        </div>
      </div>

      <div data-wf="b-3-0">
        <button type="button" className="ts-link" onClick={() => navigate('home')}>
          <Icons.ArrowLeft className="ts-ico" aria-hidden="true" /> Back to home and clock
        </button>
      </div>
    </div>
  );
}
