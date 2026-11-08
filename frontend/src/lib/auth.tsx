import * as React from "react";

import { ApiError, apiFetch, setSessionToken } from "@/lib/api";

export type Role = "Employee" | "Manager" | "Payroll Admin" | "System Admin";

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  time_zone: string;
  home_path: string;
};

type AuthValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthValue>({
  user: null,
  loading: true,
  login: async () => {
    throw new Error("AuthProvider missing");
  },
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let live = true;
    apiFetch<User>("/api/auth/me")
      .then((u) => live && setUser(u))
      .catch((err) => {
        if (live && !(err instanceof ApiError)) console.error(err);
        if (live) setUser(null);
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const { token, ...u } = await apiFetch<User & { token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setSessionToken(token);
    setUser(u);
    setLoading(false);
    return u;
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await apiFetch<void>("/api/auth/logout", { method: "POST" });
    } finally {
      setSessionToken(null);
      setUser(null);
    }
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  return React.useContext(AuthContext);
}
