import { DollarSign } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const FinancialOperations = () => (
  <FeaturePageLayout
    featureSlug="financial-operations"
    quickLinkTags={["prime cost control"]}
    icon={DollarSign}
    title="Financial Operations"
    intro="Master your P&L statements, cash flow management, and financial forecasting to keep your restaurant profitable."
    overview={
      <>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Financial Operations Series
        </h3>
        <p className="text-xl text-foreground">
          Six interactive manuals to read your numbers, protect your cash, and run a profitable restaurant
        </p>
        <p>
          Most restaurants don’t fail because of bad food or bad service. They fail because the owner
          couldn’t see the numbers in time to act on them. This series gives you a complete system for
          managing the money side of your restaurant, built on more than 36 years of real restaurant
          operations.
        </p>
        <p>
          Across all six manuals you’ll follow Copper Fork Kitchen &amp; Bar, a sample restaurant, as
          it reads its P&amp;L, fixes a cash crunch, builds its budget, and brings its costs under
          control. The numbers carry from one manual to the next, so you can see how every piece
          connects.
        </p>

        <h3 className="font-display text-2xl font-bold text-foreground">What you’ll find here</h3>
        <ul>
          <li>
            <strong>Reading &amp; Acting on Your P&amp;L.</strong> Understand every line of your Profit
            &amp; Loss statement, compare it to benchmarks for your concept, and turn problems into
            actions.
          </li>
          <li>
            <strong>Cash Flow Management.</strong> Learn why profit isn’t cash, find your true
            available cash, and forecast the next 13 weeks.
          </li>
          <li>
            <strong>Budgeting &amp; Forecasting.</strong> Build an annual budget from guest counts and
            check average, and plan for slow seasons and rising costs.
          </li>
          <li>
            <strong>Break-Even Analysis.</strong> Know exactly how much you need to sell before you
            make a profit, in dollars, guests per day and seat turns.
          </li>
          <li>
            <strong>Prime Cost Control.</strong> Control food, beverage and labor costs with recipe
            costing, waste control, menu engineering and smarter scheduling.
          </li>
          <li>
            <strong>Monthly Financial Reviews.</strong> Turn your monthly numbers into decisions with
            one 90-minute meeting, a one-page KPI dashboard and an action tracker.
          </li>
        </ul>

        <h3 className="font-display text-2xl font-bold text-foreground">What’s included</h3>
        <ul>
          <li>158 pages of plain-language guidance, with worked examples and practice exercises</li>
          <li>32 interactive forms that calculate automatically as you type</li>
          <li>2026 research and industry benchmarks by restaurant concept</li>
          <li>NRO Standards: clear targets for every part of your financial operation</li>
        </ul>

        <h3 className="font-display text-2xl font-bold text-foreground">How to use this series</h3>
        <p>
          Start with Manual 1 and work through in order, or go straight to the topic you need today.
          Each manual stands on its own. For the forms to calculate, open the files in Adobe Acrobat
          Reader (free), Chrome or Edge.
        </p>
        <p>
          These manuals are educational guides, not accounting, tax or legal advice. Consult a
          licensed CPA or attorney for your specific situation.
        </p>
      </>
    }
    topics={[
      "Reading and acting on your P&L",
      "Cash flow management",
      "Budgeting and forecasting",
      "Break-even analysis",
      "Prime cost control",
      "Monthly financial reviews",
    ]}
  />
);

export default FinancialOperations;
