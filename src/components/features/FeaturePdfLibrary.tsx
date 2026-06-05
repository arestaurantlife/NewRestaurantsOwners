import { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2, Search, X, BookOpen, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import PdfResourceCard from "./PdfResourceCard";
import PdfViewerDialog from "./PdfViewerDialog";
import FeaturePdfManager from "./FeaturePdfManager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface FeaturePdfRow {
  id: string;
  feature_slug: string;
  title: string;
  description: string | null;
  storage_path: string;
  sort_order: number;
  tags: string[];
}

interface Props {
  featureSlug: string;
}

const BUCKET = "feature-pdfs";

const FeaturePdfLibrary = ({ featureSlug }: Props) => {
  const { isAdmin } = useIsAdmin();
  const [rows, setRows] = useState<FeaturePdfRow[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => (r.tags ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => (r.tags ?? []).includes(t));
      return matchesQuery && matchesTags;
    });
  }, [rows, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feature_pdfs")
      .select("*")
      .eq("feature_slug", featureSlug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load PDFs");
      setLoading(false);
      return;
    }

    const list = ((data ?? []) as any[]).map((r) => ({
      ...r,
      tags: Array.isArray(r.tags) ? r.tags : [],
    })) as FeaturePdfRow[];
    setRows(list);

    const signed: Record<string, string> = {};
    await Promise.all(
      list.map(async (row) => {
        const { data: s } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(row.storage_path, 3600);
        if (s?.signedUrl) signed[row.id] = s.signedUrl;
      })
    );
    setUrls(signed);
    setLoading(false);
  }, [featureSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (row: FeaturePdfRow) => {
    if (!confirm(`Remove "${row.title}"? This cannot be undone.`)) return;
    setDeletingId(row.id);
    const { error: storageErr } = await supabase.storage
      .from(BUCKET)
      .remove([row.storage_path]);
    if (storageErr) {
      console.warn("Storage remove warning:", storageErr.message);
    }
    const { error } = await supabase.from("feature_pdfs").delete().eq("id", row.id);
    setDeletingId(null);
    if (error) {
      toast.error("Failed to remove PDF");
      return;
    }
    toast.success("PDF removed");
    load();
  };

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {isAdmin && (
        <FeaturePdfManager featureSlug={featureSlug} onUploaded={load} />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by title or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Tag filter chips */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={selectedTags.length === 0 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTags([])}
          >
            All
          </Badge>
          {availableTags.map(({ tag, count }) => {
            const active = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={active ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                <span className="ml-1.5 opacity-60 text-xs">{count}</span>
              </Badge>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">
            No PDFs uploaded yet.{isAdmin ? " Use the uploader above to add one." : ""}
          </p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">
            No PDFs match your filters
            {searchQuery && <> for "{searchQuery}"</>}
            {selectedTags.length > 0 && (
              <> with tag{selectedTags.length > 1 ? "s" : ""}: {selectedTags.join(", ")}</>
            )}
            .
          </p>
          <Button variant="link" className="mt-1" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRows.map((row) => (
            <PdfResourceCard
              key={row.id}
              title={row.title}
              description={row.description ?? ""}
              url={urls[row.id] ?? "#"}
              tags={row.tags}
              selectedTags={selectedTags}
              onTagClick={toggleTag}
              onDelete={isAdmin ? () => handleDelete(row) : undefined}
              deleting={deletingId === row.id}
            />
          ))}
        </div>
      )}

      {hasActiveFilters && filteredRows.length > 0 && (
        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeaturePdfLibrary;
