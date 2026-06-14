"use client";

/**
 * JWT storage. MVP keeps the access (and refresh) token in localStorage so the
 * client can attach the access token to expense-service requests. (When the
 * services move behind one domain, switch to httpOnly cookies — the API client
 * is the only caller, so the blast radius is small.)
 */
const ACCESS_KEY = "kb.jwt";
const REFRESH_KEY = "kb.refresh";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setToken(access: string, refresh?: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
