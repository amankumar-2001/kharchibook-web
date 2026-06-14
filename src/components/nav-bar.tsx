"use client";

import Link from "next/link";
import { Plus, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" aria-hidden />
          <span className="font-semibold">KharchiBook</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <Link
              href="/profile"
              className="hidden items-center gap-2 rounded-md px-1 py-1 hover:opacity-80 sm:flex"
            >
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Badge variant={user.plan === "premium" ? "default" : "muted"}>
                {user.plan}
              </Badge>
            </Link>
          )}
          {user && (
            <Link href="/add" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
