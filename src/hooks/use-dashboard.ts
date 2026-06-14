"use client";

import { useCallback, useEffect, useState } from "react";
import { getCommitted, getExpenseSummary, getUpcoming } from "@/lib/api/autopay";
import type {
  CommittedSummary,
  ExpenseSummary,
  UpcomingDeduction,
} from "@/lib/api/types";

interface DashboardData {
  committed: CommittedSummary;
  expenses: ExpenseSummary;
  upcoming: UpcomingDeduction[];
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Fetches the three things the dashboard renders, in parallel. */
export function useDashboard(): DashboardState {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [committed, expenses, upcoming] = await Promise.all([
        getCommitted(),
        getExpenseSummary(),
        getUpcoming(),
      ]);
      setData({ committed, expenses, upcoming });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Intentional fetch on mount; setState runs after the awaited requests.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const reload = useCallback(() => {
    setLoading(true);
    void load();
  }, [load]);

  return { data, loading, error, reload };
}
