// @ts-nocheck -- raw Markdown imports (?raw) are untyped here.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactMarkdown from "react-markdown";

import * as UI from "@/lib/ui";
import { brand } from "@/lib/brand";
import { useAuth } from "@/lib/auth";
import userGuide from "@/content/user-guide.md?raw";
import adminGuide from "@/content/admin-guide.md?raw";
import projectDocs from "@/content/project-docs.md?raw";

const { Tabs } = UI;

const CONTENT = {
  user: { label: "User guide", text: userGuide },
  admin: { label: "Admin guide", text: adminGuide },
  docs: { label: "Project documentation", text: projectDocs },
};

const components = {
  table: ({ node, ...p }) => (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <table {...p} style={{ borderCollapse: "collapse", width: "100%" }} />
    </div>
  ),
  th: ({ node, ...p }) => (
    <th
      {...p}
      style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #8884" }}
    />
  ),
  td: ({ node, ...p }) => (
    <td
      {...p}
      style={{
        textAlign: "left",
        padding: "8px 12px",
        verticalAlign: "top",
        borderBottom: "1px solid #8882",
        overflowWrap: "anywhere",
      }}
    />
  ),
};

export default function Screen() {
  const { user } = useAuth();
  const isAdmin = user?.role === "System Admin";
  const [tab, setTab] = React.useState("user");
  const keys = isAdmin ? ["user", "admin", "docs"] : ["user", "docs"];
  const active = keys.includes(tab) ? tab : "user";
  const tabs = keys.map((key) => ({ key, label: CONTENT[key].label }));

  return (
    <div
      className="px-4 py-8 md:px-8"
      style={{
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        backgroundColor: brand.backgroundColor,
        minHeight: "100%",
        overflowWrap: "anywhere",
      }}
    >
      <style>{`
        .help-md h2 { font-family: ${brand.fontHeading}; font-size: 22px; margin: 32px 0 12px; }
        .help-md p, .help-md li { font-size: 15px; line-height: 1.6; margin-bottom: 8px; }
        .help-md ol { list-style: decimal; padding-left: 24px; }
        .help-md ul { list-style: disc; padding-left: 24px; }
        .help-md code { font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: ${brand.accentColor}; }
        .help-md :focus-visible, .help-tabs button:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 2px; }
      `}</style>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
          Reference
        </p>
        <h1 style={{ fontFamily: brand.fontHeading, fontSize: 36, margin: "8px 0 24px" }}>
          Help and guides
        </h1>
        <div className="help-tabs" style={{ overflowX: "auto", marginBottom: 24 }}>
          <Tabs tabs={tabs} active={active} onChange={setTab} />
        </div>
        <div className="help-md" data-testid="help-content">
          <ReactMarkdown components={components}>{CONTENT[active].text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
