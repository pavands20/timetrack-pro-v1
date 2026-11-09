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
  {
    id: 3,
    name: "Ops",
    client_name: "Acme",
    default_billable: true,
    tasks: [{ id: 4, name: "Admin" }],
  },
];
const week = (rows: unknown[] = [], start = "2026-11-09") => ({
  week_start: start,
  week_end: "2026-11-15",
  time_zone: "Europe/London",
  rows,
  day_totals_minutes: [0, 0, 0, 0, 0, 0, 0],
  week_total_minutes: 0,
});
const day = (i: number, manual = 0, clocked = 0) => ({
  date: `2026-11-${String(9 + i).padStart(2, "0")}`,
  manual_minutes: manual,
  clocked_minutes: clocked,
  manual_entry_id: manual ? 50 + i : null,
  clocked_entry_ids: clocked ? [60 + i] : [],
});
const ROW = {
  project_id: 1,
  project_name: "Web",
  client_name: "Acme",
  task_id: 2,
  task_name: "Design",
  task_archived: false,
  billable: false,
  days: [0, 1, 2, 3, 4, 5, 6].map((i) => day(i, i === 0 ? 120 : 0, i === 1 ? 180 : 0)),
};

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
const base = (rows: unknown[] = []) => ({
  "GET /api/auth/me": () => json(me),
  "GET /api/projects": () => json(PROJECTS),
  "GET /api/timesheets/2026-11-09": () => json(week(rows)),
});
const bodyOf = (fn: ReturnType<typeof setup>, method: string, url: string) => {
  const c = fn.mock.calls.find((x) => x[0] === url && (x[1] as RequestInit)?.method === method)!;
  return JSON.parse((c[1] as RequestInit).body as string);
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-11-11T12:00:00Z") });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Timesheet", () => {
  it("[AC-035] the week runs Monday to Sunday in the user's zone and navigation moves whole weeks", async () => {
    const fn = setup({
      ...base(),
      "GET /api/timesheets/2026-11-16": () => json(week([], "2026-11-16")),
    });
    expect(await screen.findByText("Timesheet: 9 Nov – 15 Nov 2026")).toBeInTheDocument();
    expect(screen.getByText(/Monday to Sunday · Europe\/London/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next week" }));
    expect(await screen.findByText("Timesheet: 16 Nov – 22 Nov 2026")).toBeInTheDocument();
    expect(fn.mock.calls.some((c) => c[0] === "/api/timesheets/2026-11-16")).toBe(true);
  });

  it("[AC-036] clocked time shows next to typed hours and is in the totals", async () => {
    setup(base([ROW]));
    expect(await screen.findByText("+ 3.0 h clocked")).toBeInTheDocument();
    expect(screen.getByText("Clocked")).toBeInTheDocument();
    expect(screen.getByLabelText(/Hours on Mon 9 Nov for Web/)).toHaveValue("2");
    expect(screen.getByText(/Week total/)).toHaveTextContent("5.0 h");
  });

  it("[AC-038] a new row takes the project's default billable, shown before saving", async () => {
    setup(base());
    await screen.findByText(/No hours on this week yet/);
    await userEvent.click(screen.getAllByRole("button", { name: /Add row/ })[0]);
    expect(screen.getByRole("checkbox")).toBeChecked();
    await userEvent.selectOptions(screen.getByLabelText(/Project for/), "1");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByText("Non-billable")).toBeInTheDocument();
  });

  it("[AC-033] saving a new row PUTs minutes and shows server totals", async () => {
    const saved = week([
      { ...ROW, days: [0, 1, 2, 3, 4, 5, 6].map((i) => day(i, i === 0 ? 450 : 0)) },
    ]);
    const fn = setup({ ...base(), "PUT /api/timesheets/cells": () => json(saved) });
    await screen.findByText(/No hours on this week yet/);
    await userEvent.click(screen.getAllByRole("button", { name: /Add row/ })[0]);
    await userEvent.selectOptions(screen.getByLabelText(/Project for/), "1");
    await userEvent.type(screen.getByLabelText(/Hours on Mon 9 Nov/), "7.5");
    await userEvent.click(screen.getByRole("button", { name: "Save timesheet" }));
    expect(await screen.findByText(/Timesheet saved/)).toBeInTheDocument();
    expect(bodyOf(fn, "PUT", "/api/timesheets/cells")).toEqual({
      week_start: "2026-11-09",
      cells: [{ project_id: 1, task_id: 2, billable: false, date: "2026-11-09", minutes: 450 }],
    });
    expect(screen.getByText(/Week total/)).toHaveTextContent("7.5 h");
    expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
  });

  it.each([
    ["-1", /can't be negative/],
    ["abc", /as a number/],
    ["25", /more than 24 hours/],
  ])("[AC-034] hours %s is rejected without a request", async (value, msg) => {
    const fn = setup(base());
    await screen.findByText(/No hours on this week yet/);
    await userEvent.click(screen.getAllByRole("button", { name: /Add row/ })[0]);
    await userEvent.selectOptions(screen.getByLabelText(/Project for/), "1");
    await userEvent.type(screen.getByLabelText(/Hours on Tue 10 Nov/), value);
    await userEvent.click(screen.getByRole("button", { name: "Save timesheet" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(msg);
    expect(alert).toHaveTextContent(/Web \/ Design, Tue/);
    expect(screen.getByLabelText(/Hours on Tue 10 Nov/)).toHaveValue(value);
    expect(fn.mock.calls.some((c) => (c[1] as RequestInit)?.method === "PUT")).toBe(false);
  });

  it("[AC-034] a server 422 is mapped to the row and day", async () => {
    setup({
      ...base(),
      "PUT /api/timesheets/cells": () =>
        json(
          {
            detail: [{ loc: ["body", "cells", 0, "minutes"], msg: "Day total is over 24 hours." }],
          },
          422,
        ),
    });
    await screen.findByText(/No hours on this week yet/);
    await userEvent.click(screen.getAllByRole("button", { name: /Add row/ })[0]);
    await userEvent.selectOptions(screen.getByLabelText(/Project for/), "1");
    await userEvent.type(screen.getByLabelText(/Hours on Wed 11 Nov/), "5");
    await userEvent.click(screen.getByRole("button", { name: "Save timesheet" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Web / Design, Wed: Day total is over 24 hours.",
    );
    expect(screen.getByLabelText(/Hours on Wed 11 Nov/)).toHaveValue("5");
  });

  it("[AC-037] changing billable on a saved row PATCHes its entries", async () => {
    let loads = 0;
    const fn = setup({
      ...base([ROW]),
      "PATCH /api/time-entries/50": () =>
        json({ id: 50, project_id: 1, task_id: 2, billable: true, source: "manual" }),
      "PATCH /api/time-entries/61": () =>
        json({ id: 61, project_id: 1, task_id: 2, billable: true, source: "clock" }),
      "GET /api/timesheets/2026-11-09": () => json(week([{ ...ROW, billable: ++loads > 1 }])),
    });
    await userEvent.click(await screen.findByRole("checkbox"));
    expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Save timesheet" }));
    expect(await screen.findByText(/Timesheet saved/)).toBeInTheDocument();
    expect(bodyOf(fn, "PATCH", "/api/time-entries/50")).toEqual({ billable: true });
    expect(fn.mock.calls.some((c) => c[0] === "/api/timesheets/cells")).toBe(false);
  });

  it("[AC-033] 401 navigates to sign-in", async () => {
    setup({ "GET /api/auth/me": () => json(me) });
    expect(await screen.findByText("sign in page")).toBeInTheDocument();
  });

  it("[AC-033] a load failure offers retry", async () => {
    setup({
      "GET /api/auth/me": () => json(me),
      "GET /api/projects": () => json(PROJECTS),
      "GET /api/timesheets/2026-11-09": () => json({}, 500),
    });
    expect(await screen.findByText("Could not load the timesheet.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
