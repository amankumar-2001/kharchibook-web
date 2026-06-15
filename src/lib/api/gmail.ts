"use client";

import { config } from "@/lib/config";
import { request } from "./client";

/**
 * Gmail-connect client. The OAuth flow lives in auth-service: the SPA fetches a
 * consent URL (authenticated via the JWT header) and redirects to it; Google's
 * callback stores the encrypted tokens server-side. Status reads that back —
 * it's how we confirm a token was actually persisted.
 */

export interface GmailStatus {
  connected: boolean;
  scope?: string;
}

/** Whether the current user has Gmail connected (a stored credential). */
export async function getGmailStatus(): Promise<GmailStatus> {
  if (config.mockAuth) return { connected: false };
  return request<GmailStatus>("auth", "/v1/public/auth/google/gmail/status");
}

/** Returns Google's consent URL for the current user; caller redirects to it. */
export async function getGmailConnectUrl(): Promise<string> {
  const { authUrl } = await request<{ authUrl: string }>(
    "auth",
    "/v1/public/auth/google/gmail/connect",
  );
  return authUrl;
}
