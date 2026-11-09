import { expect, test, request as pwRequest, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };

const stamp = () => `${Date.now()}${Math.floor(Math.random() * 100000)}`;

test.describe("US-006 edit and deactivate in the browser", () => {
  test.skip(!A.e || !A.p, "PENDING: no E2E admin credentials (E2E_ADMIN_EMAIL/PASSWORD)");

  async function adminHeaders() {
    const ctx = await pwRequest.newContext();
    const res = await ctx.post(`${API}/api/auth/login`, {
      headers: CSRF,
      data: { email: A.e, password: A.p },
    });
    expect(res.status()).toBe(200);
    const { token } = await res.json();
    await ctx.dispose();
    return { ...CSRF, Authorization: `Bearer ${token}` };
  }

  async function seed(headers: object, name: string, role: string) {
    const ctx = await pwRequest.newContext();
    const res = await ctx.post(`${API}/api/admin/users`, {
      headers,
      data: {
        full_name: name,
        email: `us006ui${stamp()}@example.com`,
        role,
        time_zone: "Europe/London",
      },
    });
    expect(res.status()).toBe(201);
    const u = await res.json();
    await ctx.dispose();
    return u as { id: number; email: string };
  }

  async function signIn(page: Page) {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(A.e!);
    await page.getByLabel("Password").fill(A.p!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin-users");
    await expect(page.getByRole("heading", { name: "User administration" })).toBeVisible();
  }

  test("[AC-015] an admin edits a user's role and time zone and sees the success banner", async ({
    page,
  }) => {
    const headers = await adminHeaders();
    const name = `UI Editee ${stamp()}`;
    await seed(headers, name, "Employee");
    await signIn(page);
    await page.getByRole("button", { name: `Edit ${name}` }).click();
    await page.getByLabel("Role").selectOption("Payroll Admin");
    await page.getByLabel("Time zone").selectOption("Europe/Madrid");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("status").filter({ hasText: /^Saved\./ })).toBeVisible();
    const row = page.getByRole("row").filter({ hasText: name });
    await expect(row).toContainText("Payroll Admin");
    await expect(row).toContainText("Europe/Madrid");
  });

  test("[AC-016] deactivating through the confirm step marks the row Deactivated and removes the user from the Manager dropdown", async ({
    page,
  }) => {
    const headers = await adminHeaders();
    const name = `UI Leaver Mgr ${stamp()}`;
    await seed(headers, name, "Manager");
    await signIn(page);

    // Active managers are offered in the Manager dropdown.
    await page.getByRole("button", { name: "New user" }).click();
    await expect(page.getByLabel("Manager").locator("option", { hasText: name })).toHaveCount(1);

    await page.getByRole("button", { name: `Edit ${name}` }).click();
    await page.getByRole("button", { name: "Deactivate" }).click();
    await expect(page.getByText(/Press Deactivate again to confirm/)).toBeVisible();
    // Nothing is deactivated before the second press.
    await expect(page.getByRole("row").filter({ hasText: name })).not.toContainText("Deactivated");
    await page.getByRole("button", { name: "Deactivate" }).click();
    await expect(page.getByRole("status").filter({ hasText: `${name} is deactivated` })).toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: name })).toContainText("Deactivated");

    await page.getByRole("button", { name: "New user" }).click();
    await expect(page.getByLabel("Manager").locator("option", { hasText: name })).toHaveCount(0);
  });
});
