// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Input, Label, Select } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { User, Home, Clock } = Icons;

const TZ = 'Europe/London';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_DATES = [2, 3, 4, 5, 6, 7, 8];
const TODAY_INDEX = 5;
const NOW0 = Date.UTC(2026, 10, 7, 10, 14);

const PROJECTS = [
  { id: 'p1', client: 'Northgate Housing', name: 'Tenant Portal Redesign', defaultBillable: true, tasks: ['Design', 'Frontend build', 'User research', 'Stakeholder review'] },
  { id: 'p2', client: 'Marlow & Finch', name: 'Annual Report 2026', defaultBillable: true, tasks: ['Copy editing', 'Layout', 'Data visuals'] },
  { id: 'p3', client: 'Internal', name: 'Team Admin', defaultBillable: false, tasks: ['Team meetings', 'Training', 'Planning'] },
];

// minutes per day, split billable / non-billable. Total 26.5 h: 21.0 billable, 5.5 non-billable.
const INITIAL_DAYS = [
  { b: 390, n: 90 },
  { b: 330, n: 90 },
  { b: 330, n: 120 },
  { b: 0, n: 0 },
  { b: 210, n: 30 },
  { b: 0, n: 0 },
  { b: 0, n: 0 },
];

const STALE_ENTRY = {
  start: Date.UTC(2026, 10, 5, 9, 0),
  breaks: [{ start: Date.UTC(2026, 10, 5, 12, 30), end: Date.UTC(2026, 10, 5, 13, 0) }],
  projectId: 'p1',
  task: 'Design',
  billable: true,
  stale: true,
};

const pad = (n) => String(n).padStart(2, '0');
const fmtH = (min) => (min / 60).toFixed(1);
const fmtHM = (min) => `${Math.floor(min / 60)}:${pad(Math.round(min % 60))}`;
const fmtTime = (ms) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(ms);
const fmtDay = (ms) => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' }).formatToParts(ms);
  const get = (t) => (parts.find((p) => p.type === t) || {}).value;
  return `${get('weekday')} ${get('day')} ${get('month')}`;
};
const toLocalInput = (ms) => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(ms);
  const g = (t) => (p.find((x) => x.type === t) || {}).value;
  return `${g('year')}-${g('month')}-${g('day')}T${g('hour') === '24' ? '00' : g('hour')}:${g('minute')}`;
};
const netMinutes = (entry, endMs) => {
  const brk = entry.breaks.reduce((s, b) => s + ((b.end || endMs) - b.start), 0);
  return Math.max(0, Math.round((endMs - entry.start - brk) / 60000));
};
const breakMinutes = (entry, nowMs) =>
  Math.round(entry.breaks.reduce((s, b) => s + ((b.end || nowMs) - b.start), 0) / 60000);

export default function Screen() {
  const navigate = useNavigate();
  const mountRef = React.useRef(Date.now());
  const getNow = () => NOW0 + (Date.now() - mountRef.current);
  const [now, setNow] = React.useState(NOW0);
  React.useEffect(() => {
    const id = setInterval(() => setNow(getNow()), 30000);
    return () => clearInterval(id);
  }, []);

  const [days, setDays] = React.useState(INITIAL_DAYS);
  const [entry, setEntry] = React.useState(STALE_ENTRY);
  const [projectId, setProjectId] = React.useState(STALE_ENTRY.projectId);
  const [task, setTask] = React.useState(STALE_ENTRY.task);
  const [billable, setBillable] = React.useState('billable');
  const [endValue, setEndValue] = React.useState('2026-11-05T17:30');
  const [endError, setEndError] = React.useState('');
  const [fixed, setFixed] = React.useState(null);
  const [notice, setNotice] = React.useState(null);

  const project = PROJECTS.find((p) => p.id === projectId);
  const onBreak = !!(entry && entry.breaks.length && !entry.breaks[entry.breaks.length - 1].end);
  const stale = !!(entry && entry.stale);
  const totalB = days.reduce((s, d) => s + d.b, 0);
  const totalN = days.reduce((s, d) => s + d.n, 0);
  const total = totalB + totalN;
  const maxDay = Math.max(600, ...days.map((d) => d.b + d.n));
  const nowMs = getNow();

  const say = (kind, text) => setNotice({ kind, text, at: Date.now() });

  const changeProject = (id) => {
    const p = PROJECTS.find((x) => x.id === id);
    setProjectId(id);
    setTask(p.tasks[0]);
    setBillable(p.defaultBillable ? 'billable' : 'non-billable');
  };

  const addMinutes = (idx, mins, isBillable) =>
    setDays((prev) => prev.map((d, i) => (i === idx ? { b: d.b + (isBillable ? mins : 0), n: d.n + (isBillable ? 0 : mins) } : d)));

  const saveEnd = (e) => {
    e.preventDefault();
    if (!endValue) {
      setEndError('Enter the time you actually stopped work.');
      return;
    }
    const endMs = Date.parse(endValue + ':00Z');
    const lastBreak = entry.breaks[entry.breaks.length - 1];
    if (!(endMs > entry.start)) {
      setEndError(`End time must be after the start (${fmtDay(entry.start)}, ${fmtTime(entry.start)}).`);
      return;
    }
    if (lastBreak && lastBreak.end && endMs < lastBreak.end) {
      setEndError(`End time falls inside the recorded break, which ended at ${fmtTime(lastBreak.end)}.`);
      return;
    }
    if (endMs > nowMs) {
      setEndError('End time cannot be in the future.');
      return;
    }
    const mins = netMinutes(entry, endMs);
    addMinutes(3, mins, entry.billable);
    setFixed({ mins, end: endMs });
    setEndError('');
    setEntry(null);
    say('ok', `Entry from ${fmtDay(entry.start)} closed. You can clock in again.`);
  };

  const clockIn = () => {
    if (entry) {
      say('error', stale
        ? `You are already clocked in. Your entry from ${fmtDay(entry.start)} is still running, so set its end time first.`
        : `You are already clocked in since ${fmtTime(entry.start)}. Clock out before starting a new entry.`);
      return;
    }
    const t = getNow();
    setEntry({ start: t, breaks: [], projectId, task, billable: billable === 'billable', stale: false });
    say('ok', `Clocked in at ${fmtTime(t)} on ${project.name}, ${task}.`);
  };
  const startBreak = () => {
    if (!entry) return say('error', 'Clock in first. A break needs a running entry.');
    if (stale) return say('error', `Your entry from ${fmtDay(entry.start)} is still running. Set its end time above before using breaks.`);
    if (onBreak) return say('error', `You are already on a break since ${fmtTime(entry.breaks[entry.breaks.length - 1].start)}. End it before starting another.`);
    const t = getNow();
    setEntry({ ...entry, breaks: [...entry.breaks, { start: t, end: null }] });
    say('ok', `Break started at ${fmtTime(t)}. It will not count towards your hours.`);
  };
  const endBreak = () => {
    if (!onBreak) return say('error', 'There is no break running to end.');
    const t = getNow();
    setEntry({ ...entry, breaks: entry.breaks.map((b, i) => (i === entry.breaks.length - 1 ? { ...b, end: t } : b)) });
    say('ok', `Break ended at ${fmtTime(t)}. Back on the clock.`);
  };
  const clockOut = () => {
    if (!entry) return say('error', 'You are not clocked in, so there is nothing to clock out of.');
    if (stale) return say('error', `Your entry from ${fmtDay(entry.start)} has been running for days. Set the correct end time above instead.`);
    const t = getNow();
    const mins = netMinutes(entry, t);
    addMinutes(TODAY_INDEX, mins, entry.billable);
    setEntry(null);
    say('ok', `Clocked out at ${fmtTime(t)}. ${fmtHM(mins)} h added to Saturday.`);
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
  const label = { fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, fontWeight: 500 };
  const panel = { backgroundColor: C.surface, border: `1px solid ${C.line}`, borderRadius: brand.radius, padding: 24 };
  const serif = { fontFamily: brand.fontHeading };
  const num = { fontVariantNumeric: 'tabular-nums' };
  const field = {
    width: '100%', minHeight: 44, padding: '8px 12px', backgroundColor: C.bg, color: C.fg,
    border: `1px solid ${C.line}`, borderRadius: brand.radius, fontSize: 15, fontFamily: brand.fontBody,
  };

  const actionBtn = (primary, dim) => ({
    minHeight: 48, padding: '12px 16px', borderRadius: brand.radius, fontSize: 15, fontWeight: 500,
    fontFamily: brand.fontBody, cursor: 'pointer',
    backgroundColor: primary ? C.accent : 'transparent',
    color: primary ? C.bg : C.fg,
    border: `1px solid ${primary ? C.accent : C.line}`,
    opacity: dim ? 0.5 : 1,
  });

  const primaryAction = !entry ? 'in' : stale ? null : onBreak ? 'endbreak' : 'out';

  let statusLine;
  if (!entry) {
    statusLine = <>Not clocked in. Pick a project and task, then clock in.</>;
  } else {
    statusLine = (
      <>
        In progress since <strong style={{ ...num, color: C.accent, fontWeight: 600 }}>{fmtTime(entry.start)}</strong>
        {stale ? ` (${fmtDay(entry.start)})` : ''}. Break taken: <span style={num}>{fmtHM(breakMinutes(entry, nowMs))}</span>.
      </>
    );
  }

  return (
    <div className="tt" style={{ backgroundColor: C.bg, color: C.fg, fontFamily: brand.fontBody, minHeight: '100%', padding: '32px 16px' }}>
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
          <div style={{ width: 48, height: 1, backgroundColor: C.accent, marginBottom: 16 }} aria-hidden="true" />
          <h1 style={{ ...serif, fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>Home</h1>
          <p style={{ color: C.muted, margin: '8px 0 0', fontSize: 15 }}>
            Week of Mon 2 to Sun 8 Nov 2026 · Saturday, {fmtTime(nowMs)} in London
          </p>
        </div>
        <div className="col-span-12 sm:col-span-4 flex sm:justify-end items-start">
          <button data-wf="b-0-1" type="button" className="tt-btn" style={actionBtn(false)} onClick={() => navigate('sign-in')}>
            Sign out
          </button>
        </div>

        {/* Row 2 */}
        {(stale || fixed) && (
          <section data-wf="b-1-0" aria-labelledby="fc-h" className="col-span-12 tt-in"
            style={{ ...panel, borderLeft: `3px solid ${C.accent}` }}>
            {stale ? (
              <form onSubmit={saveEnd} noValidate className="grid grid-cols-12 gap-6 items-end">
                <div className="col-span-12 lg:col-span-6">
                  <p style={{ ...label, display: 'flex', alignItems: 'center', gap: 8, color: C.accent, margin: 0 }}>
                    <Icons.AlertCircle width={16} height={16} aria-hidden="true" /> Needs your attention
                  </p>
                  <h2 id="fc-h" style={{ ...serif, fontSize: 22, fontWeight: 700, margin: '8px 0' }}>Forgotten clock-out</h2>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
                    Your entry from <strong>{fmtDay(entry.start)}</strong> is still running. Set the correct end time.
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted, ...num }}>
                    {project.name} · {entry.task} · started {fmtTime(entry.start)} · break {fmtHM(breakMinutes(entry, nowMs))}
                  </p>
                </div>
                <div className="col-span-12 sm:col-span-8 lg:col-span-4">
                  <Label htmlFor="end-time" style={{ ...label, display: 'block', marginBottom: 8 }}>End time</Label>
                  <Input
                    data-wf="i-1-0-0" id="end-time" type="datetime-local" value={endValue}
                    min={toLocalInput(entry.start)} max={toLocalInput(nowMs)}
                    onChange={(e) => { setEndValue(e.target.value); setEndError(''); }}
                    aria-invalid={endError ? 'true' : 'false'} aria-describedby={endError ? 'end-err' : 'end-help'}
                    style={{ ...field, ...num, borderColor: endError ? C.fg : C.line }}
                  />
                </div>
                <div className="col-span-12 sm:col-span-4 lg:col-span-2">
                  <button data-wf="i-1-0-1" type="submit" className="tt-btn" data-primary="true" style={{ ...actionBtn(true), width: '100%' }}>
                    Save end time
                  </button>
                </div>
                <div className="col-span-12" style={{ marginTop: -8 }}>
                  {endError ? (
                    <p id="end-err" role="alert" style={{ margin: 0, fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Icons.AlertCircle width={16} height={16} aria-hidden="true" /> {endError} Your entry is unchanged.
                    </p>
                  ) : (
                    <p id="end-help" style={{ margin: 0, fontSize: 13, color: C.muted }}>
                      Times are in Europe/London. The 0:30 break already recorded is taken off your worked hours.
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <div role="status" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icons.CheckCircle width={20} height={20} aria-hidden="true" style={{ color: C.accent, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h2 id="fc-h" style={{ ...serif, fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>End time saved</h2>
                  <p style={{ margin: 0, fontSize: 15, ...num }}>
                    Thursday's entry now ends at {fmtTime(fixed.end)}. <strong style={{ color: C.accent }}>{fmtHM(fixed.mins)} h</strong> were added to Thu 5 Nov.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Row 3 */}
        <section data-wf="b-2-0" aria-labelledby="hw-h" className="col-span-12 lg:col-span-4" style={panel}>
          <h2 id="hw-h" style={{ ...label, margin: 0 }}>Hours this week</h2>
          <p style={{ ...serif, ...num, fontSize: 56, lineHeight: 1, margin: '16px 0 4px', color: C.accent, fontWeight: 700 }}>
            {fmtH(total)} <span style={{ fontSize: 24, color: C.muted, fontWeight: 400 }}>h</span>
          </p>
          {total === 0 ? (
            <div style={{ marginTop: 16, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
              Nothing recorded yet this week. Clock in below, or{' '}
              <button type="button" onClick={() => navigate('timesheet')} style={{ color: C.fg, textDecoration: 'underline', background: 'none', border: 0, padding: 0, cursor: 'pointer', fontSize: 14 }}>
                fill in the weekly timesheet
              </button>.
            </div>
          ) : (
            <>
              <div aria-hidden="true" style={{ display: 'flex', height: 4, margin: '24px 0 16px', backgroundColor: C.line, borderRadius: 2, overflow: 'hidden' }}>
                <div className="tt-bar" style={{ width: `${(totalB / total) * 100}%`, backgroundColor: C.accent }} />
              </div>
              <dl style={{ margin: 0 }}>
                <div data-wf="i-2-0-0" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.line}` }}>
                  <dt style={{ fontSize: 15 }}><span aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: C.accent, marginRight: 8 }} />Billable</dt>
                  <dd style={{ margin: 0, ...num, fontSize: 15 }}>{fmtH(totalB)} h</dd>
                </div>
                <div data-wf="i-2-0-1" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <dt style={{ fontSize: 15 }}><span aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, border: `1px solid ${C.muted}`, marginRight: 8 }} />Non-billable</dt>
                  <dd style={{ margin: 0, ...num, fontSize: 15 }}>{fmtH(totalN)} h</dd>
                </div>
              </dl>
            </>
          )}
        </section>

        <section data-wf="b-2-1" aria-labelledby="chart-h" className="col-span-12 lg:col-span-8" style={panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
            <h2 id="chart-h" style={{ ...label, margin: 0 }}>Hours per day, Mon to Sun</h2>
            <p style={{ margin: 0, fontSize: 12, color: C.muted, display: 'flex', gap: 16 }}>
              <span><span aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: C.accent, marginRight: 6 }} />Billable</span>
              <span><span aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, border: `1px solid ${C.muted}`, marginRight: 6 }} />Non-billable</span>
            </p>
          </div>
          <div style={{ position: 'relative', marginTop: 24, height: 208 }}>
            {[4, 8].map((h) => (
              <div key={h} aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 32 + (h * 60 / maxDay) * 160, borderTop: `1px ${h === 8 ? 'dashed' : 'solid'} ${C.line}`, fontSize: 11, color: C.muted, ...num }}>
                <span style={{ position: 'absolute', right: 0, top: -16 }}>{h} h</span>
              </div>
            ))}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, height: '100%', position: 'relative' }}>
              {days.map((d, i) => {
                const tot = d.b + d.n;
                const runningDay = stale && i === 3;
                const hB = (d.b / maxDay) * 160;
                const hN = (d.n / maxDay) * 160;
                return (
                  <li key={i} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span className="sr-only">
                      {DAY_FULL[i]} {DAY_DATES[i]} Nov: {fmtH(tot)} hours, {fmtH(d.b)} billable, {fmtH(d.n)} non-billable{runningDay ? ', entry still running' : ''}{i === TODAY_INDEX ? ', today' : ''}
                    </span>
                    <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                      <span style={{ ...num, fontSize: 13, marginBottom: 4, color: tot ? C.fg : C.muted }}>
                        {runningDay ? 'running' : tot ? fmtH(tot) : '0.0'}
                      </span>
                      <div style={{ width: '60%', maxWidth: 40, height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        {runningDay ? (
                          <div style={{ height: 48, border: `1px dashed ${C.accent}`, borderBottom: 0 }} />
                        ) : (
                          <>
                            <div className="tt-bar" style={{ height: hN, border: d.n ? `1px solid ${C.muted}` : 0, borderBottom: 0, backgroundColor: 'transparent' }} />
                            <div className="tt-bar" style={{ height: hB, backgroundColor: C.accent }} />
                          </>
                        )}
                      </div>
                      <div style={{ width: '100%', borderTop: `1px solid ${C.muted}` }} />
                      <span style={{ fontSize: 12, marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase', color: i === TODAY_INDEX ? C.accent : C.muted, fontWeight: i === TODAY_INDEX ? 600 : 400, borderBottom: i === TODAY_INDEX ? `1px solid ${C.accent}` : '1px solid transparent' }}>
                        {DAY_NAMES[i]}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {stale && (
            <p style={{ margin: '16px 0 0', fontSize: 13, color: C.muted }}>
              Thursday's running entry is not counted until you set its end time.
            </p>
          )}
        </section>

        {/* Row 4 */}
        <form data-wf="b-3-0" aria-labelledby="clock-h" onSubmit={(e) => e.preventDefault()} className="col-span-12 lg:col-span-8" style={panel}>
          <h2 id="clock-h" style={{ ...serif, fontSize: 22, fontWeight: 700, margin: 0 }}>
            Clock <span style={{ ...label, textTransform: 'none', letterSpacing: '0.02em', fontSize: 13, fontFamily: brand.fontBody, fontWeight: 400 }}>(times shown in Europe/London)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: 24 }}>
            <div>
              <Label htmlFor="clock-project" style={{ ...label, display: 'block', marginBottom: 8 }}>Project</Label>
              <Select data-wf="i-3-0-0" id="clock-project" value={projectId} disabled={!!entry} onChange={(e) => changeProject(e.target.value)} style={field}>
                {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: C.muted }}>{project.client}</p>
            </div>
            <div>
              <Label htmlFor="clock-task" style={{ ...label, display: 'block', marginBottom: 8 }}>Task</Label>
              <Select data-wf="i-3-0-1" id="clock-task" value={task} disabled={!!entry} onChange={(e) => setTask(e.target.value)} style={field}>
                {project.tasks.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="clock-billable" style={{ ...label, display: 'block', marginBottom: 8 }}>Billable / Non-billable</Label>
              <Select data-wf="i-3-0-2" id="clock-billable" value={billable} disabled={!!entry} onChange={(e) => setBillable(e.target.value)} style={field}>
                <option value="billable">Billable</option>
                <option value="non-billable">Non-billable</option>
              </Select>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: C.muted }}>
                Project default: {project.defaultBillable ? 'billable' : 'non-billable'}
              </p>
            </div>
          </div>
          {entry && (
            <p style={{ margin: '16px 0 0', fontSize: 13, color: C.muted }}>
              Choices are locked while an entry is running.
            </p>
          )}
        </form>

        <div data-wf="b-3-1" className="col-span-12 lg:col-span-4" style={{ ...panel, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h2 style={{ ...label, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Clock width={16} height={16} aria-hidden="true" /> Status
          </h2>
          <p role="status" style={{ ...serif, fontSize: 20, lineHeight: 1.4, margin: '16px 0 0' }}>
            Status: {statusLine}
          </p>
          {onBreak && (
            <p style={{ margin: '12px 0 0', fontSize: 14, color: C.accent }}>
              On a break since <span style={num}>{fmtTime(entry.breaks[entry.breaks.length - 1].start)}</span>.
            </p>
          )}
          {entry && !stale && (
            <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted, ...num }}>
              Worked so far (net of breaks): {fmtHM(netMinutes(entry, nowMs))}
            </p>
          )}
        </div>

        {/* Row 5 */}
        <button data-wf="b-4-0" type="button" className="tt-btn col-span-6 lg:col-span-3" data-primary={primaryAction === 'in'} aria-disabled={!!entry} style={actionBtn(primaryAction === 'in', !!entry)} onClick={clockIn}>
          Clock in
        </button>
        <button data-wf="b-4-1" type="button" className="tt-btn col-span-6 lg:col-span-3" data-primary="false" aria-disabled={!entry || onBreak || stale} style={actionBtn(false, !entry || onBreak || stale)} onClick={startBreak}>
          Start break
        </button>
        <button data-wf="b-4-2" type="button" className="tt-btn col-span-6 lg:col-span-3" data-primary={primaryAction === 'endbreak'} aria-disabled={!onBreak} style={actionBtn(primaryAction === 'endbreak', !onBreak)} onClick={endBreak}>
          End break
        </button>
        <button data-wf="b-4-3" type="button" className="tt-btn col-span-6 lg:col-span-3" data-primary={primaryAction === 'out'} aria-disabled={!entry || stale} style={actionBtn(primaryAction === 'out', !entry || stale)} onClick={clockOut}>
          Clock out
        </button>

        <div className="col-span-12" style={{ minHeight: 24, marginTop: -8 }}>
          {notice && (
            <p key={notice.at} role="status" className="tt-in" style={{ margin: 0, fontSize: 14, display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.5 }}>
              {notice.kind === 'ok'
                ? <Icons.CheckCircle width={16} height={16} aria-hidden="true" style={{ color: C.accent, flexShrink: 0, marginTop: 3 }} />
                : <Icons.AlertCircle width={16} height={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} />}
              <span><strong style={{ fontWeight: 600 }}>{notice.kind === 'ok' ? 'Done. ' : 'Not allowed. '}</strong>{notice.text}</span>
            </p>
          )}
        </div>

        {/* Row 6 */}
        <div className="col-span-12" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
          <button data-wf="b-5-0" type="button" className="tt-link" onClick={() => navigate('timesheet')}
            style={{ background: 'none', border: 0, color: C.fg, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, minHeight: 44, padding: 0 }}>
            <Icons.Calendar width={18} height={18} aria-hidden="true" style={{ color: C.accent }} />
            <span className="tt-ul" style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 2 }}>Open weekly timesheet</span>
            <Icons.ArrowRight width={16} height={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
