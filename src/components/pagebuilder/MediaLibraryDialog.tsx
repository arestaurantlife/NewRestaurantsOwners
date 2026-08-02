import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Film, Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import {
  MediaAsset,
  deleteMedia,
  listMedia,
  mediaRef,
  uploadMedia,
  useMediaUrl,
} from "@/pagebuilder/media";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Restrict the library to one media kind. */
  kind?: "image" | "video" | "pdf";
  onSelect?: (value: string, asset: MediaAsset) => void;
}

const KIND_ICON = {
  image: ImageIcon,
  video: Film,
  pdf: FileText,
  file: FileText,
} as const;

const Thumb = ({ asset }: { asset: MediaAsset }) => {
  const url = useMediaUrl(mediaRef(asset.bucket, asset.storage_path));
  const Icon = KIND_ICON[(asset.kind as keyof typeof KIND_ICON) ?? "file"] ?? FileText;
  if (asset.kind === "image" && url) {
    return <img src={url} alt={asset.title} className="w-full h-24 object-cover" loading="lazy" />;
  }
  return (
    <div className="w-full h-24 bg-muted flex items-center justify-center">
      <Icon className="w-7 h-7 text-muted-foreground" />
    </div>
  );
};

const MediaLibraryDialog = ({ open, onOpenChange, kind, onSelect }: Props) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setAssets(await listMedia(kind));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kind]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file);
      }
      toast.success("Uploaded");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const accept =
    kind === "image" ? "image/*" : kind === "video" ? "video/*" : kind === "pdf" ? "application/pdf" : undefined;

  const filtered = assets.filter((a) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>
            Upload images, videos and PDFs once, then reuse them anywhere on the site.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="url">Use a URL</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search by title or tag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={accept}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-1" />
                )}
                Upload
              </Button>
            </div>

            <ScrollArea className="h-[380px] pr-3">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-16 text-center">
                  Nothing here yet — upload your first file.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filtered.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative rounded-lg border border-border overflow-hidden text-left hover:border-primary transition-colors"
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => {
                          onSelect?.(mediaRef(asset.bucket, asset.storage_path), asset);
                          onOpenChange(false);
                        }}
                      >
                        <Thumb asset={asset} />
                        <p className="text-xs p-2 truncate">{asset.title}</p>
                      </button>
                      <button
                        type="button"
                        aria-label="Delete file"
                        className="absolute top-1 right-1 h-7 w-7 rounded bg-background/90 border border-border inline-flex items-center justify-center opacity-0 group-hover:opacity-100 text-destructive"
                        onClick={async () => {
                          if (!window.confirm(`Delete "${asset.title}"?`)) return;
                          try {
                            await deleteMedia(asset);
                            toast.success("Deleted");
                            refresh();
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Delete failed");
                          }
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="url" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Paste a direct file URL, or a YouTube / Vimeo link for videos.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="https://…"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!urlValue.trim()) return;
                  onSelect?.(urlValue.trim(), {} as MediaAsset);
                  onOpenChange(false);
                }}
              >
                Use
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibraryDialog;
