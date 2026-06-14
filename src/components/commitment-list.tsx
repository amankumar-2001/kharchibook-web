"use client";

import { useState } from "react";
import { Home, Tv, ShieldCheck, TrendingUp, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { confirmAutoPay } from "@/lib/api/autopay";
import { inr, ordinalDay } from "@/lib/format";
import type { AutoPay, AutoPayType } from "@/lib/api/types";

const ICONS: Record<AutoPayType, typeof Home> = {
  emi: Home,
  subscription: Tv,
  insurance: ShieldCheck,
  sip: TrendingUp,
  other: CircleDollarSign,
};

const TYPE_LABEL: Record<AutoPayType, string> = {
  emi: "EMI",
  subscription: "Subscription",
  insurance: "Insurance",
  sip: "SIP",
  other: "Other",
};

function CommitmentRow({ ap }: { ap: AutoPay }) {
  const [item, setItem] = useState(ap);
  const [confirming, setConfirming] = useState(false);
  const Icon = ICONS[item.type];
  const needsConfirm = item.confidenceScore !== undefined;

  async function onConfirm() {
    setConfirming(true);
    try {
      setItem(await confirmAutoPay(item.id));
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{item.name}</p>
          {item.source === "email_auto" && (
            <Badge variant="muted">auto</Badge>
          )}
          {needsConfirm && (
            <Badge variant="warning">
              {Math.round((item.confidenceScore ?? 0) * 100)}% — confirm?
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {TYPE_LABEL[item.type]} · deducts {ordinalDay(item.deductDay)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-semibold tabular-nums">{inr(item.amount)}</p>
        {needsConfirm && (
          <Button size="sm" variant="outline" className="mt-1" onClick={onConfirm} disabled={confirming}>
            {confirming ? "…" : "Confirm"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function CommitmentList({ autopays }: { autopays: AutoPay[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly commitments</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {autopays.map((ap) => (
          <CommitmentRow key={ap.id} ap={ap} />
        ))}
      </CardContent>
    </Card>
  );
}
