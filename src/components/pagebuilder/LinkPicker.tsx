import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePages } from "@/pagebuilder/usePages";
import MediaLibraryDialog from "./MediaLibraryDialog";
import { FileText } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

type Mode = "page" | "url" | "anchor" | "file";

const detectMode = (value: string): Mode => {
  if (!value) return "page";
  if (value.startsWith("#")) return "anchor";
  if (value.startsWith("media:")) return "file";
  if (value.startsWith("/")) return "page";
  return "url";
};

/** Choose an internal page, external URL, on-page anchor, or an uploaded file. */
const LinkPicker = ({ value, onChange }: Props) => {
  const { pages } = usePages();
  const [mode, setMode] = useState<Mode>(() => detectMode(value));
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Select value={mode} onValueChange={(m) => setMode(m as Mode)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[80]">
          <SelectItem value="page">Page on this site</SelectItem>
          <SelectItem value="anchor">Section on this page</SelectItem>
          <SelectItem value="url">External URL</SelectItem>
          <SelectItem value="file">Uploaded file / PDF</SelectItem>
        </SelectContent>
      </Select>

      {mode === "page" && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a page" />
          </SelectTrigger>
          <SelectContent className="z-[80] max-h-64">
            {pages.map((p) => (
              <SelectItem key={p.id} value={p.slug === "home" ? "/" : `/${p.slug}`}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {mode === "anchor" && (
        <Input
          placeholder="#pricing"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {mode === "url" && (
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {mode === "file" && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setPickerOpen(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            {value?.startsWith("media:") ? "Change file" : "Choose file"}
          </Button>
          <MediaLibraryDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onSelect={(v) => onChange(v)}
          />
        </>
      )}
    </div>
  );
};

export default LinkPicker;
