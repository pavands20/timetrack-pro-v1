import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Home from "./Home";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const PROJECTS = [
  {
    id: 1,
    name: "Web",
    client_name: "Acme",
    default_billable: false,
    tasks: [{ id: 2, name: "Design" }],
  },
];
const entryAt = (start_at: string) => ({
  id: 9,
  project_id: 1,
  project_name: "Web",
  client_name: "Acme",
  task_id: 2,
  task_name: "Design",
  billable: false,
  start_at,
  on_break: false,
  break_started_at: null,
  break_minutes: 0,
});

function setup(tz: string, entry: ReturnType<typeof entryAt> | null) {
  const me = {
    id: 1,
    email: "a@x.co",
    full_name: "A",
    role: "Employee",
    time_zone: tz,
    home_path: "/home",
  };
  const handlers: Record<string, () => Response> = {
    "GET /api/auth/me": () => json(me),
    "GET /api/projects": () => json(PROJECTS),
    "GET /api/clock/status": () => json({ entry }),
    "POST /api/clock/in": () => json(entry, 201),
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const key = `${init?.method ?? "GET"} ${url}`;
      return handlers[key]?.() ?? json({ detail: "Not signed in" }, 401);
    }),
  );
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
}
afterEach(() => vi.unstubAllGlobals());

describe("Home times shown in the user's time zone (US-017)", () => {
  it("[AC-045] a summer entry stored as 08:00 UTC shows 09:00 for a London user", async () => {
    setup("Europe/London", entryAt("2026-07-01T08:00:00Z"));
    expect(await screen.findByText("09:00", { selector: "strong" })).toBeInTheDocument();
    expect(screen.queryByText("08:00", { selector: "strong" })).not.toBeInTheDocument();
    expect(screen.getByText(/times shown in Europe\/London/)).toBeInTheDocument();
  });

  it("[AC-045] a winter entry stored as 09:00 UTC shows 09:00 for a London user", async () => {
    setup("Europe/London", entryAt("2026-01-15T09:00:00Z"));
    expect(await screen.findByText("09:00", { selector: "strong" })).toBeInTheDocument();
  });

  it("[AC-045] the same stored instant shows a different local time in another zone", async () => {
    setup("Europe/Paris", entryAt("2026-07-01T08:00:00Z"));
    expect(await screen.findByText("10:00", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText(/times shown in Europe\/Paris/)).toBeInTheDocument();
  });

  it("[AC-046] an entry started just after the spring change shows local 02:00, not 01:00", async () => {
    setup("Europe/London", entryAt("2026-03-29T01:00:00Z"));
    expect(await screen.findByText("02:00", { selector: "strong" })).toBeInTheDocument();
  });

  it("[AC-046] the clock-in confirmation uses the local time after the autumn change", async () => {
    // 01:30Z on 25 Oct is 01:30 GMT (the second 01:30 of the day), not BST.
    setup("Europe/London", null);
    await screen.findByText(/Not clocked in/);
    // swap in the entry the server will return for the clock-in click
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const key = `${init?.method ?? "GET"} ${url}`;
        if (key === "POST /api/clock/in") return json(entryAt("2026-10-25T01:30:00Z"), 201);
        return json({ detail: "Not signed in" }, 401);
      }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Clock in" }));
    expect(await screen.findByText(/Clocked in at 01:30 on Web, Design/)).toBeInTheDocument();
  });
});
