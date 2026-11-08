import { expect, test, type Page } from "@playwright/test";

// Needs seeded accounts: E2E_ADMIN_EMAIL/PASSWORD (System Admin) and
// E2E_EMPLOYEE_EMAIL/PASSWORD (Employee). Without them the scenarios are skipped as pending.
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const E = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

const uniq = () => `qa${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;

test.describe("admin users", () => {
  test("[AC-004] an Employee opening /admin-users sees no admin data", async ({ page }) => {
    test.skip(!E.e || !E.p, "PENDING: no E2E employee credentials");
    await signIn(page, E.e!, E.p!);
    await page.goto("/admin-users");
    await expect(page.getByText("User administration")).toHaveCount(0);
    await expect(page.getByRole("table", { name: "Users" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Users" })).toHaveCount(0);
  });

  test.describe("as System Admin", () => {
    test.skip(!A.e || !A.p, "PENDING: no E2E admin credentials");
    test.beforeEach(async ({ page }) => {
      await signIn(page, A.e!, A.p!);
      await page.goto("/admin-users");
      await expect(page.getByRole("heading", { name: "User administration" })).toBeVisible();
    });

    async function create(page: Page, name: string, email: string) {
      await page.getByRole("button", { name: "New user" }).click();
      await page.getByLabel("Full name").fill(name);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Time zone").selectOption("Europe/London");
      await page.getByRole("button", { name: "Save" }).click();
    }

    test("[AC-010] creates a user through the form", async ({ page }) => {
      const email = uniq();
      await create(page, "QA Created", email);
      await expect(page.getByText(/link to set their password has been emailed/)).toBeVisible();
      await expect(page.getByRole("button", { name: "Edit QA Created" })).toBeVisible();
    });

    test("[AC-011] duplicate email, any case, shows under Email", async ({ page }) => {
      const email = uniq();
      await create(page, "QA Dup", email);
      await expect(page.getByText(/emailed/)).toBeVisible();
      await create(page, "QA Dup Two", email.toUpperCase());
      await expect(
        page.getByText("An account with this email already exists.").first(),
      ).toBeVisible();
    });

    test("[AC-012] missing required fields show messages under the field", async ({ page }) => {
      await page.getByRole("button", { name: "New user" }).click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Full name is required.")).toBeVisible();
      await expect(page.getByText("Email is required.")).toBeVisible();
      await expect(page.getByText("Choose a time zone.")).toBeVisible();
    });

    test("[AC-006] edits a user's time zone through the screen", async ({ page }) => {
      const email = uniq();
      await create(page, "QA Editable", email);
      await expect(page.getByText(/emailed/)).toBeVisible();
      await page.getByLabel("Time zone").selectOption("Europe/Berlin");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText(/Saved\./)).toBeVisible();
      await page.reload();
      const row = page.getByRole("row").filter({ hasText: email });
      await expect(row).toContainText("Europe/Berlin");
    });

    test("[AC-013] assigning an active manager shows the manager's name", async ({ page }) => {
      const mgrEmail = uniq();
      await create(page, "QA Boss", mgrEmail);
      await expect(page.getByText(/emailed/)).toBeVisible();
      await page.getByLabel("Role").selectOption("Manager");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText(/Saved\./)).toBeVisible();
      const email = uniq();
      await page.getByRole("button", { name: "New user" }).click();
      await page.getByLabel("Full name").fill("QA Report");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Time zone").selectOption("Europe/London");
      await page.getByLabel("Manager").selectOption({ label: "QA Boss" });
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByRole("row").filter({ hasText: email })).toContainText("QA Boss");
    });
  });
});
