import { DollarSign } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const FinancialOperations = () => (
  <FeaturePageLayout
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
    pdfResources={[
      { title: "P&L Template", description: "Placeholder — upload your P&L template PDF.", url: "#" },
      { title: "Cash Flow Worksheet", description: "Placeholder — upload your cash flow worksheet.", url: "#" },
      { title: "Budget Planning Guide", description: "Placeholder — upload your budget guide.", url: "#" },
    ]}
  />
);

export default FinancialOperations;
