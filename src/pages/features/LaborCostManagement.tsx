import { BarChart3 } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const LaborCostManagement = () => (
  <FeaturePageLayout
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
    pdfResources={[
      { title: "Scheduling Template", description: "Placeholder — upload your scheduling template.", url: "#" },
      { title: "Labor Cost Calculator", description: "Placeholder — upload your labor cost calculator.", url: "#" },
      { title: "Staff Metrics Dashboard", description: "Placeholder — upload your metrics doc.", url: "#" },
    ]}
  />
);

export default LaborCostManagement;
