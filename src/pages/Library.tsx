import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, Download, Loader2, Lock, Pencil, Plus, ShoppingCart, Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";

interface Ebook {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_path: string | null;
  storage_path: string | null;
  min_tier: string;
  price_cents: number | null;
  published: boolean;
  sort_order: number;
}

const TIER_LABEL: Record<string, string> = { starter: "Starter", professional: "Professional", enterprise: "Enterprise" };
const money = (c: number | null) => (c ? `$${(c / 100).toFixed(2).replace(/\.00$/, "")}` : null);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

const openUrl = (url: string) => {
  const w = window.open(url, "_blank");
  if (!w) window.location.href = url;
};

export const BUNDLE_SLUGS = ["psychology-of-restaurant-theft", "service-vs-hospitality", "science-of-restaurant-budget"];

const EbookCard = ({ book, cover, isAdmin, onEdit, onUploaded }: { book: Ebook; cover?: string; isAdmin: boolean; onEdit: () => void; onUploaded: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState<"" | "dl" | "buy" | "up">("");
  const [locked, setLocked] = useState(false);
  const inBundle = BUNDLE_SLUGS.includes(book.slug);

  const uploadFile = async (f: File | undefined) => {
    if (!f) return;
    setBusy("up");
    const path = `${book.slug}/book-${Date.now()}.${f.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("ebooks").upload(path, f, { upsert: true });
    const { error: e2 } = error ? { error } : await supabase.from("ebooks").update({ storage_path: path }).eq("id", book.id);
    setBusy("");
    if (error || e2) return toast({ title: "Upload failed", description: (error || e2)!.message, variant: "destructive" });
    toast({ title: "eBook uploaded" });
    onUploaded();
  };


  const download = async () => {
    if (!user) return (window.location.href = "/auth");
    setBusy("dl");
    const { data, error } = await supabase.functions.invoke("get-ebook-url", { body: { id: book.id } });
    setBusy("");
    if (error || data?.error) return toast({ title: "Couldn't load eBook", variant: "destructive" });
    if (!data.allowed) {
      if (data.reason === "signin") return (window.location.href = "/auth");
      setLocked(true);
      return toast({ title: `Included with ${TIER_LABEL[book.min_tier]} plan or above`, description: "Upgrade your plan or buy this eBook." });
    }
    if (!data.url) return toast({ title: "File coming soon", description: "This eBook hasn't been uploaded yet." });
    openUrl(data.url);
  };

  const buy = async () => {
    if (!user) return (window.location.href = "/auth?mode=signup");
    setBusy("buy");
    const { data, error } = await supabase.functions.invoke("ebook-checkout", { body: { id: book.id } });
    setBusy("");
    if (error || !data?.url) return toast({ title: data?.error ?? "Couldn't start checkout", variant: "destructive" });
    openUrl(data.url);
  };

  const price = money(book.price_cents);
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-primary/10 shadow-soft hover:shadow-wine transition-all duration-300 flex flex-col">
      <div className="relative aspect-[3/4] bg-gradient-hero flex items-center justify-center">
        {cover ? (
          <img src={cover} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-6">
            <BookOpen className="w-12 h-12 text-gold mx-auto mb-4" />
            <p className="font-display text-xl font-bold text-primary-foreground leading-snug">{book.title}</p>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-gold text-charcoal hover:bg-gold">{TIER_LABEL[book.min_tier]}+ free</Badge>
        {isAdmin && (
          <Button size="icon" variant="secondary" className="absolute top-3 right-3" onClick={onEdit} aria-label="Edit eBook">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {isAdmin && !book.published && <Badge variant="destructive" className="absolute bottom-3 left-3">Hidden</Badge>}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">{book.title}</h3>
        <p className="text-muted-foreground text-sm mb-6 flex-1">{book.description}</p>
        <div className="space-y-2">
          <Button className="w-full" onClick={download} disabled={!!busy}>
            {busy === "dl" ? <Loader2 className="w-4 h-4 animate-spin" /> : locked ? <Lock className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            Download (members)
          </Button>
          {inBundle ? (
            <p className="text-center text-xs text-muted-foreground">Included in the 3-eBook combo — $29.99</p>
          ) : price ? (
            <Button variant="outline" className="w-full" onClick={buy} disabled={!!busy}>
              {busy === "buy" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              Buy for {price}
            </Button>
          ) : (
            <p className="text-center text-xs text-muted-foreground">Individual purchase coming soon</p>
          )}
          {isAdmin && (
            <label className="block">
              <input type="file" accept="application/pdf,.epub" className="hidden" onChange={(e) => uploadFile(e.target.files?.[0])} disabled={!!busy} />
              <span className="flex items-center justify-center gap-2 w-full rounded-md border border-dashed border-primary/40 py-2 text-sm text-primary cursor-pointer hover:bg-primary/5">
                {busy === "up" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {book.storage_path ? "Replace eBook file" : "Upload eBook file"}
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

const EditDialog = ({ book, onClose, onSaved }: { book: Partial<Ebook> | null; onClose: () => void; onSaved: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<Partial<Ebook>>({});
  const [price, setPrice] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(book ?? {});
    setPrice(book?.price_cents ? String(book.price_cents / 100) : "");
    setPdf(null);
    setCover(null);
  }, [book]);

  const save = async () => {
    if (!form.title?.trim()) return toast({ title: "Title is required", variant: "destructive" });
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.title);
      const up = async (f: File, kind: string) => {
        const path = `${slug}/${kind}-${Date.now()}.${f.name.split(".").pop()}`;
        const { error } = await supabase.storage.from("ebooks").upload(path, f, { upsert: true });
        if (error) throw error;
        return path;
      };
      const row = {
        slug,
        title: form.title.trim(),
        description: form.description ?? null,
        min_tier: form.min_tier ?? "starter",
        price_cents: price ? Math.round(parseFloat(price) * 100) : null,
        published: form.published ?? false,
        sort_order: form.sort_order ?? 99,
        storage_path: pdf ? await up(pdf, "book") : form.storage_path ?? null,
        cover_path: cover ? await up(cover, "cover") : form.cover_path ?? null,
      };
      const { error } = form.id
        ? await supabase.from("ebooks").update(row).eq("id", form.id)
        : await supabase.from("ebooks").insert(row);
      if (error) throw error;
      toast({ title: "Saved" });
      onSaved();
    } catch (e) {
      toast({ title: "Couldn't save", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!book} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit eBook" : "Add eBook"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Free for plan</Label>
              <Select value={form.min_tier ?? "starter"} onValueChange={(v) => setForm({ ...form, min_tier: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter and up</SelectItem>
                  <SelectItem value="professional">Professional and up</SelectItem>
                  <SelectItem value="enterprise">Enterprise only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Price to buy (USD)</Label><Input type="number" min="0" step="0.01" placeholder="e.g. 19" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          </div>
          <div><Label>eBook file (PDF) {form.storage_path && <span className="text-muted-foreground">— uploaded</span>}</Label><Input type="file" accept="application/pdf,.epub" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} /></div>
          <div><Label>Cover image {form.cover_path && <span className="text-muted-foreground">— uploaded</span>}</Label><Input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} /></div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <div><Label>Order</Label><Input type="number" value={form.sort_order ?? 99} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 pb-2"><Switch checked={!!form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /> Visible</label>
          </div>
          <Button className="w-full" onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 animate-spin" />}Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Library = () => {
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [books, setBooks] = useState<Ebook[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Ebook> | null>(null);
  const { user } = useAuth();
  const [bundleBusy, setBundleBusy] = useState(false);
  const buyBundle = async () => {
    if (!user) return (window.location.href = "/auth?mode=signup");
    setBundleBusy(true);
    const { data, error } = await supabase.functions.invoke("ebook-checkout", { body: { bundle: true } });
    setBundleBusy(false);
    if (error || !data?.url) return toast({ title: data?.error ?? "Couldn't start checkout", variant: "destructive" });
    openUrl(data.url);
  };

  const load = async () => {
    const { data } = await supabase.from("ebooks").select("*").order("sort_order").order("created_at");
    setBooks((data ?? []) as Ebook[]);
    setLoading(false);
    const { data: c } = await supabase.functions.invoke("get-ebook-url", { body: { covers: true } });
    setCovers(c?.urls ?? {});
  };

  useEffect(() => { load(); }, [isAdmin]);
  useEffect(() => {
    if (params.get("purchased")) toast({ title: "Thanks for your purchase!", description: "Click Download on your eBook to get it." });
  }, [params, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>eBook Library | NewRestaurantsOwners.com</title>
        <meta name="description" content="eBooks for new restaurant owners and managers — free with your membership or available to buy." />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mb-4">Library</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">eBook Library</h1>
          <p className="text-lg text-muted-foreground">
            Every member, starting with the Starter plan, can read and download the whole library. Not a member? Get the 3-eBook combo for $29.99, or{" "}
            <Link to="/#pricing" className="text-primary underline">start your free trial</Link>.
          </p>
          {isAdmin && (
            <Button className="mt-6" variant="outline" onClick={() => setEditing({ published: false, min_tier: "starter" })}>
              <Plus className="w-4 h-4" /> Add eBook
            </Button>
          )}
        </div>
        <div className="max-w-3xl mx-auto mb-12 rounded-2xl border border-gold/30 bg-gold/5 p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-foreground">3-eBook Combo — $29.99</p>
            <p className="text-sm text-muted-foreground">The Psychology of Restaurant Theft, Service Vs Hospitality and The Science of Restaurant Budget.</p>
          </div>
          <Button onClick={buyBundle} disabled={bundleBusy}>
            {bundleBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            Buy the combo
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : books.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">New eBooks are coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((b) => (
              <EbookCard key={b.id} book={b} cover={covers[b.id]} isAdmin={isAdmin} onEdit={() => setEditing(b)} onUploaded={load} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <EditDialog book={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
};

export default Library;
