import { merge } from "@/pagebuilder/types";
import EditableText from "@/components/pagebuilder/EditableText";
import { Button } from "@/components/ui/button";
import { useMediaUrl } from "@/pagebuilder/media";

export const buttonRowDefaults = {
  title: "",
  subtitle: "",
  primaryLabel: "Get started",
  primaryHref: "/auth",
  secondaryLabel: "",
  secondaryHref: "",
  align: "center",
};

const Cta = ({ label, href, variant }: { label: string; href: string; variant: "default" | "outline" }) => {
  const resolved = useMediaUrl(href.startsWith("media:") ? href : "");
  const target = resolved || href;
  const external = /^https?:/.test(target);
  return (
    <Button asChild variant={variant} size="lg">
      <a href={target} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    </Button>
  );
};

const ButtonRowSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(buttonRowDefaults, content);
  const align =
    c.align === "left" ? "text-left items-start" : c.align === "right" ? "text-right items-end" : "text-center items-center";

  return (
    <section className="py-14">
      <div className={`container mx-auto px-4 max-w-3xl flex flex-col gap-4 ${align}`}>
        {c.title ? (
          <EditableText
            field="title"
            value={c.title}
            as="h2"
            className="font-display text-2xl md:text-3xl font-bold text-foreground"
          />
        ) : null}
        {c.subtitle ? (
          <EditableText
            field="subtitle"
            value={c.subtitle}
            as="p"
            className="text-muted-foreground"
          />
        ) : null}
        <div className="flex flex-wrap gap-3">
          {c.primaryLabel ? (
            <Cta label={c.primaryLabel} href={c.primaryHref || "#"} variant="default" />
          ) : null}
          {c.secondaryLabel ? (
            <Cta label={c.secondaryLabel} href={c.secondaryHref || "#"} variant="outline" />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ButtonRowSection;
