/** Format a rupee amount the Indian way: ₹1,23,456. */
export function inr(amount: number, opts: { decimals?: boolean } = {}): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts.decimals ? 2 : 0,
  }).format(amount);
}

/** "5th", "1st", "22nd" — for deduction days. */
export function ordinalDay(day: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

/** Percentage of salary that's committed, clamped 0–100. */
export function pctOf(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.min(100, Math.round((part / whole) * 100));
}
