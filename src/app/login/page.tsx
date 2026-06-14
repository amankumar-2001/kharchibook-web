"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { login, signup, verifyOtp } from "@/lib/api/auth";
import { config } from "@/lib/config";

type Mode = "login" | "signup" | "verify";

const inputCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function LoginPage() {
  const { login: establishSession } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const tokens = await login(email, password);
      await establishSession(tokens.accessToken, tokens.refreshToken);
    });
  };

  const onSignup = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await signup(email, password, phone || undefined);
      setNotice("Account created. We sent a verification code — enter it below, or skip and log in.");
      setMode("verify");
    });
  };

  const onVerify = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await verifyOtp(email, otp);
      setNotice("Email verified! You can log in now.");
      setMode("login");
      setOtp("");
    });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Wallet className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <CardTitle className="text-xl">
            {mode === "signup" ? "Create your account" : "Welcome to KharchiBook"}
          </CardTitle>
          <CardDescription>
            {mode === "login" && "Log in with your email"}
            {mode === "signup" && "Sign up to track your money"}
            {mode === "verify" && `Enter the code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" && (
            <form onSubmit={onLogin} className="space-y-3">
              <input type="email" required placeholder="you@example.com" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              <input type="password" required placeholder="Password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Logging in…" : "Log in"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                No account?{" "}
                <button type="button" className="text-primary hover:underline"
                  onClick={() => { setMode("signup"); setError(null); }}>
                  Sign up
                </button>
              </p>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={onSignup} className="space-y-3">
              <input type="email" required placeholder="you@example.com" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              <input type="password" required placeholder="Password (8+ chars, mixed case, digit, symbol)"
                autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              <input type="tel" inputMode="tel" placeholder="Phone (optional, +91…)"
                value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Creating…" : "Create account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button type="button" className="text-primary hover:underline"
                  onClick={() => { setMode("login"); setError(null); }}>
                  Log in
                </button>
              </p>
            </form>
          )}

          {mode === "verify" && (
            <form onSubmit={onVerify} className="space-y-3">
              <input type="text" inputMode="numeric" required placeholder="6-digit code"
                value={otp} onChange={(e) => setOtp(e.target.value)}
                className={`${inputCls} text-center text-lg tracking-widest`} />
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Verifying…" : "Verify email"}
              </Button>
              <button type="button" onClick={() => { setMode("login"); setError(null); }}
                className="w-full text-center text-xs text-muted-foreground hover:underline">
                Skip — just log in
              </button>
            </form>
          )}

          {notice && <p className="mt-3 text-sm text-primary">{notice}</p>}
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {config.mockAuth && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo mode — any email &amp; password works.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
