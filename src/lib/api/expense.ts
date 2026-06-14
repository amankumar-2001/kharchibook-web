"use client";

import { config } from "@/lib/config";
import { request } from "./client";
import { mockCommitted, mockExpenseSummary, mockUpcoming } from "./mock";
import type {
  AutoPay,
  CommittedSummary,
  ExpenseSummary,
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

export async function confirmAutoPay(id: string): Promise<AutoPay> {
  if (config.mockExpense) {
    const found = mockCommitted.autopays.find((a) => a.id === id)!;
    return { ...found, confidenceScore: undefined };
  }
  return request<AutoPay>("expense", `/v1/autopays/${id}/confirm`, {
    method: "POST",
  });
}
