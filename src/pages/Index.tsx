import { Helmet } from "react-helmet-async";
import { SITE } from "@/lib/siteConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBuilder from "@/components/pagebuilder/PageBuilder";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NewRestaurantsOwners.com | Master Your Restaurant's Financial Success</title>
        <meta
          name="description"
          content="Built by a professional team with more than 36 years of restaurant experience, NRO gives you the systems most new owners learn the hard way. You get step-by-step manuals with fillable forms for your P&L, cash flow, budgeting, break-even, and prime cost. You get complete labor and food & bar cost systems covering scheduling, overtime rules, recipe costing, inventory counts, waste tracking, and menu pricing. You get cost calculators, 50+ operational forms, a new-hire training library, and the Hospitality Library to help your team turn good service into guests who come back. Plus The Psychology of Restaurant Theft, The Pre-Shift Playbook, weekly live Q&A, and a private community of owners who’ve been where you are. One membership. Every system you need to run a profitable restaurant."
        />
        <meta
          name="keywords"
          content="restaurant management, restaurant training, food cost control, labor cost management, restaurant operations, new restaurant owner, restaurant design, kitchen planning"
        />
        <link rel="canonical" href={SITE.domain} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <PageBuilder />
        <Footer />
      </div>
    </>
  );
};

export default Index;
