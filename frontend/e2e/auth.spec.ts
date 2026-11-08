import { expect, test, type Page } from "@playwright/test";

// Needs a seeded account: E2E_EMPLOYEE_EMAIL/PASSWORD (or the admin pair). Without it the
// scenarios that sign in are skipped as pending. The session is a bearer token in localStorage.
const U = {
  e: process.env.E2E_EMPLOYEE_EMAIL ?? process.env.E2E_ADMIN_EMAIL,
  p: process.env.E2E_EMPLOYEE_PASSWORD ?? process.env.E2E_ADMIN_PASSWORD,
  home: process.env.E2E_EMPLOYEE_EMAIL ? /\/home$/ : /\/admin-users$/,
};

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
}

test.describe("auth", () => {
  test("[AC-001] sign-in lands on the role's home page", async ({ page, context }) => {
    test.skip(!U.e || !U.p, "PENDING: no E2E credentials");
    await signIn(page, U.e!, U.p!);
    await expect(page).toHaveURL(U.home);
    // Cross-origin deploy: the session is a bearer token kept by the SPA, never a cookie.
    expect(await page.evaluate(() => localStorage.getItem("session_token"))).toBeTruthy();
    expect((await context.cookies()).find((c) => c.name === "session")).toBeUndefined();
  });

  test("[AC-002] a wrong password shows the generic error", async ({ page }) => {
    await signIn(page, U.e ?? "nobody@example.com", "wrong-password-xyz");
    await expect(
      page.getByRole("alert").filter({ hasText: "Incorrect email or password" }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("[AC-002] an unknown email shows the same generic error", async ({ page }) => {
    await signIn(page, `nobody${Date.now()}@example.com`, "wrong-password-xyz");
    await expect(
      page.getByRole("alert").filter({ hasText: "Incorrect email or password" }),
    ).toBeVisible();
  });

  test("[AC-003] sign-out returns to /sign-in and protected URLs redirect back", async ({
    page,
  }) => {
    test.skip(!U.e || !U.p, "PENDING: no E2E credentials");
    await signIn(page, U.e!, U.p!);
    await expect(page).toHaveURL(U.home);
    await page.getByRole("button", { name: "Sign out" }).first().click();
    await expect(page).toHaveURL(/\/sign-in/);
    await page.goto("/home");
    await expect(page).toHaveURL(/\/sign-in/);
    await page.goto("/timesheet");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("[AC-003] a protected URL without a session redirects to /sign-in", async ({ page }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("[AC-009] reset request shows the same confirmation for known and unknown emails", async ({
    page,
  }) => {
    const ask = async (email: string) => {
      await page.goto("/sign-in");
      await page.getByLabel("Email for reset link").fill(email);
      await page.getByRole("button", { name: /send reset link/i }).click();
      const msg = page.getByRole("status").filter({ hasText: "reset link has been sent" });
      await expect(msg).toBeVisible();
      return (await msg.innerText()).trim();
    };
    const unknown = await ask(`nobody${Date.now()}@example.com`);
    expect(unknown).toBe("If that email has an account, a reset link has been sent.");
    if (U.e) {
      expect(await ask(U.e)).toBe(unknown);
    }
  });
});
