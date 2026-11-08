// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.

import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const PRODUCT = "TimeTrack Pro V1";
const SCREEN = "Sign in and password reset";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

export default function Screen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [params] = useSearchParams();
  const resetToken = params.get("reset_token");
  const [signInError, setSignInError] = React.useState("");
  const [resetMessage, setResetMessage] = React.useState("");
  const [resetError, setResetError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [resetDone, setResetDone] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [resetEmail, setResetEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [resetSent, setResetSent] = React.useState(false);
  const field = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    height: 46,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
  };
  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };
  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const fieldMessage = (err, name) => {
    const list = err instanceof ApiError && Array.isArray(err.body?.detail) ? err.body.detail : [];
    const hit = list.find((d) => d.loc && d.loc[d.loc.length - 1] === name);
    return hit ? hit.msg : "";
  };
  const signIn = async () => {
    setSignInError("");
    try {
      const u = await login(email, password);
      navigate(u.home_path);
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 422
          ? fieldMessage(err, "email") || fieldMessage(err, "password")
          : "";
      setSignInError(msg || "Incorrect email or password");
    }
  };
  const handleSignInClick = (e) => {
    const f = e.currentTarget.form;
    if (f && !f.reportValidity()) return;
    signIn();
  };
  const submitReset = async () => {
    setResetError("");
    setPasswordError("");
    setResetDone(false);
    if (resetToken) {
      if (newPassword !== confirmPassword) return;
      try {
        await apiFetch("/api/auth/password-reset/confirm", {
          method: "POST",
          body: JSON.stringify({ token: resetToken, new_password: newPassword }),
        });
        setResetDone(true);
      } catch (err) {
        if (err instanceof ApiError && err.status === 422) {
          setPasswordError(fieldMessage(err, "new_password") || "Enter a valid password.");
        } else if (err instanceof ApiError && err.status === 400) {
          setResetError("This reset link is invalid or has expired.");
        } else {
          setResetError("Something went wrong. Try again.");
        }
      }
      return;
    }
    try {
      const r = await apiFetch("/api/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail }),
      });
      setResetMessage(r.message);
      setResetSent(true);
    } catch (err) {
      setResetError(fieldMessage(err, "email") || "Something went wrong. Try again.");
    }
  };
  const handleResetClick = (e) => {
    const f = e.currentTarget.form;
    if (f && !f.reportValidity()) return;
    submitReset();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-10"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <style>{`
        .vl-focus:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .vl-focus { transition: none !important; } }
      `}</style>
      <main
        className="w-full max-w-4xl p-10"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: HAIRLINE,
          borderRadius: brand.radius,
        }}
      >
        <div className="text-3xl" style={{ fontFamily: brand.fontHeading }}>
          {PRODUCT}
        </div>
        <div
          aria-hidden
          className="mt-3 h-px w-12"
          style={{ backgroundColor: brand.accentColor }}
        />
        <p className="mt-3 text-xs uppercase" style={label}>
          {SCREEN}
        </p>

        <h1 data-wf="b-0-0" className="mt-8 text-2xl" style={{ fontFamily: brand.fontHeading }}>
          Sign in to TimeTrack Pro
        </h1>

        <div className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
          <form
            id="vl-signin-form"
            data-wf="b-1-0"
            className="space-y-5 md:col-start-1 md:row-start-1"
            onSubmit={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            <h2 className="text-lg" style={{ fontFamily: brand.fontHeading }}>
              Sign in
            </h2>
            {signInError && (
              <p role="alert" className="text-sm" style={{ color: "rgb(232,150,140)" }}>
                {signInError}
              </p>
            )}
            <div className="space-y-2">
              <label htmlFor="vl-email" className="block text-xs uppercase" style={label}>
                Email
              </label>
              <input
                data-wf="i-1-0-0"
                id="vl-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>
                Password
              </label>
              <input
                data-wf="i-1-0-1"
                id="vl-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
          </form>

          <div className="md:col-start-1 md:row-start-2">
            <button
              data-wf="b-2-0"
              type="button"
              form="vl-signin-form"
              onClick={handleSignInClick}
              className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={{
                backgroundColor: brand.accentColor,
                color: brand.backgroundColor,
                borderRadius: brand.radius,
              }}
            >
              Sign in
            </button>
          </div>

          <form
            id="vl-reset-form"
            data-wf="b-1-1"
            className="space-y-5 md:col-start-2 md:row-start-1"
            onSubmit={(e) => {
              e.preventDefault();
              submitReset();
            }}
          >
            <h2 className="text-lg" style={{ fontFamily: brand.fontHeading }}>
              Reset your password
            </h2>
            <div className="space-y-2">
              <label htmlFor="vl-reset-email" className="block text-xs uppercase" style={label}>
                Email for reset link
              </label>
              <input
                data-wf="i-1-1-0"
                id="vl-reset-email"
                type="email"
                autoComplete="email"
                required={!resetToken}
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetSent(false);
                }}
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="vl-new-password" className="block text-xs uppercase" style={label}>
                New password (from reset link)
              </label>
              <input
                data-wf="i-1-1-1"
                id="vl-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby="vl-new-hint vl-new-error"
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
              <p id="vl-new-hint" className="text-xs" style={{ color: brand.neutralColor }}>
                Only needed once you have opened the link from your email.
              </p>
              <p id="vl-new-error" className="text-xs" style={{ color: "rgb(232,150,140)" }}>
                {passwordError}
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="vl-confirm-password"
                className="block text-xs uppercase"
                style={label}
              >
                Confirm new password
              </label>
              <input
                data-wf="i-1-1-2"
                id="vl-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={mismatch}
                aria-describedby="vl-confirm-msg"
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
              <p
                id="vl-confirm-msg"
                aria-live="polite"
                className="text-xs"
                style={{ color: brand.primaryColor }}
              >
                {mismatch ? "Not the same yet: the two passwords need to match." : ""}
              </p>
            </div>
            {resetSent && (
              <p
                role="status"
                className="text-sm"
                style={{ borderLeft: "1px solid " + brand.accentColor, paddingLeft: 12 }}
              >
                {resetMessage}
              </p>
            )}
            {resetDone && (
              <p role="status" className="text-sm">
                Your password has been reset. You can now sign in.
              </p>
            )}
            {resetError && (
              <p role="alert" className="text-sm" style={{ color: "rgb(232,150,140)" }}>
                {resetError}
              </p>
            )}
          </form>

          <div className="md:col-start-2 md:row-start-2">
            <button
              data-wf="b-2-1"
              type="button"
              form="vl-reset-form"
              onClick={handleResetClick}
              className="vl-focus h-12 w-full text-xs font-bold uppercase tracking-[0.25em] transition-opacity hover:opacity-90"
              style={{
                border: HAIRLINE,
                color: brand.primaryColor,
                backgroundColor: "transparent",
                borderRadius: brand.radius,
              }}
            >
              Send reset link
            </button>
          </div>
        </div>

        <p data-wf="b-3-0" className="mt-8 text-xs" style={{ color: brand.neutralColor }}>
          If the details are wrong, we show: Incorrect email or password. If the email has an
          account, a reset link has been sent.
        </p>

        <p className="mt-8 text-xs uppercase" style={label}>
          No account?{" "}
          <button
            type="button"
            className="vl-focus underline underline-offset-4"
            style={{ color: brand.accentColor }}
          >
            Request an invitation
          </button>
        </p>
      </main>
    </div>
  );
}
