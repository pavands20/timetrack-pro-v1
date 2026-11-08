import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Icons } from "@/lib/icons";
import SignIn from "@/screens/SignIn";
import Home from "@/screens/Home";
import Timesheet from "@/screens/Timesheet";
import AdminUsers from "@/screens/AdminUsers";
import AdminProjects from "@/screens/AdminProjects";
import Help from "@/screens/Help";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"TimeTrack Pro"}
        </p>
        <nav aria-label="App menu" className="flex flex-col gap-1">
          <NavLink to="/home" className={navLinkClass}>
            <Icons.Home size={16} />
            {"Home"}
          </NavLink>
          <NavLink to="/timesheet" className={navLinkClass}>
            <Icons.Menu size={16} />
            {"Timesheet"}
          </NavLink>
          <NavLink to="/admin-users" className={navLinkClass}>
            <Icons.User size={16} />
            {"Users"}
          </NavLink>
          <NavLink to="/admin-projects" className={navLinkClass}>
            <Icons.Settings size={16} />
            {"Projects"}
          </NavLink>
          <NavLink to="/help" className={navLinkClass}>
            {"Help"}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-projects" element={<AdminProjects />} />
        <Route path="/help" element={<Help />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
