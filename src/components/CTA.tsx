import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { merge } from "@/pagebuilder/types";

export const ctaDefaults = {
  title: "Ready to Transform Your Restaurant?",
  subtitle:
    "Join thousands of restaurant owners who have taken control of their finances, reduced costs, and built thriving businesses.",
  buttonLabel: "Start Your 7-Day Free Trial",
  footnote: "Credit card required • Cancel anytime • 14-day money-back guarantee",
};

const CTA = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(ctaDefaults, content);
  return <section className="py-20 md:py-32 bg-gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {c.title}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 leading-relaxed">
            {c.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              {c.buttonLabel}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-primary-foreground/60 mt-6 text-sm">{c.footnote}</p>
        </div>
      </div>
    </section>;
};
export default CTA;
