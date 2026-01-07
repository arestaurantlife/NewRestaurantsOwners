import { Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
const benefits = ["Step-by-step guidance from day one", "Financial templates and calculators", "Weekly live Q&A sessions with experts", "Private community of restaurant owners", "Personalized action plans"];
const HowItWorks = () => {
  return <section className="py-20 bg-charcoal relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop" alt="Restaurant interior" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-10 h-10 text-charcoal ml-2" />
                </button>
              </div>

              {/* Video Duration Badge */}
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  Watch: 3:45 min
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-wine/30 rounded-full blur-2xl" />
          </div>

          {/* Content Section */}
          <div className="lg:pl-8">
            <span className="text-gold font-semibold tracking-wider uppercase text-sm">
              See It In Action
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-6">How NewRestaurantsOwners.com Works</h2>
            <p className="text-lg text-white/70 mb-8">
              Watch this quick video to see how our platform helps you build a profitable, 
              well-managed restaurant from the very beginning. No guesswork, no expensive 
              consultants—just proven systems that work.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-gold flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </li>)}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg">
                Start Your Free Trial
              </Button>
              <Button variant="heroOutline" size="lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;