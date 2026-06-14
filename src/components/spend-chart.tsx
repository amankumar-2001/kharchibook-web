"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inr } from "@/lib/format";
import type { ExpenseSummary } from "@/lib/api/types";

const SHADES = [
  "#059669", "#0d9488", "#0891b2", "#65a30d",
  "#ca8a04", "#dc2626", "#9333ea", "#78716c",
];

export function SpendChart({ summary }: { summary: ExpenseSummary }) {
  const data = summary.byCategory.map((c) => ({
    name: c.category.split("/")[0],
    value: c.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{summary.month} — spend by category</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total spent: <span className="font-semibold text-foreground">{inr(summary.total)}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                formatter={(v) => [inr(Number(v)), "Spent"]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={SHADES[i % SHADES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
