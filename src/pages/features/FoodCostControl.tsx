import { UtensilsCrossed } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const FoodCostControl = () => (
  <FeaturePageLayout
    icon={UtensilsCrossed}
    title="Food Cost Control"
    intro="Learn proven strategies to manage inventory, reduce waste, and maintain healthy food cost percentages."
    overview={
      <>
        <p>[Placeholder overview — replace with your real content.]</p>
        <p>Use this section to describe your food cost methodology.</p>
      </>
    }
    topics={[
      "Inventory systems and counts",
      "Yield testing and recipe costing",
      "Waste tracking",
      "Menu engineering and pricing",
      "Supplier negotiation",
      "Theoretical vs. actual variance",
    ]}
    pdfResources={[
      { title: "Inventory Sheet", description: "Placeholder — upload your inventory sheet.", url: "#" },
      { title: "Waste Tracking Log", description: "Placeholder — upload your waste log.", url: "#" },
      { title: "Menu Pricing Worksheet", description: "Placeholder — upload your pricing worksheet.", url: "#" },
    ]}
  />
);

export default FoodCostControl;
