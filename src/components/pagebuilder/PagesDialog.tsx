import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import {
  SitePage,
  createPage,
  deletePage,
  normalizeSlug,
  updatePage,
  usePages,
} from "@/pagebuilder/usePages";
import { saveLayout } from "@/pagebuilder/usePageLayout";
import { blankPageBlocks } from "@/pagebuilder/registry";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Create, rename, show/hide in nav, and delete site pages. */
const PagesDialog = ({ open, onOpenChange }: Props) => {
  const { pages, loading, reload } = usePages();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    const cleanTitle = title.trim();
    const cleanSlug = normalizeSlug(slug || cleanTitle);
    if (!cleanTitle || !cleanSlug) {
      toast.error("Give the page a title.");
      return;
    }
    setBusy(true);
    try {
      const page = await createPage({ slug: cleanSlug, title: cleanTitle, showInNav: true });
      const blocks = blankPageBlocks(cleanTitle);
      await saveLayout("draft", blocks, page.slug);
      await saveLayout("published", blocks, page.slug);
      setTitle("");
      setSlug("");
      await reload();
      toast.success("Page created");
      onOpenChange(false);
      navigate(`/${page.slug}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create page");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (page: SitePage) => {
    if (!confirm(`Delete “${page.title}” and its content?`)) return;
    try {
      await deletePage(page);
      await reload();
      toast.success("Page deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete page");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg z-[70]">
        <DialogHeader>
          <DialogTitle>Pages</DialogTitle>
          <DialogDescription>Create new pages and manage the menu.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Page title</Label>
            <Input
              value={title}
              placeholder="About us"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input
              value={slug}
              placeholder="about-us"
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={add} disabled={busy} className="w-full">
          {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Create page
        </Button>

        <ScrollArea className="max-h-[45vh] mt-2 pr-3">
          <div className="space-y-2">
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              pages.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      /{p.slug === "home" ? "" : p.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">Menu</span>
                    <Switch
                      checked={p.show_in_nav}
                      onCheckedChange={async (v) => {
                        await updatePage(p.id, { show_in_nav: v });
                        reload();
                      }}
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Open page"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(p.slug === "home" ? "/" : `/${p.slug}`);
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    disabled={p.is_system}
                    title={p.is_system ? "Built-in page" : "Delete page"}
                    onClick={() => remove(p)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PagesDialog;
