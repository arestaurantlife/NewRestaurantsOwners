import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, Upload, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  AdminContentItem, CONTENT_BUCKET, CONTENT_THUMB_PREFIX, ContentAccess, ContentKind, ContentTier,
  KIND_LABEL, TIER_LABEL, slugify, useThumbnail,
} from "@/lib/content";

type Draft = Omit<AdminContentItem, "id" | "created_at"> & { id?: string };

const emptyDraft = (): Draft => ({
  slug: "", kind: "video", parent_id: null, title: "", description: "", thumbnail: "", media_url: "",
  storage_path: null, duration: "", access: "subscriber", min_tier: "starter", published: false, sort_order: 0,
});

const Thumb = ({ value }: { value: string | null }) => {
  const url = useThumbnail(value);
  return url ? <img src={url} alt="" className="w-20 h-12 object-cover rounded" /> : <div className="w-20 h-12 rounded bg-muted" />;
};

const uploadFile = async (file: File, folder: string) => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(CONTENT_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return path;
};

const AdminContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"" | "video" | "thumb">("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_items").select("*")
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) toast.error("Couldn't load content");
    setItems((data ?? []) as unknown as AdminContentItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Admins only</h1>
          <p className="text-muted-foreground mb-6">You need an admin account to manage content.</p>
          <Button asChild><Link to={user ? "/" : "/auth"}>{user ? "Back to home" : "Sign in"}</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const courses = items.filter((i) => i.kind === "course");
  const topLevel = items.filter((i) => i.kind !== "lesson");
  const lessonsOf = (id: string) => items.filter((i) => i.kind === "lesson" && i.parent_id === id);
  const orphanLessons = items.filter((i) => i.kind === "lesson" && !courses.some((c) => c.id === i.parent_id));

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  const save = async () => {
    if (!draft) return;
    const title = draft.title.trim();
    const slug = slugify(draft.slug || title);
    if (!title) return toast.error("Title is required");
    if (!slug) return toast.error("Slug is required");
    if (draft.kind === "lesson" && !draft.parent_id) return toast.error("Choose the course this lesson belongs to");
    setSaving(true);
    const row = {
      slug, kind: draft.kind, parent_id: draft.kind === "lesson" ? draft.parent_id : null, title,
      description: draft.description?.trim() || null, thumbnail: draft.thumbnail?.trim() || null,
      media_url: draft.storage_path ? null : draft.media_url?.trim() || null, storage_path: draft.storage_path || null,
      duration: draft.duration?.trim() || null, access: draft.access, min_tier: draft.min_tier,
      published: draft.published, sort_order: draft.sort_order,
    };
    const { error } = draft.id
      ? await supabase.from("content_items").update(row).eq("id", draft.id)
      : await supabase.from("content_items").insert({ ...row, sort_order: items.length });
    setSaving(false);
    if (error) {
      toast.error(error.code === "23505" ? "That slug is already used" : "Couldn't save");
      return;
    }
    toast.success("Saved");
    setDraft(null);
    load();
  };

  const remove = async (item: AdminContentItem) => {
    if (!confirm(`Delete "${item.title}"?${item.kind === "course" ? " Its lessons will be deleted too." : ""}`)) return;
    const { error } = await supabase.from("content_items").delete().eq("id", item.id);
    if (error) return toast.error("Couldn't delete");
    if (item.storage_path) await supabase.storage.from(CONTENT_BUCKET).remove([item.storage_path]);
    toast.success("Deleted");
    load();
  };

  const togglePublished = async (item: AdminContentItem) => {
    const { error } = await supabase.from("content_items").update({ published: !item.published }).eq("id", item.id);
    if (error) return toast.error("Couldn't update");
    load();
  };

  const move = async (list: AdminContentItem[], index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    const reordered = [...list];
    [reordered[index], reordered[j]] = [reordered[j], reordered[index]];
    await Promise.all(reordered.map((it, i) => supabase.from("content_items").update({ sort_order: i }).eq("id", it.id)));
    load();
  };

  const onUpload = async (file: File | undefined, kind: "video" | "thumb") => {
    if (!file || !draft) return;
    setUploading(kind);
    try {
      const path = await uploadFile(file, kind === "video" ? "media" : "thumbnails");
      if (kind === "video") {
        if (draft.storage_path) await supabase.storage.from(CONTENT_BUCKET).remove([draft.storage_path]);
        setDraft((d) => (d ? { ...d, storage_path: path, media_url: "" } : d));
      } else {
        setDraft((d) => (d ? { ...d, thumbnail: `${CONTENT_THUMB_PREFIX}${path}` } : d));
      }
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading("");
    }
  };

  const Row = ({ item, list, index, indent }: { item: AdminContentItem; list: AdminContentItem[]; index: number; indent?: boolean }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border border-border bg-card ${indent ? "ml-8" : ""}`}>
      <div className="flex flex-col">
        <button aria-label="Move up" onClick={() => move(list, index, -1)} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
        <button aria-label="Move down" onClick={() => move(list, index, 1)} disabled={index === list.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
      </div>
      <Thumb value={item.thumbnail} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item.title}</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <Badge variant="outline">{KIND_LABEL[item.kind]}</Badge>
          <Badge variant={item.access === "free" ? "default" : "secondary"}>{item.access === "free" ? "Free" : `${TIER_LABEL[item.min_tier]}+`}</Badge>
          {!item.storage_path && !item.media_url && item.kind !== "course" && <Badge variant="destructive">No media</Badge>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Published</Label>
        <Switch checked={item.published} onCheckedChange={() => togglePublished(item)} />
      </div>
      <Button variant="ghost" size="icon" asChild aria-label="View"><Link to={`/learn/${item.slug}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link></Button>
      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setDraft({ ...item })}><Pencil className="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => remove(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Manage Content | NewRestaurantsOwners.com</title></Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Learning Library Content</h1>
            <p className="text-muted-foreground">Add courses, lessons, videos and podcasts.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/learn">View library</Link></Button>
            <Button onClick={() => setDraft(emptyDraft())}><Plus className="w-4 h-4 mr-1" />New item</Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Items</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">No content yet. Click "New item" to add your first one.</p>
            ) : (
              <>
                {topLevel.map((item, i) => (
                  <div key={item.id} className="space-y-2">
                    <Row item={item} list={topLevel} index={i} />
                    {item.kind === "course" && lessonsOf(item.id).map((l, li, arr) => (
                      <Row key={l.id} item={l} list={arr} index={li} indent />
                    ))}
                  </div>
                ))}
                {orphanLessons.map((l, i, arr) => <Row key={l.id} item={l} list={arr} index={i} />)}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{draft?.id ? "Edit item" : "New item"}</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={draft.kind} onValueChange={(v) => set("kind", v as ContentKind)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["video", "course", "lesson", "podcast"] as ContentKind[]).map((k) => <SelectItem key={k} value={k}>{KIND_LABEL[k]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {draft.kind === "lesson" && (
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <Select value={draft.parent_id ?? ""} onValueChange={(v) => set("parent_id", v)}>
                      <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={draft.title} onChange={(e) => set("title", e.target.value)} onBlur={() => !draft.slug && set("slug", slugify(draft.title))} />
              </div>
              <div className="space-y-2">
                <Label>Slug (web address)</Label>
                <Input value={draft.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
                <p className="text-xs text-muted-foreground">/learn/{slugify(draft.slug || draft.title) || "..."}</p>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex items-center gap-3">
                  <Thumb value={draft.thumbnail || null} />
                  <Input value={draft.thumbnail ?? ""} onChange={(e) => set("thumbnail", e.target.value)} placeholder="Image URL, or upload" />
                  <Button variant="outline" asChild disabled={uploading === "thumb"}>
                    <label className="cursor-pointer">
                      {uploading === "thumb" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0], "thumb")} />
                    </label>
                  </Button>
                </div>
              </div>

              {draft.kind !== "course" || true ? (
                <div className="space-y-2">
                  <Label>Media</Label>
                  {draft.storage_path ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">Uploaded file</Badge>
                      <span className="truncate text-muted-foreground">{draft.storage_path.split("/").pop()}</span>
                      <Button variant="ghost" size="sm" onClick={() => set("storage_path", null)}>Remove</Button>
                    </div>
                  ) : (
                    <Input value={draft.media_url ?? ""} onChange={(e) => set("media_url", e.target.value)} placeholder="YouTube or Vimeo link" />
                  )}
                  <Button variant="outline" size="sm" asChild disabled={uploading === "video"}>
                    <label className="cursor-pointer">
                      {uploading === "video" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                      Upload video or audio
                      <input type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0], "video")} />
                    </label>
                  </Button>
                  {draft.kind === "course" && <p className="text-xs text-muted-foreground">Optional for courses (e.g. a trailer). Lessons are added as separate items.</p>}
                </div>
              ) : null}

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={draft.duration ?? ""} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 45 min" />
                </div>
                <div className="space-y-2">
                  <Label>Access</Label>
                  <Select value={draft.access} onValueChange={(v) => set("access", v as ContentAccess)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="subscriber">Subscribers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Minimum plan</Label>
                  <Select value={draft.min_tier} onValueChange={(v) => set("min_tier", v as ContentTier)} disabled={draft.access === "free"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["starter", "professional", "enterprise"] as ContentTier[]).map((t) => <SelectItem key={t} value={t}>{TIER_LABEL[t]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={draft.published} onCheckedChange={(v) => set("published", v)} />
                <Label>Published</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving || !!uploading}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
