"use client";

import { config } from "@/lib/config";
import { request } from "./client";
import { mockCommitted, mockExpenseSummary, mockUpcoming } from "./mock";
import type {
  AutoPay,
  AutoPayType,
  CommittedSummary,
  Expense,
  ExpenseCategory,
  ExpenseSummary,
  Salary,
  UpcomingDeduction,
} from "./types";

/** expense-service client: expenses, autopays, analytics. */

export async function getExpenseSummary(month?: string): Promise<ExpenseSummary> {
  if (config.mockExpense) return mockExpenseSummary;
  const q = month ? `?month=${encodeURIComponent(month)}` : "";
  return request<ExpenseSummary>("expense", `/v1/expenses/summary${q}`);
}

export async function getCommitted(): Promise<CommittedSummary> {
  if (config.mockExpense) return mockCommitted;
  return request<CommittedSummary>("expense", "/v1/analytics/committed");
}

export async function getUpcoming(days = 7): Promise<UpcomingDeduction[]> {
  if (config.mockExpense) return mockUpcoming;
  return request<UpcomingDeduction[]>("expense", `/v1/analytics/upcoming?days=${days}`);
}

export interface SetSalaryInput {
  amount: number;
  salaryDay: number; // 1–31
}

export async function setSalary(input: SetSalaryInput): Promise<Salary> {
  if (config.mockExpense) {
    mockCommitted.monthlySalary = input.amount;
    mockCommitted.salaryDay = input.salaryDay;
    mockCommitted.freeMoney = input.amount - mockCommitted.totalCommitted;
    return { monthlySalary: input.amount, salaryDay: input.salaryDay };
  }
  return request<Salary>("expense", "/v1/salary", {
    method: "PUT",
    body: input,
  });
}

export interface CreateExpenseInput {
  amount: number;
  category: ExpenseCategory;
  note?: string;
  /** Optional ISO date (YYYY-MM-DD); defaults to today server-side. */
  expenseDate?: string;
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  if (config.mockExpense) {
    return {
      id: `exp_mock_${input.amount}`,
      amount: input.amount,
      category: input.category,
      note: input.note ?? "",
      rawText: "",
      expenseDate: input.expenseDate ?? new Date().toISOString().slice(0, 10),
    };
  }
  return request<Expense>("expense", "/v1/expenses", {
    method: "POST",
    body: input,
  });
}

export interface CreateAutoPayInput {
  name: string;
  type: AutoPayType;
  amount: number;
  deductDay: number; // 1–31
  notes?: string;
}

export async function createAutoPay(input: CreateAutoPayInput): Promise<AutoPay> {
  if (config.mockExpense) {
    return {
      id: `ap_mock_${input.name}`,
      name: input.name,
      type: input.type,
      amount: input.amount,
      deductDay: input.deductDay,
      source: "manual",
      status: "active",
    };
  }
  return request<AutoPay>("expense", "/v1/autopays", {
    method: "POST",
    body: input,
  });
}

export async function confirmAutoPay(id: string): Promise<AutoPay> {
  if (config.mockExpense) {
    const found = mockCommitted.autopays.find((a) => a.id === id)!;
    return { ...found, confidenceScore: undefined };
  }
  return request<AutoPay>("expense", `/v1/autopays/${id}/confirm`, {
    method: "POST",
  });
}
