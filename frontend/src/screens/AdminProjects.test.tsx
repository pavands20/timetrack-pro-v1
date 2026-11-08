import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminProjects from "./AdminProjects";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
const DATA = [
  {
    id: 1,
    name: "Acme",
    is_archived: false,
    projects: [
      {
        id: 5,
        client_id: 1,
        name: "Web",
        bill_rate: "145.00",
        default_billable: true,
        tasks: [{ id: 9, project_id: 5, name: "Design", is_archived: false }],
      },
    ],
  },
];

function setup(handlers: Record<string, () => Response>) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    return handlers[key]?.() ?? json({ detail: "Not signed in" }, 401);
  });
  vi.stubGlobal("fetch", fn);
  render(
    <MemoryRouter initialEntries={["/p"]}>
      <Routes>
        <Route path="/p" element={<AdminProjects />} />
        <Route path="/sign-in" element={<p>sign in page</p>} />
      </Routes>
    </MemoryRouter>,
  );
  return fn;
}
const base = { "GET /api/admin/clients": () => json(DATA) };
afterEach(() => vi.unstubAllGlobals());

describe("AdminProjects", () => {
  it("[AC-017] loads and creates a client; 409 shows message", async () => {
    setup({
      ...base,
      "POST /api/admin/clients": () => json({ detail: "Client name already exists." }, 409),
    });
    expect(await screen.findByText("Design")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /New client/ }));
    await userEvent.type(screen.getByLabelText("Client name"), "Acme");
    await userEvent.click(screen.getByRole("button", { name: "Create client" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Client name already exists.");
  });

  it("[AC-021] editing a rate PATCHes the project", async () => {
    const fn = setup({
      ...base,
      "PATCH /api/admin/projects/5": () =>
        json({ id: 5, client_id: 1, name: "Web", bill_rate: "150.00", default_billable: true }),
    });
    const input = await screen.findByLabelText(/bill rate/i);
    await userEvent.clear(input);
    await userEvent.type(input, "150");
    await userEvent.click(screen.getByRole("button", { name: /^Save/ }));
    expect(await screen.findByText(/recorded time is unchanged/)).toBeInTheDocument();
    const c = fn.mock.calls.find((x) => (x[1] as RequestInit)?.method === "PATCH")!;
    expect(JSON.parse((c[1] as RequestInit).body as string).bill_rate).toBe("150");
  });

  it("[AC-020] a negative rate is rejected without a request", async () => {
    const fn = setup(base);
    const input = await screen.findByLabelText(/bill rate/i);
    await userEvent.clear(input);
    await userEvent.type(input, "-5");
    await userEvent.click(screen.getByRole("button", { name: /^Save/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/0 or more/);
    expect(fn.mock.calls.some((c) => (c[1] as RequestInit)?.method === "PATCH")).toBe(false);
  });

  it("[AC-017] 401 redirects to sign-in", async () => {
    setup({});
    expect(await screen.findByText("sign in page")).toBeInTheDocument();
  });

  it("[AC-017] load failure offers retry", async () => {
    setup({ "GET /api/admin/clients": () => json({}, 500) });
    expect(await screen.findByText("Could not load clients.")).toBeInTheDocument();
  });
});
