import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Download, Loader2, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface Row { id: string; name: string; email: string; marketing_consent: boolean; created_at: string }

const csvCell = (v: string) => {
  const s = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return `"${s.replace(/"/g, '""')}"`;
};

const AdminWaitlist = () => {
  const { isAdmin, loading } = useIsAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from("waitlist_submissions").select("id,name,email,marketing_consent,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => { if (error) setError("Could not load the waiting list."); else setRows(data ?? []); setBusy(false); });
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? rows.filter((r) => r.name.toLowerCase().includes(t) || r.email.toLowerCase().includes(t)) : rows;
  }, [rows, q]);

  const exportCsv = () => {
    const lines = [["Name", "Email", "Marketing consent", "Signed up"].join(",")]
      .concat(filtered.map((r) => [csvCell(r.name), csvCell(r.email), r.marketing_consent ? "Yes" : "No", csvCell(new Date(r.created_at).toISOString())].join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nro-waiting-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Waiting list | NewRestaurantsOwners.com</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Waiting list</h1>
        <p className="text-muted-foreground mb-8">Everyone who signed up for the December 15, 2026 launch offer.</p>
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : !isAdmin ? (
          <p className="text-muted-foreground">Admins only. <Link to="/dashboard" className="text-primary underline">Back to dashboard</Link></p>
        ) : (
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl">{rows.length} signup{rows.length === 1 ? "" : "s"}</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-8 w-56" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <Button onClick={exportCsv} disabled={filtered.length === 0}><Download className="w-4 h-4" />Export CSV</Button>
              </div>
            </CardHeader>
            <CardContent>
              {busy ? <Loader2 className="w-6 h-6 animate-spin" /> : error ? <p className="text-destructive">{error}</p> :
                filtered.length === 0 ? <p className="text-sm text-muted-foreground">No signups found.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Consent</th><th className="py-2">Signed up</th></tr></thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                          <td className="py-2 pr-4">{r.name}</td>
                          <td className="py-2 pr-4"><a href={`mailto:${r.email}`} className="text-primary underline">{r.email}</a></td>
                          <td className="py-2 pr-4">{r.marketing_consent ? "Yes" : "No"}</td>
                          <td className="py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminWaitlist;
