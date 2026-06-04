import { GraduationCap } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const EmployeeTraining = () => (
  <FeaturePageLayout
    featureSlug="employee-training"
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
  />
);

export default EmployeeTraining;
