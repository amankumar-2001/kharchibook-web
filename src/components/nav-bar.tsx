"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" aria-hidden />
          <span className="font-semibold">KharchiBook</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Badge variant={user.plan === "premium" ? "default" : "muted"}>
                {user.plan}
              </Badge>
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
