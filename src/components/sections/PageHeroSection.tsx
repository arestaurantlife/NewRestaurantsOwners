import { merge } from "@/pagebuilder/types";
import EditableText from "@/components/pagebuilder/EditableText";
import { useMediaUrl } from "@/pagebuilder/media";
import { Button } from "@/components/ui/button";

export const pageHeroDefaults = {
  eyebrow: "",
  title: "Page title",
  subtitle: "A short introduction to this page.",
  primaryLabel: "",
  primaryHref: "",
  backgroundImage: "",
};

const PageHeroSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(pageHeroDefaults, content);
  const bg = useMediaUrl(c.backgroundImage);

  return (
    <section
      className="relative py-20 md:py-28 bg-gradient-warm"
      style={bg ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {bg ? <div className="absolute inset-0 bg-charcoal/60" aria-hidden /> : null}
      <div className="container mx-auto px-4 max-w-3xl relative text-center">
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
          as="h1"
          className={`font-display text-4xl md:text-5xl font-bold mb-4 ${bg ? "text-white" : "text-foreground"}`}
        />
        <EditableText
          field="subtitle"
          value={c.subtitle}
          as="p"
          className={`text-lg ${bg ? "text-white/85" : "text-muted-foreground"}`}
        />
        {c.primaryLabel ? (
          <div className="mt-7">
            <Button asChild size="lg">
              <a href={c.primaryHref || "#"}>{c.primaryLabel}</a>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PageHeroSection;
