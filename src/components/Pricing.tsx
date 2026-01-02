import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
const plans = [{
  name: "Starter",
  description: "Perfect for new restaurant owners just getting started",
  price: 47,
  period: "month",
  features: ["Financial Operations Guide", "Basic Cost Calculators", "10+ Essential Forms", "Email Support", "Monthly Webinars"],
  popular: false
}, {
  name: "Professional",
  description: "Everything you need to run a profitable restaurant",
  price: 97,
  period: "month",
  features: ["Everything in Starter", "Complete Training Library", "Labor & Food Cost Systems", "50+ Operational Forms", "Private Community Access", "Weekly Live Q&A Sessions", "Priority Email Support"],
  popular: true
}, {
  name: "Enterprise",
  description: "For multi-location owners and serious operators",
  price: 197,
  period: "month",
  features: ["Everything in Professional", "1-on-1 Monthly Consulting", "Custom Form Templates", "Multi-Location Tools", "Team Access (5 users)", "Dedicated Account Manager", "Custom Training Modules"],
  popular: false
}];
const Pricing = () => {
  return <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mb-4">
            Simple Pricing
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Invest in Your{" "}
            <span className="text-primary">Restaurant's Success</span>
          </h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs. All plans include a 14-day free trial—no credit card required.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map(plan => <div key={plan.name} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${plan.popular ? "bg-gradient-hero text-primary-foreground shadow-wine scale-105" : "bg-card border border-border shadow-soft"}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gold text-charcoal text-sm font-semibold shadow-gold">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>}

              <div className="mb-6">
                <h3 className={`font-display text-2xl font-bold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-5xl font-display font-bold ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  ${plan.price}
                </span>
                <span className={`text-lg ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  /{plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 ${plan.popular ? "text-gold" : "text-primary"}`} />
                    <span className={`text-sm ${plan.popular ? "text-primary-foreground/90" : "text-foreground"}`}>
                      {feature}
                    </span>
                  </li>)}
              </ul>

              <Button variant={plan.popular ? "hero" : "default"} size="lg" className="w-full">
                Start Free Trial
              </Button>
            </div>)}
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-muted-foreground mt-10">💰 30-day money-back guarantee.</p>
      </div>
    </section>;
};
export default Pricing;