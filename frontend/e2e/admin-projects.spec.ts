import { expect, test } from "@playwright/test";

const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

test.describe("admin projects screen", () => {
  test.skip(!A.e || !A.p, "PENDING: no E2E admin credentials (E2E_ADMIN_EMAIL/PASSWORD)");

  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(A.e!);
    await page.getByLabel("Password").fill(A.p!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin-projects");
    await expect(page.getByRole("heading", { name: "Clients, projects and tasks" })).toBeVisible();
  });

  test("[AC-019] admin creates a client and a project with a rate, adds a task and archives it", async ({
    page,
  }) => {
    const client = `QA Client ${stamp()}`;
    const project = `QA Project ${stamp()}`;
    const task = `QA Task ${stamp()}`;

    await page.getByRole("button", { name: "New client" }).click();
    await page.getByLabel("Client name").fill(client);
    await page.getByRole("button", { name: "Create client" }).click();
    await expect(page.getByText(client).first()).toBeVisible();

    await page.getByLabel("Project name").fill(project);
    await page.getByLabel(/bill rate/i).fill("145.00");
    await page.getByRole("button", { name: "Save project" }).click();
    await expect(page.getByText(project).first()).toBeVisible();

    await page.getByLabel("New task name").fill(task);
    await page.getByRole("button", { name: "Add task" }).click();
    await expect(page.getByText(task).first()).toBeVisible();

    await page.getByRole("button", { name: `Archive task ${task}` }).click();
    await page.getByRole("button", { name: `Archive ${task}` }).click();
    await expect(page.getByText(/archived/i).first()).toBeVisible();
  });

  test("[AC-020] an invalid rate (-5 and abc) shows the clear validation message", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "New client" }).click();
    await page.getByLabel("Client name").fill(`QA Rate ${stamp()}`);
    await page.getByRole("button", { name: "Create client" }).click();
    await page.getByLabel("Project name").fill(`QA Bad Rate ${stamp()}`);
    for (const bad of ["-5", "abc"]) {
      await page.getByLabel(/bill rate/i).fill(bad);
      await page.getByRole("button", { name: "Save project" }).click();
      await expect(page.getByText(/The bill rate must be a number of 0 or more/)).toBeVisible();
    }
  });

  test("[AC-022] no invoice or payment control is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /invoice|payment/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /invoice|payment/i })).toHaveCount(0);
    await expect(page.getByLabel(/invoice|payment/i)).toHaveCount(0);
  });
});
