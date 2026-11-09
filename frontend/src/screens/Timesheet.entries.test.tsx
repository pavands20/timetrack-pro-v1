import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Timesheet from "./Timesheet";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const me = {
  id: 1,
  email: "a@x.co",
  full_name: "A",
  role: "Employee",
  time_zone: "Europe/London",
  home_path: "/home",
};
const PROJECTS = [
  {
    id: 1,
    name: "Web",
    client_name: "Acme",
    default_billable: false,
    tasks: [{ id: 2, name: "Design" }],
  },
];
const E1 = {
  id: 50,
  source: "manual",
  date: "2026-11-09",
  minutes: 120,
  project_id: 1,
  task_id: 2,
  project_name: "Web",
  task_name: "Design",
  billable: false,
};
const E2 = { ...E1, id: 60, source: "clock", date: "2026-11-10", minutes: 90 };
const week = (entries: unknown[]) => ({
  week_start: "2026-11-09",
  week_end: "2026-11-15",
  time_zone: "Europe/London",
  rows: [],
  entries,
  day_totals_minutes: [0, 0, 0, 0, 0, 0, 0],
  week_total_minutes: 0,
});

function setup(handlers: Record<string, (init?: RequestInit) => Response>) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    return handlers[key]?.(init) ?? json({ detail: "Not signed in" }, 401);
  });
  vi.stubGlobal("fetch", fn);
  render(
    <MemoryRouter initialEntries={["/timesheet"]}>
      <AuthProvider>
        <Routes>
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/sign-in" element={<p>sign in page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
  return fn;
}
const base = (entries: unknown[] = [E1, E2]) => ({
  "GET /api/auth/me": () => json(me),
  "GET /api/projects": () => json(PROJECTS),
  "GET /api/timesheets/2026-11-09": () => json(week(entries)),
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-11-11T12:00:00Z") });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Timesheet entries (US-015)", () => {
  it("[AC-039] lists entries and PATCHes a manual edit then refreshes", async () => {
    let entries = [E1, E2];
    const fn = setup({
      ...base(),
      "GET /api/timesheets/2026-11-09": () => json(week(entries)),
      "PATCH /api/time-entries/50": () => {
        entries = [{ ...E1, minutes: 180 }, E2];
        return json({});
      },
    });
    expect(
      await screen.findByText(/2026-11-09 · Web \/ Design · 2\.0 h · Non-billable/),
    ).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: /Edit Web \/ Design, 2026-11-09/ }));
    const hours = screen.getByLabelText("Hours");
    await userEvent.clear(hours);
    await userEvent.type(hours, "3");
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    expect(await screen.findByText(/2026-11-09 · Web \/ Design · 3\.0 h/)).toBeTruthy();
    const c = fn.mock.calls.find((x) => (x[1] as RequestInit)?.method === "PATCH")!;
    expect(JSON.parse((c[1] as RequestInit).body as string)).toMatchObject({
      work_date: "2026-11-09",
      minutes: 180,
      project_id: 1,
      task_id: 2,
      billable: false,
    });
  });

  it("[AC-039] clocked entries show day and hours read-only", async () => {
    const fn = setup(base());
    await userEvent.click(
      await screen.findByRole("button", { name: /Edit Web \/ Design, 2026-11-10/ }),
    );
    expect(screen.getByText(/1\.5 h \(clocked, read-only\)/)).toBeTruthy();
    expect(screen.queryByRole("textbox", { name: "Hours" })).toBeNull();
    fn.mockClear();
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    const c = fn.mock.calls.find((x) => (x[1] as RequestInit)?.method === "PATCH")!;
    const body = JSON.parse((c[1] as RequestInit).body as string);
    expect(body.minutes).toBeUndefined();
    expect(body.work_date).toBeUndefined();
  });

  it("[AC-039] 422 shows field messages and keeps input; 409 is an alert", async () => {
    let status = 422;
    setup({
      ...base(),
      "PATCH /api/time-entries/50": () =>
        status === 422
          ? json({ detail: [{ loc: ["body", "minutes"], msg: "Too many minutes." }] }, 422)
          : json({ detail: "That day already has this entry." }, 409),
    });
    await userEvent.click(
      await screen.findByRole("button", { name: /Edit Web \/ Design, 2026-11-09/ }),
    );
    const hours = screen.getByLabelText("Hours");
    await userEvent.clear(hours);
    await userEvent.type(hours, "5");
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    expect(await screen.findByText("Too many minutes.")).toBeTruthy();
    expect(screen.getByLabelText("Hours")).toHaveValue("5");
    status = 409;
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    expect(await screen.findByText("That day already has this entry.")).toBeTruthy();
    expect(screen.getByLabelText("Hours")).toHaveValue("5");
  });

  it("[AC-039] 401 on edit navigates to sign-in", async () => {
    setup({ ...base(), "PATCH /api/time-entries/50": () => json({ detail: "x" }, 401) });
    await userEvent.click(
      await screen.findByRole("button", { name: /Edit Web \/ Design, 2026-11-09/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    expect(await screen.findByText("sign in page")).toBeTruthy();
  });

  it("[AC-040] delete confirms, calls DELETE and the entry disappears; cancel changes nothing", async () => {
    let entries = [E1, E2];
    const fn = setup({
      ...base(),
      "GET /api/timesheets/2026-11-09": () => json(week(entries)),
      "DELETE /api/time-entries/50": () => {
        entries = [E2];
        return new Response(null, { status: 204 });
      },
    });
    const del = await screen.findByRole("button", { name: /Delete Web \/ Design, 2026-11-09/ });
    await userEvent.click(del);
    expect(screen.getByText("Delete this entry?")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Delete this entry?")).toBeNull();
    expect(fn.mock.calls.some((c) => (c[1] as RequestInit)?.method === "DELETE")).toBe(false);
    await userEvent.click(del);
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    await vi.waitFor(() => expect(screen.queryByText(/2026-11-09 · Web/)).toBeNull());
    expect(screen.getByText(/2026-11-10 · Web/)).toBeTruthy();
  });

  it("[AC-041] a 404 on delete shows the message and refreshes", async () => {
    let entries = [E1, E2];
    setup({
      ...base(),
      "GET /api/timesheets/2026-11-09": () => json(week(entries)),
      "DELETE /api/time-entries/50": () => {
        entries = [E2];
        return json({ detail: "Time entry not found." }, 404);
      },
    });
    await userEvent.click(
      await screen.findByRole("button", { name: /Delete Web \/ Design, 2026-11-09/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(await screen.findByText("This entry is no longer available.")).toBeTruthy();
    expect(screen.queryByText(/2026-11-09 · Web/)).toBeNull();
  });

  it("[AC-041] a 404 on edit shows the message", async () => {
    setup({
      ...base(),
      "PATCH /api/time-entries/50": () => json({ detail: "Time entry not found." }, 404),
    });
    await userEvent.click(
      await screen.findByRole("button", { name: /Edit Web \/ Design, 2026-11-09/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Save entry" }));
    expect(await screen.findByText("This entry is no longer available.")).toBeTruthy();
  });
});
