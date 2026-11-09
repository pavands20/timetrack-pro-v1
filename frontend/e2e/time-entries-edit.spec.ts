import { expect, test, request as pwRequest, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const U = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };
const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function thisWeek() {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const day = (n: number) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + n);
    return iso(d);
  };
  return { start: iso(monday), mon: day(0), tue: day(1) };
}

async function token(ctx: Awaited<ReturnType<typeof pwRequest.newContext>>, who: typeof A) {
  const r = await ctx.post(`${API}/api/auth/login`, {
    headers: CSRF,
    data: { email: who.e, password: who.p },
  });
  return { ...CSRF, Authorization: `Bearer ${(await r.json()).token}` };
}

async function seedEntry(minutes: number) {
  const ctx = await pwRequest.newContext();
  const admin = await token(ctx, A);
  const c = await (
    await ctx.post(`${API}/api/admin/clients`, {
      headers: admin,
      data: { name: `Ed C ${stamp()}` },
    })
  ).json();
  const project = `Ed P ${stamp()}`;
  const p = await (
    await ctx.post(`${API}/api/admin/projects`, {
      headers: admin,
      data: { client_id: c.id, name: project, bill_rate: 10 },
    })
  ).json();
  const task = `Ed T ${stamp()}`;
  const t = await (
    await ctx.post(`${API}/api/admin/projects/${p.id}/tasks`, {
      headers: admin,
      data: { name: task },
    })
  ).json();
  const emp = await token(ctx, U);
  const w = thisWeek();
  const put = await ctx.put(`${API}/api/timesheets/cells`, {
    headers: emp,
    data: {
      week_start: w.start,
      cells: [{ project_id: p.id, task_id: t.id, billable: true, date: w.mon, minutes }],
    },
  });
  expect(put.status()).toBe(200);
  const week = await (await ctx.get(`${API}/api/timesheets/${w.start}`, { headers: emp })).json();
  const entry = week.entries.find((e: { task_name: string }) => e.task_name === task);
  await ctx.dispose();
  return { project, task, id: entry.id as number, w };
}

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(U.e!);
  await page.getByLabel("Password", { exact: true }).fill(U.p!);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/home$/);
  await page.goto("/timesheet");
}

test.describe("time entries edit and delete", () => {
  test.skip(
    !A.e || !A.p || !U.e || !U.p,
    "needs E2E_ADMIN_* and E2E_EMPLOYEE_* credentials",
  );

  test("[AC-039] edit an entry's day, hours and billable and see it change", async ({ page }) => {
    const { project, task, w } = await seedEntry(120);
    await signIn(page);
    const row = page.getByRole("listitem").filter({ hasText: task });
    await expect(row).toContainText("2.00 h");
    await page.getByRole("button", { name: new RegExp(`^Edit ${project} / ${task}`) }).click();
    await page.locator("#ee-day").selectOption(w.tue);
    await page.locator("#ee-hours").fill("1.5");
    await page.locator("#ee-billable").uncheck();
    await page.getByRole("button", { name: "Save entry" }).click();
    await expect(row).toContainText(w.tue);
    await expect(row).toContainText("1.50 h");
    await expect(row).toContainText("Non-billable");
  });

  test("[AC-039] a bad hours value shows a field-level message and keeps the entry", async ({
    page,
  }) => {
    const { project, task } = await seedEntry(60);
    await signIn(page);
    await page.getByRole("button", { name: new RegExp(`^Edit ${project} / ${task}`) }).click();
    await page.locator("#ee-hours").fill("25");
    await page.getByRole("button", { name: "Save entry" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /\w{5,}/ }).first()).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).first().click();
    await expect(page.getByRole("listitem").filter({ hasText: task })).toContainText("1.00 h");
  });

  test("[AC-040] Cancel keeps the entry, Confirm removes it", async ({ page }) => {
    const { project, task } = await seedEntry(90);
    await signIn(page);
    const row = page.getByRole("listitem").filter({ hasText: task });
    await page.getByRole("button", { name: new RegExp(`^Delete ${project} / ${task}`) }).click();
    await expect(page.getByRole("alertdialog", { name: "Confirm delete" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(row).toBeVisible();
    await page.getByRole("button", { name: new RegExp(`^Delete ${project} / ${task}`) }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("listitem").filter({ hasText: task })).toHaveCount(0);
  });

  test("[AC-041] an API call against another user's entry id is refused", async () => {
    const { id, w } = await seedEntry(45);
    const ctx = await pwRequest.newContext();
    const admin = await token(ctx, A); // a different account from the entry's owner
    const patch = await ctx.patch(`${API}/api/time-entries/${id}`, {
      headers: admin,
      data: { minutes: 5 },
    });
    expect(patch.status()).toBe(404);
    expect(await patch.json()).toEqual({ detail: "Time entry not found." });
    const del = await ctx.delete(`${API}/api/time-entries/${id}`, { headers: admin });
    expect(del.status()).toBe(404);
    const noSession = await ctx.delete(`${API}/api/time-entries/${id}`, { headers: CSRF });
    expect(noSession.status()).toBe(401);
    const emp = await token(ctx, U);
    const week = await (await ctx.get(`${API}/api/timesheets/${w.start}`, { headers: emp })).json();
    expect(week.entries.find((e: { id: number }) => e.id === id).minutes).toBe(45);
    await ctx.dispose();
  });
});
