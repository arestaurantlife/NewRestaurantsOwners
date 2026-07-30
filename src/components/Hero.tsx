import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroVideo from "@/assets/hero-restaurant-video.mp4";
import { merge } from "@/pagebuilder/types";

export const heroDefaults = {
  badge: "Trusted by New Restaurants Owners",
  titleLead: "Master Your Restaurant's",
  titleAccent: "Financial Success",
  subtitle:
    "Get expert guidance on financial operations, labor & food costs, new hire training, and essential operational forms. Everything you need to run a profitable restaurant — all in one membership.",
  primaryCta: "Start Your Free Trial",
  secondaryCta: "Watch How It Works",
  ratingText: "4.9/5 reviews",
  watermark: "Website Coming Soon — Under Construction",
};

const Hero = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(heroDefaults, content);
  return <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-3 mb-6 animate-fade-up" style={{
            animationDelay: "0.1s"
          }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-sm font-medium">{c.badge}</span>
            </div>
            {c.watermark ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30">
                <span className="text-gold text-sm font-medium">{c.watermark}</span>
              </div>
            ) : null}
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{
          animationDelay: "0.2s"
        }}>
            {c.titleLead}{" "}
            <span className="text-gradient-gold">{c.titleAccent}</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl animate-fade-up" style={{
          animationDelay: "0.3s"
        }}>{c.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{
          animationDelay: "0.4s"
        }}>
            <Button variant="hero" size="xl" onClick={() => document.getElementById('pricing')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              {c.primaryCta}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              <Play className="w-5 h-5" />
              {c.secondaryCta}
            </Button>
          </div>

          <div className="flex items-center gap-8 mt-10 animate-fade-up" style={{
          animationDelay: "0.5s"
        }}>
            <div className="text-primary-foreground/80">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
              <p className="text-sm mt-1">{c.ratingText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Watermark */}
      {c.watermark ? (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <div className="absolute bottom-16 right-[-4%] md:bottom-24 md:right-[-2%] rotate-[-12deg] bg-gold/10 border border-gold/20 backdrop-blur-sm px-6 py-3 md:px-10 md:py-4 rounded-sm">
            <p className="text-gold/60 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] whitespace-nowrap">
              {c.watermark}
            </p>
          </div>
        </div>
      ) : null}
    </section>;
};
export default Hero;
