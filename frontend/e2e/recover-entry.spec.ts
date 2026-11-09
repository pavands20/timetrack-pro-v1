import { execFileSync } from "node:child_process";
import { expect, test, request as pwRequest, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const U = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };
const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

async function seedCatalogue() {
  const ctx = await pwRequest.newContext();
  const login = await ctx.post(`${API}/api/auth/login`, {
    headers: CSRF,
    data: { email: A.e, password: A.p },
  });
  const headers = { ...CSRF, Authorization: `Bearer ${(await login.json()).token}` };
  const c = await (
    await ctx.post(`${API}/api/admin/clients`, { headers, data: { name: `Rec C ${stamp()}` } })
  ).json();
  const project = `Rec P ${stamp()}`;
  const p = await (
    await ctx.post(`${API}/api/admin/projects`, {
      headers,
      data: { client_id: c.id, name: project, bill_rate: 10 },
    })
  ).json();
  const task = `Rec T ${stamp()}`;
  await ctx.post(`${API}/api/admin/projects/${p.id}/tasks`, { headers, data: { name: task } });
  await ctx.dispose();
  return { project, task };
}

async function userHeaders() {
  const ctx = await pwRequest.newContext();
  const login = await ctx.post(`${API}/api/auth/login`, {
    headers: CSRF,
    data: { email: U.e, password: U.p },
  });
  const h = { ...CSRF, Authorization: `Bearer ${(await login.json()).token}` };
  return { ctx, h };
}

/** Clock in through the API, then backdate start_at by ~26 hours directly in PostgreSQL. */
async function makeStaleEntry(): Promise<number> {
  const { project, task } = await seedCatalogue();
  const { ctx, h } = await userHeaders();
  // Close anything already running.
  const st = await (await ctx.get(`${API}/api/clock/status`, { headers: h })).json();
  if (st.entry) await ctx.post(`${API}/api/clock/out`, { headers: h });
  const projects = await (await ctx.get(`${API}/api/projects`, { headers: h })).json();
  const p = projects.find((x: { name: string }) => x.name === project);
  const t = p.tasks.find((x: { name: string }) => x.name === task);
  const r = await ctx.post(`${API}/api/clock/in`, {
    headers: h,
    data: { project_id: p.id, task_id: t.id, billable: true },
  });
  expect(r.status()).toBe(201);
  const entryId = (await (await ctx.get(`${API}/api/clock/status`, { headers: h })).json()).entry
    .id as number;
  await ctx.dispose();
  const py = process.env.E2E_BACKEND_PYTHON ?? "../backend/.venv/bin/python";
  const code = [
    "import os, sqlalchemy as sa",
    "e = sa.create_engine(os.environ['DATABASE_URL'])",
    "c = e.begin().__enter__()",
    `c.execute(sa.text("UPDATE time_entries SET start_at = now() - interval '26 hours' WHERE id = ${entryId}"))`,
    "c.commit()",
  ].join("\n");
  execFileSync(py, ["-c", code], { env: process.env });
  return entryId;
}

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(U.e!);
  await page.getByLabel("Password", { exact: true }).fill(U.p!);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/home$/);
}

/** datetime-local value for now minus the given hours, in the browser's zone. */
function localValue(hoursAgo: number): string {
  const d = new Date(Date.now() - hoursAgo * 3600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

test.describe("recover a forgotten entry", () => {
  test.skip(
    !A.e || !A.p || !U.e || !U.p || !process.env.DATABASE_URL,
    "PENDING: needs E2E_ADMIN_*, E2E_EMPLOYEE_* credentials and DATABASE_URL",
  );

  test("[AC-032] an end time before the start shows the message and the entry stays running", async ({
    page,
  }) => {
    await makeStaleEntry();
    await signIn(page);
    const alert = page.getByRole("alert").filter({ hasText: /still clocked in/i });
    await expect(alert).toBeVisible();
    await page.getByLabel("Correct end time").fill(localValue(30));
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("End time must be after the start time.")).toBeVisible();
    await expect(alert).toBeVisible();
    await page.reload();
    await expect(page.getByRole("alert").filter({ hasText: /still clocked in/i })).toBeVisible();
  });

  test("[AC-031] the alert is shown, the user sets an end time, saves, and the alert goes away", async ({
    page,
  }) => {
    await makeStaleEntry();
    await signIn(page);
    const alert = page.getByRole("alert").filter({ hasText: /still clocked in/i });
    await expect(alert).toBeVisible();
    await page.getByLabel("Correct end time").fill(localValue(24));
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(alert).toHaveCount(0);
    await page.reload();
    await expect(page.getByText(/still clocked in/i)).toHaveCount(0);
  });
});
