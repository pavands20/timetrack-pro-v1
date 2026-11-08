// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const PRODUCT = "TimeTrack Pro V1";
const SCREEN = "Sign in and password reset";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";

export default function Screen() {
  const navigate = useNavigate();
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

  const signIn = () => navigate("home");
  const handleSignInClick = (e) => {
    const f = e.currentTarget.form;
    if (f && !f.reportValidity()) return;
    signIn();
  };
  const handleResetClick = (e) => {
    const f = e.currentTarget.form;
    if (f && !f.reportValidity()) return;
    setResetSent(true);
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
              setResetSent(true);
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
                required
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
                aria-describedby="vl-new-hint"
                className="vl-focus w-full px-3 text-sm outline-none"
                style={field}
              />
              <p id="vl-new-hint" className="text-xs" style={{ color: brand.neutralColor }}>
                Only needed once you have opened the link from your email.
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
                If that email has an account, a reset link has been sent.
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
