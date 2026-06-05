import { DollarSign } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const FinancialOperations = () => (
  <FeaturePageLayout
    quickLinkTags={["prime cost control"]}
    icon={DollarSign}
    title="Financial Operations"
    intro="Master your P&L statements, cash flow management, and financial forecasting to keep your restaurant profitable."
    overview={
      <>
        <p>[Placeholder overview — replace with your real content.]</p>
        <p>Use this section to introduce your approach to restaurant financial operations.</p>
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
