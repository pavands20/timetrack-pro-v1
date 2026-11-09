import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Help from "./Help";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const me = (role: string) => ({
  id: 1,
  email: "a@x.co",
  full_name: "A",
  role,
  time_zone: "Europe/London",
  home_path: "/home",
});

function setup(role: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      url === "/api/auth/me" ? json(me(role)) : json({ detail: "x" }, 401),
    ),
  );
  render(
    <MemoryRouter>
      <AuthProvider>
        <Help />
      </AuthProvider>
    </MemoryRouter>,
  );
}
afterEach(() => vi.unstubAllGlobals());

describe("Help", () => {
  it("[AC-049] shows the user guide topics", async () => {
    setup("Employee");
    expect(await screen.findByRole("heading", { name: "Clocking in and out" })).toBeInTheDocument();
    for (const h of ["Taking breaks", "The weekly timesheet", "Editing and deleting entries"])
      expect(screen.getByRole("heading", { name: h })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The dashboard" })).toBeInTheDocument();
  });

  it("[AC-050] a System Admin sees the Admin guide tab", async () => {
    setup("System Admin");
    await userEvent.click(await screen.findByRole("button", { name: "Admin guide" }));
    expect(screen.getByRole("heading", { name: "Creating users" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Assigning managers" })).toBeInTheDocument();
  });

  it("[AC-050] a non-admin does not see the Admin guide tab", async () => {
    setup("Manager");
    await screen.findByRole("heading", { name: "Clocking in and out" });
    expect(screen.queryByRole("button", { name: "Admin guide" })).toBeNull();
    expect(screen.queryByText("Creating users")).toBeNull();
  });

  it("[AC-051] project documentation covers stack, settings and EU/UK region", async () => {
    setup("Employee");
    await userEvent.click(await screen.findByRole("button", { name: "Project documentation" }));
    expect(screen.getByText(/FastAPI/)).toBeInTheDocument();
    expect(screen.getAllByText(/PostgreSQL 16/)[0]).toBeInTheDocument();
    expect(screen.getAllByText("SMTP_PASSWORD")[0]).toBeInTheDocument();
    expect(screen.getByText(/hosted in an EU or UK region/)).toBeInTheDocument();
    expect(screen.queryByText("SESSION_SECRET")).toBeNull();
  });
});
