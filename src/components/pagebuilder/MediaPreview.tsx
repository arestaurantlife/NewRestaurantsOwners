import { useEffect, useState } from "react";
import { embedUrl, useMediaUrlState } from "@/pagebuilder/media";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";

interface Props {
  kind: "image" | "video" | "pdf";
  /** Raw stored value: a `media:` reference or an external URL. */
  value: string;
  /** Show the resolved URL with a copy button. */
  showUrl?: boolean;
}

const fileNameOf = (value: string) => {
  const clean = value.split("?")[0];
  const last = clean.split("/").pop() || clean;
  return decodeURIComponent(last) || "file";
};

/** Shared preview of the final, resolved media a visitor will see. */
const MediaPreview = ({ kind, value, showUrl = true }: Props) => {
  const embed = kind === "video" ? embedUrl(value) : null;
  const { url, status } = useMediaUrlState(embed ? "" : value);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [value]);

  if (!value) return null;

  const resolving = status === "loading";
  const errored = failed || status === "error";
  const resolved = embed || url;

  const frame = "w-full h-40 rounded-md border border-border overflow-hidden bg-muted";

  return (
    <div className="space-y-2">
      {resolving ? (
        <div className={`${frame} flex items-center justify-center gap-2 text-muted-foreground`}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Resolving…</span>
        </div>
      ) : errored || !resolved ? (
        <div className={`${frame} flex flex-col items-center justify-center gap-1 text-destructive`}>
          <AlertTriangle className="w-5 h-5" />
          <span className="text-xs">Couldn't load this file</span>
        </div>
      ) : kind === "image" ? (
        <img
          src={resolved}
          alt="Selected media preview"
          className={`${frame} object-cover`}
          onError={() => setFailed(true)}
        />
      ) : kind === "video" ? (
        embed ? (
          <iframe
            src={embed}
            title="Video preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className={`${frame} border-0`}
          />
        ) : (
          <video
            src={resolved}
            controls
            playsInline
            className={`${frame} object-cover bg-black`}
            onError={() => setFailed(true)}
          />
        )
      ) : (
        <div className="flex items-center gap-3 rounded-md border border-border p-3 bg-muted/40">
          <FileText className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          <span className="text-xs truncate flex-1">{fileNameOf(value)}</span>
          <Button asChild type="button" size="sm" variant="outline">
            <a href={resolved} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open
            </a>
          </Button>
        </div>
      )}

      {showUrl && resolved ? (
        <div className="flex items-center gap-1">
          <code className="text-[11px] text-muted-foreground truncate flex-1" title={resolved}>
            {resolved}
          </code>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-6 w-6 flex-shrink-0"
            title="Copy resolved URL"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(resolved);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                toast.error("Could not copy");
              }
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default MediaPreview;
