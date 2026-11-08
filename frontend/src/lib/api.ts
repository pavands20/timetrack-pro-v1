/// <reference types="vite/client" />
// Same-origin API: calls go to /api/... (Vite proxies it in dev). Auth is an HttpOnly
// session cookie; nothing sensitive is kept in browser storage.
export const API_BASE_URL = "";

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
  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
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
