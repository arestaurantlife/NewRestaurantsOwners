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
        <h3>Employee Training Series</h3>
        <p>Six interactive manuals to turn a new hire into a confident professional, and a job into a career</p>
        <p>You can control your food cost and your labor cost on paper and still lose money every night, because every standard you set is executed by a person. This series is how those people learn: the onboarding that decides your turnover, the written procedures they’re trained against, the service standard they’re held to, the safety knowledge that protects your license, the cross-training that covers your schedule, and the development that keeps your best people from leaving. Built on more than 36 years of real restaurant operations.</p>
        <p>Across all six manuals you’ll follow Copper Fork Kitchen &amp; Bar, a sample restaurant, as it onboards a new server through a two-week gated track, writes its first ten procedures, times its steps of service, cools a soup batch correctly, discovers that only one person can run its bar, and maps the ladder from crew to manager.</p>
        <h3>What you’ll find here</h3>
        <ul>
          <li><strong>New-hire Onboarding.</strong> The full arc from signed offer to graduation: paperwork, orientation, modules, sign-offs and a target date.</li>
          <li><strong>FOH and BOH SOPs.</strong> Write the procedures your team is trained against, in language two people can’t disagree about.</li>
          <li><strong>Service Standards.</strong> Make service measurable and hospitality teachable, and fix problems before the guest leaves.</li>
          <li><strong>Food Safety Basics.</strong> The temperatures, the habits, the logs and the self-inspection that keep your kitchen safe and open.</li>
          <li><strong>Cross-training.</strong> Find the stations only one person can run, and build a bench where it pays.</li>
          <li><strong>Ongoing Development.</strong> The career ladder, the development plans, and the managers you grow instead of hire.</li>
        </ul>
        <h3>What’s included</h3>
        <ul>
          <li>134 pages of plain-language guidance, with worked examples and practice exercises</li>
          <li>30 interactive forms that calculate automatically as you type</li>
          <li>2026 research and benchmarks, with vendor claims, disputed findings and unverifiable statistics labeled honestly</li>
          <li>NRO Standards: clear targets for every part of your training program</li>
        </ul>
        <h3>How to use this series</h3>
        <p>Start with Manual 1 and work through in order, or go straight to the topic you need today. Each manual stands on its own. For the forms to calculate, open the files in Adobe Acrobat Reader (free), Chrome or Edge.</p>
        <p>These manuals are educational guides and training support, not legal advice and not a certification course. They do not satisfy any food handler or food protection manager requirement, which must come from an accredited provider. Employment paperwork, pay practices, promotion criteria, food safety codes and alcohol rules all vary by state and change: confirm everything here with your attorney, your CPA, your payroll provider and your local health department.</p>
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
