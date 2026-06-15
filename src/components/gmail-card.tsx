"use client";

import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Mail } from "lucide-react";
import { getGmailConnectUrl, getGmailStatus, type GmailStatus } from "@/lib/api/gmail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * GmailCard shows whether the user's Gmail is connected (read back from
 * auth-service — the proof a token was stored) and starts the OAuth flow.
 */
export function GmailCard() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set once on mount: auth-service redirects back here with ?gmail=connected.
  const [justConnected] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("gmail") === "connected",
  );

  const refresh = useCallback(async () => {
    try {
      setStatus(await getGmailStatus());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Gmail status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load status on mount; setState runs after the async fetch resolves, not
    // synchronously (same pattern as auth-provider).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const onConnect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      window.location.href = await getGmailConnectUrl();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Gmail connect");
      setConnecting(false);
    }
  }, []);

  const connected = status?.connected ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4" aria-hidden />
          Gmail
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {justConnected && (
          <p className="rounded-md bg-accent px-3 py-2 text-xs text-accent-foreground">
            Gmail connected — your token is stored securely.
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">Connection status</p>
            <p className="text-xs text-muted-foreground">
              Lets KharchiBook read your inbox (read-only) for email insights.
            </p>
          </div>
          {loading ? (
            <Badge variant="muted">Checking…</Badge>
          ) : connected ? (
            <Badge variant="accent">
              <BadgeCheck className="mr-1 h-3 w-3" aria-hidden />
              Connected
            </Badge>
          ) : (
            <Badge variant="muted">Not connected</Badge>
          )}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button
          variant={connected ? "outline" : "default"}
          size="sm"
          onClick={onConnect}
          disabled={connecting || loading}
        >
          {connecting ? "Redirecting…" : connected ? "Reconnect Gmail" : "Connect Gmail"}
        </Button>
      </CardContent>
    </Card>
  );
}
