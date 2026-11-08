import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import SignIn from "./SignIn";

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });

function setup(path: string, handlers: Record<string, () => Response>) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url}`;
    return handlers[key]?.() ?? json({ detail: "Not signed in" }, 401);
  });
  vi.stubGlobal("fetch", fn);
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/somewhere" element={<p>somewhere page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
  return fn;
}

async function fillReset(password: string) {
  await userEvent.type(screen.getByLabelText("New password (from reset link)"), password);
  await userEvent.type(screen.getByLabelText("Confirm new password"), password);
  await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("SignIn", () => {
  it("[AC-001] signs in and navigates to home_path", async () => {
    const fn = setup("/sign-in", {
      "POST /api/auth/login": () =>
        json({
          id: 1,
          email: "a@b.co",
          full_name: "A",
          role: "Manager",
          time_zone: "UTC",
          home_path: "/somewhere",
          token: "tok-123",
        }),
    });
    await userEvent.type(screen.getByLabelText("Email"), "a@b.co");
    await userEvent.type(screen.getByLabelText("Password"), "secret-password");
    await userEvent.click(screen.getAllByRole("button", { name: "Sign in" })[0]);
    expect(await screen.findByText("somewhere page")).toBeInTheDocument();
    const call = fn.mock.calls.find((c) => c[0] === "/api/auth/login")!;
    expect((call[1] as RequestInit).headers).toMatchObject({
      "X-Requested-With": "XMLHttpRequest",
    });
    // Cross-origin: the session travels as a bearer token, not a cookie.
    expect(localStorage.getItem("session_token")).toBe("tok-123");
  });

  it("[AC-002] a 401 shows the generic message in an alert", async () => {
    setup("/sign-in", {
      "POST /api/auth/login": () => json({ detail: "Incorrect email or password" }, 401),
    });
    await userEvent.type(screen.getByLabelText("Email"), "a@b.co");
    await userEvent.type(screen.getByLabelText("Password"), "x");
    await userEvent.click(screen.getAllByRole("button", { name: "Sign in" })[0]);
    expect(await screen.findByRole("alert")).toHaveTextContent("Incorrect email or password");
  });

  it("[AC-007] [AC-009] shows the returned confirmation message", async () => {
    const message = "If that email has an account, a reset link has been sent.";
    setup("/sign-in", {
      "POST /api/auth/password-reset/request": () => json({ message }, 202),
    });
    await userEvent.type(screen.getByLabelText("Email for reset link"), "who@x.co");
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByRole("status")).toHaveTextContent(message);
  });

  it("[AC-008] [NFR-013] confirm: 422 shows the field message", async () => {
    setup("/sign-in?reset_token=tok", {
      "POST /api/auth/password-reset/confirm": () =>
        json(
          {
            detail: [
              {
                loc: ["body", "new_password"],
                msg: "Password must be at least 12 characters long.",
              },
            ],
          },
          422,
        ),
    });
    await fillReset("short");
    expect(
      await screen.findByText("Password must be at least 12 characters long."),
    ).toBeInTheDocument();
  });

  it("[AC-008] confirm: 400 shows the invalid link message", async () => {
    setup("/sign-in?reset_token=tok", {
      "POST /api/auth/password-reset/confirm": () =>
        json({ detail: "This reset link is invalid or has expired." }, 400),
    });
    await fillReset("long-enough-pass");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This reset link is invalid or has expired.",
    );
  });

  it("[AC-008] confirm: 204 shows success", async () => {
    setup("/sign-in?reset_token=tok", {
      "POST /api/auth/password-reset/confirm": () => new Response(null, { status: 204 }),
    });
    await fillReset("long-enough-pass");
    expect(await screen.findByText(/You can now sign in/)).toBeInTheDocument();
  });
});
