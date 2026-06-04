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
    description: "Learn proven strategies to manage inventory, reduce waste, and maintain healthy food cost percentages.",
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
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
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
              className="group bg-card rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground mb-5">
                {feature.description}
              </p>
              
              <ul className="space-y-2 mb-5">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
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
