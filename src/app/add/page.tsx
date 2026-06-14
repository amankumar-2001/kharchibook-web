"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createAutoPay,
  createExpense,
  getCommitted,
  setSalary,
} from "@/lib/api/expense";
import { cn } from "@/lib/cn";
import { inr, ordinalDay } from "@/lib/format";
import type {
  AutoPayType,
  ExpenseCategory,
} from "@/lib/api/types";

type Tab = "expense" | "autopay" | "salary";

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Groceries",
  "Transport",
  "Food/Dining",
  "Utilities",
  "Medical",
  "Entertainment",
  "Shopping",
  "Other",
];

const AUTOPAY_TYPES: { value: AutoPayType; label: string }[] = [
  { value: "emi", label: "EMI" },
  { value: "subscription", label: "Subscription" },
  { value: "insurance", label: "Insurance" },
  { value: "sip", label: "SIP" },
  { value: "other", label: "Other" },
];

const inputCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

const labelCls = "block text-sm font-medium";

export default function AddPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("expense");

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
      <main className="mx-auto w-full max-w-lg flex-1 space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add an entry</h1>
          <p className="text-sm text-muted-foreground">
            Log a one-off expense, a recurring commitment, or your salary.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <TabButton active={tab === "expense"} onClick={() => setTab("expense")}>
            Expense
          </TabButton>
          <TabButton active={tab === "autopay"} onClick={() => setTab("autopay")}>
            AutoPay
          </TabButton>
          <TabButton active={tab === "salary"} onClick={() => setTab("salary")}>
            Salary
          </TabButton>
        </div>

        {tab === "expense" && <ExpenseForm />}
        {tab === "autopay" && <AutoPayForm />}
        {tab === "salary" && <SalaryForm />}
      </main>
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Shared submit lifecycle: busy flag, error string, success notice. */
function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = (fn: () => Promise<string>) => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    void (async () => {
      try {
        setSuccess(await fn());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setBusy(false);
      }
    })();
  };

  return { busy, error, success, submit };
}

function ExpenseForm() {
  const { busy, error, success, submit } = useSubmit();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Groceries");
  const [note, setNote] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(async () => {
      const created = await createExpense({
        amount: Number(amount),
        category,
        note: note.trim() || undefined,
        expenseDate: expenseDate || undefined,
      });
      setAmount("");
      setNote("");
      setExpenseDate("");
      return `Logged ${inr(created.amount)} · ${created.category}.`;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New expense</CardTitle>
        <CardDescription>What did you spend on?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="amount" className={labelCls}>
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              required
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="category" className={labelCls}>
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className={inputCls}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="note" className={labelCls}>
              Note <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="note"
              type="text"
              placeholder="e.g. weekly sabzi"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="expenseDate" className={labelCls}>
              Date <span className="text-muted-foreground">(optional, defaults to today)</span>
            </label>
            <input
              id="expenseDate"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className={inputCls}
            />
          </div>

          <Submit busy={busy} idle="Add expense" busyLabel="Adding…" />
          <Feedback error={error} success={success} />
        </form>
      </CardContent>
    </Card>
  );
}

function AutoPayForm() {
  const { busy, error, success, submit } = useSubmit();
  const [name, setName] = useState("");
  const [type, setType] = useState<AutoPayType>("subscription");
  const [amount, setAmount] = useState("");
  const [deductDay, setDeductDay] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(async () => {
      const created = await createAutoPay({
        name: name.trim(),
        type,
        amount: Number(amount),
        deductDay: Number(deductDay),
        notes: notes.trim() || undefined,
      });
      setName("");
      setAmount("");
      setDeductDay("");
      setNotes("");
      return `Added ${created.name} · ${inr(created.amount)}/month.`;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New AutoPay</CardTitle>
        <CardDescription>A recurring monthly deduction.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelCls}>
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Netflix, Home Loan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="type" className={labelCls}>
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as AutoPayType)}
              className={inputCls}
            >
              {AUTOPAY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="ap-amount" className={labelCls}>
                Amount (₹)
              </label>
              <input
                id="ap-amount"
                type="number"
                min="1"
                step="0.01"
                required
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="deductDay" className={labelCls}>
                Deduct day
              </label>
              <input
                id="deductDay"
                type="number"
                min="1"
                max="31"
                required
                inputMode="numeric"
                placeholder="1–31"
                value={deductDay}
                onChange={(e) => setDeductDay(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className={labelCls}>
              Notes <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="notes"
              type="text"
              placeholder="e.g. family plan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputCls}
            />
          </div>

          <Submit busy={busy} idle="Add AutoPay" busyLabel="Adding…" />
          <Feedback error={error} success={success} />
        </form>
      </CardContent>
    </Card>
  );
}

function SalaryForm() {
  const { busy, error, success, submit } = useSubmit();
  const [amount, setAmount] = useState("");
  const [salaryDay, setSalaryDay] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Prefill with the salary already on record, if any.
  useEffect(() => {
    void (async () => {
      try {
        const committed = await getCommitted();
        if (committed.monthlySalary > 0) setAmount(String(committed.monthlySalary));
        if (committed.salaryDay) setSalaryDay(String(committed.salaryDay));
      } catch {
        // Non-fatal — user can still enter values from scratch.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(async () => {
      const saved = await setSalary({
        amount: Number(amount),
        salaryDay: Number(salaryDay),
      });
      return `Salary set to ${inr(saved.monthlySalary)}/month, credited on the ${ordinalDay(saved.salaryDay)}.`;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly salary</CardTitle>
        <CardDescription>
          Drives your free-to-spend figure on the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="salary-amount" className={labelCls}>
                Amount (₹)
              </label>
              <input
                id="salary-amount"
                type="number"
                min="1"
                step="0.01"
                required
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="salary-day" className={labelCls}>
                Credited on
              </label>
              <input
                id="salary-day"
                type="number"
                min="1"
                max="31"
                required
                inputMode="numeric"
                placeholder="1–31"
                value={salaryDay}
                onChange={(e) => setSalaryDay(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <Submit
            busy={busy || !loaded}
            idle="Save salary"
            busyLabel={loaded ? "Saving…" : "Loading…"}
          />
          <Feedback error={error} success={success} />
        </form>
      </CardContent>
    </Card>
  );
}

function Submit({
  busy,
  idle,
  busyLabel,
}: {
  busy: boolean;
  idle: string;
  busyLabel: string;
}) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={busy}>
      <PlusCircle className="h-4 w-4" aria-hidden />
      {busy ? busyLabel : idle}
    </Button>
  );
}

function Feedback({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (success) {
    return (
      <p className="flex items-center gap-2 text-sm text-primary">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        {success}
      </p>
    );
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  return null;
}
