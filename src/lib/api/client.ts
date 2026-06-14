"use client";

import { config } from "@/lib/config";
import { getToken, clearToken } from "@/lib/auth/token";

export type Service = "auth" | "expense";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function baseUrl(service: Service): string {
  return service === "auth" ? config.authUrl : config.expenseUrl;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the stored JWT. Defaults to true. */
  auth?: boolean;
}

/**
 * Typed fetch wrapper. Attaches the JWT, parses JSON, throws ApiError on
 * non-2xx. On 401 it clears the token so the app falls back to login.
 */
export async function request<T>(
  service: Service,
  path: string,
  { method = "GET", body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl(service)}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401) {
    clearToken();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
