import { Users } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const CommunitySupport = () => (
  <FeaturePageLayout
    icon={Users}
    title="Community & Support"
    intro="Connect with other restaurant owners, share experiences, and get expert advice when you need it."
    overview={
      <>
        <p>[Placeholder overview — replace with your real content.]</p>
        <p>Use this section to describe the community and support model.</p>
      </>
    }
    topics={[
      "Private members forum",
      "Monthly live Q&A",
      "Expert network access",
      "Peer mentoring",
      "Office hours",
      "Event calendar",
    ]}
    pdfResources={[
      { title: "Community Guidelines", description: "Placeholder — upload guidelines.", url: "#" },
      { title: "Q&A Schedule", description: "Placeholder — upload schedule.", url: "#" },
    ]}
  />
);

export default CommunitySupport;
