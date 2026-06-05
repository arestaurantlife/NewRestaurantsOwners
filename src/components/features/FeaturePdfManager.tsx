import { useState, useRef } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { parseTagsInput } from "@/lib/tags";


interface Props {
  featureSlug: string;
  onUploaded: () => void;
}

const BUCKET = "feature-pdfs";

const FeaturePdfManager = ({ featureSlug, onUploaded }: Props) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedTags = parseTagsInput(tagsInput);

  const removeTag = (tag: string) => {
    setTagsInput(parsedTags.filter((t) => t !== tag).join(", "));
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setTagsInput("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !user) {
      toast.error("Please provide a title and choose a PDF file.");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Max 50 MB.");
      return;
    }

    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${featureSlug}/${Date.now()}-${safeName}`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: "application/pdf", upsert: false });

    if (uploadErr) {
      setUploading(false);
      toast.error(`Upload failed: ${uploadErr.message}`);
      return;
    }

    const { error: insertErr } = await supabase.from("feature_pdfs").insert({
      feature_slug: featureSlug,
      title: title.trim(),
      description: description.trim() || null,
      storage_path: path,
      tags: parsedTags,
      created_by: user.id,
    });

    setUploading(false);

    if (insertErr) {
      await supabase.storage.from(BUCKET).remove([path]);
      toast.error(`Save failed: ${insertErr.message}`);
      return;
    }

    toast.success("PDF uploaded");
    reset();
    onUploaded();
  };


  return (
    <form
      onSubmit={handleUpload}
      className="bg-card border border-border rounded-2xl p-5 shadow-soft space-y-4"
    >
      <div className="flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-foreground">Admin: Upload PDF</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="pdf-title">Title</Label>
          <Input
            id="pdf-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. P&L Template"
            maxLength={150}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="pdf-file">PDF file</Label>
          <Input
            id="pdf-file"
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="pdf-desc">Description (optional)</Label>
        <Textarea
          id="pdf-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description shown under the title"
          rows={2}
          maxLength={500}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="pdf-tags">Tags (optional)</Label>
        <Input
          id="pdf-tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Comma-separated, e.g. budgeting, p&l, template"
          maxLength={300}
        />
        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {parsedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">

        <Button type="submit" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FeaturePdfManager;
