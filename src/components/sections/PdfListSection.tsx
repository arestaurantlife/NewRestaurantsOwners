import { merge } from "@/pagebuilder/types";
import FeaturePdfLibrary from "@/components/features/FeaturePdfLibrary";
import EditableText from "@/components/pagebuilder/EditableText";

export const pdfListDefaults = {
  title: "PDF Resources",
  subtitle: "Open any PDF below to read it in-app, or download for offline use.",
  featureSlug: "financial-operations",
  quickLinkTags: "",
};

const PdfListSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(pdfListDefaults, content);
  const tags = String(c.quickLinkTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <EditableText
          field="title"
          value={c.title}
          as="h2"
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2"
        />
        <EditableText
          field="subtitle"
          value={c.subtitle}
          as="p"
          className="text-muted-foreground mb-8"
        />
        <FeaturePdfLibrary
          featureSlug={String(c.featureSlug || "")}
          quickLinkTags={tags.length ? tags : undefined}
        />
      </div>
    </section>
  );
};

export default PdfListSection;
