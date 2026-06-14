"use client";

import { config } from "@/lib/config";
import { request } from "./client";
import { mockUser } from "./mock";
import type { Language, Plan, User } from "./types";

/**
 * auth-service client. The real service (REPO 2) is email/password based:
 * signup creates the account and emails an OTP, login returns a JWT pair, and
 * OTP verify marks the email verified. Routes live under /v1/public/auth.
 */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/** Raw shape returned by GET /v1/public/auth/me. */
interface MeResponse {
  userId: number;
  email: string;
  verified: boolean;
  provider: string;
  roles: string[];
}

export async function login(email: string, password: string): Promise<TokenPair> {
  if (config.mockAuth) {
    return { accessToken: `mock.${btoa(email)}.token`, refreshToken: "mock.refresh", expiresIn: 900, tokenType: "Bearer" };
  }
  return request<TokenPair>("auth", "/v1/public/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export interface SignupResult {
  userId: string;
  verified: boolean;
  message: string;
}

export async function signup(
  email: string,
  password: string,
  phone?: string,
): Promise<SignupResult> {
  if (config.mockAuth) {
    return { userId: "1", verified: false, message: "OTP sent" };
  }
  return request<SignupResult>("auth", "/v1/public/auth/signup", {
    method: "POST",
    body: { email, password, ...(phone ? { phone } : {}) },
    auth: false,
  });
}

export async function verifyOtp(email: string, otp: string): Promise<{ verified: boolean }> {
  if (config.mockAuth) return { verified: true };
  return request<{ verified: boolean }>("auth", "/v1/public/auth/otp/verify", {
    method: "POST",
    body: { email, otp },
    auth: false,
  });
}

export async function resendOtp(email: string): Promise<void> {
  if (config.mockAuth) return;
  await request("auth", "/v1/public/auth/otp/resend", {
    method: "POST",
    body: { email },
    auth: false,
  });
}

/**
 * Resolve the current user. auth-service owns only identity (email, verified,
 * roles); profile fields the dashboard wants (name, plan, language, phone) are
 * autopay-service's domain, so we derive sensible defaults until that exists.
 */
export async function getMe(): Promise<User> {
  if (config.mockAuth) return mockUser;
  const me = await request<MeResponse>("auth", "/v1/public/auth/me");
  return {
    id: String(me.userId),
    email: me.email,
    verified: me.verified,
    phone: "",
    name: me.email.split("@")[0],
    language: "en" as Language,
    plan: "free" as Plan,
  };
}
