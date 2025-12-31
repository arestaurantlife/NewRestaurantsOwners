const testimonials = [
  {
    quote: "This platform saved my restaurant. Within 3 months of implementing their food cost strategies, I reduced waste by 22% and increased my margins significantly.",
    author: "Maria Gonzalez",
    role: "Owner, Casa Bella Trattoria",
    rating: 5
  },
  {
    quote: "The training modules for my staff have been incredible. My team is more efficient and my labor costs have dropped while customer satisfaction has increased.",
    author: "James Chen",
    role: "Owner, Golden Dragon Bistro",
    rating: 5
  },
  {
    quote: "I was completely lost with the financial side of running a restaurant. The P&L templates and cash flow tools finally made everything click for me.",
    author: "Sarah Mitchell",
    role: "Owner, The Copper Kettle",
    rating: 5
  },
  {
    quote: "The community aspect is what sets this apart. Being able to ask questions and get advice from experienced owners has been invaluable.",
    author: "David Thompson",
    role: "Owner, Riverside Grill",
    rating: 5
  },
  {
    quote: "Every form I needed was right there—health inspection checklists, employee handbooks, inventory sheets. Saved me hundreds of hours.",
    author: "Jennifer Park",
    role: "Owner, Seoul Kitchen",
    rating: 5
  },
  {
    quote: "Best investment I've made for my business. The ROI on the membership paid for itself in the first month through better cost management.",
    author: "Michael Roberts",
    role: "Owner, The Smokehouse BBQ",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-cream-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            Success Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Restaurant Owners{" "}
            <span className="text-primary">Love Our Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of restaurant owners who have transformed their 
            businesses with our proven systems.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border hover:shadow-elevated transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-gold fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;