/** Domain types shared by the API layer and the UI. Mirror expense-service DTOs. */

export type Language = "hi" | "kn" | "ta" | "en";
export type Plan = "free" | "premium";

export interface User {
  id: string;
  email: string;
  /** Whether the email/OTP has been verified (from auth-service). */
  verified: boolean;
  phone: string;
  name: string;
  language: Language;
  plan: Plan;
}

export type ExpenseCategory =
  | "Groceries"
  | "Transport"
  | "Food/Dining"
  | "Utilities"
  | "Medical"
  | "Entertainment"
  | "Shopping"
  | "Other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  rawText: string;
  expenseDate: string; // ISO date
}

export type AutoPayType =
  | "emi"
  | "subscription"
  | "insurance"
  | "sip"
  | "other";

export type AutoPaySource = "manual" | "email_auto";
export type AutoPayStatus = "active" | "inactive" | "cancelled" | "duplicate";

export interface AutoPay {
  id: string;
  name: string;
  type: AutoPayType;
  amount: number;
  deductDay: number; // 1–31
  source: AutoPaySource;
  status: AutoPayStatus;
  /** 0–1, present only for auto-detected entries awaiting confirmation. */
  confidenceScore?: number;
}

export interface CategoryTotal {
  category: ExpenseCategory;
  total: number;
}

export interface ExpenseSummary {
  month: string; // e.g. "June 2026"
  total: number;
  byCategory: CategoryTotal[];
}

export interface Salary {
  monthlySalary: number;
  salaryDay: number; // 1–31
}

export interface CommittedSummary {
  monthlySalary: number;
  salaryDay: number;
  totalCommitted: number;
  freeMoney: number;
  autopays: AutoPay[];
}

export interface UpcomingDeduction {
  autopayId: string;
  name: string;
  amount: number;
  deductDay: number;
  inDays: number;
}
