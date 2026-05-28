import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const faqs = [{
  question: "Is this platform suitable for someone who hasn't opened their restaurant yet?",
  answer: "Absolutely! In fact, starting before you open is ideal. You'll learn how to set up proper financial systems from day one, avoid common costly mistakes, and have all your operational procedures ready before opening day."
}, {
  question: "How is this different from free content on YouTube or blogs?",
  answer: "While free content can be helpful, it's often scattered, outdated, or comes from people without real restaurant experience. Our platform provides a structured, comprehensive system with downloadable templates, calculators, and forms you can immediately implement—all created by industry professionals."
}, {
  question: "Can I cancel my subscription at any time?",
  answer: "Yes, you can cancel your subscription at any time with no penalties or hidden fees. You'll continue to have access until the end of your current billing period. Plus, we offer a 14-day money-back guarantee."
}, {
  question: "How quickly will I see results?",
  answer: "Most members start seeing improvements within the first 2-4 weeks. Whether it's reduced food waste, better labor scheduling, or improved financial clarity—the impact is often immediate when you implement our proven systems."
}, {
  question: "Do you offer support if I get stuck?",
  answer: "Yes! All plans include email support. Professional and Enterprise members get priority support plus access to weekly live Q&A sessions where you can get your specific questions answered by our experts."
}, {
  question: "Is there a free trial available?",
  answer: "Yes! We offer a 7-day free trial on all plans—credit card required. This gives you full access to explore the platform and see the value before committing."
}, {
  question: "What types of restaurants is this designed for?",
  answer: "Our content is designed to work for all restaurant types—full service, quick service, cafes, bars, food trucks, and more. The fundamental principles of financial management, labor optimization, and operations apply across all formats."
}, {
  question: "Can I share my account with my business partner or manager?",
  answer: "The Starter and Professional plans are for single-user access. The Enterprise plan includes team access for up to 5 users, making it perfect for partnerships or giving your management team access to training materials."
}];
const FAQ = () => {
  return <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mb-4">
            Got Questions?
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about NewRestaurantsOwners.com. Can't find the answer you're looking for? Reach out to our team.</p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-soft transition-shadow">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </section>;
};
export default FAQ;