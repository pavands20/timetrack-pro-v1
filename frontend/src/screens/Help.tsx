// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Select, Table, THead, TBody, TR, TH, TD, Tabs } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { User, Home, Clock } = Icons;

const HELP_TABS = [
  { key: "user", label: "User guide" },
  { key: "admin", label: "Admin guide" },
  { key: "docs", label: "Project documentation" },
];

const TAB_WF = { user: "i-1-0-0", admin: "i-1-0-1", docs: "i-1-0-2" };

const LEADS = {
  user: "User guide: clocking in and out, taking breaks, filling the weekly timesheet, editing entries and reading the dashboard.",
  admin:
    "Admin guide: creating users, assigning managers, setting up clients, projects, tasks and bill rates.",
  docs: "Project documentation: stack, setup, email service API key and EU/UK hosting region.",
};

const GUIDES = {
  user: [
    {
      id: "u1",
      ref: "UG-01",
      title: "Clocking in and out",
      summary: "Record working time live from the browser, without doing the sums yourself.",
      steps: [
        "Open Home and choose a project and a task. Mark the entry billable or non-billable; it starts from the project default.",
        "Select Clock in. A running entry starts at the current time and is shown as in progress.",
        "You can only be clocked in once. A second clock-in is refused with a message until you clock out.",
        "Select Clock out to close the entry. Its duration, net of breaks, lands on that day of your timesheet.",
        "Forgot to clock out yesterday? The clock page alerts you the next time you open the app, and you can set the correct end time. An end time earlier than the start is rejected.",
      ],
      link: { label: "Open the clock", route: "home" },
    },
    {
      id: "u2",
      ref: "UG-02",
      title: "Taking breaks",
      summary: "Break time is taken out of your worked hours.",
      steps: [
        "While an entry is running, select Start break. Select End break when you are back.",
        "Each break is saved with its start and end times and subtracted from the entry.",
        "Only one break can run at a time. Starting a second one is refused.",
        "If you clock out while on a break, the break ends at the clock-out time and the entry closes.",
      ],
    },
    {
      id: "u3",
      ref: "UG-03",
      title: "Filling the weekly timesheet",
      summary: "An alternative to the clock: enter hours by day, per project and task.",
      steps: [
        "The week runs Monday to Sunday. Use the arrows to move between weeks.",
        "Add a row, pick a project and task, then type hours in one or more day cells.",
        "Hours must be a number from 0 to 24 for each day. Negative, non-numeric or larger values are rejected.",
        "Entries you clocked appear on the correct days next to hours you typed. Daily and weekly totals update as you save.",
        "Each row shows Billable or Non-billable before you save. If you make no choice it takes the project default, or billable if the project has none.",
      ],
      link: { label: "Open the weekly timesheet", route: "timesheet" },
    },
    {
      id: "u4",
      ref: "UG-04",
      title: "Editing and deleting entries",
      summary: "Fix mistakes on your own entries at any time in this version.",
      steps: [
        "Change the day, hours, project, task or billable flag on an entry and save. Totals recalculate.",
        "To delete an entry, confirm the deletion. It is removed from your timesheet and totals.",
        "You can only see and change your own entries. Requests for anyone else’s are denied.",
      ],
    },
    {
      id: "u5",
      ref: "UG-05",
      title: "Reading the dashboard",
      summary: "Your current week at a glance.",
      steps: [
        "The dashboard shows total hours for the week, hours per day, and the split between billable and non-billable.",
        "Figures update when you record or delete an entry; return to Home to see the change.",
        "With no entries this week you will see zero hours and links to the clock and the timesheet.",
        "All times display in the time zone on your profile, including across daylight-saving changes.",
      ],
      link: { label: "Go to your dashboard", route: "home" },
    },
  ],
  admin: [
    {
      id: "a1",
      ref: "AG-01",
      title: "Creating users",
      summary: "System Admins create every account by hand; there is no import or SSO.",
      steps: [
        "Open User administration and choose New user.",
        "Enter full name, a unique email, one role (Employee, Manager, Payroll Admin or System Admin) and a time zone.",
        "A missing required field is highlighted and nothing is created. An email already in use is rejected with a duplicate-email message.",
        "The new user then sets a password and can sign in.",
      ],
      link: { label: "Open user administration", route: "admin-users" },
    },
    {
      id: "a2",
      ref: "AG-02",
      title: "Assigning managers",
      summary: "Records the reporting line for later approval features.",
      steps: [
        "Open an employee’s record and choose a manager.",
        "Only users with the Manager role can be assigned. Anyone else is refused.",
        "Deactivated users cannot be picked as a new manager.",
        "You can also edit name, role, manager or time zone, and deactivate a user who has left. Their time entries are kept and they can no longer sign in.",
      ],
    },
    {
      id: "a3",
      ref: "AG-03",
      title: "Setting up clients",
      summary: "Clients group projects. Names must be unique.",
      steps: [
        "Open Clients, projects and tasks and add a client.",
        "Archiving a client stops its projects receiving new time entries. Existing entries stay visible.",
      ],
      link: { label: "Open clients and projects", route: "admin-projects" },
    },
    {
      id: "a4",
      ref: "AG-04",
      title: "Projects and bill rates",
      summary: "The hourly bill rate is held per project, for reporting only.",
      steps: [
        "Create a project under a client with a name and an hourly bill rate of zero or more.",
        "A negative or non-numeric rate is rejected with a validation message.",
        "Changing a rate stores the new one. Existing time entries are not deleted or altered.",
        "Set whether the project is billable by default; new entries start from that value.",
        "There is no invoicing or payment function anywhere in this release.",
      ],
    },
    {
      id: "a5",
      ref: "AG-05",
      title: "Tasks",
      summary: "Tasks are what employees charge time to within a project.",
      steps: [
        "Add a task with a name under a project; it is available for selection straight away.",
        "Archive a task to stop it being offered on new entries. Older entries that used it still display it.",
      ],
    },
  ],
};

const DOC_SECTIONS = [
  {
    id: "d1",
    ref: "PD-01",
    title: "Stack",
    summary: "What TimeTrack Pro is built on. These are working assumptions, still open.",
    steps: [
      "Frontend: React 19 and TypeScript, responsive in the browser. No native mobile app.",
      "Backend: Node.js REST API.",
      "Database: PostgreSQL. Times are stored in UTC and shown in each user’s time zone; the week starts on Monday.",
      "Authentication: hashed passwords, session cookies and password reset by email. SSO is not included.",
    ],
  },
  {
    id: "d2",
    ref: "PD-02",
    title: "Setup",
    summary: "From an empty database to a first sign-in.",
    steps: [
      "Provision a PostgreSQL database in an EU or UK region and run the schema migrations.",
      "Set the configuration values listed below, then start the API and serve the frontend.",
      "Create the first System Admin account directly in the database. All other initial data is entered manually in the app: users, managers, clients, projects, tasks.",
      "Sign in as that admin, create users and assign managers, then set up clients, projects, tasks and bill rates.",
    ],
  },
];

const CONFIG_ROWS = [
  {
    key: "DATABASE_URL",
    purpose: "PostgreSQL connection string for the EU/UK database.",
    status: "Required",
  },
  {
    key: "SESSION_SECRET",
    purpose: "Signs session cookies. Sessions are stored as hashed tokens.",
    status: "Required",
  },
  {
    key: "EMAIL_SERVICE_API_KEY",
    purpose: "Sends password reset links. Without it, reset requests cannot deliver email.",
    status: "Not yet supplied",
  },
  {
    key: "HOSTING_REGION",
    purpose: "Region for the API, database and backups. Personal data stays in the EU or UK.",
    status: "EU/UK",
  },
];

export default function Screen() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState("user");
  const [open, setOpen] = React.useState({ u1: true, a1: true, d1: true });
  const tabsRef = React.useRef(null);

  React.useEffect(() => {
    if (!tabsRef.current) return;
    const btns = tabsRef.current.querySelectorAll("button");
    HELP_TABS.forEach((t, i) => {
      if (btns[i]) btns[i].setAttribute("data-wf", TAB_WF[t.key]);
    });
  }, [tab]);

  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const hairline = "1px solid rgba(255,255,255,0.1)";
  const surface = "rgba(255,255,255,0.04)";
  const label = {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: brand.neutralColor,
    fontFamily: brand.fontBody,
  };

  const sections = tab === "docs" ? DOC_SECTIONS : GUIDES[tab];

  const renderSection = (s, extra) => {
    const isOpen = !!open[s.id];
    return (
      <li key={s.id} style={{ borderTop: hairline, listStyle: "none" }}>
        <h3 style={{ margin: 0 }}>
          <button
            type="button"
            onClick={() => toggle(s.id)}
            aria-expanded={isOpen}
            aria-controls={"panel-" + s.id}
            className="help-acc w-full flex items-start gap-4 text-left"
            style={{
              padding: "24px 0",
              background: "transparent",
              border: 0,
              cursor: "pointer",
              color: brand.primaryColor,
              fontFamily: brand.fontBody,
              borderRadius: brand.radius,
            }}
          >
            <span
              style={{
                color: brand.accentColor,
                fontFamily: brand.fontHeading,
                fontVariantNumeric: "tabular-nums",
                fontSize: 14,
                letterSpacing: "0.08em",
                width: 56,
                flexShrink: 0,
                paddingTop: 6,
              }}
            >
              {s.ref}
            </span>
            <span className="flex-1 min-w-0">
              <span
                style={{
                  display: "block",
                  fontFamily: brand.fontHeading,
                  fontSize: 22,
                  lineHeight: 1.3,
                }}
              >
                {s.title}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: brand.neutralColor,
                  marginTop: 4,
                }}
              >
                {s.summary}
              </span>
            </span>
            <span
              aria-hidden="true"
              style={{
                color: brand.neutralColor,
                paddingTop: 8,
                transition: "transform 200ms ease",
                transform: isOpen ? "rotate(180deg)" : "none",
              }}
            >
              <Icons.ChevronDown width={20} height={20} />
            </span>
          </button>
        </h3>
        <div
          id={"panel-" + s.id}
          role="region"
          aria-label={s.title}
          className="help-collapse"
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 240ms ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 0 32px 72px", visibility: isOpen ? "visible" : "hidden" }}>
              <ol style={{ margin: 0, padding: 0, maxWidth: "68ch" }}>
                {s.steps.map((st, i) => (
                  <li
                    key={i}
                    className="flex gap-3"
                    style={{
                      listStyle: "none",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: brand.primaryColor,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        color: brand.accentColor,
                        fontVariantNumeric: "tabular-nums",
                        width: 20,
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span>{st}</span>
                  </li>
                ))}
              </ol>
              {s.link && (
                <div style={{ marginTop: 16 }}>
                  <Button
                    variant="outline"
                    onClick={() => navigate(s.link.route)}
                    style={{
                      borderColor: brand.accentColor,
                      color: brand.accentColor,
                      backgroundColor: "transparent",
                      borderRadius: brand.radius,
                      minHeight: 44,
                    }}
                  >
                    {s.link.label}
                    <Icons.ArrowRight
                      width={16}
                      height={16}
                      aria-hidden="true"
                      style={{ marginLeft: 8 }}
                    />
                  </Button>
                </div>
              )}
              {extra}
            </div>
          </div>
        </div>
      </li>
    );
  };

  const keyMissing = (
    <div
      className="flex items-start gap-3"
      role="note"
      style={{
        marginTop: 8,
        padding: 16,
        border: hairline,
        borderLeft: "1px solid " + brand.accentColor,
        borderRadius: brand.radius,
        backgroundColor: surface,
        maxWidth: "68ch",
      }}
    >
      <span aria-hidden="true" style={{ color: brand.accentColor, paddingTop: 2 }}>
        <Icons.AlertCircle width={18} height={18} />
      </span>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: brand.primaryColor }}>
        <strong style={{ fontWeight: 600 }}>Email service API key: not yet supplied.</strong>{" "}
        Sign-in works without it, but password reset emails will not be sent until the key is set.
      </p>
    </div>
  );

  return (
    <div
      style={{
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        backgroundColor: brand.backgroundColor,
        minHeight: "100%",
        padding: "48px 32px 64px",
      }}
    >
      <style>{`
        .help-acc:focus-visible, .help-wrap button:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 2px; }
        .help-acc:hover span[style*="Baskerville"] { text-decoration: underline; text-decoration-color: ${brand.accentColor}; text-underline-offset: 6px; }
        .help-fade { animation: helpfade 220ms ease both; }
        @keyframes helpfade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .help-fade, .help-collapse, .help-acc span { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="help-wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div data-wf="b-0-0" style={{ marginBottom: 32 }}>
          <p style={{ ...label, margin: "0 0 12px", color: brand.accentColor }}>Reference</p>
          <h1
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 40,
              lineHeight: 1.15,
              fontWeight: 400,
              margin: 0,
              color: brand.primaryColor,
            }}
          >
            Help and guides
          </h1>
          <div
            aria-hidden="true"
            style={{ width: 64, height: 1, backgroundColor: brand.accentColor, marginTop: 24 }}
          />
        </div>

        <div data-wf="b-1-0" ref={tabsRef} style={{ marginBottom: 32 }}>
          <Tabs tabs={HELP_TABS} active={tab} onChange={setTab} />
        </div>

        <div data-wf="b-2-0" key={tab} className="help-fade" style={{ marginBottom: 32 }}>
          <p style={{ ...label, margin: "0 0 12px" }}>
            {HELP_TABS.find((t) => t.key === tab).label}
          </p>
          <p
            style={{
              fontFamily: brand.fontHeading,
              fontSize: 20,
              lineHeight: 1.5,
              margin: "0 0 32px",
              maxWidth: "60ch",
            }}
          >
            {LEADS[tab]}
          </p>

          <ul style={{ margin: 0, padding: 0, borderBottom: hairline }}>
            {sections.map((s) => renderSection(s, s.id === "d2" ? null : null))}
            {tab === "docs" && (
              <li style={{ borderTop: hairline, listStyle: "none" }}>
                <div style={{ padding: "24px 0 32px" }}>
                  <div className="flex items-baseline gap-4" style={{ marginBottom: 16 }}>
                    <span
                      style={{
                        color: brand.accentColor,
                        fontFamily: brand.fontHeading,
                        fontSize: 14,
                        letterSpacing: "0.08em",
                        width: 56,
                        flexShrink: 0,
                      }}
                    >
                      PD-03
                    </span>
                    <h3
                      style={{
                        fontFamily: brand.fontHeading,
                        fontSize: 22,
                        fontWeight: 400,
                        margin: 0,
                      }}
                    >
                      Configuration and hosting region
                    </h3>
                  </div>
                  <div style={{ paddingLeft: 72 }}>
                    <div
                      style={{
                        border: hairline,
                        borderRadius: brand.radius,
                        backgroundColor: surface,
                        overflowX: "auto",
                      }}
                    >
                      <Table style={{ width: "100%", fontVariantNumeric: "tabular-nums" }}>
                        <THead>
                          <TR>
                            <TH
                              style={{
                                ...label,
                                textAlign: "left",
                                padding: "12px 16px",
                                fontWeight: 400,
                              }}
                            >
                              Setting
                            </TH>
                            <TH
                              style={{
                                ...label,
                                textAlign: "left",
                                padding: "12px 16px",
                                fontWeight: 400,
                              }}
                            >
                              What it does
                            </TH>
                            <TH
                              style={{
                                ...label,
                                textAlign: "left",
                                padding: "12px 16px",
                                fontWeight: 400,
                              }}
                            >
                              Status
                            </TH>
                          </TR>
                        </THead>
                        <TBody>
                          {CONFIG_ROWS.map((r) => (
                            <TR key={r.key} style={{ borderTop: hairline }}>
                              <TD
                                style={{
                                  padding: "16px",
                                  fontFamily: "ui-monospace, Menlo, monospace",
                                  fontSize: 13,
                                  color: brand.accentColor,
                                  whiteSpace: "nowrap",
                                  verticalAlign: "top",
                                }}
                              >
                                {r.key}
                              </TD>
                              <TD
                                style={{
                                  padding: "16px",
                                  fontSize: 14,
                                  lineHeight: 1.5,
                                  verticalAlign: "top",
                                }}
                              >
                                {r.purpose}
                              </TD>
                              <TD
                                style={{
                                  padding: "16px",
                                  verticalAlign: "top",
                                  whiteSpace: "nowrap",
                                  fontSize: 13,
                                }}
                              >
                                <span className="inline-flex items-center gap-2">
                                  <span
                                    aria-hidden="true"
                                    style={{
                                      color:
                                        r.status === "Not yet supplied"
                                          ? brand.neutralColor
                                          : brand.accentColor,
                                    }}
                                  >
                                    {r.status === "Not yet supplied" ? (
                                      <Icons.AlertCircle width={16} height={16} />
                                    ) : (
                                      <Icons.CheckCircle width={16} height={16} />
                                    )}
                                  </span>
                                  {r.status}
                                </span>
                              </TD>
                            </TR>
                          ))}
                        </TBody>
                      </Table>
                    </div>
                    <div style={{ marginTop: 16 }}>{keyMissing}</div>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: brand.neutralColor,
                        maxWidth: "68ch",
                        marginTop: 16,
                      }}
                    >
                      Hosting region: personal data is hosted in an EU or UK region. Keep the
                      database, API and backups in that region.
                    </p>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div
          data-wf="b-3-0"
          style={{
            padding: 24,
            border: hairline,
            borderRadius: brand.radius,
            backgroundColor: surface,
          }}
        >
          <p style={{ ...label, margin: "0 0 12px" }}>In this help centre</p>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: "68ch" }}>
            Admin guide: creating users, assigning managers, setting up clients, projects, tasks and
            bill rates. Project documentation: stack, setup, email service API key and EU/UK hosting
            region.
          </p>
        </div>
      </div>
    </div>
  );
}
