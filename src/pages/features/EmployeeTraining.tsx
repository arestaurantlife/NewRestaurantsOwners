import { GraduationCap } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const EmployeeTraining = () => (
  <FeaturePageLayout
    icon={GraduationCap}
    title="Employee Training"
    intro="Access comprehensive training modules and materials to develop a skilled, efficient team."
    overview={
      <>
        <p>[Placeholder overview — replace with your real content.]</p>
        <p>Use this section to introduce your training philosophy.</p>
      </>
    }
    topics={[
      "New-hire onboarding",
      "FOH and BOH SOPs",
      "Service standards",
      "Food safety basics",
      "Cross-training",
      "Ongoing development",
    ]}
    pdfResources={[
      { title: "Onboarding Checklist", description: "Placeholder — upload onboarding checklist.", url: "#" },
      { title: "SOP Library", description: "Placeholder — upload your SOPs.", url: "#" },
      { title: "Training Workbook", description: "Placeholder — upload training workbook.", url: "#" },
    ]}
  />
);

export default EmployeeTraining;
