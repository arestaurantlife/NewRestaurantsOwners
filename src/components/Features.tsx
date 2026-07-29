import {
  DollarSign,
  Users,
  UtensilsCrossed,
  GraduationCap,
  FileText,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { merge } from "@/pagebuilder/types";

const icons = [DollarSign, BarChart3, UtensilsCrossed, GraduationCap, FileText, Users];

export const featuresDefaults = {
  eyebrow: "Everything You Need",
  titleLead: "Your Complete Restaurant",
  titleAccent: "Success Toolkit",
  subtitle:
    "Stop piecing together advice from random sources. Get a comprehensive system designed specifically for new restaurant owners.",
  items: [
    {
      title: "Financial Operations",
      description:
        "Master your P&L statements, cash flow management, and financial forecasting to keep your restaurant profitable.",
      benefits: "P&L Templates\nCash Flow Tools\nBudget Planning",
      href: "/features/financial-operations",
    },
    {
      title: "Labor Cost Management",
      description:
        "Optimize your staffing schedules and reduce labor costs while maintaining excellent service standards.",
      benefits: "Scheduling Templates\nCost Calculators\nStaff Metrics",
      href: "/features/labor-cost-management",
    },
    {
      title: "Food Cost Control",
      description:
        "Learn proven strategies to manage inventory, reduce waste, maintain an efficient food cost percentages.",
      benefits: "Inventory Systems\nWaste Tracking\nMenu Pricing",
      href: "/features/food-cost-control",
    },
    {
      title: "Employee Training",
      description:
        "Access comprehensive training modules and materials to develop a skilled, efficient team.",
      benefits: "Training Videos\nSOPs Library\nOnboarding Guides",
      href: "/features/employee-training",
    },
    {
      title: "Essential Forms",
      description:
        "Get access to all the operational forms you need—from checklists to compliance documents.",
      benefits: "Opening/Closing\nHealth & Safety\nHR Documents",
      href: "/features/essential-forms",
    },
    {
      title: "Community & Support",
      description:
        "Connect with other restaurant owners, share experiences, and get expert advice when you need it.",
      benefits: "Private Forum\nMonthly Q&A\nExpert Network",
      href: "/features/community-support",
    },
  ],
};

const Features = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(featuresDefaults, content);
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            {c.eyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            {c.titleLead} <span className="text-primary">{c.titleAccent}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{c.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {c.items.map((feature, index) => {
            const Icon = icons[index % icons.length];
            const benefits = String(feature.benefits ?? "")
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean);
            return (
              <Link
                to={feature.href || "#"}
                key={`${feature.title}-${index}`}
                className="group relative bg-card rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-wine transition-all duration-300 hover:-translate-y-1 border border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="absolute top-5 right-5 font-display text-2xl text-gold/30 group-hover:text-gold/60 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="w-14 h-14 rounded-full bg-gradient-hero ring-2 ring-gold/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:ring-gold transition-all duration-300 shadow-wine">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-2 tracking-tight">
                  {feature.title}
                </h3>

                <span className="block h-0.5 w-8 bg-gold mb-4 group-hover:w-16 transition-all duration-300" />

                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2 mb-5">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm group/item">
                      <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-foreground group-hover/item:text-primary transition-colors">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                  View details <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
