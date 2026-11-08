// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "react-router-dom";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const { Button, Input, Label, Select, Table, THead, TBody, TR, TH, TD, Avatar } = UI;

const { Check, User, Users, Edit } = Icons;

const ROLES = ["Employee", "Manager", "Payroll Admin", "System Admin"];
const TIME_ZONES = [
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Lisbon",
];

const fromApi = (u) => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  role: u.role,
  timeZone: u.time_zone,
  managerId: u.manager_id,
  isActive: u.is_active,
});
const toApi = (p) => ({
  full_name: p.fullName,
  email: p.email,
  role: p.role,
  time_zone: p.timeZone,
  manager_id: p.managerId,
});
const FIELD_KEYS = {
  full_name: "fullName",
  email: "email",
  role: "role",
  time_zone: "timeZone",
  manager_id: "managerId",
};

const EMPTY_FORM = { fullName: "", email: "", role: "Employee", timeZone: "", managerId: "" };

export default function Screen() {
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [denied, setDenied] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [errors, setErrors] = React.useState({});
  const [banner, setBanner] = React.useState(null);
  const [confirming, setConfirming] = React.useState(false);
  const [freshId, setFreshId] = React.useState(null);

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
    apiFetch("/api/admin/users")
      .then((list) => setUsers(list.map(fromApi)))
      .catch((err) => {
        if (!guard(err)) setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);

  const formRef = React.useRef(null);
  const nameRef = React.useRef(null);

  const accent = brand.accentColor;
  const ink = brand.primaryColor;
  const muted = brand.neutralColor;
  const canvas = brand.backgroundColor;
  const surface = `color-mix(in srgb, white 5%, ${canvas})`;
  const surfaceLow = `color-mix(in srgb, black 18%, ${canvas})`;
  const hairline = "rgba(255,255,255,0.1)";
  const hairlineSoft = "rgba(255,255,255,0.07)";
  const errorTone = "rgb(232,150,140)";
  const radius = brand.radius;

  const serif = { fontFamily: brand.fontHeading };
  const label = {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: muted,
    fontWeight: 500,
  };
  const fieldStyle = (invalid) => ({
    width: "100%",
    minHeight: 44,
    padding: "8px 12px",
    backgroundColor: surfaceLow,
    color: ink,
    border: `1px solid ${invalid ? errorTone : hairline}`,
    borderRadius: radius,
    fontSize: 15,
    colorScheme: "dark",
  });
  const primaryBtn = {
    backgroundColor: accent,
    color: canvas,
    borderRadius: radius,
    minHeight: 44,
    padding: "0 20px",
    fontWeight: 600,
    border: `1px solid ${accent}`,
    letterSpacing: "0.02em",
  };
  const quietBtn = {
    backgroundColor: "transparent",
    color: ink,
    borderRadius: radius,
    minHeight: 44,
    padding: "0 20px",
    border: `1px solid ${hairline}`,
  };
  const thStyle = {
    ...label,
    textAlign: "left",
    padding: "12px 16px",
    borderBottom: `1px solid ${hairline}`,
    backgroundColor: "transparent",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "12px 16px",
    borderBottom: `1px solid ${hairlineSoft}`,
    color: ink,
    fontSize: 14,
    verticalAlign: "middle",
  };

  const byId = (id) => users.find((u) => u.id === id);
  const selected = selectedId ? byId(selectedId) : null;
  const activeCount = users.filter((u) => u.isActive).length;

  const managerOptions = users.filter(
    (u) => u.role === "Manager" && u.id !== selectedId && u.isActive,
  );

  const focusForm = () => {
    window.setTimeout(() => {
      if (formRef.current) formRef.current.scrollIntoView({ block: "nearest" });
      if (nameRef.current) nameRef.current.focus({ preventScroll: true });
    }, 0);
  };

  const startNew = () => {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setBanner(null);
    setConfirming(false);
    focusForm();
  };

  const selectUser = (u) => {
    setSelectedId(u.id);
    setForm({
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      timeZone: u.timeZone,
      managerId: u.managerId ? String(u.managerId) : "",
    });
    setErrors({});
    setBanner(null);
    setConfirming(false);
    focusForm();
  };

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    const name = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    if (!name) er.fullName = "Full name is required.";
    if (!email) er.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      er.email = "Enter an email address like name@company.com.";
    if (!form.role) er.role = "Choose a role.";
    if (!form.timeZone) er.timeZone = "Choose a time zone.";
    return er;
  };

  const fieldNames = {
    fullName: "Full name",
    email: "Email",
    role: "Role",
    timeZone: "Time zone",
    managerId: "Manager",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setConfirming(false);
    if (Object.keys(er).length > 0) {
      setErrors(er);
      setBanner({
        type: "error",
        text: `Not saved. Check ${Object.keys(er)
          .map((k) => fieldNames[k])
          .join(", ")} and try again. Nothing you typed has been lost.`,
      });
      return;
    }
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role: form.role,
      timeZone: form.timeZone,
      managerId: form.managerId ? Number(form.managerId) : null,
    };
    setErrors({});
    try {
      if (selected) {
        const saved = fromApi(
          await apiFetch(`/api/admin/users/${selected.id}`, {
            method: "PATCH",
            body: JSON.stringify(toApi(payload)),
          }),
        );
        setUsers((list) => list.map((u) => (u.id === saved.id ? saved : u)));
        setBanner({
          type: "success",
          text: `Saved. Changes to ${saved.fullName} apply from their next request.`,
        });
      } else {
        const saved = fromApi(
          await apiFetch("/api/admin/users", {
            method: "POST",
            body: JSON.stringify(toApi(payload)),
          }),
        );
        setUsers((list) => [...list, saved]);
        setSelectedId(saved.id);
        setFreshId(saved.id);
        setBanner({
          type: "success",
          text: `Account created for ${saved.fullName}. A link to set their password has been emailed to ${saved.email}.`,
        });
      }
    } catch (err) {
      if (guard(err)) return;
      if (err instanceof ApiError && err.status === 409) {
        const msg = err.body?.detail || "An account with this email already exists.";
        setErrors({ email: msg });
        setBanner({ type: "error", text: `Not saved. ${msg}` });
      } else if (err instanceof ApiError && err.status === 422 && Array.isArray(err.body?.detail)) {
        const er = {};
        for (const d of err.body.detail) {
          const key = FIELD_KEYS[d.loc?.[d.loc.length - 1]];
          if (key && !er[key]) er[key] = d.msg;
        }
        setErrors(er);
        setBanner({
          type: "error",
          text: `Not saved. Check ${Object.keys(er)
            .map((k) => fieldNames[k])
            .join(", ")} and try again. Nothing you typed has been lost.`,
        });
      } else {
        setBanner({ type: "error", text: "Not saved. Something went wrong. Try again." });
      }
    }
  };

  const deactivate = async () => {
    setConfirming(false);
    try {
      const saved = fromApi(
        await apiFetch(`/api/admin/users/${selectedId}/deactivate`, { method: "POST" }),
      );
      setUsers((list) => list.map((u) => (u.id === saved.id ? saved : u)));
      setBanner({
        type: "success",
        text: `${saved.fullName} is deactivated. They can no longer sign in, and their time entries are kept.`,
      });
    } catch (err) {
      if (guard(err)) return;
      const d = err instanceof ApiError ? err.body?.detail : null;
      setBanner({
        type: "error",
        text: typeof d === "string" ? d : "Could not deactivate. Try again.",
      });
    }
  };

  // First press of Deactivate asks for confirmation; a second press confirms.
  const askDeactivate = () => {
    if (confirming) {
      deactivate();
    } else {
      setConfirming(true);
    }
  };

  const isSelf = !!me && selectedId === me.id;
  const canDeactivate = !!selected && selected.isActive && !isSelf;

  const fieldBlock = (id, text, control, error, help) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} style={label}>
        {text}
      </Label>
      {control}
      {error ? (
        <p
          id={`${id}-msg`}
          className="flex items-start gap-2 text-sm"
          style={{ color: errorTone, margin: 0 }}
        >
          <AlertCircleIconSafe />
          <span>{error}</span>
        </p>
      ) : help ? (
        <p id={`${id}-msg`} className="text-sm" style={{ color: muted, margin: 0 }}>
          {help}
        </p>
      ) : null}
    </div>
  );

  function AlertCircleIconSafe() {
    return (
      <Icons.AlertCircle
        aria-hidden="true"
        className="shrink-0"
        style={{ width: 16, height: 16, marginTop: 2 }}
      />
    );
  }

  if (denied || loading || loadError) {
    return (
      <div
        style={{
          color: ink,
          fontFamily: brand.fontBody,
          backgroundColor: canvas,
          minHeight: "100%",
        }}
        className="px-4 py-8 md:px-8 md:py-12"
      >
        {denied ? (
          <p role="alert">Access denied. You do not have access to this resource.</p>
        ) : loading ? (
          <p role="status">Loading users…</p>
        ) : (
          <div role="alert">
            <p>Could not load users.</p>
            <Button type="button" onClick={load} style={quietBtn}>
              Try again
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{ color: ink, fontFamily: brand.fontBody, backgroundColor: canvas, minHeight: "100%" }}
      className="px-4 py-8 md:px-8 md:py-12"
    >
      <style>{`
        .vl-wrap button:focus-visible, .vl-wrap input:focus-visible, .vl-wrap select:focus-visible {
          outline: 2px solid ${accent}; outline-offset: 2px;
        }
        .vl-wrap button:not(:disabled), .vl-wrap select { cursor: pointer; }
        .vl-wrap button:disabled { opacity: 0.45; cursor: not-allowed; }
        .vl-btn { transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease; }
        .vl-btn-quiet:not(:disabled):hover { background-color: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.22) !important; }
        .vl-btn-primary:not(:disabled):hover { background-color: ${ink} !important; border-color: ${ink} !important; }
        .vl-row { transition: background-color 160ms ease; }
        .vl-row:hover { background-color: rgba(255,255,255,0.03); }
        .vl-name:hover { text-decoration: underline; text-underline-offset: 4px; }
        @keyframes vl-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .vl-enter { animation: vl-in 240ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .vl-enter { animation: none; }
          .vl-btn, .vl-row { transition: none; }
        }
      `}</style>

      <div className="vl-wrap mx-auto flex max-w-6xl flex-col gap-12">
        {/* Row 1 */}
        <header className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div data-wf="b-0-0" className="md:col-span-8">
            <p style={{ ...label, color: accent, margin: 0 }}>Administration · System Admin</p>
            <h1
              style={{
                ...serif,
                fontSize: 40,
                lineHeight: 1.15,
                fontWeight: 700,
                margin: "12px 0 0",
              }}
            >
              User administration
            </h1>
            <div
              aria-hidden="true"
              style={{ width: 48, height: 1, backgroundColor: accent, margin: "16px 0" }}
            />
            <p style={{ color: muted, fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
              Create accounts, set each person’s role and time zone, and record who they report to.
              Every user has exactly one role.
            </p>
          </div>
          <div className="flex md:col-span-4 md:justify-end">
            <Button
              data-wf="b-0-1"
              type="button"
              onClick={startNew}
              className="vl-btn vl-btn-primary inline-flex items-center justify-center gap-2"
              style={primaryBtn}
            >
              <Icons.Plus aria-hidden="true" style={{ width: 18, height: 18 }} />
              New user
            </Button>
          </div>
        </header>

        {/* Row 2 */}
        <section data-wf="b-1-0" aria-labelledby="users-heading">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="users-heading" style={{ ...serif, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Users
            </h2>
            <p
              style={{ color: muted, fontSize: 14, margin: 0, fontVariantNumeric: "tabular-nums" }}
            >
              <span style={{ color: accent }}>{users.length}</span> accounts ·{" "}
              <span style={{ color: accent }}>{activeCount}</span> active · choose a name to edit
            </p>
          </div>
          <div
            style={{
              backgroundColor: surface,
              border: `1px solid ${hairline}`,
              borderRadius: radius,
              borderTop: `1px solid ${accent}`,
            }}
            className="overflow-x-auto"
          >
            <Table
              aria-label="Users"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontVariantNumeric: "tabular-nums",
                minWidth: 820,
              }}
            >
              <THead>
                <TR>
                  <TH data-wf="i-1-0-0" scope="col" style={thStyle}>
                    Name
                  </TH>
                  <TH data-wf="i-1-0-1" scope="col" style={thStyle}>
                    Email
                  </TH>
                  <TH data-wf="i-1-0-2" scope="col" style={thStyle}>
                    Role
                  </TH>
                  <TH data-wf="i-1-0-3" scope="col" style={thStyle}>
                    Manager
                  </TH>
                  <TH data-wf="i-1-0-4" scope="col" style={thStyle}>
                    Time zone
                  </TH>
                  <TH data-wf="i-1-0-5" scope="col" style={thStyle}>
                    Status
                  </TH>
                </TR>
              </THead>
              <TBody>
                {users.map((u) => {
                  const mgr = u.managerId ? byId(u.managerId) : null;
                  const isSel = u.id === selectedId;
                  return (
                    <TR
                      key={u.id}
                      className={`vl-row ${u.id === freshId ? "vl-enter" : ""}`}
                      style={{
                        backgroundColor: isSel ? "rgba(255,255,255,0.06)" : undefined,
                        boxShadow: isSel ? `inset 2px 0 0 ${accent}` : undefined,
                      }}
                    >
                      <TD style={tdStyle}>
                        <div className="flex items-center gap-3">
                          <Avatar name={u.fullName} />
                          <div className="flex flex-col" style={{ minWidth: 0 }}>
                            <button
                              type="button"
                              className="vl-name"
                              onClick={() => selectUser(u)}
                              aria-current={isSel ? "true" : undefined}
                              aria-label={`Edit ${u.fullName}`}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                margin: 0,
                                color: ink,
                                fontSize: 15,
                                fontWeight: 600,
                                textAlign: "left",
                                borderRadius: 2,
                              }}
                            >
                              {u.fullName}
                            </button>
                            <span style={{ color: accent, fontSize: 12, letterSpacing: "0.08em" }}>
                              USR-{u.id}
                            </span>
                          </div>
                        </div>
                      </TD>
                      <TD style={{ ...tdStyle, color: muted }}>{u.email}</TD>
                      <TD style={tdStyle}>
                        <span
                          style={{
                            ...label,
                            color: ink,
                            border: `1px solid ${hairline}`,
                            borderRadius: radius,
                            padding: "4px 8px",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                          }}
                        >
                          {u.role}
                        </span>
                      </TD>
                      <TD style={{ ...tdStyle, color: mgr ? (mgr.isActive ? ink : muted) : muted }}>
                        {mgr ? (
                          mgr.fullName
                        ) : (
                          <span>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">No manager</span>
                          </span>
                        )}
                      </TD>
                      <TD style={{ ...tdStyle, color: muted, whiteSpace: "nowrap" }}>
                        {u.timeZone}
                      </TD>
                      <TD style={tdStyle}>
                        {u.isActive ? (
                          <span
                            className="inline-flex items-center gap-2"
                            style={{ color: accent, fontSize: 14 }}
                          >
                            <Icons.CheckCircle
                              aria-hidden="true"
                              style={{ width: 16, height: 16 }}
                            />
                            Active
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-2"
                            style={{ color: muted, fontSize: 14 }}
                          >
                            <Icons.X aria-hidden="true" style={{ width: 16, height: 16 }} />
                            Deactivated
                          </span>
                        )}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
        </section>

        {/* Row 3 */}
        <section
          ref={formRef}
          aria-labelledby="form-heading"
          onKeyDown={(e) => {
            if (e.key === "Escape" && confirming) setConfirming(false);
          }}
          className="grid grid-cols-1 items-end gap-6 md:grid-cols-12"
        >
          <div
            data-wf="b-2-0"
            className="md:col-span-8"
            style={{
              backgroundColor: surface,
              border: `1px solid ${hairline}`,
              borderTop: `1px solid ${accent}`,
              borderRadius: radius,
              padding: 24,
            }}
          >
            <div className="mb-6">
              <h2 id="form-heading" style={{ ...serif, fontSize: 24, fontWeight: 700, margin: 0 }}>
                New / edit user
              </h2>
              <p style={{ color: muted, fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>
                {selected ? (
                  <>
                    Editing <span style={{ color: ink }}>{selected.fullName}</span> ·{" "}
                    <span style={{ color: accent, letterSpacing: "0.08em" }}>
                      USR-{selected.id}
                    </span>
                    . Changes apply from their next request.
                  </>
                ) : (
                  <>
                    Creating a new account. A link to set their password is emailed to the new user.
                  </>
                )}
              </p>
            </div>

            {banner && (
              <div
                key={banner.text}
                className="vl-enter mb-6 flex items-start gap-3"
                role={banner.type === "error" ? "alert" : "status"}
                style={{
                  padding: "12px 16px",
                  borderRadius: radius,
                  border: `1px solid ${banner.type === "error" ? errorTone : accent}`,
                  backgroundColor: surfaceLow,
                  color: ink,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {banner.type === "error" ? (
                  <Icons.AlertCircle
                    aria-hidden="true"
                    style={{ width: 18, height: 18, marginTop: 1, color: errorTone, flexShrink: 0 }}
                  />
                ) : (
                  <Icons.CheckCircle
                    aria-hidden="true"
                    style={{ width: 18, height: 18, marginTop: 1, color: accent, flexShrink: 0 }}
                  />
                )}
                <span>{banner.text}</span>
              </div>
            )}

            {selected && !selected.isActive && (
              <p
                className="mb-6 flex items-start gap-3"
                style={{ color: muted, fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}
              >
                <Icons.AlertCircle
                  aria-hidden="true"
                  style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0 }}
                />
                <span>
                  This account is deactivated. {selected.fullName} can’t sign in or be chosen as a
                  manager, and their time entries are kept.
                </span>
              </p>
            )}

            <form
              id="user-form"
              onSubmit={handleSubmit}
              noValidate
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              {fieldBlock(
                "f-name",
                "Full name",
                <Input
                  data-wf="i-2-0-0"
                  id="f-name"
                  ref={nameRef}
                  value={form.fullName}
                  onChange={update("fullName")}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={errors.fullName ? "true" : undefined}
                  aria-describedby={errors.fullName ? "f-name-msg" : undefined}
                  style={fieldStyle(errors.fullName)}
                />,
                errors.fullName,
              )}
              {fieldBlock(
                "f-email",
                "Email",
                <Input
                  data-wf="i-2-0-1"
                  id="f-email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby="f-email-msg"
                  style={fieldStyle(errors.email)}
                />,
                errors.email,
                "Must be unique. This is what they sign in with.",
              )}
              {fieldBlock(
                "f-role",
                "Role",
                <select
                  data-wf="i-2-0-2"
                  id="f-role"
                  value={form.role}
                  onChange={update("role")}
                  aria-required="true"
                  aria-invalid={errors.role ? "true" : undefined}
                  aria-describedby={errors.role ? "f-role-msg" : undefined}
                  style={fieldStyle(errors.role)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>,
                errors.role,
              )}
              {fieldBlock(
                "f-tz",
                "Time zone",
                <select
                  data-wf="i-2-0-3"
                  id="f-tz"
                  value={form.timeZone}
                  onChange={update("timeZone")}
                  aria-required="true"
                  aria-invalid={errors.timeZone ? "true" : undefined}
                  aria-describedby={errors.timeZone ? "f-tz-msg" : undefined}
                  style={fieldStyle(errors.timeZone)}
                >
                  <option value="">Select a time zone</option>
                  {TIME_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>,
                errors.timeZone,
              )}
              {fieldBlock(
                "f-mgr",
                "Manager",
                <select
                  data-wf="i-2-0-4"
                  id="f-mgr"
                  value={form.managerId}
                  onChange={update("managerId")}
                  aria-invalid={errors.managerId ? "true" : undefined}
                  aria-describedby="f-mgr-msg"
                  style={fieldStyle(errors.managerId)}
                >
                  <option value="">No manager</option>
                  {managerOptions.map((m) => (
                    <option key={m.id} value={String(m.id)}>
                      {m.fullName}
                      {m.isActive ? "" : " (deactivated)"}
                    </option>
                  ))}
                </select>,
                errors.managerId,
                "Only active users with the Manager role are listed.",
              )}
            </form>
          </div>

          <div className="md:col-span-2">
            <Button
              data-wf="b-2-1"
              type="submit"
              form="user-form"
              className="vl-btn vl-btn-primary inline-flex w-full items-center justify-center gap-2"
              style={primaryBtn}
            >
              <Icons.Check aria-hidden="true" style={{ width: 18, height: 18 }} />
              Save
            </Button>
          </div>
          <div className="md:col-span-2">
            <Button
              data-wf="b-2-2"
              type="button"
              onClick={askDeactivate}
              disabled={!canDeactivate}
              aria-describedby={confirming ? "confirm-desc" : undefined}
              className="vl-btn vl-btn-quiet inline-flex w-full items-center justify-center gap-2"
              style={
                confirming && canDeactivate
                  ? { ...quietBtn, borderColor: errorTone, color: errorTone }
                  : quietBtn
              }
            >
              Deactivate
            </Button>
            {selected && isSelf && (
              <p style={{ color: muted, fontSize: 13, margin: "8px 0 0", lineHeight: 1.5 }}>
                You can’t deactivate your own account.
              </p>
            )}
          </div>

          {confirming && selected && (
            <div
              role="alert"
              aria-labelledby="confirm-title"
              className="vl-enter md:col-span-12"
              style={{
                padding: 24,
                borderRadius: radius,
                border: `1px solid ${errorTone}`,
                backgroundColor: surfaceLow,
              }}
            >
              <h3 id="confirm-title" style={{ ...serif, fontSize: 20, fontWeight: 600, margin: 0 }}>
                Deactivate {selected.fullName}?
              </h3>
              <p
                id="confirm-desc"
                style={{
                  color: muted,
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: "8px 0 0",
                  maxWidth: 620,
                }}
              >
                They will no longer be able to sign in and can’t be chosen as a manager. Their
                existing time entries are kept.
                {users.some((u) => u.managerId === selected.id)
                  ? " People who report to them keep this manager until you reassign them."
                  : ""}{" "}
                Press Deactivate again to confirm, or press Escape to cancel.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
