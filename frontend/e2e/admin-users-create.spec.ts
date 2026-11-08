import { expect, test, request as pwRequest } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };

// The database starts empty, so no admin exists unless the run provides one
// (E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD, as in admin-users.spec.ts).
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };

const uniq = () => `us004${Date.now()}${Math.floor(Math.random() * 100000)}@example.com`;
const valid = (email: string) => ({
  full_name: "US004 Person",
  email,
  role: "Employee",
  time_zone: "Europe/London",
});

test.describe("US-004 create user: API contract", () => {
  test("[AC-010] creating a user without a session is refused and creates nothing", async ({
    request,
  }) => {
    const email = uniq();
    const res = await request.post(`${API}/api/admin/users`, {
      headers: CSRF,
      data: valid(email),
    });
    expect(res.status()).toBe(401);
    expect(JSON.stringify(await res.json())).not.toContain(email);
  });

  test("[AC-010] a state-changing call without X-Requested-With is refused", async ({
    request,
  }) => {
    const res = await request.post(`${API}/api/admin/users`, { data: valid(uniq()) });
    expect(res.status()).toBe(403);
  });

  test("[AC-010] a sign-in for an account that has no password yet is refused", async ({
    request,
  }) => {
    const res = await request.post(`${API}/api/auth/login`, {
      headers: CSRF,
      data: { email: uniq(), password: "whatever-password-1" },
    });
    expect(res.status()).toBe(401);
  });

  test("[AC-010] a set-password link with an unknown token is rejected", async ({ request }) => {
    const res = await request.post(`${API}/api/auth/password-reset/confirm`, {
      headers: CSRF,
      data: { token: "not-a-real-token", new_password: "a-long-enough-password-1" },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});

test.describe("US-004 create user: as System Admin", () => {
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

  test("[AC-010] a valid create returns 201 and the user appears in the list", async ({
    request,
  }) => {
    const headers = await adminHeaders();
    const email = uniq();
    const res = await request.post(`${API}/api/admin/users`, { headers, data: valid(email) });
    expect(res.status()).toBe(201);
    const created = await res.json();
    expect(created).toMatchObject({
      email,
      full_name: "US004 Person",
      role: "Employee",
      time_zone: "Europe/London",
      manager_id: null,
      is_active: true,
    });
    expect(created).not.toHaveProperty("password_hash");
    const list = await request.get(`${API}/api/admin/users`, { headers });
    expect(list.status()).toBe(200);
    const ids = (await list.json()).map((u: { id: number }) => u.id);
    expect(ids).toContain(created.id);
  });

  test("[AC-011] the same email, in any case, is rejected 409 with a clear message", async ({
    request,
  }) => {
    const headers = await adminHeaders();
    const email = uniq();
    expect(
      (await request.post(`${API}/api/admin/users`, { headers, data: valid(email) })).status(),
    ).toBe(201);
    for (const e of [email, email.toUpperCase()]) {
      const dup = await request.post(`${API}/api/admin/users`, { headers, data: valid(e) });
      expect(dup.status()).toBe(409);
      expect(await dup.json()).toEqual({ detail: "An account with this email already exists." });
    }
    const list = await (await request.get(`${API}/api/admin/users`, { headers })).json();
    expect(list.filter((u: { email: string }) => u.email === email)).toHaveLength(1);
  });

  for (const field of ["full_name", "email", "role", "time_zone"]) {
    test(`[AC-012] missing ${field} returns 422 naming the field and creates nothing`, async ({
      request,
    }) => {
      const headers = await adminHeaders();
      const email = uniq();
      const data: Record<string, string> = valid(email);
      delete data[field];
      const before = (await (await request.get(`${API}/api/admin/users`, { headers })).json())
        .length;
      const res = await request.post(`${API}/api/admin/users`, { headers, data });
      expect(res.status()).toBe(422);
      const detail = (await res.json()).detail as { loc: string[]; msg: string }[];
      const hit = detail.find((d) => d.loc[d.loc.length - 1] === field);
      expect(hit?.msg).toBeTruthy();
      const after = (await (await request.get(`${API}/api/admin/users`, { headers })).json())
        .length;
      expect(after).toBe(before);
    });
  }

  test("[AC-012] the new-user form names each missing field and creates no account", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(A.e!);
    await page.getByLabel("Password").fill(A.p!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin-users");
    await expect(page.getByRole("heading", { name: "User administration" })).toBeVisible();
    const rows = await page.getByRole("table", { name: "Users" }).getByRole("row").count();
    await page.getByRole("button", { name: "New user" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Full name is required.")).toBeVisible();
    await expect(page.getByText("Email is required.")).toBeVisible();
    await expect(page.getByText("Choose a time zone.")).toBeVisible();
    await expect(page.getByRole("table", { name: "Users" }).getByRole("row")).toHaveCount(rows);
  });
});
