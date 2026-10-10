import { merge } from "@/pagebuilder/types";

export const testimonialsDefaults = {
  eyebrow: "Possible Scenarios",
  titleLead: "What Could Change",
  titleAccent: "in Your Restaurant",
  subtitle:
    "NRO launches December 15, 2026. These are illustrative scenarios, not customer results. They show what putting these systems to work could look like.",
  items: [
    {
      title: "Food cost",
      body: "You count inventory weekly with the food cost calculator and compare what you should have used against what you actually used. Possible outcome: you see over-portioning and waste in dollars every week, instead of finding out at month-end.",
      tool: "Labor & Food Cost Systems · Professional",
    },
    {
      title: "Staff training",
      body: "Every new hire learns the same standards from the same modules, not from whoever is on shift. Possible outcome: fewer hours spent re-training and more consistent service from one shift to the next.",
      tool: "Complete Training Library · Professional",
    },
    {
      title: "Financials",
      body: "You've never read a P&L line by line. You work through the P&L Mastery System with your own numbers. Possible outcome: you know which cost line moved last month before your accountant tells you.",
      tool: "Restaurant P&L Mastery System · Professional",
    },
    {
      title: "Community",
      body: "Friday night goes sideways. You bring the problem to the weekly live Q&A and the private community. Possible outcome: you get an answer from operators who have already lived it, not a forum full of guesses.",
      tool: "Weekly Live Q&A + Private Community · Professional",
    },
    {
      title: "Forms",
      body: "You need a checklist, a log, or a sheet, and you need it before tomorrow's shift. Possible outcome: you stop building forms from scratch at midnight and start using ones built by an operator.",
      tool: "10+ forms in Starter · 50+ in Professional",
    },
    {
      title: "Return on the membership",
      body: "You don't take our word that it pays for itself. You track your food cost, labor, and comps against the monthly fee. Possible outcome: you have your own numbers that show whether the membership is earning its keep.",
      tool: "Any tier",
    },
  ] as { title?: string; body?: string; tool?: string }[],
  disclaimer:
    "Illustrative scenarios only. Results depend on your restaurant, your market, and how consistently the systems are used. No outcome is guaranteed.",
};

const Testimonials = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(testimonialsDefaults, content);
  return <section id="testimonials" className="py-20 md:py-32 bg-cream-dark">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            {c.eyebrow}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {c.titleLead} <span className="text-primary">{c.titleAccent}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{c.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.items.map((item, index) => <div key={index} className="flex flex-col bg-card rounded-2xl p-6 lg:p-8 shadow-soft border border-border hover:shadow-elevated transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-foreground mb-6 leading-relaxed flex-1">{item.body}</p>
              {item.tool && <span className="self-start inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {item.tool}
                </span>}
            </div>)}
        </div>

        {c.disclaimer && <p className="text-center text-sm text-muted-foreground mt-10 max-w-3xl mx-auto">{c.disclaimer}</p>}
      </div>
    </section>;
};
export default Testimonials;
