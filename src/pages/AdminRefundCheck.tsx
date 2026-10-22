import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { AccessRow, checkRefundEligibility } from "@/lib/refundEligibility";

interface Result { found: boolean; email: string; first_paid_at: string | null; logs: AccessRow[] }

const fmt = (d: string) => new Date(d).toLocaleString();

const AdminRefundCheck = () => {
  const { isAdmin, loading } = useIsAdmin();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setResult(null);
    const { data, error } = await supabase.functions.invoke("admin-refund-check", { body: { email } });
    setBusy(false);
    if (error || data?.error) return setError(data?.error ?? "Lookup failed");
    setResult(data as Result);
  };

  const verdict = result ? checkRefundEligibility(result.first_paid_at, result.logs) : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Refund check | NewRestaurantsOwners.com</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Refund check</h1>
        <p className="text-muted-foreground mb-8">Look up a member by email to see their first payment and everything they opened or downloaded.</p>
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : !isAdmin ? (
          <p className="text-muted-foreground">Admins only. <Link to="/dashboard" className="text-primary underline">Back to dashboard</Link></p>
        ) : (
          <>
            <form onSubmit={search} className="flex gap-2 mb-8">
              <Input type="email" required placeholder="member@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" disabled={busy}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}Search</Button>
            </form>
            {error && <p className="text-destructive mb-6">{error}</p>}
            {result && verdict && (
              <div className="space-y-6">
                {!result.found && <p className="text-muted-foreground">No account or payments found for {result.email}.</p>}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">{result.email}</CardTitle>
                    <Badge variant={verdict.eligible ? "default" : "destructive"}>{verdict.eligible ? "Eligible" : "Not eligible"}</Badge>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><span className="text-muted-foreground">First paid charge:</span> {result.first_paid_at ? fmt(result.first_paid_at) : "None"}</p>
                    <p><span className="text-muted-foreground">Distinct items accessed:</span> {verdict.itemCount}</p>
                    {verdict.reasons.length > 0 && (
                      <ul className="list-disc pl-5 text-destructive">{verdict.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-xl">Access history</CardTitle></CardHeader>
                  <CardContent>
                    {result.logs.length === 0 ? <p className="text-sm text-muted-foreground">Nothing accessed.</p> : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2 pr-4">Date &amp; time</th><th className="py-2 pr-4">Item</th><th className="py-2 pr-4">Type</th><th className="py-2">Action</th></tr></thead>
                          <tbody>
                            {result.logs.map((l, i) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-2 pr-4 whitespace-nowrap">{fmt(l.accessed_at)}</td>
                                <td className="py-2 pr-4">{l.content_title}</td>
                                <td className="py-2 pr-4 capitalize">{l.content_type}</td>
                                <td className="py-2 capitalize">{l.action}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminRefundCheck;
