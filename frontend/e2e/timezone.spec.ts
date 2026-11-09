import { expect, test, request as pwRequest, type APIRequestContext } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const CSRF = { "X-Requested-With": "XMLHttpRequest" };
const A = { e: process.env.E2E_ADMIN_EMAIL, p: process.env.E2E_ADMIN_PASSWORD };
const U = { e: process.env.E2E_EMPLOYEE_EMAIL, p: process.env.E2E_EMPLOYEE_PASSWORD };
const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

async function login(ctx: APIRequestContext, email: string, password: string) {
  const res = await ctx.post(`${API}/api/auth/login`, {
    headers: CSRF,
    data: { email, password },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return { headers: { ...CSRF, Authorization: `Bearer ${body.token}` }, user: body };
}

async function seedCatalogue(ctx: APIRequestContext) {
  const { headers } = await login(ctx, A.e!, A.p!);
  const c = await (
    await ctx.post(`${API}/api/admin/clients`, { headers, data: { name: `TZ C ${stamp()}` } })
  ).json();
  const project = `TZ P ${stamp()}`;
  const p = await (
    await ctx.post(`${API}/api/admin/projects`, {
      headers,
      data: { client_id: c.id, name: project, bill_rate: 10 },
    })
  ).json();
  const task = `TZ T ${stamp()}`;
  const t = await (
    await ctx.post(`${API}/api/admin/projects/${p.id}/tasks`, { headers, data: { name: task } })
  ).json();
  return { project, task, project_id: p.id, task_id: t.id };
}

// The wall-clock time an instant has in an IANA zone, the way a person reads it.
const hhmm = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));

async function clearRunning(ctx: APIRequestContext, headers: Record<string, string>) {
  const res = await ctx.post(`${API}/api/clock/out`, { headers });
  expect([200, 409]).toContain(res.status());
}

test.describe("US-017 times stored in UTC, shown in the user's time zone", () => {
  test.skip(
    !A.e || !A.p || !U.e || !U.p,
    "PENDING: needs E2E_ADMIN_* and E2E_EMPLOYEE_* credentials",
  );

  test("[AC-045] the API stores and returns UTC instants and the profile carries the IANA zone", async ({
    request,
  }) => {
    const { project_id, task_id } = await seedCatalogue(request);
    const { headers, user } = await login(request, U.e!, U.p!);
    expect(() => new Intl.DateTimeFormat("en-GB", { timeZone: user.time_zone })).not.toThrow();
    await clearRunning(request, headers);

    const before = Date.now();
    const res = await request.post(`${API}/api/clock/in`, {
      headers,
      data: { project_id, task_id, billable: true },
    });
    expect(res.status()).toBe(201);
    const entry = await res.json();
    // UTC with a Z suffix, and the instant is "now", not shifted by the zone offset.
    expect(entry.start_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
    expect(Math.abs(Date.parse(entry.start_at) - before)).toBeLessThan(5 * 60 * 1000);

    const status = await (await request.get(`${API}/api/clock/status`, { headers })).json();
    expect(status.entry.start_at).toBe(entry.start_at);

    const out = await request.post(`${API}/api/clock/out`, { headers });
    expect(out.status()).toBe(200);
    const o = await out.json();
    expect(o.start_at).toBe(entry.start_at);
    expect(o.end_at).toMatch(/Z$/);
    // The work date is the local calendar date of the start in the profile zone.
    const localDate = new Intl.DateTimeFormat("en-CA", { timeZone: user.time_zone }).format(
      new Date(o.start_at),
    );
    expect(o.work_date).toBe(localDate);
  });

  test("[AC-045] the clock screen shows the clock-in time in the profile zone, not UTC", async ({
    page,
    request,
  }) => {
    const { project, task, project_id, task_id } = await seedCatalogue(request);
    const { headers, user } = await login(request, U.e!, U.p!);
    await clearRunning(request, headers);

    await page.goto("/sign-in");
    await page.getByLabel("Email", { exact: true }).fill(U.e!);
    await page.getByLabel("Password", { exact: true }).fill(U.p!);
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/home$/);

    await page.locator("#clock-project").selectOption({ label: project });
    await page.locator("#clock-task").selectOption({ label: task });
    await page.getByRole("button", { name: "Clock in" }).click();
    await expect(page.getByText(/Status:.*in progress since/i)).toBeVisible();
    await expect(page.getByText(new RegExp(`times shown in ${user.time_zone}`))).toBeVisible();

    // Confirm through the API: the stored instant, read in the profile zone, is what is on screen.
    const status = await (await request.get(`${API}/api/clock/status`, { headers })).json();
    expect(status.entry.start_at).toMatch(/Z$/);
    const shown = hhmm(status.entry.start_at, user.time_zone);
    await expect(page.getByRole("status").filter({ hasText: "In progress since" })).toContainText(
      shown,
    );
    void project_id;
    void task_id;

    await page.getByRole("button", { name: "Clock out" }).click();
    await expect(page.getByText(/h added to/i)).toBeVisible();
  });

  test("[AC-046] the weekly timesheet reports its zone and puts a clocked entry on its local day with its elapsed minutes", async ({
    request,
  }) => {
    const { project_id, task_id } = await seedCatalogue(request);
    const { headers, user } = await login(request, U.e!, U.p!);
    await clearRunning(request, headers);
    const inRes = await request.post(`${API}/api/clock/in`, {
      headers,
      data: { project_id, task_id, billable: true },
    });
    expect(inRes.status()).toBe(201);
    const out = await (await request.post(`${API}/api/clock/out`, { headers })).json();

    // Monday of the week containing the entry's local work date.
    const d = new Date(`${out.work_date}T12:00:00Z`);
    const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000)
      .toISOString()
      .slice(0, 10);
    const week = await (await request.get(`${API}/api/timesheets/${monday}`, { headers })).json();
    expect(week.time_zone).toBe(user.time_zone);
    const dayIndex = Math.round(
      (Date.parse(`${out.work_date}T00:00:00Z`) - Date.parse(`${monday}T00:00:00Z`)) / 86400000,
    );
    const row = week.rows.find(
      (r: { project_id: number; task_id: number }) =>
        r.project_id === project_id && r.task_id === task_id,
    );
    expect(row).toBeTruthy();
    expect(row.days[dayIndex].clocked_minutes).toBe(out.duration_minutes);
    expect(row.days[dayIndex].clocked_entry_ids).toContain(out.id);
  });

  test("[AC-045] times endpoints refuse a request with no session", async ({ request }) => {
    const res = await request.get(`${API}/api/clock/status`);
    expect(res.status()).toBe(401);
  });

  test.skip("[AC-046] a clock-in spanning a real daylight-saving change cannot be driven end to end: the live server clock cannot be set (covered in backend/tests/test_timezone_us017_qa.py)", () => {});
});

// Keep the import used when every test above is skipped for missing credentials.
void pwRequest;
