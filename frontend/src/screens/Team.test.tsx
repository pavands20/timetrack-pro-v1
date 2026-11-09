import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Team from "./Team";
import TeamMember from "./TeamMember";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const me = {
  id: 1,
  email: "m@x.co",
  full_name: "M",
  role: "Manager",
  time_zone: "Europe/London",
  home_path: "/home",
};
const WEEK = {
  user_id: 5,
  user_name: "Eve",
  time_zone: "America/New_York",
  week_start: "2026-11-02",
  week_end: "2026-11-08",
  entries: [
    {
      id: 1,
      source: "manual",
      date: "2026-11-02",
      minutes: 90,
      project_id: 1,
      task_id: 2,
      project_name: "Web",
      task_name: "Design",
      billable: true,
    },
  ],
  rows: [
    {
      project_id: 1,
      project_name: "Web",
      client_name: "Acme",
      task_id: 2,
      task_name: "Design",
      task_archived: false,
      billable: true,
      days: Array.from({ length: 7 }, (_, i) => ({
        date: `2026-11-0${2 + i}`,
        manual_minutes: i === 0 ? 90 : 0,
        clocked_minutes: 0,
        manual_entry_id: null,
        clocked_entry_ids: [],
      })),
    },
  ],
  day_totals_minutes: [90, 0, 0, 0, 0, 0, 0],
  week_total_minutes: 90,
  billable_minutes: 90,
  non_billable_minutes: 0,
};

function setup(handlers: Record<string, () => Response>, path: string) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    if (key === "GET /api/auth/me") return json(me);
    const h = Object.entries(handlers).find(([k]) => key.startsWith(k));
    return h ? h[1]() : json({ detail: "x" }, 401);
  });
  vi.stubGlobal("fetch", fn);
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/team" element={<Team />} />
          <Route path="/team/:userId" element={<TeamMember />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
  return fn;
}
afterEach(() => vi.unstubAllGlobals());

describe("Team", () => {
  it("[AC-052] lists reports with name and time zone", async () => {
    setup(
      { "GET /api/team/members": () => json([{ id: 5, name: "Eve", time_zone: "Europe/Paris" }]) },
      "/team",
    );
    expect(await screen.findByRole("link", { name: "Eve" })).toHaveAttribute("href", "/team/5");
    expect(screen.getByText("Europe/Paris")).toBeInTheDocument();
  });

  it("[AC-054] shows the empty state", async () => {
    setup({ "GET /api/team/members": () => json([]) }, "/team");
    expect(await screen.findByText("You have no direct reports.")).toBeInTheDocument();
  });

  it("[AC-055] [AC-056] [AC-057] shows the read-only week in the report's zone", async () => {
    const fn = setup({ "GET /api/team/members/5/timesheets/": () => json(WEEK) }, "/team/5");
    expect(await screen.findByText("America/New_York")).toBeInTheDocument();
    expect(screen.getByText("Weekly total: 1:30 h")).toBeInTheDocument();
    expect(screen.getByText("Billable: 1:30 h")).toBeInTheDocument();
    expect(screen.getByText("Non-billable: 0:00 h")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: /edit|delete|add|clock|break/i })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Next week" }));
    expect(fn.mock.calls.every((c) => !(c[1] as RequestInit)?.method)).toBe(true);
  });

  it("[AC-053] a 403 shows access denied with no data", async () => {
    setup({ "GET /api/team/members/5/timesheets/": () => json({ detail: "no" }, 403) }, "/team/5");
    expect(await screen.findByText(/Access denied/)).toBeInTheDocument();
    expect(screen.queryByText("Weekly total", { exact: false })).toBeNull();
  });
});
