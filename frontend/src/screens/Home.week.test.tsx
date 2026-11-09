import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Home from "./Home";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const me = {
  id: 1,
  email: "a@x.co",
  full_name: "A",
  role: "Employee",
  time_zone: "Europe/London",
  home_path: "/home",
};
const dates = [
  "2026-11-02",
  "2026-11-03",
  "2026-11-04",
  "2026-11-05",
  "2026-11-06",
  "2026-11-07",
  "2026-11-08",
];
const mins = [120, 60, 0, 0, 0, 0, 0];
const WEEK = {
  week_start: "2026-11-02",
  week_end: "2026-11-08",
  time_zone: "Europe/London",
  total_minutes: 180,
  billable_minutes: 120,
  non_billable_minutes: 60,
  has_entries: true,
  days: dates.map((date, i) => ({
    date,
    total_minutes: mins[i],
    billable_minutes: i === 0 ? 120 : 0,
    non_billable_minutes: i === 1 ? 60 : 0,
  })),
};
const EMPTY = {
  ...WEEK,
  total_minutes: 0,
  billable_minutes: 0,
  non_billable_minutes: 0,
  has_entries: false,
};

function setup(week: () => Response) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    const h: Record<string, () => Response> = {
      "GET /api/auth/me": () => json(me),
      "GET /api/projects": () => json([]),
      "GET /api/clock/status": () => json({ entry: null }),
      "GET /api/dashboard/week": week,
    };
    return h[key]?.() ?? json({ detail: "x" }, 401);
  });
  vi.stubGlobal("fetch", fn);
  render(
    <MemoryRouter initialEntries={["/home"]}>
      <AuthProvider>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<p>sign in page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
  return fn;
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-11-05T12:00:00Z") });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Home weekly dashboard (US-016)", () => {
  it("[AC-042] shows totals, split, real week range and today", async () => {
    setup(() => json(WEEK));
    expect(await screen.findByText("2.0 h")).toBeInTheDocument();
    expect(screen.getByText("1.0 h")).toBeInTheDocument();
    expect(screen.getByText(/Week of Mon 2 to Sun 8 Nov 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Thursday 2026-11-05: 0.0 hours.*today/)).toBeInTheDocument();
  });

  it("[AC-043] empty week shows 0.0 and links", async () => {
    setup(() => json(EMPTY));
    expect(await screen.findByText(/Nothing recorded yet this week/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "fill in the weekly timesheet" }),
    ).toBeInTheDocument();
  });

  it("[AC-044] the dashboard is fetched on mount", async () => {
    const fn = setup(() => json(WEEK));
    await screen.findByText("2.0 h");
    expect(fn.mock.calls.filter((c) => c[0] === "/api/dashboard/week")).toHaveLength(1);
  });

  it("[AC-042] failed load shows message and Try again reloads", async () => {
    let ok = false;
    setup(() => (ok ? json(WEEK) : json({}, 500)));
    expect(await screen.findByText("Could not load your weekly hours.")).toBeInTheDocument();
    ok = true;
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("2.0 h")).toBeInTheDocument();
  });

  it("[AC-042] 401 navigates to sign-in", async () => {
    setup(() => json({ detail: "no" }, 401));
    expect(await screen.findByText("sign in page")).toBeInTheDocument();
  });
});
