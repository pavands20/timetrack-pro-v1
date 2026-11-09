import * as React from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { Icons } from "@/lib/icons";
import { useAuth } from "@/lib/auth";
import SignIn from "@/screens/SignIn";
import Home from "@/screens/Home";
import Timesheet from "@/screens/Timesheet";
import AdminUsers from "@/screens/AdminUsers";
import AdminProjects from "@/screens/AdminProjects";
import Help from "@/screens/Help";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex min-h-11 items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  if (loading)
    return (
      <p role="status" className="p-8">
        Loading…
      </p>
    );
  if (!user) return <Navigate to="/sign-in" replace />;
  const isAdmin = user.role === "System Admin";
  const signOut = async () => {
    try {
      await logout();
    } finally {
      navigate("/sign-in", { replace: true });
    }
  };
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside
        className="w-full shrink-0 border-b p-2 md:w-56 md:border-b-0 md:border-r md:p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="flex items-center justify-between md:mb-4">
          <p
            className="px-3 text-sm font-semibold"
            style={{ fontFamily: "var(--brand-font-heading)" }}
          >
            {"TimeTrack Pro"}
          </p>
          <button
            type="button"
            className="inline-flex h-11 min-w-11 items-center justify-center md:hidden"
            aria-expanded={menuOpen}
            aria-controls="app-menu"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icons.Menu size={20} />
          </button>
        </div>
        <nav
          id="app-menu"
          aria-label="App menu"
          className={`${menuOpen ? "flex" : "hidden"} flex-col gap-1 md:flex`}
          onClick={() => setMenuOpen(false)}
        >
          <NavLink to="/home" className={navLinkClass}>
            <Icons.Home size={16} />
            {"Home"}
          </NavLink>
          <NavLink to="/timesheet" className={navLinkClass}>
            <Icons.Menu size={16} />
            {"Timesheet"}
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin-users" className={navLinkClass}>
              <Icons.User size={16} />
              {"Users"}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin-projects" className={navLinkClass}>
              <Icons.Settings size={16} />
              {"Projects"}
            </NavLink>
          )}
          <NavLink to="/help" className={navLinkClass}>
            {"Help"}
          </NavLink>
          <button
            type="button"
            onClick={signOut}
            className="flex min-h-11 items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-left text-sm font-medium text-[var(--brand-fg-muted)]"
          >
            {"Sign out"}
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function AdminOnly({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  return user?.role === "System Admin" ? children : <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route
          path="/admin-users"
          element={
            <AdminOnly>
              <AdminUsers />
            </AdminOnly>
          }
        />
        <Route
          path="/admin-projects"
          element={
            <AdminOnly>
              <AdminProjects />
            </AdminOnly>
          }
        />
        <Route path="/help" element={<Help />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
