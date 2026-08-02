import { merge } from "@/pagebuilder/types";
import EditableText from "@/components/pagebuilder/EditableText";

export const richTextDefaults = {
  eyebrow: "",
  title: "Section heading",
  body: "<p>Write anything here. Select text while editing to make it bold, italic or a link.</p>",
  maxWidth: "narrow",
};

const RichTextSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(richTextDefaults, content);
  const width = c.maxWidth === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <section className="py-16">
      <div className={`container mx-auto px-4 ${width}`}>
        {c.eyebrow ? (
          <EditableText
            field="eyebrow"
            value={c.eyebrow}
            as="p"
            plain
            className="text-sm font-semibold uppercase tracking-widest text-gold mb-3"
          />
        ) : null}
        <EditableText
          field="title"
          value={c.title}
          as="h2"
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5"
        />
        <EditableText
          field="body"
          value={c.body}
          as="div"
          className="prose prose-lg max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6"
        />
      </div>
    </section>
  );
};

export default RichTextSection;
