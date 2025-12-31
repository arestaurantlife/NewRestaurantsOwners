import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import PodcastsCourses from "@/components/PodcastsCourses";
import DesignServices from "@/components/DesignServices";
import SupplierFinder from "@/components/SupplierFinder";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NewRestaurantOwners.com | Master Your Restaurant's Financial Success</title>
        <meta 
          name="description" 
          content="Get expert guidance on financial operations, labor & food costs, employee training, and essential operational forms. Everything you need to run a profitable restaurant." 
        />
        <meta name="keywords" content="restaurant management, restaurant training, food cost control, labor cost management, restaurant operations, new restaurant owner, restaurant design, kitchen planning" />
        <link rel="canonical" href="https://newrestaurantowners.com" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <PodcastsCourses />
          <DesignServices />
          <SupplierFinder />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;