import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, ExternalLink, GraduationCap, Loader2, RefreshCw } from "lucide-react";

const REDEEM_URL = "https://training.newrestaurantsowners.com/redeem";

type AccessState =
  | { kind: "loading" }
  | { kind: "professional"; code: string; codeStatus: "issued" | "redeemed" }
  | { kind: "upgrade" }
  | { kind: "hidden" };

const TrainingAccessCard = () => {
  const { session, subscription, subscriptionLoading } = useAuth();
  const [state, setState] = useState<AccessState>({ kind: "loading" });
  const [regenerating, setRegenerating] = useState(false);

  const load = useCallback(async () => {
    if (!session?.access_token) return;
    const { data, error } = await supabase.functions.invoke("training-access", {
      body: { action: "get" },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) {
      console.error("training-access error:", error);
      setState({ kind: "hidden" });
      return;
    }
    if (data?.professional) {
      setState({ kind: "professional", code: data.code, codeStatus: data.code_status });
    } else {
      setState({ kind: "upgrade" });
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (subscriptionLoading) return;
    if (!subscription.subscribed) {
      setState({ kind: "hidden" });
      return;
    }
    if (subscription.tier !== "professional") {
      setState({ kind: "upgrade" });
      return;
    }
    load();
  }, [subscription.subscribed, subscription.tier, subscriptionLoading, load]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Couldn't copy. Select the code and copy it manually.");
    }
  };

  const regenerate = async () => {
    if (!session?.access_token) return;
    setRegenerating(true);
    const { data, error } = await supabase.functions.invoke("training-access", {
      body: { action: "regenerate" },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setRegenerating(false);
    if (error || !data?.code) {
      toast.error(data?.error ?? "Couldn't generate a new code. Please try again.");
      return;
    }
    setState({ kind: "professional", code: data.code, codeStatus: data.code_status });
    toast.success("New code generated", { description: "Your old code no longer works." });
  };

  if (state.kind === "hidden") return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Your Staff Training Access</CardTitle>
            <CardDescription>
              Unlock your team's training seats on training.newrestaurantsowners.com
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state.kind === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading your code…
          </div>
        )}

        {state.kind === "upgrade" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Staff training access codes are included with the Professional plan. Upgrade to give
              your team 30 Safe Food Handling seats and 30 Responsible Alcohol Service seats.
            </p>
            <Button asChild>
              <Link to="/#pricing">Upgrade to Professional</Link>
            </Button>
          </div>
        )}

        {state.kind === "professional" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <code className="text-lg font-mono font-semibold tracking-wider bg-muted px-4 py-2 rounded-md text-foreground">
                {state.code}
              </code>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => copyCode(state.code)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    state.codeStatus === "redeemed"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {state.codeStatus === "redeemed" ? "Redeemed" : "Ready to redeem"}
                </span>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Create or sign in to your training account.</li>
              <li>Enter this code.</li>
              <li>
                Invite your staff — 30 Safe Food Handling seats and 30 Responsible Alcohol Service
                seats are included.
              </li>
            </ol>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href={REDEEM_URL} target="_blank" rel="noopener noreferrer">
                  Open training site <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              {state.codeStatus === "issued" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={regenerating}>
                      {regenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Generate a new code
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Generate a new code?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your current code will stop working immediately. Only do this if the code was
                        shared or compromised.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep current code</AlertDialogCancel>
                      <AlertDialogAction onClick={regenerate}>Generate new code</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Need to move this to a different location?{" "}
                  <Link to="/contact" className="text-primary underline underline-offset-2">
                    Contact support
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingAccessCard;
