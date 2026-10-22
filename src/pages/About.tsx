import { Helmet } from "react-helmet-async";
import { Eye, Target, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Eye,
    title: "Our Vision",
    body: "To become one of the leading online platforms in the United States for new restaurant owners and managers, giving every operator a complete blueprint for running a successful restaurant.",
  },
  {
    icon: Target,
    title: "Our Mission",
    body: "To equip restaurant owners, their managers, and independent restaurants and small groups with proven, practical systems for daily operations, financial management, loss prevention, and employee training. We deliver them through an accessible online platform built on decades of real-world leadership in hospitality.",
  },
  {
    icon: ShieldCheck,
    title: "Our Purpose",
    body: "To protect new restaurants through their most vulnerable first year by replacing guesswork with structure. We help owners safeguard their investment, earn the profit their hard work deserves, and build teams that deliver outstanding hospitality.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | NewRestaurantsOwners.com</title>
        <meta name="description" content="NewRestaurantsOwners.com (NRO) is the online education and operations platform of Corporate Shield Hospitality Solutions LLC, a Colorado-based hospitality education and consulting company founded by Walter Mosca." />
        <link rel="canonical" href="https://newrestaurantsowners.com/about" />
        <meta property="og:title" content="About Us | NewRestaurantsOwners.com" />
        <meta property="og:description" content="NewRestaurantsOwners.com (NRO) is the online education and operations platform of Corporate Shield Hospitality Solutions LLC, a Colorado-based hospitality education and consulting company founded by Walter Mosca." />
        <meta property="og:url" content="https://newrestaurantsowners.com/about" />
      </Helmet>
      <Header />
      <main className="pt-28 pb-20 md:pt-32">
        {/* Hero */}
        <section className="mx-auto w-full max-w-[760px] px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-8">About Us</h1>
          <p className="text-lg leading-relaxed text-foreground/90">
            NewRestaurantsOwners.com (NRO) is the online education and operations platform of Corporate Shield Hospitality Solutions LLC, a Colorado-based hospitality education and consulting company. NRO was founded by Walter Mosca. His 36-year hospitality career includes managing the openings of five restaurants for one of the largest restaurant chains in the United States, and leading food and beverage departments across several brands of the world's largest hotel company, a portfolio of more than 30 hotel brands. There he learned the training processes that develop top leaders in the industry. Walter is also the author of <em>The Psychology of Restaurant Theft</em>, an eye-opening guide that uses real-world scenarios to show how theft happens inside restaurant operations and how to prevent it. He is joined by Director of Operations Anastasiya Pyrkh-Hagen, who brings 10 years of restaurant operations experience in the airport sector and a strong background in hospitality and planning, with a passion for proper employee training and an excellent guest experience. Together they built NRO on a simple truth learned on the floor: a restaurant's staff can tell within the first two or three days whether a new owner or manager knows what they are doing. Without systems in place from day one, that first year can be financially devastating. Profits a well-run restaurant should earn are lost to waste, poor controls, and employee theft, and the business can be forced to close. NRO exists to put those systems in owners' hands before that happens.
          </p>
        </section>

        {/* Vision / Mission / Purpose */}
        <section className="container mx-auto px-4 mt-16 md:mt-20">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-8 shadow-soft">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-display text-2xl font-bold text-primary mb-4 border-b-2 border-accent/40 pb-3">{title}</h2>
                <p className="text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[760px] px-4 mt-16 md:mt-20 text-center">
          <Button size="lg" asChild>
            <a href="/#pricing">Explore our plans</a>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
