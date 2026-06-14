"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import { NavBar } from "@/components/nav-bar";
import { StatTile } from "@/components/stat-tile";
import { FreeMoneyCard } from "@/components/free-money-card";
import { CommitmentList } from "@/components/commitment-list";
import { SpendChart } from "@/components/spend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { inr, ordinalDay } from "@/lib/format";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error } = useDashboard();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Namaste, {user.name} 🙏
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s your money picture this month.
          </p>
        </div>

        {loading && <DashboardSkeleton />}

        {error && (
          <Card>
            <CardContent className="flex items-center gap-2 py-6 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden />
              {error}
            </CardContent>
          </Card>
        )}

        {data && !loading && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile
                label="Free to spend"
                value={inr(data.committed.freeMoney)}
                accent="primary"
              />
              <StatTile
                label="Locked / month"
                value={inr(data.committed.totalCommitted)}
                hint={`${data.committed.autopays.length} commitments`}
              />
              <StatTile
                label={`Spent · ${data.expenses.month}`}
                value={inr(data.expenses.total)}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <FreeMoneyCard data={data.committed} />
              <UpcomingCard items={data.upcoming} />
            </div>

            <SpendChart summary={data.expenses} />
            <CommitmentList autopays={data.committed.autopays} />
          </>
        )}
      </main>
    </>
  );
}

function UpcomingCard({
  items,
}: {
  items: { autopayId: string; name: string; amount: number; deductDay: number; inDays: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming deductions</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {items.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">Nothing in the next 7 days. 🎉</p>
        )}
        {items.map((d) => (
          <div key={d.autopayId} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {ordinalDay(d.deductDay)} · in {d.inDays} day{d.inDays === 1 ? "" : "s"}
              </p>
            </div>
            <p className="font-semibold tabular-nums">{inr(d.amount)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
