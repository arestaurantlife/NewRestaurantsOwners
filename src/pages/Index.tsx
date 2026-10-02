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
          content="Get expert guidance on financial operations, labor & food costs, employee training, and essential operational forms. Everything you need to run a profitable restaurant." 
        />
        <meta name="keywords" content="restaurant management, restaurant training, food cost control, labor cost management, restaurant operations, new restaurant owner, restaurant design, kitchen planning" />
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
