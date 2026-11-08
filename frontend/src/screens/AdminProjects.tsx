// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "react-router-dom";
import { ApiError, apiFetch } from "@/lib/api";

 
const { Input, Label, Select, Table, THead, TBody, TR, TH, TD, Empty } = UI;
 
const { Edit } = Icons;

const pad = (n, w) => String(n).padStart(w, "0");
const toClient = (c) => ({
  id: c.id,
  ref: "CL-" + pad(c.id, 3),
  name: c.name,
  archived: c.is_archived,
});
const toProject = (p) => ({
  id: p.id,
  ref: "PR-" + pad(p.id, 4),
  clientId: p.client_id,
  name: p.name,
  rate: p.bill_rate,
  defaultBillable: p.default_billable,
});
const toTask = (k) => ({ id: k.id, projectId: k.project_id, name: k.name, archived: k.is_archived });
const flatten = (data) => {
  const clients = [];
  const projects = [];
  const tasks = [];
  for (const c of data) {
    clients.push(toClient(c));
    for (const p of c.projects || []) {
      projects.push(toProject({ ...p, client_id: c.id }));
      for (const k of p.tasks || []) tasks.push(toTask({ ...k, project_id: p.id }));
    }
  }
  return { clients, projects, tasks };
};
const upsert = (list, item) =>
  list.some((x) => x.id === item.id)
    ? list.map((x) => (x.id === item.id ? item : x))
    : [...list, item];
const detailOf = (err, fallback) => {
  const d = err instanceof ApiError ? err.body?.detail : null;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]?.msg) return d[0].msg;
  return fallback;
};
const fieldErrors = (err, map) => {
  const out = {};
  const d = err instanceof ApiError ? err.body?.detail : null;
  if (Array.isArray(d))
    for (const x of d) {
      const key = map[x.loc?.[x.loc.length - 1]];
      if (key && !out[key]) out[key] = x.msg;
    }
  return out;
};

export default function Screen() {
  const { Table, THead, TBody, TR, TH, TD, Input, Label, Empty } = UI;

  const navigate = useNavigate();
  const [clients, setClients] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [denied, setDenied] = React.useState(false);
  const [clientId, setClientId] = React.useState(null);
  const [projectId, setProjectId] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);

  const [form, setForm] = React.useState({ name: "", rate: "", defaultBillable: true });
  const [formErrors, setFormErrors] = React.useState({});
  const [notice, setNotice] = React.useState("");

  const [clientPanel, setClientPanel] = React.useState(false);
  const [clientName, setClientName] = React.useState("");
  const [clientError, setClientError] = React.useState("");
  const [confirmArchive, setConfirmArchive] = React.useState(false);

  const [taskName, setTaskName] = React.useState("");
  const [taskError, setTaskError] = React.useState("");
  const [archiveTaskId, setArchiveTaskId] = React.useState(null);

  const guard = (err) => {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      setDenied(true);
      if (err.status === 401) navigate("/sign-in");
      return true;
    }
    return false;
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const load = React.useCallback(() => {
    setLoading(true);
    setLoadError(false);
    apiFetch("/api/admin/clients")
      .then((data) => {
        const f = flatten(data);
        setClients(f.clients);
        setProjects(f.projects);
        setTasks(f.tasks);
        const c = f.clients[0];
        const p = c ? f.projects.find((x) => x.clientId === c.id) : null;
        setClientId(c ? c.id : null);
        setProjectId(p ? p.id : null);
        setEditingId(p ? p.id : null);
        setForm(
          p
            ? { name: p.name, rate: p.rate, defaultBillable: p.defaultBillable }
            : { name: "", rate: "", defaultBillable: true },
        );
      })
      .catch((err) => {
        if (!guard(err)) setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);

  const client = clients.find((c) => c.id === clientId);
  const clientProjects = projects.filter((p) => p.clientId === clientId);
  const project = projects.find((p) => p.id === projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const clientLocked = client ? client.archived : false;

  const surface = `color-mix(in srgb, ${brand.primaryColor} 5%, ${brand.backgroundColor})`;
  const surfaceHi = `color-mix(in srgb, ${brand.primaryColor} 9%, ${brand.backgroundColor})`;
  const hairline = `color-mix(in srgb, ${brand.primaryColor} 12%, transparent)`;
  const errorColor = "hsl(8 62% 72%)";

  const s = {
    page: {
      color: brand.primaryColor,
      fontFamily: brand.fontBody,
      backgroundColor: brand.backgroundColor,
    },
    h1: {
      fontFamily: brand.fontHeading,
      fontWeight: 700,
      fontSize: 36,
      lineHeight: 1.15,
      letterSpacing: "-0.01em",
      margin: 0,
    },
    h2: {
      fontFamily: brand.fontHeading,
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.25,
      margin: 0,
    },
    label: {
      fontSize: 12,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: brand.neutralColor,
      fontWeight: 500,
    },
    panel: {
      backgroundColor: surface,
      border: `1px solid ${hairline}`,
      borderRadius: brand.radius,
    },
    muted: { color: brand.neutralColor, fontSize: 14, lineHeight: 1.5 },
    ref: {
      color: brand.accentColor,
      fontSize: 12,
      letterSpacing: "0.08em",
      fontVariantNumeric: "tabular-nums",
    },
    input: {
      backgroundColor: brand.backgroundColor,
      color: brand.primaryColor,
      border: `1px solid ${hairline}`,
      borderRadius: brand.radius,
      minHeight: 44,
      padding: "8px 12px",
      fontSize: 15,
      width: "100%",
    },
  };
  const btn = (kind) => ({
    minHeight: 44,
    padding: "8px 16px",
    borderRadius: brand.radius,
    fontSize: 14,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    ...(kind === "primary"
      ? {
          backgroundColor: brand.accentColor,
          color: brand.backgroundColor,
          border: `1px solid ${brand.accentColor}`,
        }
      : kind === "outline"
        ? {
            backgroundColor: "transparent",
            color: brand.accentColor,
            border: `1px solid ${brand.accentColor}`,
          }
        : {
            backgroundColor: "transparent",
            color: brand.primaryColor,
            border: `1px solid ${hairline}`,
          }),
  });

  const money = (r) =>
    "£" + Number(r).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const projectCount = (cid) => projects.filter((p) => p.clientId === cid).length;

  const selectClient = (id) => {
    setClientId(id);
    setConfirmArchive(false);
    setNotice("");
    setTaskError("");
    setTaskName("");
    setArchiveTaskId(null);
    const first = projects.find((p) => p.clientId === id);
    if (first) {
      loadProject(first);
    } else {
      startNewProject();
      setProjectId(null);
    }
  };

  const loadProject = (p) => {
    setProjectId(p.id);
    setEditingId(p.id);
    setForm({ name: p.name, rate: p.rate, defaultBillable: p.defaultBillable });
    setFormErrors({});
    setNotice("");
    setTaskError("");
    setTaskName("");
    setArchiveTaskId(null);
  };

  const startNewProject = () => {
    setEditingId(null);
    setForm({ name: "", rate: "", defaultBillable: true });
    setFormErrors({});
    setNotice("");
  };

  const createClient = async (e) => {
    e.preventDefault();
    const name = clientName.trim();
    if (!name) {
      setClientError("Give the client a name.");
      return;
    }
    try {
      const c = await apiFetch("/api/admin/clients", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setClients((l) => upsert(l, toClient(c)));
      setClientName("");
      setClientError("");
      setClientPanel(false);
      setClientId(c.id);
      setProjectId(null);
      startNewProject();
      setNotice(`Client “${c.name}” created. Add its first project below.`);
    } catch (err) {
      if (guard(err)) return;
      setClientError(
        fieldErrors(err, { name: "name" }).name ||
          detailOf(err, "The client could not be saved. Try again."),
      );
    }
  };

  const archiveClient = async () => {
    try {
      await apiFetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_archived: true }),
      });
      setClients((l) => l.map((c) => (c.id === clientId ? { ...c, archived: true } : c)));
      setConfirmArchive(false);
      setNotice(
        `${client.name} archived. Its projects no longer accept new time entries; existing entries stay visible.`,
      );
    } catch (err) {
      if (guard(err)) return;
      setConfirmArchive(false);
      setNotice(detailOf(err, "The client could not be archived. Try again."));
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    if (clientLocked) return;
    const errs = {};
    const name = form.name.trim();
    const rate = String(form.rate).trim();
    if (!name) errs.name = "Give the project a name.";
    if (!rate) errs.rate = "Enter an hourly bill rate. Use 0 if the work is not charged.";
    else if (!/^\d+(\.\d{1,2})?$/.test(rate))
      errs.rate =
        "The bill rate must be a number of 0 or more, such as 145.00. Negative values and text are not accepted.";
    setFormErrors(errs);
    if (Object.keys(errs).length) {
      setNotice("");
      return;
    }
    const creating = !editingId;
    try {
      const body = creating
        ? { client_id: clientId, name, bill_rate: rate, default_billable: form.defaultBillable }
        : { name, bill_rate: rate, default_billable: form.defaultBillable };
      const p = await apiFetch(creating ? "/api/admin/projects" : `/api/admin/projects/${editingId}`, {
        method: creating ? "POST" : "PATCH",
        body: JSON.stringify(body),
      });
      setProjects((l) => upsert(l, toProject({ ...p, client_id: p.client_id ?? clientId })));
      setProjectId(p.id);
      setEditingId(p.id);
      setForm({ name: p.name, rate: p.bill_rate, defaultBillable: p.default_billable });
      setNotice(
        creating
          ? `Project “${p.name}” created under ${client.name} at ${money(p.bill_rate)} per hour.`
          : `Saved “${p.name}”. The new rate applies to reporting only; recorded time is unchanged.`,
      );
    } catch (err) {
      if (guard(err)) return;
      const mapped = fieldErrors(err, {
        name: "name",
        bill_rate: "rate",
        default_billable: "rate",
        client_id: "name",
      });
      setFormErrors(
        Object.keys(mapped).length
          ? mapped
          : {
              [err instanceof ApiError && err.status === 409 ? "name" : "rate"]: detailOf(
                err,
                "The project could not be saved. Try again.",
              ),
            },
      );
      setNotice("");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    const name = taskName.trim();
    if (!project || clientLocked) return;
    if (!name) {
      setTaskError("Give the task a name.");
      return;
    }
    try {
      const k = await apiFetch(`/api/admin/projects/${projectId}/tasks`, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setTasks((l) => upsert(l, toTask({ ...k, project_id: k.project_id ?? projectId })));
      setTaskName("");
      setTaskError("");
    } catch (err) {
      if (guard(err)) return;
      setTaskError(
        fieldErrors(err, { name: "name" }).name ||
          detailOf(err, "The task could not be saved. Try again."),
      );
    }
  };

  const archiveTask = async (id) => {
    try {
      await apiFetch(`/api/admin/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_archived: true }),
      });
      setTasks((l) => l.map((t) => (t.id === id ? { ...t, archived: true } : t)));
      setArchiveTaskId(null);
    } catch (err) {
      if (guard(err)) return;
      setArchiveTaskId(null);
      setTaskError(detailOf(err, "The task could not be archived. Try again."));
    }
  };

  const statusTag = (archived, label) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: brand.radius,
        border: `1px solid ${archived ? hairline : brand.accentColor}`,
        color: archived ? brand.neutralColor : brand.accentColor,
      }}
    >
      {archived ? (
        <span aria-hidden="true">—</span>
      ) : (
        <Icons.Check className="w-3 h-3" aria-hidden="true" />
      )}
      {label}
    </span>
  );

  const fieldError = (id, msg) =>
    msg ? (
      <p
        id={id}
        role="alert"
        className="flex items-start gap-2 mt-2"
        style={{ color: errorColor, fontSize: 13, lineHeight: 1.45, margin: 0, marginTop: 8 }}
      >
        <Icons.AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{msg}</span>
      </p>
    ) : null;

  const projectsHeading = `Projects of ${client ? client.name : "no client"}`;
  const tasksHeading = `Tasks of ${project ? project.name : "no project"}`;

  if (denied || loading || loadError) {
    return (
      <div style={s.page} className="p-4 md:p-8 min-h-full">
        {denied ? (
          <p role="alert">Access denied. You do not have access to this resource.</p>
        ) : loading ? (
          <p role="status">Loading clients…</p>
        ) : (
          <div role="alert">
            <p>Could not load clients.</p>
            <button type="button" style={btn("outline")} onClick={load}>
              Try again
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={s.page} className="p-4 md:p-8 min-h-full">
      <style>{`
        .vt-focus:focus-visible, .vt-page button:focus-visible, .vt-page input:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 2px; }
        .vt-page button:not(:disabled):hover { filter: brightness(1.12); }
        .vt-page button:disabled { opacity: .5; cursor: not-allowed; }
        .vt-page input::placeholder { color: ${brand.neutralColor}; opacity: .8; }
        .vt-row-in { animation: vt-in .28s ease-out both; }
        @keyframes vt-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .vt-page th, .vt-page td { text-align: left; }
        @media (prefers-reduced-motion: reduce) { .vt-row-in { animation: none; } .vt-page * { transition: none !important; } }
      `}</style>
      <div className="vt-page mx-auto" style={{ maxWidth: 1200 }}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-8" data-wf="b-0-0">
            <p style={{ ...s.label, margin: 0, marginBottom: 12 }}>
              Administration · Billing structure
            </p>
            <h1 style={s.h1}>Clients, projects and tasks</h1>
            <div
              aria-hidden="true"
              style={{ width: 64, height: 1, backgroundColor: brand.accentColor, marginTop: 16 }}
            />
            <p style={{ ...s.muted, marginTop: 16, maxWidth: 620 }}>
              Everything employees charge time to is set up here. Bill rates are held for reporting
              only; nothing on this screen invoices or collects payment.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end" data-wf="b-0-1">
            <button
              type="button"
              style={btn("outline")}
              aria-expanded={clientPanel}
              aria-controls="new-client-panel"
              onClick={() => {
                setClientPanel(!clientPanel);
                setClientError("");
              }}
            >
              <Icons.Plus className="w-4 h-4" aria-hidden="true" />
              New client
            </button>
          </div>
        </div>

        {/* Notice */}
        <div aria-live="polite" style={{ minHeight: 8, marginTop: 24 }}>
          {notice && (
            <div
              className="vt-row-in flex items-start gap-3"
              style={{
                ...s.panel,
                padding: "12px 16px",
                borderColor: brand.accentColor,
                fontSize: 14,
              }}
            >
              <Icons.CheckCircle
                className="w-5 h-5 shrink-0"
                style={{ color: brand.accentColor }}
                aria-hidden="true"
              />
              <span style={{ flex: 1, lineHeight: 1.5 }}>{notice}</span>
            </div>
          )}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ marginTop: 16 }}>
          <section
            className="lg:col-span-4"
            data-wf="b-1-0"
            aria-labelledby="clients-h"
            style={{ ...s.panel, padding: 24, alignSelf: "start" }}
          >
            <div className="flex items-baseline justify-between">
              <h2 id="clients-h" style={s.h2}>
                Clients
              </h2>
              <span style={{ ...s.label, fontVariantNumeric: "tabular-nums" }}>
                {clients.length} total
              </span>
            </div>

            {clientPanel && (
              <form
                id="new-client-panel"
                onSubmit={createClient}
                noValidate
                className="vt-row-in"
                style={{
                  marginTop: 16,
                  padding: 16,
                  backgroundColor: surfaceHi,
                  border: `1px solid ${hairline}`,
                  borderRadius: brand.radius,
                }}
              >
                <Label htmlFor="client-name" style={s.label}>
                  Client name
                </Label>
                <Input
                  id="client-name"
                  value={clientName}
                  autoFocus
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setClientError("");
                  }}
                  aria-invalid={!!clientError}
                  aria-describedby={clientError ? "client-err" : undefined}
                  placeholder="e.g. Lindqvist Marine"
                  style={{ ...s.input, marginTop: 8 }}
                />
                {fieldError("client-err", clientError)}
                <div className="flex gap-2" style={{ marginTop: 12 }}>
                  <button type="submit" style={btn("primary")}>
                    Create client
                  </button>
                  <button
                    type="button"
                    style={btn("ghost")}
                    onClick={() => {
                      setClientPanel(false);
                      setClientError("");
                      setClientName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                marginTop: 16,
                borderTop: `1px solid ${hairline}`,
              }}
            >
              {clients.map((c, i) => {
                const sel = c.id === clientId;
                return (
                  <li
                    key={c.id}
                    className={i >= 4 ? "vt-row-in" : ""}
                    style={{ borderBottom: `1px solid ${hairline}` }}
                  >
                    <button
                      type="button"
                      data-wf={i === 0 ? "i-1-0-0" : i === 1 ? "i-1-0-1" : undefined}
                      aria-current={sel ? "true" : undefined}
                      onClick={() => selectClient(c.id)}
                      className="w-full text-left flex items-center justify-between gap-3"
                      style={{
                        background: sel ? surfaceHi : "transparent",
                        color: brand.primaryColor,
                        border: "none",
                        borderLeft: `2px solid ${sel ? brand.accentColor : "transparent"}`,
                        padding: "12px 12px",
                        minHeight: 56,
                        cursor: "pointer",
                        transition: "background-color .15s",
                      }}
                    >
                      <span>
                        <span
                          style={{
                            display: "block",
                            fontSize: 16,
                            fontWeight: sel ? 600 : 400,
                            opacity: c.archived ? 0.7 : 1,
                          }}
                        >
                          {c.name}
                        </span>
                        <span style={s.ref}>{c.ref}</span>
                        <span
                          style={{
                            ...s.muted,
                            fontSize: 13,
                            marginLeft: 8,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {projectCount(c.id)} {projectCount(c.id) === 1 ? "project" : "projects"}
                        </span>
                      </span>
                      {c.archived ? (
                        statusTag(true, "Archived")
                      ) : (
                        <Icons.ChevronRight
                          className="w-4 h-4"
                          style={{ color: brand.neutralColor }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div style={{ marginTop: 16 }}>
              {confirmArchive ? (
                <div
                  role="alertdialog"
                  aria-labelledby="arch-h"
                  className="vt-row-in"
                  style={{
                    padding: 16,
                    border: `1px solid ${hairline}`,
                    borderRadius: brand.radius,
                    backgroundColor: surfaceHi,
                  }}
                >
                  <p id="arch-h" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                    Archive <strong>{client.name}</strong>? Its {projectCount(client.id)}{" "}
                    {projectCount(client.id) === 1 ? "project" : "projects"} will stop accepting new
                    time entries. Existing entries stay visible.
                  </p>
                  <div className="flex gap-2" style={{ marginTop: 12 }}>
                    <button type="button" style={btn("primary")} onClick={archiveClient}>
                      Archive {client.name}
                    </button>
                    <button
                      type="button"
                      style={btn("ghost")}
                      onClick={() => setConfirmArchive(false)}
                    >
                      Keep active
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  data-wf="i-1-0-2"
                  style={btn("ghost")}
                  disabled={!client || clientLocked}
                  onClick={() => setConfirmArchive(true)}
                >
                  <Icons.Trash className="w-4 h-4" aria-hidden="true" />
                  Archive client
                </button>
              )}
              {clientLocked && (
                <p style={{ ...s.muted, fontSize: 13, marginTop: 8 }}>{client.name} is archived.</p>
              )}
            </div>
          </section>

          <section
            className="lg:col-span-8"
            data-wf="b-1-1"
            aria-label={projectsHeading}
            style={{ ...s.panel, padding: 24, alignSelf: "start" }}
          >
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 id="projects-h" style={s.h2}>
                {projectsHeading}
              </h2>
              {client && <span style={s.ref}>{client.ref}</span>}
            </div>
            {clientLocked && (
              <p className="flex items-start gap-2" style={{ ...s.muted, marginTop: 12 }}>
                <Icons.AlertCircle
                  className="w-4 h-4 shrink-0"
                  style={{ marginTop: 2 }}
                  aria-hidden="true"
                />
                <span>
                  This client is archived, so these projects cannot receive new time entries.
                  Recorded entries remain visible in timesheets.
                </span>
              </p>
            )}
            <div style={{ marginTop: 16, overflowX: "auto" }}>
              {clientProjects.length === 0 ? (
                <Empty
                  title="No projects under this client yet"
                  description="Use the form below to add the first project and set its hourly bill rate. Tasks come next."
                />
              ) : (
                <Table
                  aria-labelledby="projects-h"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 520,
                  }}
                >
                  <THead>
                    <TR style={{ borderBottom: `1px solid ${hairline}` }}>
                      <TH
                        data-wf="i-1-1-0"
                        scope="col"
                        style={{ ...s.label, padding: "8px 12px 12px 0" }}
                      >
                        Project
                      </TH>
                      <TH
                        data-wf="i-1-1-1"
                        scope="col"
                        style={{ ...s.label, padding: "8px 12px 12px", textAlign: "right" }}
                      >
                        Hourly bill rate
                      </TH>
                      <TH
                        data-wf="i-1-1-2"
                        scope="col"
                        style={{ ...s.label, padding: "8px 12px 12px" }}
                      >
                        Default billable
                      </TH>
                      <TH
                        data-wf="i-1-1-3"
                        scope="col"
                        style={{ ...s.label, padding: "8px 0 12px 12px" }}
                      >
                        Status
                      </TH>
                    </TR>
                  </THead>
                  <TBody>
                    {clientProjects.map((p) => {
                      const sel = p.id === projectId;
                      return (
                        <TR
                          key={p.id}
                          className="vt-row-in"
                          style={{
                            borderBottom: `1px solid ${hairline}`,
                            backgroundColor: sel ? surfaceHi : "transparent",
                          }}
                        >
                          <TD style={{ padding: "12px 12px 12px 0" }}>
                            <button
                              type="button"
                              onClick={() => loadProject(p)}
                              aria-label={`Edit ${p.name}`}
                              aria-current={sel ? "true" : undefined}
                              style={{
                                background: "none",
                                border: "none",
                                color: brand.primaryColor,
                                textAlign: "left",
                                cursor: "pointer",
                                padding: "4px 0 4px 8px",
                                minHeight: 44,
                                borderLeft: `2px solid ${sel ? brand.accentColor : "transparent"}`,
                              }}
                            >
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 15,
                                  fontWeight: sel ? 600 : 400,
                                }}
                              >
                                {p.name}
                              </span>
                              <span style={s.ref}>{p.ref}</span>
                            </button>
                          </TD>
                          <TD
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              fontSize: 15,
                              color: brand.accentColor,
                            }}
                          >
                            {money(p.rate)}
                            <span style={{ ...s.muted, fontSize: 12 }}> /h</span>
                          </TD>
                          <TD style={{ padding: 12, fontSize: 14 }}>
                            {p.defaultBillable ? "Billable" : "Non-billable"}
                          </TD>
                          <TD style={{ padding: "12px 0 12px 12px" }}>
                            {clientLocked
                              ? statusTag(true, "Archived")
                              : statusTag(false, "Active")}
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              )}
            </div>
          </section>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ marginTop: 24 }}>
          <section
            className="lg:col-span-6"
            data-wf="b-2-0"
            aria-labelledby="form-h"
            style={{ ...s.panel, padding: 24, alignSelf: "start" }}
          >
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 id="form-h" style={s.h2}>
                New / edit project
              </h2>
              <span style={s.label}>{editingId ? "Editing" : "New project"}</span>
            </div>
            <p style={{ ...s.muted, marginTop: 8 }}>
              {editingId
                ? `Changing the rate keeps every recorded entry as it is.`
                : `Created under ${client ? client.name : "the selected client"}.`}
            </p>
            <form id="project-form" onSubmit={saveProject} noValidate style={{ marginTop: 24 }}>
              <fieldset
                disabled={clientLocked}
                style={{ border: "none", margin: 0, padding: 0, minWidth: 0 }}
              >
                <div>
                  <Label htmlFor="project-name" style={s.label}>
                    Project name
                  </Label>
                  <Input
                    id="project-name"
                    data-wf="i-2-0-0"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "pn-err" : undefined}
                    placeholder="e.g. Website Redesign"
                    style={{ ...s.input, marginTop: 8 }}
                  />
                  {fieldError("pn-err", formErrors.name)}
                </div>
                <div style={{ marginTop: 24 }}>
                  <Label htmlFor="project-rate" style={s.label}>
                    Hourly bill rate (£, reporting only)
                  </Label>
                  <Input
                    id="project-rate"
                    data-wf="i-2-0-1"
                    inputMode="decimal"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    aria-invalid={!!formErrors.rate}
                    aria-describedby={formErrors.rate ? "pr-err" : "pr-help"}
                    placeholder="145.00"
                    style={{ ...s.input, marginTop: 8, fontVariantNumeric: "tabular-nums" }}
                  />
                  {formErrors.rate ? (
                    fieldError("pr-err", formErrors.rate)
                  ) : (
                    <p id="pr-help" style={{ ...s.muted, fontSize: 13, margin: 0, marginTop: 8 }}>
                      Zero or more, up to two decimals.
                    </p>
                  )}
                </div>
                <div className="flex items-start gap-3" style={{ marginTop: 24 }}>
                  <input
                    id="project-billable"
                    data-wf="i-2-0-2"
                    type="checkbox"
                    checked={form.defaultBillable}
                    onChange={(e) => setForm({ ...form, defaultBillable: e.target.checked })}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 2,
                      accentColor: brand.accentColor,
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <Label
                      htmlFor="project-billable"
                      style={{ fontSize: 15, color: brand.primaryColor }}
                    >
                      Default billable
                    </Label>
                    <p style={{ ...s.muted, fontSize: 13, margin: 0 }}>
                      New time entries on this project start as{" "}
                      {form.defaultBillable ? "billable" : "non-billable"}. Employees can change it
                      per entry.
                    </p>
                  </div>
                </div>
              </fieldset>
              {editingId && (
                <button
                  type="button"
                  style={{ ...btn("ghost"), marginTop: 24 }}
                  onClick={startNewProject}
                  disabled={clientLocked}
                >
                  <Icons.Plus className="w-4 h-4" aria-hidden="true" />
                  Start a new project instead
                </button>
              )}
              {clientLocked && (
                <p style={{ ...s.muted, marginTop: 16 }}>
                  Projects cannot be added or changed while {client.name} is archived.
                </p>
              )}
            </form>
          </section>

          <section
            className="lg:col-span-6"
            data-wf="b-2-1"
            aria-label={tasksHeading}
            style={{ ...s.panel, padding: 24, alignSelf: "start" }}
          >
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 id="tasks-h" style={s.h2}>
                {tasksHeading}
              </h2>
              {project && <span style={s.ref}>{project.ref}</span>}
            </div>
            {!project ? (
              <div style={{ marginTop: 16 }}>
                <Empty
                  title="Pick a project to see its tasks"
                  description="Select a project in the table, or save a new one, and its tasks will appear here."
                />
              </div>
            ) : (
              <>
                {projectTasks.length === 0 ? (
                  <div style={{ marginTop: 16 }}>
                    <Empty
                      title="No tasks yet"
                      description="Employees pick a task when they clock in or fill a timesheet row. Add the first one below."
                    />
                  </div>
                ) : (
                  <ul
                    aria-labelledby="tasks-h"
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      marginTop: 16,
                      borderTop: `1px solid ${hairline}`,
                    }}
                  >
                    {projectTasks.map((t, i) => (
                      <li
                        key={t.id}
                        className="vt-row-in flex items-center justify-between gap-3 flex-wrap"
                        style={{
                          borderBottom: `1px solid ${hairline}`,
                          padding: "8px 0",
                          minHeight: 56,
                        }}
                      >
                        <span
                          style={{ fontSize: 15, opacity: t.archived ? 0.65 : 1 }}
                          data-wf={i === 0 ? "i-2-1-0" : i === 1 ? "i-2-1-1" : undefined}
                        >
                          {t.name}
                        </span>
                        {t.archived ? (
                          statusTag(true, "Archived")
                        ) : archiveTaskId === t.id ? (
                          <span className="flex items-center gap-2 flex-wrap">
                            <span style={{ ...s.muted, fontSize: 13 }}>Hide from new entries?</span>
                            <button
                              type="button"
                              style={{ ...btn("primary"), minHeight: 44 }}
                              onClick={() => archiveTask(t.id)}
                            >
                              Archive {t.name}
                            </button>
                            <button
                              type="button"
                              style={btn("ghost")}
                              onClick={() => setArchiveTaskId(null)}
                            >
                              Keep
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            style={btn("ghost")}
                            data-wf={i === 0 ? "i-2-1-3" : undefined}
                            disabled={clientLocked}
                            onClick={() => setArchiveTaskId(t.id)}
                            aria-label={`Archive task ${t.name}`}
                          >
                            <Icons.Trash className="w-4 h-4" aria-hidden="true" />
                            Archive task
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <p style={{ ...s.muted, fontSize: 13, marginTop: 12 }}>
                  Archived tasks are not offered on new entries, but entries that already use them
                  still show the name.
                </p>

                <form onSubmit={addTask} noValidate style={{ marginTop: 24 }}>
                  <Label htmlFor="task-name" style={s.label}>
                    New task name
                  </Label>
                  <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
                    <Input
                      id="task-name"
                      value={taskName}
                      disabled={clientLocked}
                      onChange={(e) => {
                        setTaskName(e.target.value);
                        setTaskError("");
                      }}
                      aria-invalid={!!taskError}
                      aria-describedby={taskError ? "task-err" : undefined}
                      placeholder="e.g. Accessibility review"
                      style={{ ...s.input, flex: "1 1 180px", width: "auto" }}
                    />
                    <button
                      type="submit"
                      data-wf="i-2-1-2"
                      style={btn("outline")}
                      disabled={clientLocked}
                    >
                      <Icons.Plus className="w-4 h-4" aria-hidden="true" />
                      Add task
                    </button>
                  </div>
                  {fieldError("task-err", taskError)}
                </form>
              </>
            )}
          </section>
        </div>

        {/* Row 4 */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${hairline}` }}
        >
          <div className="lg:col-span-4" data-wf="b-3-0">
            <button
              type="submit"
              form="project-form"
              style={{ ...btn("primary"), width: "100%" }}
              disabled={clientLocked}
            >
              <Icons.Check className="w-4 h-4" aria-hidden="true" />
              Save project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
