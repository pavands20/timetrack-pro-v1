import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { AuthProvider } from "@/lib/auth";

const user = (role: string) => ({
  id: 1,
  email: "a@b.co",
  full_name: "A B",
  role,
  time_zone: "Europe/London",
  home_path: "/home",
});

function mockApi(me: unknown) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    if (key === "GET /api/auth/me")
      return me
        ? new Response(JSON.stringify(me), { status: 200 })
        : new Response(JSON.stringify({ detail: "Not signed in" }), { status: 401 });
    return new Response(null, { status: 204 });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("App", () => {
  it("[AC-003] shows loading, then redirects to sign-in without a session", async () => {
    mockApi(null);
    renderAt("/home");
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByText("Sign in to TimeTrack Pro")).toBeInTheDocument();
  });

  it("[AC-003] Sign out calls logout and routes to sign-in", async () => {
    const fn = mockApi(user("Employee"));
    renderAt("/home");
    await userEvent.click((await screen.findAllByRole("button", { name: "Sign out" }))[0]);
    expect(await screen.findByText("Sign in to TimeTrack Pro")).toBeInTheDocument();
    expect(fn).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
  });

  it("[Role gating] hides admin links and redirects non-admins from admin routes", async () => {
    mockApi(user("Employee"));
    renderAt("/admin-users");
    await waitFor(() => expect(screen.getAllByText("Home").length).toBeGreaterThan(0));
    expect(screen.queryByRole("link", { name: "Users" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Projects" })).toBeNull();
  });

  it("[Role gating] System Admin sees admin links", async () => {
    mockApi(user("System Admin"));
    renderAt("/home");
    expect(await screen.findByRole("link", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
  });
});
