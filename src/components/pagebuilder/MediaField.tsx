import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MediaLibraryDialog from "./MediaLibraryDialog";
import { useMediaUrl } from "@/pagebuilder/media";
import { FileText, Film, Image as ImageIcon, X } from "lucide-react";

interface Props {
  kind: "image" | "video" | "pdf";
  value: string;
  onChange: (value: string) => void;
  /** Allow pasting an external URL (YouTube/Vimeo, hosted file). */
  allowUrl?: boolean;
}

const ICON = { image: ImageIcon, video: Film, pdf: FileText } as const;

/** Field that opens the media library, with an optional URL fallback. */
const MediaField = ({ kind, value, onChange, allowUrl = true }: Props) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);
  const url = useMediaUrl(kind === "image" ? value : "");
  const Icon = ICON[kind];

  return (
    <div className="space-y-2">
      {kind === "image" && url ? (
        <img
          src={url}
          alt="Selected"
          className="w-full h-28 object-cover rounded-md border border-border"
        />
      ) : null}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 justify-start"
          onClick={() => setOpen(true)}
        >
          <Icon className="w-4 h-4 mr-2" />
          {value ? "Change" : "Choose"} {kind}
        </Button>
        {value ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              setText("");
              onChange("");
            }}
            title="Remove"
          >
            <X className="w-4 h-4" />
          </Button>
        ) : null}
      </div>

      {allowUrl ? (
        <Input
          placeholder={kind === "video" ? "…or paste a YouTube / Vimeo link" : "…or paste a URL"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => text !== value && onChange(text)}
        />
      ) : null}

      <MediaLibraryDialog
        open={open}
        onOpenChange={setOpen}
        kind={kind}
        onSelect={(v) => {
          setText(v);
          onChange(v);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default MediaField;
