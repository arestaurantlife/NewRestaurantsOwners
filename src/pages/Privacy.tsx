import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import policy from "@/content/privacy-policy.html?raw";

const sections = [
  "Information we collect",
  "How we use information",
  "Payments, subscriptions, and free trials",
  "Cookies and tracking technologies",
  "How we share information",
  "Training seats provided by your restaurant",
  "How long we keep information, and how we protect it",
  "Your choices and privacy rights",
  "Other important information",
  "Contact us",
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | NewRestaurantsOwners.com</title>
        <meta name="description" content="Privacy Policy for NewRestaurantsOwners.com, operated by Corporate Shield Hospitality Solutions LLC." />
        <link rel="canonical" href="https://newrestaurantsowners.com/privacy" />
        <meta property="og:title" content="Privacy Policy | NewRestaurantsOwners.com" />
        <meta property="og:description" content="Privacy Policy for NewRestaurantsOwners.com, operated by Corporate Shield Hospitality Solutions LLC." />
        <meta property="og:url" content="https://newrestaurantsowners.com/privacy" />
      </Helmet>
      <Header />
      <main className="mx-auto w-full max-w-[760px] px-4 pt-28 pb-20 md:pt-32">
        <h1 className="font-display text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
        <nav aria-label="Privacy Policy table of contents" className="border-y border-border py-5 mb-8">
          <h2 className="font-display font-semibold text-lg mb-3">Table of contents</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm leading-relaxed">
            {sections.map((title, index) => (
              <li key={title}><a href={`#section-${index + 1}`} className="text-primary underline underline-offset-2 hover:text-foreground">{title}</a></li>
            ))}
          </ol>
        </nav>
        <article className="privacy-policy" dangerouslySetInnerHTML={{ __html: policy.replace("<h1>Privacy Policy</h1>\n", "") }} />
      </main>
      <Footer />
    </div>
  );
}