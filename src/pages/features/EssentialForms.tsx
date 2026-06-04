import { FileText } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const EssentialForms = () => (
  <FeaturePageLayout
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
    pdfResources={[
      { title: "Opening/Closing Checklist", description: "Placeholder — upload checklist.", url: "#" },
      { title: "Health & Safety Pack", description: "Placeholder — upload health & safety forms.", url: "#" },
      { title: "HR Document Pack", description: "Placeholder — upload HR forms.", url: "#" },
    ]}
  />
);

export default EssentialForms;
