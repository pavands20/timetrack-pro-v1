import { render, screen, within } from "@testing-library/react";
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
const bodyOf = (fn: ReturnType<typeof setup>, method: string, url: string) => {
  const c = fn.mock.calls.find((x) => x[0] === url && (x[1] as RequestInit)?.method === method)!;
  return JSON.parse((c[1] as RequestInit).body as string);
};

Element.prototype.scrollIntoView = vi.fn();
afterEach(() => vi.unstubAllGlobals());

describe("AdminUsers", () => {
  it("[AC-006] loads users and PATCHes an edit", async () => {
    const fn = setup({
      ...base,
      "PATCH /api/admin/users/4": () =>
        json(
          au({
            id: 4,
            full_name: "Eve Employee",
            email: "eve@x.co",
            role: "Employee",
            time_zone: "Europe/Berlin",
            manager_id: 2,
          }),
        ),
    });
    await userEvent.click(await screen.findByRole("button", { name: "Edit Eve Employee" }));
    await userEvent.selectOptions(screen.getByLabelText("Time zone"), "Europe/Berlin");
    await userEvent.selectOptions(screen.getByLabelText("Manager"), "2");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText(/Saved\./)).toBeInTheDocument();
    expect(bodyOf(fn, "PATCH", "/api/admin/users/4")).toMatchObject({
      time_zone: "Europe/Berlin",
      manager_id: 2,
    });
    const row = screen.getByRole("button", { name: "Edit Eve Employee" }).closest("tr")!;
    expect(within(row).getByText("Mia Manager")).toBeInTheDocument();
  });

  it("[AC-013] manager dropdown lists only active managers", async () => {
    setup(base);
    await userEvent.click(await screen.findByRole("button", { name: "Edit Eve Employee" }));
    const opts = within(screen.getByLabelText("Manager"))
      .getAllByRole("option")
      .map((o) => o.textContent);
    expect(opts).toEqual(["No manager", "Mia Manager"]);
  });

  it("[AC-010] creates a user and shows the invite banner", async () => {
    const fn = setup({
      ...base,
      "POST /api/admin/users": () =>
        json(au({ id: 9, full_name: "New Person", email: "n@x.co" }), 201),
    });
    await userEvent.click(await screen.findByRole("button", { name: "New user" }));
    await userEvent.type(screen.getByLabelText("Full name"), "New Person");
    await userEvent.type(screen.getByLabelText("Email"), "n@x.co");
    await userEvent.selectOptions(screen.getByLabelText("Time zone"), "Europe/London");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      await screen.findByText(/link to set their password has been emailed/),
    ).toBeInTheDocument();
    expect(bodyOf(fn, "POST", "/api/admin/users")).toEqual({
      full_name: "New Person",
      email: "n@x.co",
      role: "Employee",
      time_zone: "Europe/London",
      manager_id: null,
    });
  });

  it("[AC-011] a 409 shows under Email and keeps values", async () => {
    setup({
      ...base,
      "POST /api/admin/users": () =>
        json({ detail: "An account with this email already exists." }, 409),
    });
    await userEvent.click(await screen.findByRole("button", { name: "New user" }));
    await userEvent.type(screen.getByLabelText("Full name"), "Dup");
    await userEvent.type(screen.getByLabelText("Email"), "ann@x.co");
    await userEvent.selectOptions(screen.getByLabelText("Time zone"), "Europe/London");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      (await screen.findAllByText("An account with this email already exists."))[0],
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveValue("Dup");
  });

  it("[AC-012] a 422 maps to fields and no request on empty required", async () => {
    const fn = setup({
      ...base,
      "POST /api/admin/users": () =>
        json({ detail: [{ loc: ["body", "email"], msg: "Not a valid email." }] }, 422),
    });
    await userEvent.click(await screen.findByRole("button", { name: "New user" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
    expect(fn.mock.calls.some((c) => (c[1] as RequestInit)?.method === "POST")).toBe(false);
    await userEvent.type(screen.getByLabelText("Full name"), "X");
    await userEvent.type(screen.getByLabelText("Email"), "x@x.co");
    await userEvent.selectOptions(screen.getByLabelText("Time zone"), "Europe/London");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Not a valid email.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Not saved");
  });

  it("[AC-014] a 422 on manager_id shows under Manager and leaves the table", async () => {
    setup({
      ...base,
      "PATCH /api/admin/users/4": () =>
        json({ detail: [{ loc: ["body", "manager_id"], msg: "Manager must be active." }] }, 422),
    });
    await userEvent.click(await screen.findByRole("button", { name: "Edit Eve Employee" }));
    await userEvent.selectOptions(screen.getByLabelText("Manager"), "2");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Manager must be active.")).toBeInTheDocument();
    const row = screen.getByRole("button", { name: "Edit Eve Employee" }).closest("tr")!;
    expect(within(row).queryByText("Mia Manager")).toBeNull();
  });

  it("[AC-006] deactivate confirms then updates the row", async () => {
    setup({
      ...base,
      "POST /api/admin/users/4/deactivate": () =>
        json(au({ id: 4, full_name: "Eve Employee", is_active: false })),
    });
    await userEvent.click(await screen.findByRole("button", { name: "Edit Eve Employee" }));
    await userEvent.click(screen.getByRole("button", { name: "Deactivate" }));
    await userEvent.click(screen.getByRole("button", { name: "Deactivate" }));
    expect(await screen.findByText(/Eve Employee is deactivated\./)).toBeInTheDocument();
  });

  it("[AC-004] 403 shows access denied without data", async () => {
    setup({
      "GET /api/auth/me": () => json(me),
      "GET /api/admin/users": () =>
        json({ detail: "You do not have access to this resource." }, 403),
    });
    expect(await screen.findByText(/Access denied/)).toBeInTheDocument();
    expect(screen.queryByText("Mia Manager")).toBeNull();
  });

  it("[AC-004] 401 redirects to sign-in", async () => {
    setup({ "GET /api/auth/me": () => json(me) });
    expect(await screen.findByText("sign in page")).toBeInTheDocument();
  });

  it("[AC-006] shows a load failure", async () => {
    setup({ "GET /api/auth/me": () => json(me), "GET /api/admin/users": () => json({}, 500) });
    expect(await screen.findByText("Could not load users.")).toBeInTheDocument();
  });
});
