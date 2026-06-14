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

/** autopay-service client: expenses, autopays, analytics. */

export async function getExpenseSummary(month?: string): Promise<ExpenseSummary> {
  if (config.mockAutopay) return mockExpenseSummary;
  const q = month ? `?month=${encodeURIComponent(month)}` : "";
  return request<ExpenseSummary>("autopay", `/v1/expenses/summary${q}`);
}

export async function getCommitted(): Promise<CommittedSummary> {
  if (config.mockAutopay) return mockCommitted;
  return request<CommittedSummary>("autopay", "/v1/analytics/committed");
}

export async function getUpcoming(days = 7): Promise<UpcomingDeduction[]> {
  if (config.mockAutopay) return mockUpcoming;
  return request<UpcomingDeduction[]>("autopay", `/v1/analytics/upcoming?days=${days}`);
}

export async function confirmAutoPay(id: string): Promise<AutoPay> {
  if (config.mockAutopay) {
    const found = mockCommitted.autopays.find((a) => a.id === id)!;
    return { ...found, confidenceScore: undefined };
  }
  return request<AutoPay>("autopay", `/v1/autopays/${id}/confirm`, {
    method: "POST",
  });
}
