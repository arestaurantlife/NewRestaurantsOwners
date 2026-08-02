import { merge } from "@/pagebuilder/types";
import { embedUrl, useMediaUrl } from "@/pagebuilder/media";
import EditableText from "@/components/pagebuilder/EditableText";
import { Film } from "lucide-react";

export const videoDefaults = {
  title: "",
  src: "",
  poster: "",
  caption: "",
  width: "wide",
};

const VideoSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(videoDefaults, content);
  const embed = embedUrl(c.src);
  const fileUrl = useMediaUrl(embed ? "" : c.src);
  const posterUrl = useMediaUrl(c.poster);
  const width = c.width === "narrow" ? "max-w-2xl" : "max-w-4xl";

  return (
    <section className="py-14">
      <div className={`container mx-auto px-4 ${width}`}>
        {c.title ? (
          <EditableText
            field="title"
            value={c.title}
            as="h2"
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 text-center"
          />
        ) : null}

        <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)] bg-charcoal aspect-video">
          {embed ? (
            <iframe
              src={embed}
              title={c.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : fileUrl ? (
            <video
              src={fileUrl}
              poster={posterUrl || undefined}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/60">
              <Film className="w-8 h-8" />
              <span className="text-sm">Upload a video or paste a YouTube / Vimeo link</span>
            </div>
          )}
        </div>

        {c.caption ? (
          <EditableText
            field="caption"
            value={c.caption}
            as="p"
            className="text-sm text-muted-foreground text-center mt-3"
          />
        ) : null}
      </div>
    </section>
  );
};

export default VideoSection;
