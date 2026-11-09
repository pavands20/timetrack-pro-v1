import { fireEvent, render, screen } from "@testing-library/react";
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
const WEEK = {
  week_start: "2026-06-29",
  week_end: "2026-07-05",
  time_zone: "Europe/London",
  total_minutes: 0,
  billable_minutes: 0,
  non_billable_minutes: 0,
  has_entries: false,
  days: [],
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
  "GET /api/dashboard/week": () => json(WEEK),
};
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"], now: new Date("2026-07-01T12:00:00Z") });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const STALE = { ...ENTRY, start_at: "2026-06-30T08:30:00Z" };
const CLOSED = {
  id: 9,
  start_at: "",
  end_at: "",
  duration_minutes: 510,
  work_date: "2026-06-30",
  billable: false,
  project_id: 1,
  task_id: 2,
};

describe("Home stale entry (US-012)", () => {
  it("[AC-031] shows the alert, saves the end in UTC and returns to not clocked in", async () => {
    let status: unknown = { entry: STALE };
    const fn = setup({
      ...base,
      "GET /api/clock/status": () => json(status),
      "PATCH /api/time-entries/9/end": () => {
        status = { entry: null };
        return json(CLOSED);
      },
    });
    expect(await screen.findByText(/still clocked in since Tue 30 Jun 09:30/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start break" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clock out" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText(/8:30 h added to Tue 30 Jun/)).toBeInTheDocument();
    const c = fn.mock.calls.find((x) => (x[1] as RequestInit)?.method === "PATCH")!;
    expect(JSON.parse((c[1] as RequestInit).body as string).end_at).toBe("2026-06-30T16:00:00Z");
    expect(await screen.findByText(/Not clocked in/)).toBeInTheDocument();
    expect(screen.queryByText(/still clocked in since/)).toBeNull();
  });

  it("[AC-032] an end not after the start is rejected client-side and the value is kept", async () => {
    const fn = setup({ ...base, "GET /api/clock/status": () => json({ entry: STALE }) });
    const input = await screen.findByLabelText("Correct end time");
    fireEvent.change(input, { target: { value: "2026-06-30T09:30" } });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("End time must be after the start time.")).toBeInTheDocument();
    expect(input).toHaveValue("2026-06-30T09:30");
    expect(fn.mock.calls.some((c) => (c[1] as RequestInit)?.method === "PATCH")).toBe(false);
  });

  it("[AC-032] a server 422 message is shown and the entry stays running", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: STALE }),
      "PATCH /api/time-entries/9/end": () =>
        json(
          { detail: [{ loc: ["body", "end_at"], msg: "End time cannot be in the future." }] },
          422,
        ),
    });
    await screen.findByText(/still clocked in since/);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("End time cannot be in the future.")).toBeInTheDocument();
    expect(screen.getByText(/still clocked in since/)).toBeInTheDocument();
  });

  it("[AC-031] a 409 shows its message", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: STALE }),
      "PATCH /api/time-entries/9/end": () => json({ detail: "Entry is already closed." }, 409),
    });
    await screen.findByText(/still clocked in since/);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Entry is already closed.")).toBeInTheDocument();
  });

  it("[AC-031] a 401 navigates to sign-in", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: STALE }),
      "PATCH /api/time-entries/9/end": () => json({ detail: "Not signed in" }, 401),
    });
    await screen.findByText(/still clocked in since/);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("sign in page")).toBeInTheDocument();
  });

  it("[AC-031] a same-day entry shows no alert", async () => {
    setup({ ...base, "GET /api/clock/status": () => json({ entry: ENTRY }) });
    await screen.findByText(/In progress since/);
    expect(screen.queryByText(/still clocked in since/)).toBeNull();
  });
});

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

  it("[AC-025] reload during a break shows break start and button states", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () =>
        json({ entry: { ...ENTRY, on_break: true, break_started_at: "2026-07-01T10:00:00Z" } }),
    });
    expect(await screen.findByText(/On a break since/)).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start break" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "End break" })).toBeEnabled();
  });

  it("[AC-025] start break calls the endpoint; 409 shows server message", async () => {
    setup({
      ...base,
      "GET /api/clock/status": () => json({ entry: ENTRY }),
      "POST /api/clock/breaks/start": () =>
        json({ ...ENTRY, on_break: true, break_started_at: "2026-07-01T10:00:00Z" }),
      "POST /api/clock/breaks/end": () => json({ detail: "No break is open." }, 409),
    });
    await screen.findByText(/In progress since/);
    await userEvent.click(screen.getByRole("button", { name: "Start break" }));
    expect(await screen.findByText(/Break started at 11:00/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "End break" }));
    expect(await screen.findByText(/No break is open\./)).toBeInTheDocument();
  });
});
