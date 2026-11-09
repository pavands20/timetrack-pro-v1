import { expect, test, type Page } from "@playwright/test";

const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const U = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };

async function openHelp(page: Page, who: typeof A) {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(who.e!);
  await page.getByLabel("Password", { exact: true }).fill(who.p!);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).not.toHaveURL(/\/sign-in/);
  await page.goto("/help");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/help/i);
}

const content = (page: Page) => page.getByTestId("help-content");
const tab = (page: Page, name: string) => page.getByRole("button", { name, exact: true });

test.describe("help: employee", () => {
  test.skip(!U.e || !U.p, "PENDING: no E2E employee credentials (E2E_EMPLOYEE_EMAIL/PASSWORD)");

  test("[AC-049] the user guide covers clocking, breaks, timesheet, editing and dashboard", async ({
    page,
  }) => {
    await openHelp(page, U);
    for (const h of [
      /Clocking in and out/i,
      /breaks/i,
      /weekly timesheet/i,
      /Editing and deleting entries/i,
      /dashboard/i,
    ]) {
      await expect(content(page).getByRole("heading", { level: 2, name: h })).toBeVisible();
    }
  });

  test("[AC-050] an Employee sees no Admin guide tab or text", async ({ page }) => {
    await openHelp(page, U);
    await expect(tab(page, "Admin guide")).toHaveCount(0);
    await expect(tab(page, "User guide")).toBeVisible();
    await expect(tab(page, "Project documentation")).toBeVisible();
    for (const t of ["User guide", "Project documentation"]) {
      await tab(page, t).click();
      const body = await page.locator("body").innerText();
      expect(body).not.toMatch(/This guide is for System Admins/);
      expect(body).not.toMatch(/Creating users/);
      expect(body).not.toMatch(/Assigning managers/);
    }
  });

  test("[AC-051] [NFR-016] [NFR-006] project documentation covers stack, setup, email API key and EU/UK region", async ({
    page,
  }) => {
    await openHelp(page, U);
    await tab(page, "Project documentation").click();
    const c = content(page);
    await expect(c.getByRole("heading", { level: 2, name: /Stack/i })).toBeVisible();
    await expect(c.getByRole("heading", { level: 2, name: /Setup/i })).toBeVisible();
    await expect(c).toContainText(/email service API key/i);
    await expect(c).toContainText("SMTP_PASSWORD");
    await expect(c).toContainText(/EU or UK/);
    await expect(c).toContainText(/Password-reset email/i);
  });

  test("[NFR-007] [NFR-008] [NFR-015] project documentation states GDPR, 6-year retention and 500 users", async ({
    page,
  }) => {
    await openHelp(page, U);
    await tab(page, "Project documentation").click();
    await expect(content(page)).toContainText(/GDPR and UK GDPR/);
    await expect(content(page)).toContainText(/6 years/);
    await expect(content(page)).toContainText(/500 users/);
  });
});

test.describe("help: system admin", () => {
  test.skip(!A.e || !A.p, "PENDING: no E2E admin credentials (E2E_ADMIN_EMAIL/PASSWORD)");

  test("[AC-050] the Admin guide covers users, managers, clients, projects, tasks and bill rates", async ({
    page,
  }) => {
    await openHelp(page, A);
    await expect(tab(page, "Admin guide")).toBeVisible();
    await tab(page, "Admin guide").click();
    const c = content(page);
    for (const h of [
      /Creating users/i,
      /Assigning managers/i,
      /Setting up clients/i,
      /Projects and bill rates/i,
      /Tasks/i,
    ]) {
      await expect(c.getByRole("heading", { level: 2, name: h })).toBeVisible();
    }
  });

  test("[AC-049] an admin can still read the user guide", async ({ page }) => {
    await openHelp(page, A);
    await expect(
      content(page).getByRole("heading", { level: 2, name: /Clocking in and out/i }),
    ).toBeVisible();
  });
});

// NFR-006 (hosting region), NFR-008 (retention), NFR-015 (500-user load) are deployment and
// capacity concerns: only their documentation is verified here. NFR-007 role limits are covered
// by the AC-050 gating test and backend tests.
