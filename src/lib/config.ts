/**
 * Runtime configuration, sourced from NEXT_PUBLIC_* env vars.
 * These are inlined into the client bundle at build time, so they must be
 * non-secret (service URLs and feature flags only).
 */
export const config = {
  /** auth-service base URL — email/password + OTP, JWT issuance. */
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:8080",
  /** expense-service base URL — expenses, autopays, analytics, gmail. */
  expenseUrl: process.env.NEXT_PUBLIC_EXPENSE_URL ?? "http://localhost:8082",
  /**
   * Per-service mock switches. Mocking auth lets the UI run with no backend;
   * mocking expense samples the dashboard data instead of calling the live
   * expense-service at expenseUrl.
   */
  mockAuth: process.env.NEXT_PUBLIC_MOCK_AUTH === "1",
  mockExpense: process.env.NEXT_PUBLIC_MOCK_EXPENSE === "1",
  /**
   * KharchiBook's WhatsApp business number (digits only, with country code, e.g.
   * "919876543210"). Used to build the wa.me click-to-chat deep link in the
   * "Talk to us on WhatsApp" feature. Empty hides the feature.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;
