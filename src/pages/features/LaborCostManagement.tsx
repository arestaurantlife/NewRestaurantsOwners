import { BarChart3 } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const LaborCostManagement = () => (
  <FeaturePageLayout
    featureSlug="labor-cost-management"
    icon={BarChart3}
    title="Labor Cost Management"
    intro="Optimize your staffing schedules and reduce labor costs while maintaining excellent service standards."
    overview={
      <>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Labor Cost Management Series
        </h3>
        <p className="text-xl text-foreground">
          Six interactive manuals to schedule smarter, pay correctly, and build a team that stays
        </p>
        <p>
          Labor is the largest cost you can control, and the hardest to get right. Schedule too many
          people and your profit disappears. Schedule too few and your guests and your team pay the
          price. This series gives you a complete system for managing labor, built on more than 36
          years of real restaurant operations.
        </p>
        <p>
          Across all six manuals you’ll follow Copper Fork Kitchen &amp; Bar, a sample restaurant, as
          it builds its schedule, sets its labor target, forecasts its guests, and reviews its team.
          The numbers carry from one manual to the next, so you can see how every piece connects.
        </p>

        <h3 className="font-display text-2xl font-bold text-foreground">What you’ll find here</h3>
        <ul>
          <li>
            <strong>Schedule Building Best Practices.</strong> Build schedules from your sales
            forecast with a 10-step method, a staffing guide and fair scheduling habits.
          </li>
          <li>
            <strong>Labor Cost Percentage Targets.</strong> Find the right labor target for your
            concept and state, and set flexible targets that move with sales.
          </li>
          <li>
            <strong>Forecasting Demand vs. Coverage.</strong> Predict your guests hour by hour and
            match your staffing to the rush.
          </li>
          <li>
            <strong>Overtime &amp; Compliance.</strong> Calculate overtime correctly, follow tip and
            wage rules, and audit your own pay practices.
          </li>
          <li>
            <strong>Productivity Metrics.</strong> Measure sales and guests per labor hour by server,
            station and daypart, and find wasted hours.
          </li>
          <li>
            <strong>Performance Reviews.</strong> Give feedback that works, review new hires at 30, 60
            and 90 days, and link raises to performance.
          </li>
        </ul>

        <h3 className="font-display text-2xl font-bold text-foreground">What’s included</h3>
        <ul>
          <li>130 pages of plain-language guidance, with worked examples and practice exercises</li>
          <li>32 interactive forms that calculate automatically as you type</li>
          <li>2026 research and benchmarks, plus federal rules with a state-by-state overview</li>
          <li>NRO Standards: clear targets for every part of your labor operation</li>
        </ul>

        <h3 className="font-display text-2xl font-bold text-foreground">How to use this series</h3>
        <p>
          Start with Manual 1 and work through in order, or go straight to the topic you need, or
          today. Each manual stands on its own. For the forms to calculate, open the files in Adobe
          Acrobat Reader (free), Chrome or Edge.
        </p>
        <p>
          These manuals are educational guides, not legal advice. Labor laws vary by state and change
          often, so confirm the rules for your location with your state labor department or an
          employment attorney.
        </p>
      </>
    }
    topics={[
      "Schedule building best practices",
      "Labor cost percentage targets",
      "Forecasting demand vs. coverage",
      "Overtime and compliance",
      "Productivity metrics",
      "Performance reviews",
    ]}
  />
);

export default LaborCostManagement;
