"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inr, pctOf } from "@/lib/format";
import type { CommittedSummary } from "@/lib/api/types";

/**
 * The hero card — the "free money" calculation. This is the single
 * highest-value artifact in the product (users screenshot it).
 */
export function FreeMoneyCard({ data }: { data: CommittedSummary }) {
  const committedPct = pctOf(data.totalCommitted, data.monthlySalary);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Where your salary goes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Free to spend</p>
            <p className="text-3xl font-bold tracking-tight text-primary tabular-nums">
              {inr(data.freeMoney)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Locked / month</p>
            <p className="text-lg font-semibold tabular-nums">
              {inr(data.totalCommitted)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${committedPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {committedPct}% of your {inr(data.monthlySalary)} salary is committed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
