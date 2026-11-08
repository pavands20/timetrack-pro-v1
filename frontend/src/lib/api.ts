/// <reference types="vite/client" />
// Deployed, the SPA and the API are on different origins: the platform bakes the API's
// URL in as VITE_API_BASE_URL. Unset (npm run dev, tests), calls stay relative and Vite
// proxies /api. Browsers drop cross-site cookies, so the session token from login is
// kept here and sent as `Authorization: Bearer`.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

const SESSION_TOKEN_KEY = "session_token";

export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(SESSION_TOKEN_KEY, token);
    else localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Storage unavailable (private mode): the session just won't survive a reload.
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(method: string, path: string, status: number, body: unknown) {
    super(`${method} ${path} failed: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";
  const token = getSessionToken();
  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new ApiError(method, path, response.status, body);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
