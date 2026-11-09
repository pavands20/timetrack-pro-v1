import { expect, test, request as pwRequest, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const U = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };
const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

type Ctx = Awaited<ReturnType<typeof pwRequest.newContext>>;

async function auth(ctx: Ctx, who: typeof A) {
  const r = await ctx.post(`${API}/api/auth/login`, {
    headers: CSRF,
    data: { email: who.e, password: who.p },
  });
  return { ...CSRF, Authorization: `Bearer ${(await r.json()).token}` };
}

async function seedCatalogue() {
  const ctx = await pwRequest.newContext();
  const headers = await auth(ctx, A);
  const c = await (
    await ctx.post(`${API}/api/admin/clients`, { headers, data: { name: `Dsh C ${stamp()}` } })
  ).json();
  const project = `Dsh P ${stamp()}`;
  const p = await (
    await ctx.post(`${API}/api/admin/projects`, {
      headers,
      data: { client_id: c.id, name: project, bill_rate: 10 },
    })
  ).json();
  const task = `Dsh T ${stamp()}`;
  const t = await (
    await ctx.post(`${API}/api/admin/projects/${p.id}/tasks`, { headers, data: { name: task } })
  ).json();
  await ctx.dispose();
  return { project, task, pid: p.id as number, tid: t.id as number };
}

async function weekOf(who: typeof U) {
  const ctx = await pwRequest.newContext();
  const headers = await auth(ctx, who);
  const r = await ctx.get(`${API}/api/dashboard/week`, { headers });
  const body = await r.json();
  await ctx.dispose();
  return body;
}

async function wipeWeek(who: typeof U) {
  const ctx = await pwRequest.newContext();
  const headers = await auth(ctx, who);
  const w = await weekOf(who);
  await ctx.put(`${API}/api/timesheets/cells`, {
    headers,
    data: { week_start: w.week_start, cells: [] },
  });
  await ctx.dispose();
}

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(U.e!);
  await page.getByLabel("Password", { exact: true }).fill(U.p!);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/home$/);
}

const hoursPanel = (page: Page) =>
  page.locator("section", { has: page.getByRole("heading", { name: "Hours this week" }) });

test.describe("dashboard", () => {
  test.skip(
    !A.e || !A.p || !U.e || !U.p,
    "PENDING: needs E2E_ADMIN_* and E2E_EMPLOYEE_* credentials",
  );

  test("[AC-042] API returns Monday-first 7 days and 401 without a session", async () => {
    const ctx = await pwRequest.newContext();
    expect((await ctx.get(`${API}/api/dashboard/week`)).status()).toBe(401);
    await ctx.dispose();
    const w = await weekOf(U);
    expect(w.days).toHaveLength(7);
    expect(w.days[0].date).toBe(w.week_start);
    expect(w.days[6].date).toBe(w.week_end);
    expect(new Date(`${w.week_start}T12:00:00Z`).getUTCDay()).toBe(1);
  });

  test("[AC-043] empty week shows 0.0 h with links to the clock and the timesheet", async ({
    page,
  }) => {
    await wipeWeek(U);
    expect((await weekOf(U)).has_entries).toBe(false);
    await signIn(page);
    const panel = hoursPanel(page);
    await expect(panel).toContainText("0.0");
    await expect(panel).toContainText(/nothing recorded/i);
    // A control that leads to the clock, and one that leads to the timesheet.
    await expect(panel.getByRole("link", { name: /clock/i }).or(
      panel.getByRole("button", { name: /clock/i }),
    )).toBeVisible();
    await panel.getByRole("button", { name: /timesheet/i }).or(
      panel.getByRole("link", { name: /timesheet/i }),
    ).click();
    await expect(page).toHaveURL(/\/timesheet$/);
  });

  test("[AC-044] recording an entry changes the Home figures and deleting it drops them", async ({
    page,
  }) => {
    const { pid, tid } = await seedCatalogue();
    await wipeWeek(U);
    const w = await weekOf(U);
    const ctx = await pwRequest.newContext();
    const headers = await auth(ctx, U);
    const put = await ctx.put(`${API}/api/timesheets/cells`, {
      headers,
      data: {
        week_start: w.week_start,
        cells: [
          { project_id: pid, task_id: tid, billable: true, date: w.week_start, minutes: 150 },
        ],
      },
    });
    expect(put.status()).toBe(200);

    await signIn(page);
    await expect(hoursPanel(page)).toContainText("2.5");

    // Delete it through the timesheet screen.
    await page.goto("/timesheet");
    await page.getByRole("button", { name: /^Delete /i }).first().click();
    await page.getByRole("alertdialog", { name: /confirm delete/i })
      .getByRole("button", { name: /delete/i })
      .click();
    await expect(page.getByRole("alertdialog")).toHaveCount(0);

    await page.goto("/home");
    await expect(hoursPanel(page)).toContainText("0.0");
    expect((await weekOf(U)).total_minutes).toBe(0);
    await ctx.dispose();
  });

  test.describe("phone width", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    for (const path of ["/home", "/timesheet"]) {
      test(`[AC-047] [NFR-012] ${path} has no horizontal scroll and tall primary controls`, async ({
        page,
      }) => {
        await signIn(page);
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
        const primary =
          path === "/home"
            ? [/^Clock in$/, /^Clock out$/]
            : [/^Save timesheet$/, /^Add row$|^Add /i];
        let checked = 0;
        for (const name of primary) {
          const b = page.getByRole("button", { name }).first();
          if ((await b.count()) === 0) continue;
          const box = await b.boundingBox();
          expect(box, `${name} has a box`).not.toBeNull();
          expect(box!.height).toBeGreaterThanOrEqual(44);
          checked++;
        }
        expect(checked).toBeGreaterThan(0);
      });
    }
  });

  test("[AC-048] Home, Timesheet and Help show English labels only", async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hours this week" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clock in" })).toBeVisible();

    await page.goto("/timesheet");
    await expect(page.getByRole("button", { name: "Save timesheet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous week" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next week" })).toBeVisible();

    await page.goto("/help");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/help/i);

    for (const path of ["/home", "/timesheet", "/help"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const text = await page.locator("body").innerText();
      expect(text, path).not.toMatch(/[Ѐ-ӿ֐-ۿ぀-ヿ一-鿿]/);
      expect(text, path).not.toMatch(/\b(Zeit|Stunden|Fichajes|Horas|Heures|Salir|Entrar)\b/);
    }
  });

  test("[NFR-010] Home and Timesheet weeks run Monday to Sunday", async () => {
    const w = await weekOf(U);
    expect(w.days.map((d: { date: string }) => new Date(`${d.date}T12:00:00Z`).getUTCDay())).toEqual(
      [1, 2, 3, 4, 5, 6, 0],
    );
  });
});

// NFR-006 (EU hosting), NFR-008 (retention) and NFR-015 (500-user load) cannot be tested
// from a browser test; they are deployment and capacity concerns.
