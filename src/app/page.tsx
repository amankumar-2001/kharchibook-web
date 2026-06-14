"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

/** Entry point — route to the dashboard or login depending on session. */
export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [user, loading, router]);

  return (
    <main className="flex flex-1 items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading KharchiBook…</p>
    </main>
  );
}
