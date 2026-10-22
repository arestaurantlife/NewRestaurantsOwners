import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import policy from "@/content/refund-policy.html?raw";

const sections = [
  { id: "at-a-glance", title: "At a glance" },
  { id: "section-1", title: "1. Subscriptions and the free trial" },
  { id: "section-2", title: "2. eBooks, guides, bundles, and other digital products" },
  { id: "section-3", title: "3. Staff training platform" },
  { id: "section-4", title: "4. How to request a refund" },
  { id: "section-5", title: "5. Chargebacks and payment disputes" },
  { id: "section-6", title: "6. Abuse and fraud" },
  { id: "section-7", title: "7. Exceptions and the law" },
  { id: "section-8", title: "8. Contact us" },
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
          <ul className="space-y-1 text-sm leading-relaxed">
            {sections.map(({ id, title }) => (
              <li key={id}><a href={`#${id}`} className="text-primary underline underline-offset-2 hover:text-foreground">{title}</a></li>
            ))}
          </ul>
        </nav>
        <article className="privacy-policy" dangerouslySetInnerHTML={{ __html: policy.replace("<h1>Refund Policy</h1>\n", "") }} />
      </main>
      <Footer />
    </div>
  );
}