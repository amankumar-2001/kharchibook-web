"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Globe,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { config } from "@/lib/config";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { GmailCard } from "@/components/gmail-card";
import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Language } from "@/lib/api/types";

const LANGUAGE_NAMES: Record<Language, string> = {
  hi: "Hindi",
  kn: "Kannada",
  ta: "Tamil",
  en: "English",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggle } = useTheme();

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

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <>
      <NavBar />
      <main className="mx-auto w-full max-w-lg flex-1 space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your account at a glance.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge variant={user.plan === "premium" ? "default" : "muted"}>
                  {user.plan} plan
                </Badge>
                {user.verified ? (
                  <Badge variant="accent">
                    <BadgeCheck className="mr-1 h-3 w-3" aria-hidden />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <ShieldAlert className="mr-1 h-3 w-3" aria-hidden />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow
              icon={Phone}
              label="Phone"
              value={user.phone || "Not added"}
              muted={!user.phone}
            />
            <DetailRow
              icon={Globe}
              label="Language"
              value={LANGUAGE_NAMES[user.language]}
            />
          </CardContent>
        </Card>

        <GmailCard />

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Appearance</p>
                <p className="text-xs text-muted-foreground">
                  Currently {theme === "dark" ? "dark" : "light"} mode.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={toggle}>
                Switch to {theme === "dark" ? "light" : "dark"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Salary</p>
                <p className="text-xs text-muted-foreground">
                  Drives your free-to-spend figure.
                </p>
              </div>
              <Link
                href="/add"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Update
              </Link>
            </div>
          </CardContent>
        </Card>

        {config.whatsappNumber && (
          <Card>
            <CardHeader>
              <CardTitle>Talk to us on WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Log expenses and check your money by texting KharchiBook on
                WhatsApp — no app needed. Try{" "}
                <span className="font-medium text-foreground">200 sabzi</span>,{" "}
                <span className="font-medium text-foreground">summary</span>, or{" "}
                <span className="font-medium text-foreground">autopay list</span>.
              </p>
              {user.phone ? (
                <a
                  href={`https://wa.me/${config.whatsappNumber}?text=hi`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "default", size: "lg" })}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Open WhatsApp
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Add a phone number to your account first — we recognize you by
                  the number you message from.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Message from the phone registered on your account
                {user.phone ? ` (${user.phone})` : ""} so we can link your texts
                to you.
              </p>
            </CardContent>
          </Card>
        )}

        <Button
          variant="destructive"
          size="lg"
          className="w-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Log out
        </Button>
      </main>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  muted,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`ml-auto truncate text-sm font-medium ${muted ? "text-muted-foreground" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
