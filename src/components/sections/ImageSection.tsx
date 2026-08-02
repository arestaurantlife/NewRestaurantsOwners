import { merge } from "@/pagebuilder/types";
import { useMediaUrl } from "@/pagebuilder/media";
import EditableText from "@/components/pagebuilder/EditableText";
import { Image as ImageIcon } from "lucide-react";

export const imageDefaults = {
  src: "",
  alt: "",
  caption: "",
  width: "wide",
  rounded: "yes",
};

const ImageSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(imageDefaults, content);
  const url = useMediaUrl(c.src);
  const width =
    c.width === "full" ? "max-w-none" : c.width === "narrow" ? "max-w-2xl" : "max-w-5xl";

  return (
    <section className="py-12">
      <div className={`container mx-auto px-4 ${width}`}>
        {url ? (
          <img
            src={url}
            alt={c.alt || c.caption || "Section image"}
            loading="lazy"
            className={`w-full h-auto object-cover ${c.rounded === "no" ? "" : "rounded-2xl"} shadow-[var(--shadow-soft)]`}
          />
        ) : (
          <div className="w-full aspect-[16/7] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
            <span className="text-sm">Choose an image in the side panel</span>
          </div>
        )}
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

export default ImageSection;
