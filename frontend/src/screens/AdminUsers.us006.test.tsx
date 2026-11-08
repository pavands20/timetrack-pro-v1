import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import AdminUsers from "./AdminUsers";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const au = (o: object) => ({
  id: 1,
  full_name: "Ann Admin",
  email: "ann@x.co",
  role: "System Admin",
  time_zone: "Europe/London",
  manager_id: null,
  is_active: true,
  ...o,
});
const me = {
  id: 1,
  email: "ann@x.co",
  full_name: "Ann Admin",
  role: "System Admin",
  time_zone: "UTC",
  home_path: "/home",
};
const LIST = [
  au({}),
  au({ id: 2, full_name: "Mia Manager", email: "mia@x.co", role: "Manager" }),
  au({ id: 3, full_name: "Old Manager", email: "old@x.co", role: "Manager", is_active: false }),
  au({ id: 4, full_name: "Eve Employee", email: "eve@x.co", role: "Employee" }),
];

function setup(handlers: Record<string, () => Response>) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    return handlers[key]?.() ?? json({ detail: "Not signed in" }, 401);
  });
  vi.stubGlobal("fetch", fn);
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminUsers />} />
          <Route path="/sign-in" element={<p>sign in page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
  return fn;
}
const base = { "GET /api/auth/me": () => json(me), "GET /api/admin/users": () => json(LIST) };

Element.prototype.scrollIntoView = vi.fn();
afterEach(() => vi.unstubAllGlobals());

describe("AdminUsers edit and deactivate (US-006)", () => {
  it("[AC-015] saving a changed name and role sends them and shows the new values", async () => {
    const fn = setup({
      ...base,
      "PATCH /api/admin/users/4": () =>
        json(au({ id: 4, full_name: "Eve Renamed", email: "eve@x.co", role: "Manager" })),
    });
    await userEvent.click(await screen.findByRole("button", { name: "Edit Eve Employee" }));
    const name = screen.getByLabelText("Full name");
    await userEvent.clear(name);
    await userEvent.type(name, "Eve Renamed");
    await userEvent.selectOptions(screen.getByLabelText("Role"), "Manager");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText(/Saved\. Changes to Eve Renamed apply/)).toBeInTheDocument();
    const call = fn.mock.calls.find(
      (c) => c[0] === "/api/admin/users/4" && (c[1] as RequestInit)?.method === "PATCH",
    )!;
    expect(JSON.parse((call[1] as RequestInit).body as string)).toMatchObject({
      full_name: "Eve Renamed",
      role: "Manager",
    });
    expect(screen.getByRole("button", { name: "Edit Eve Renamed" })).toBeInTheDocument();
  });

  it("[AC-016] a deactivated user is marked, cannot be deactivated again, and is not offered as manager", async () => {
    setup({
      ...base,
      "POST /api/admin/users/2/deactivate": () =>
        json(
          au({
            id: 2,
            full_name: "Mia Manager",
            email: "mia@x.co",
            role: "Manager",
            is_active: false,
          }),
        ),
    });
    await userEvent.click(await screen.findByRole("button", { name: "Edit Mia Manager" }));
    await userEvent.click(screen.getByRole("button", { name: "Deactivate" }));
    await userEvent.click(screen.getByRole("button", { name: "Deactivate" }));
    expect(await screen.findByText(/Mia Manager is deactivated/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeDisabled();
    expect(screen.getByText(/This account is deactivated/)).toBeInTheDocument();

    // Pick someone else: neither deactivated manager is offered.
    await userEvent.click(screen.getByRole("button", { name: "Edit Eve Employee" }));
    const options = Array.from((screen.getByLabelText("Manager") as HTMLSelectElement).options).map(
      (o) => o.text,
    );
    expect(options).not.toContain("Mia Manager");
    expect(options).not.toContain("Old Manager");
  });

  it("[AC-016] an admin cannot deactivate their own account from the screen", async () => {
    setup(base);
    await userEvent.click(await screen.findByRole("button", { name: "Edit Ann Admin" }));
    expect(screen.getByRole("button", { name: "Deactivate" })).toBeDisabled();
    expect(screen.getByText(/can’t deactivate your own account/)).toBeInTheDocument();
  });
});
