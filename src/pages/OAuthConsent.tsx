import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Beta helpers — cast until types ship.
const authOauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
    approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
    denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  };
}).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in the URL.");
        setLoading(false);
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await authOauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await authOauth.approveAuthorization(authorizationId)
      : await authOauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authorization error</CardTitle>
            <CardDescription>We couldn't process this authorization request.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const clientName = details?.client?.name ?? "an external app";
  const redirectUri = details?.client?.redirect_uri ?? details?.redirect_uri;
  const scopes: string[] = Array.isArray(details?.scopes)
    ? details.scopes
    : typeof details?.scope === "string"
    ? details.scope.split(/\s+/).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Connect {clientName} to NewRestaurantsOwners
          </CardTitle>
          <CardDescription>
            This lets {clientName} use this app as you. It does not bypass this
            app's permissions or backend policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {redirectUri && (
            <div className="text-sm">
              <span className="text-muted-foreground">Redirects to: </span>
              <span className="font-mono break-all">{redirectUri}</span>
            </div>
          )}
          {scopes.length > 0 && (
            <div className="text-sm">
              <p className="text-muted-foreground mb-1">Requested access:</p>
              <ul className="list-disc pl-5 space-y-1">
                {scopes.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={() => decide(true)} disabled={busy}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => decide(false)}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
