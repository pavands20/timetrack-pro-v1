import { expect, test, request as pwRequest, type APIRequestContext } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const U = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };
const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

async function tokenFor(ctx: APIRequestContext, email: string, password: string) {
  const res = await ctx.post(`${API}/api/auth/login`, {
    headers: CSRF,
    data: { email, password },
  });
  expect(res.status()).toBe(200);
  return { ...CSRF, Authorization: `Bearer ${(await res.json()).token}` };
}

async function seedCatalogue(ctx: APIRequestContext) {
  const headers = await tokenFor(ctx, A.e!, A.p!);
  const c = await (
    await ctx.post(`${API}/api/admin/clients`, { headers, data: { name: `Brk C ${stamp()}` } })
  ).json();
  const p = await (
    await ctx.post(`${API}/api/admin/projects`, {
      headers,
      data: { client_id: c.id, name: `Brk P ${stamp()}`, bill_rate: 10 },
    })
  ).json();
  const t = await (
    await ctx.post(`${API}/api/admin/projects/${p.id}/tasks`, {
      headers,
      data: { name: `Brk T ${stamp()}` },
    })
  ).json();
  return { project_id: p.id, task_id: t.id };
}

// Leave the employee with no running entry, whatever an earlier spec left behind.
async function clearRunning(ctx: APIRequestContext, headers: Record<string, string>) {
  const res = await ctx.post(`${API}/api/clock/out`, { headers });
  expect([200, 409]).toContain(res.status());
}

test.describe("US-011 breaks: API contract", () => {
  test.skip(
    !A.e || !A.p || !U.e || !U.p,
    "PENDING: needs E2E_ADMIN_* and E2E_EMPLOYEE_* credentials",
  );

  test("[AC-028] a break started and ended is recorded and subtracted from the entry", async ({
    request,
  }) => {
    const { project_id, task_id } = await seedCatalogue(request);
    const h = await tokenFor(request, U.e!, U.p!);
    await clearRunning(request, h);
    const inRes = await request.post(`${API}/api/clock/in`, {
      headers: h,
      data: { project_id, task_id, billable: true },
    });
    expect(inRes.status()).toBe(201);

    const started = await request.post(`${API}/api/clock/breaks/start`, { headers: h });
    expect([200, 201]).toContain(started.status());
    const s = await started.json();
    expect(s.on_break).toBe(true);
    expect(s.break_started_at).toMatch(/Z$/);

    await new Promise((r) => setTimeout(r, 1200));
    const ended = await request.post(`${API}/api/clock/breaks/end`, { headers: h });
    expect(ended.status()).toBe(200);
    const e = await ended.json();
    expect(e.on_break).toBe(false);
    expect(e.break_started_at).toBeNull();
    expect(e).toHaveProperty("break_minutes");

    const status = await (await request.get(`${API}/api/clock/status`, { headers: h })).json();
    expect(status.entry.on_break).toBe(false);

    const out = await request.post(`${API}/api/clock/out`, { headers: h });
    expect(out.status()).toBe(200);
    const o = await out.json();
    expect(typeof o.duration_minutes).toBe("number");
    const elapsedMin = (Date.parse(o.end_at) - Date.parse(o.start_at)) / 60000;
    expect(o.duration_minutes).toBeLessThanOrEqual(Math.floor(elapsedMin));
    // Ending a break that is no longer open is refused.
    expect((await request.post(`${API}/api/clock/breaks/end`, { headers: h })).status()).toBe(409);
  });

  test("[AC-029] clocking out while on a break closes the break and the entry", async ({
    request,
  }) => {
    const { project_id, task_id } = await seedCatalogue(request);
    const h = await tokenFor(request, U.e!, U.p!);
    await clearRunning(request, h);
    expect(
      (
        await request.post(`${API}/api/clock/in`, {
          headers: h,
          data: { project_id, task_id, billable: false },
        })
      ).status(),
    ).toBe(201);
    const started = await request.post(`${API}/api/clock/breaks/start`, { headers: h });
    expect([200, 201]).toContain(started.status());

    const out = await request.post(`${API}/api/clock/out`, { headers: h });
    expect(out.status()).toBe(200);
    expect((await out.json()).end_at).toMatch(/Z$/);

    const status = await (await request.get(`${API}/api/clock/status`, { headers: h })).json();
    expect(status).toEqual({ entry: null });
    // No break is left open on the closed entry.
    expect((await request.post(`${API}/api/clock/breaks/end`, { headers: h })).status()).toBe(409);
  });

  test("[AC-030] starting a second break while on one is refused with 409", async ({ request }) => {
    const { project_id, task_id } = await seedCatalogue(request);
    const h = await tokenFor(request, U.e!, U.p!);
    await clearRunning(request, h);
    await request.post(`${API}/api/clock/in`, {
      headers: h,
      data: { project_id, task_id, billable: true },
    });
    const first = await request.post(`${API}/api/clock/breaks/start`, { headers: h });
    expect([200, 201]).toContain(first.status());
    const firstStart = (await first.json()).break_started_at;

    const second = await request.post(`${API}/api/clock/breaks/start`, { headers: h });
    expect(second.status()).toBe(409);
    expect(typeof (await second.json()).detail).toBe("string");

    const status = await (await request.get(`${API}/api/clock/status`, { headers: h })).json();
    expect(status.entry.on_break).toBe(true);
    expect(status.entry.break_started_at).toBe(firstStart);
    await clearRunning(request, h);
  });

  test("[AC-030] break endpoints require a session", async () => {
    const ctx = await pwRequest.newContext();
    for (const path of ["breaks/start", "breaks/end"]) {
      const res = await ctx.post(`${API}/api/clock/${path}`, { headers: CSRF });
      expect(res.status()).toBe(401);
    }
    await ctx.dispose();
  });
});
