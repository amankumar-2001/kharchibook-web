/**
 * Runtime configuration, sourced from NEXT_PUBLIC_* env vars.
 * These are inlined into the client bundle at build time, so they must be
 * non-secret (service URLs and feature flags only).
 */
export const config = {
  /** auth-service base URL — email/password + OTP, JWT issuance. */
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:8080",
  /** autopay-service base URL — expenses, autopays, analytics, gmail. */
  autopayUrl: process.env.NEXT_PUBLIC_AUTOPAY_URL ?? "http://localhost:8082",
  /**
   * Per-service mock switches. Mocking auth lets the UI run with no backend;
   * mocking autopay lets login run live while the dashboard data is sampled
   * (autopay-service doesn't exist yet).
   */
  mockAuth: process.env.NEXT_PUBLIC_MOCK_AUTH === "1",
  mockAutopay: process.env.NEXT_PUBLIC_MOCK_AUTOPAY === "1",
} as const;
