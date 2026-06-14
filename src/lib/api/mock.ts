import type {
  AutoPay,
  CommittedSummary,
  ExpenseSummary,
  UpcomingDeduction,
  User,
} from "./types";

/** Sample data used when NEXT_PUBLIC_USE_MOCK=1, mirroring the PRD examples. */

export const mockUser: User = {
  id: "usr_demo",
  email: "ramesh@example.com",
  verified: true,
  phone: "+919876543210",
  name: "Ramesh",
  language: "hi",
  plan: "free",
};

const autopays: AutoPay[] = [
  { id: "ap_1", name: "Home Loan", type: "emi", amount: 22000, deductDay: 5, source: "manual", status: "active" },
  { id: "ap_2", name: "Car Loan", type: "emi", amount: 8500, deductDay: 8, source: "manual", status: "active" },
  { id: "ap_3", name: "Netflix", type: "subscription", amount: 649, deductDay: 12, source: "email_auto", status: "active" },
  { id: "ap_4", name: "Amazon Prime", type: "subscription", amount: 299, deductDay: 15, source: "email_auto", status: "active" },
  { id: "ap_5", name: "Hotstar", type: "subscription", amount: 299, deductDay: 20, source: "email_auto", status: "active", confidenceScore: 0.72 },
  { id: "ap_6", name: "LIC Premium", type: "insurance", amount: 4200, deductDay: 28, source: "manual", status: "active" },
];

export const mockCommitted: CommittedSummary = {
  monthlySalary: 65000,
  salaryDay: 1,
  totalCommitted: autopays.reduce((s, a) => s + a.amount, 0),
  freeMoney: 65000 - autopays.reduce((s, a) => s + a.amount, 0),
  autopays,
};

export const mockExpenseSummary: ExpenseSummary = {
  month: "June 2026",
  total: 23700,
  byCategory: [
    { category: "Groceries", total: 8400 },
    { category: "Food/Dining", total: 4800 },
    { category: "Shopping", total: 3400 },
    { category: "Transport", total: 3200 },
    { category: "Utilities", total: 2100 },
    { category: "Other", total: 1200 },
    { category: "Medical", total: 600 },
  ],
};

export const mockUpcoming: UpcomingDeduction[] = [
  { autopayId: "ap_1", name: "Home Loan", amount: 22000, deductDay: 5, inDays: 2 },
  { autopayId: "ap_2", name: "Car Loan", amount: 8500, deductDay: 8, inDays: 5 },
];
