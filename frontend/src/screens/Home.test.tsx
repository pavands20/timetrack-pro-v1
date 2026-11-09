import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

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
const PROJECTS = [
  {
    id: 1,
    name: "Web",
    client_name: "Acme",
    default_billable: false,
    tasks: [{ id: 2, name: "Design" }],
  },
];
const ENTRY = {
  id: 9,
  project_id: 1,
  project_name: "Web",
  client_name: "Acme",
  task_id: 2,
  task_name: "Design",
  billable: false,
  start_at: "2026-07-01T08:30:00Z",
  on_break: false,
  break_minutes: 0,
};

function setup(handlers: Record<string, () => Response>) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    return handlers[key]?.() ?? json({ detail: "Not signed in" }, 401);
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
const base = {
  "GET /api/auth/me": () => json(me),
  "GET /api/projects": () => json(PROJECTS),
};
afterEach(() => vi.unstubAllGlobals());

describe("Home clock", () => {
  it("[AC-025] clock in shows start in the user's zone and locks selects", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: null }),
      "POST /api/clock/in": () => json(ENTRY, 201),
    });
    expect(await screen.findByText(/Not clocked in/)).toBeInTheDocument();
    expect(screen.getByLabelText("Billable / Non-billable")).toHaveValue("non-billable");
    await userEvent.click(screen.getByRole("button", { name: "Clock in" }));
    expect(await screen.findByText("09:30")).toBeInTheDocument();
    expect(screen.getByLabelText("Project")).toBeDisabled();
    expect(screen.getByLabelText("Task")).toBeDisabled();
  });

  it("[AC-026] clock out shows net duration and day", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: ENTRY }),
      "POST /api/clock/out": () =>
        json({
          id: 9,
          start_at: "",
          end_at: "",
          duration_minutes: 90,
          work_date: "2026-11-09",
          billable: false,
          project_id: 1,
          task_id: 2,
        }),
    });
    await screen.findByText(/In progress since/);
    await userEvent.click(screen.getByRole("button", { name: "Clock out" }));
    expect(await screen.findByText(/1:30 h added to Mon 9 Nov/)).toBeInTheDocument();
  });

  it("[AC-027] shows the 409 message", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: null }),
      "POST /api/clock/out": () => json({ detail: "You are not clocked in." }, 409),
    });
    await screen.findByText(/Not clocked in/);
    await userEvent.click(screen.getByRole("button", { name: "Clock out" }));
    expect(await screen.findByText(/You are not clocked in\./)).toBeInTheDocument();
  });

  it("[AC-025] a 422 shows inline", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: null }),
      "POST /api/clock/in": () =>
        json({ detail: [{ loc: ["body", "task_id"], msg: "Task is archived." }] }, 422),
    });
    await screen.findByText(/Not clocked in/);
    await userEvent.click(screen.getByRole("button", { name: "Clock in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Task is archived.");
  });

  it("[AC-025] 401 on load navigates to sign-in", async () => {
    setup({ "GET /api/auth/me": () => json(me) });
    expect(await screen.findByText("sign in page")).toBeInTheDocument();
  });
});
