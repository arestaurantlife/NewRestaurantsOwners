import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PRICING_TIERS, TierKey } from "@/lib/stripe";
import { merge } from "@/pagebuilder/types";

const tierKeys: TierKey[] = ["starter", "professional", "enterprise"];

export const pricingDefaults = {
  eyebrow: "Simple Pricing",
  titleLead: "Invest in Your",
  titleAccent: "Restaurant's Success",
  subtitle:
    "Choose the plan that fits your needs. All plans include a 7-day free trial—credit card required.",
  guarantee: "💰 14-day money-back guarantee.",
  plans: [
    {
      name: "Starter",
      description: "Perfect for new restaurant owners just getting started",
      price: "47",
      period: "month",
      features:
        "Financial Operations Guide\nBasic Cost Calculators\n10+ Essential Forms\nEmail Support\nMonthly Webinars",
      popular: "no",
    },
    {
      name: "Professional",
      description: "Everything you need to run a profitable restaurant",
      price: "97",
      period: "month",
      features:
        "Everything in Starter\nComplete Training Library\nLabor & Food Cost Systems\n50+ Operational Forms\nPrivate Community Access\nWeekly Live Q&A Sessions\nPriority Email Support",
      popular: "yes",
    },
    {
      name: "Enterprise",
      description: "For multi-location owners and serious operators",
      price: "197",
      period: "month",
      features:
        "Everything in Professional\n1-on-1 Monthly Consulting\nCustom Form Templates\nMulti-Location Tools\nTeam Access (5 users)\nDedicated Account Manager\nCustom Training Modules",
      popular: "no",
    },
  ],
};

const Pricing = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(pricingDefaults, content);
  const { user, session, subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<TierKey | null>(null);

  const handleSubscribe = async (tierKey: TierKey) => {
    if (!user || !session) {
      navigate("/auth");
      return;
    }
    setLoadingPlan(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: PRICING_TIERS[tierKey].price_id },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      if (data?.url) {
        const newWindow = window.open(data.url, "_blank");
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
          window.location.href = data.url;
        }
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (tierKey: TierKey) =>
    subscription.subscribed && subscription.tier === tierKey;

  return <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mb-4">
            {c.eyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {c.titleLead} <span className="text-primary">{c.titleAccent}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{c.subtitle}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {c.plans.map((plan, index) => {
          const key = tierKeys[index] ?? tierKeys[0];
          const popular = String(plan.popular).toLowerCase() === "yes" || String(plan.popular) === "true";
          const features = String(plan.features ?? "").split("\n").map(f => f.trim()).filter(Boolean);
          const isCurrent = isCurrentPlan(key);
          const isLoading = loadingPlan === key;
          return <div key={`${plan.name}-${index}`} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden ${popular ? "bg-gradient-hero text-primary-foreground shadow-wine ring-2 ring-gold md:scale-105" : "bg-card border border-primary/10 hover:border-primary/30 shadow-soft hover:shadow-wine"} ${isCurrent ? "ring-2 ring-gold" : ""}`}>
                {popular && <>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gold text-charcoal text-sm font-semibold shadow-gold">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  </>}

                {isCurrent && <div className="absolute -top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                      <Check className="w-3 h-3" />
                      Your Plan
                    </span>
                  </div>}

                <div className="mb-4">
                  <h3 className={`font-display text-2xl font-bold mb-2 tracking-tight ${popular ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <span className="block h-0.5 w-8 mb-3 bg-gold" />
                  <p className={`text-sm ${popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-5xl font-display font-bold ${popular ? "text-primary-foreground" : "text-foreground"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-lg ${popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    /{plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {features.map(feature => <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 mt-0.5 text-gold flex-shrink-0" />
                      <span className={`text-sm ${popular ? "text-primary-foreground/90" : "text-foreground"}`}>
                        {feature}
                      </span>
                    </li>)}
                </ul>

                <Button variant={popular ? "hero" : "default"} size="lg" className="w-full mt-auto" onClick={() => handleSubscribe(key)} disabled={isLoading || isCurrent}>
                  {isLoading ? <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </> : isCurrent ? "Current Plan" : "Start Free Trial"}
                </Button>
              </div>;
        })}
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-muted-foreground mt-10">{c.guarantee}</p>
      </div>
    </section>;
};
export default Pricing;
