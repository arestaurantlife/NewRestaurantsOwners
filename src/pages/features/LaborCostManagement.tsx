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
        <p>[Placeholder overview — replace with your real content.]</p>
        <p>Use this section to explain your labor cost framework.</p>
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
