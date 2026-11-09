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
    await ctx.post(`${API}/api/admin/clients`, { headers, data: { name: `Clk C ${stamp()}` } })
  ).json();
  const project = `Clk P ${stamp()}`;
  const p = await (
    await ctx.post(`${API}/api/admin/projects`, {
      headers,
      data: { client_id: c.id, name: project, bill_rate: 10 },
    })
  ).json();
  const task = `Clk T ${stamp()}`;
  await ctx.post(`${API}/api/admin/projects/${p.id}/tasks`, { headers, data: { name: task } });
  await ctx.dispose();
  return { project, task };
}

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(U.e!);
  await page.getByLabel("Password", { exact: true }).fill(U.p!);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/home$/);
}

async function endAnyRunning(page: Page) {
  if ((await page.getByText(/Status:.*(in progress|break)/i).count()) > 0) {
    if (await page.getByRole("button", { name: "End break" }).isEnabled()) {
      await page.getByRole("button", { name: "End break" }).click();
    }
    await page.getByRole("button", { name: "Clock out" }).click();
  }
}

test.describe("clock", () => {
  test.skip(
    !A.e || !A.p || !U.e || !U.p,
    "PENDING: needs E2E_ADMIN_* and E2E_EMPLOYEE_* credentials",
  );

  test("[AC-025] [AC-026] [AC-027] clock in, refused second clock-in, break, clock out nets the break", async ({
    page,
  }) => {
    const { project, task } = await seedCatalogue();
    await signIn(page);
    await expect(page.getByRole("heading", { name: /^Clock/ })).toBeVisible();
    await endAnyRunning(page);

    await page.locator("#clock-project").selectOption({ label: project });
    await page.locator("#clock-task").selectOption({ label: task });
    await page.locator("#clock-billable").selectOption("billable");
    await page.getByRole("button", { name: "Clock in" }).click();
    await expect(page.getByText(/Status:.*in progress/i)).toBeVisible();

    // AC-027: a second clock-in is refused with a message and nothing changes.
    await page.getByRole("button", { name: "Clock in" }).click();
    await expect(page.getByText(/already clocked in/i).first()).toBeVisible();
    await expect(page.getByText(/Status:.*in progress/i)).toBeVisible();

    // AC-026: break, then clock out; the added time is reported.
    await page.getByRole("button", { name: "Start break" }).click();
    await expect(page.getByText(/On a break since/i)).toBeVisible();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "End break" }).click();
    await expect(page.getByText(/Break ended at/i)).toBeVisible();
    await page.getByRole("button", { name: "Clock out" }).click();
    await expect(page.getByText(/h added to/i)).toBeVisible();
    await expect(page.getByText(/Status:.*in progress/i)).toHaveCount(0);
  });

  test("[NFR-012] the clock panel has no horizontal scroll at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await signIn(page);
    await expect(page.getByRole("heading", { name: /^Clock/ })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    for (const name of ["Clock in", "Start break", "End break", "Clock out"]) {
      const box = await page.getByRole("button", { name }).boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(375);
      expect(box!.height).toBeGreaterThanOrEqual(40);
    }
  });
});
