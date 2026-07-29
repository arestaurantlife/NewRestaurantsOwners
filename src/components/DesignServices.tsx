import { Utensils, Wine, ChefHat, Ruler, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { merge } from "@/pagebuilder/types";

const icons = [Utensils, Wine, ChefHat];

export const designServicesDefaults = {
  eyebrow: "Professional Design Services",
  title: "Plan & Design Your Restaurant",
  subtitle:
    "Get expert guidance on designing your dining room, bar, and kitchen. Our experienced consultants help you create spaces that are both beautiful and operationally efficient.",
  services: [
    {
      title: "Dining Room Design",
      description:
        "Create the perfect ambiance with optimized seating layouts, traffic flow, and aesthetic design that maximizes covers while ensuring guest comfort.",
      features:
        "Seating capacity optimization\nTraffic flow analysis\nLighting & ambiance planning\nADA compliance guidance",
    },
    {
      title: "Bar Layout & Design",
      description:
        "Design a bar that drives revenue with efficient service stations, optimal bottle placement, and an atmosphere that keeps guests ordering.",
      features:
        "Service station efficiency\nBeverage program integration\nPOS placement strategy\nBack bar organization",
    },
    {
      title: "Kitchen Planning",
      description:
        "Build a kitchen that flows seamlessly from prep to plate with equipment placement that maximizes efficiency and minimizes staff fatigue.",
      features:
        "Workflow optimization\nEquipment selection guidance\nVentilation planning\nHealth code compliance",
    },
  ],
  bannerTitle: "Ready to Design Your Dream Restaurant?",
  bannerText:
    "Schedule a free consultation with our design experts and get a personalized plan for your restaurant's layout and design.",
  bannerCta: "Book Free Consultation",
};

const DesignServices = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(designServicesDefaults, content);
  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-wider uppercase text-sm">
            {c.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mt-4 mb-6">
            {c.title}
          </h2>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {c.services.map((service, index) => {
            const Icon = icons[index % icons.length];
            const features = String(service.features ?? "")
              .split("\n")
              .map((f) => f.trim())
              .filter(Boolean);
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-elegant hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-wine/5 to-transparent rounded-bl-full" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-wine to-wine/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-display font-bold text-charcoal mb-4">
                    {service.title}
                  </h3>

                  <p className="text-charcoal/70 mb-6 leading-relaxed">{service.description}</p>

                  <ul className="space-y-3 mb-8">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-charcoal/80">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="ghost" className="text-wine hover:text-wine/80 hover:bg-wine/5 p-0 group/btn">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-wine to-wine/90 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Ruler className="w-8 h-8 text-gold" />
              <Lightbulb className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              {c.bannerTitle}
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">{c.bannerText}</p>
            <Button size="lg" className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
              {c.bannerCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignServices;
