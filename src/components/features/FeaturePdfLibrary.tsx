import { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import PdfResourceCard from "./PdfResourceCard";
import FeaturePdfManager from "./FeaturePdfManager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FeaturePdfRow {
  id: string;
  feature_slug: string;
  title: string;
  description: string | null;
  storage_path: string;
  sort_order: number;
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

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q)
    );
  }, [rows, searchQuery]);

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

    const list = (data ?? []) as FeaturePdfRow[];
    setRows(list);

    // Generate signed URLs (1 hour) for each
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
      // Continue to delete row even if file gone
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
            No PDFs match "{searchQuery}".
          </p>
          <Button
            variant="link"
            className="mt-1"
            onClick={() => setSearchQuery("")}
          >
            Clear search
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
              onDelete={isAdmin ? () => handleDelete(row) : undefined}
              deleting={deletingId === row.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturePdfLibrary;
