import { 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  GraduationCap, 
  FileText, 
  BarChart3,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: DollarSign,
    title: "Financial Operations",
    description: "Master your P&L statements, cash flow management, and financial forecasting to keep your restaurant profitable.",
    benefits: ["P&L Templates", "Cash Flow Tools", "Budget Planning"],
    href: "/features/financial-operations"
  },
  {
    icon: BarChart3,
    title: "Labor Cost Management",
    description: "Optimize your staffing schedules and reduce labor costs while maintaining excellent service standards.",
    benefits: ["Scheduling Templates", "Cost Calculators", "Staff Metrics"],
    href: "/features/labor-cost-management"
  },
  {
    icon: UtensilsCrossed,
    title: "Food Cost Control",
    description: "Learn proven strategies to manage inventory, reduce waste, maintain an efficient food cost percentages.",
    benefits: ["Inventory Systems", "Waste Tracking", "Menu Pricing"],
    href: "/features/food-cost-control"
  },
  {
    icon: GraduationCap,
    title: "Employee Training",
    description: "Access comprehensive training modules and materials to develop a skilled, efficient team.",
    benefits: ["Training Videos", "SOPs Library", "Onboarding Guides"],
    href: "/features/employee-training"
  },
  {
    icon: FileText,
    title: "Essential Forms",
    description: "Get access to all the operational forms you need—from checklists to compliance documents.",
    benefits: ["Opening/Closing", "Health & Safety", "HR Documents"],
    href: "/features/essential-forms"
  },
  {
    icon: Users,
    title: "Community & Support",
    description: "Connect with other restaurant owners, share experiences, and get expert advice when you need it.",
    benefits: ["Private Forum", "Monthly Q&A", "Expert Network"],
    href: "/features/community-support"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Everything You Need
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Your Complete Restaurant{" "}
            <span className="text-primary">Success Toolkit</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Stop piecing together advice from random sources. Get a comprehensive 
            system designed specifically for new restaurant owners.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Link
              to={feature.href}
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-wine transition-all duration-300 hover:-translate-y-1 border border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Index number */}
              <span className="absolute top-5 right-5 font-display text-2xl text-gold/30 group-hover:text-gold/60 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon badge */}
              <div className="w-14 h-14 rounded-full bg-gradient-hero ring-2 ring-gold/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:ring-gold transition-all duration-300 shadow-wine">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-2 tracking-tight">
                {feature.title}
              </h3>

              {/* Gold accent underline */}
              <span className="block h-0.5 w-8 bg-gold mb-4 group-hover:w-16 transition-all duration-300" />
              
              <p className="text-muted-foreground mb-5 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2 mb-5">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm group/item">
                    <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-foreground group-hover/item:text-primary transition-colors">{benefit}</span>
                  </li>
                ))}
              </ul>

              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                View details <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
