import { FileText } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const EssentialForms = () => (
  <FeaturePageLayout
    featureSlug="essential-forms"
    icon={FileText}
    title="Essential Forms"
    intro="Get access to all the operational forms you need—from checklists to compliance documents."
    overview={
      <>
        <p>[Placeholder overview — replace with your real content.]</p>
        <p>Use this section to describe the forms library.</p>
      </>
    }
    topics={[
      "Opening and closing checklists",
      "Health and safety forms",
      "HR documents",
      "Incident reports",
      "Compliance logs",
      "Vendor and PO forms",
    ]}
  />
);

export default EssentialForms;
