import { Utensils, Wine, ChefHat, Ruler, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Utensils,
    title: "Dining Room Design",
    description: "Create the perfect ambiance with optimized seating layouts, traffic flow, and aesthetic design that maximizes covers while ensuring guest comfort.",
    features: ["Seating capacity optimization", "Traffic flow analysis", "Lighting & ambiance planning", "ADA compliance guidance"],
  },
  {
    icon: Wine,
    title: "Bar Layout & Design",
    description: "Design a bar that drives revenue with efficient service stations, optimal bottle placement, and an atmosphere that keeps guests ordering.",
    features: ["Service station efficiency", "Beverage program integration", "POS placement strategy", "Back bar organization"],
  },
  {
    icon: ChefHat,
    title: "Kitchen Planning",
    description: "Build a kitchen that flows seamlessly from prep to plate with equipment placement that maximizes efficiency and minimizes staff fatigue.",
    features: ["Workflow optimization", "Equipment selection guidance", "Ventilation planning", "Health code compliance"],
  },
];

const DesignServices = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-wider uppercase text-sm">
            Professional Design Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mt-4 mb-6">
            Plan & Design Your Restaurant
          </h2>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
            Get expert guidance on designing your dining room, bar, and kitchen. 
            Our experienced consultants help you create spaces that are both beautiful 
            and operationally efficient.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-elegant hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-wine/5 to-transparent rounded-bl-full" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-wine to-wine/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-display font-bold text-charcoal mb-4">
                  {service.title}
                </h3>

                <p className="text-charcoal/70 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
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
          ))}
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
              Ready to Design Your Dream Restaurant?
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Schedule a free consultation with our design experts and get a personalized 
              plan for your restaurant's layout and design.
            </p>
            <Button 
              size="lg" 
              className="bg-gold text-charcoal hover:bg-gold/90 font-semibold"
            >
              Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignServices;
