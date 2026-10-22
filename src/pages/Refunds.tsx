import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import policy from "@/content/refund-policy.html?raw";

const sections = [
  "Agreement to these Terms",
  "Eligibility and accounts",
  "Subscriptions, free trials, and purchases",
  "Your license to use our content",
  "Staff training platform",
  "Educational content, not professional advice",
  "Community, webinars, and live sessions",
  "Our intellectual property",
  "Disclaimers",
  "Limitation of liability",
  "Indemnity",
  "Suspension and termination",
  "Governing law and disputes",
  "Changes to the Services and these Terms",
  "General terms",
  "Contact us",
];

export default function Refunds() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | NewRestaurantsOwners.com</title>
        <meta name="description" content="Refund Policy for NewRestaurantsOwners.com, operated by Corporate Shield Hospitality Solutions LLC." />
        <link rel="canonical" href="https://newrestaurantsowners.com/refunds" />
        <meta property="og:title" content="Refund Policy | NewRestaurantsOwners.com" />
        <meta property="og:description" content="Refund Policy for NewRestaurantsOwners.com, operated by Corporate Shield Hospitality Solutions LLC." />
        <meta property="og:url" content="https://newrestaurantsowners.com/refunds" />
      </Helmet>
      <Header />
      <main className="mx-auto w-full max-w-[760px] px-4 pt-28 pb-20 md:pt-32">
        <h1 className="font-display text-4xl font-bold text-primary mb-6">Refund Policy</h1>
        <nav aria-label="Refund Policy table of contents" className="border-y border-border py-5 mb-8">
          <h2 className="font-display font-semibold text-lg mb-3">Table of contents</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm leading-relaxed">
            {sections.map((title, index) => (
              <li key={title}><a href={`#section-${index + 1}`} className="text-primary underline underline-offset-2 hover:text-foreground">{title}</a></li>
            ))}
          </ol>
        </nav>
        <article className="privacy-policy" dangerouslySetInnerHTML={{ __html: policy.replace("<h1>Refund Policy</h1>\n", "") }} />
      </main>
      <Footer />
    </div>
  );
}