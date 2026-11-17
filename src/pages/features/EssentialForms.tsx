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
        <h3>Essential Forms Series</h3>
        <p>Six interactive manuals to turn what happens in your restaurant into a record, and a record into a defense</p>
        <p>You can know your numbers, control your costs and train your people, and still lose the argument, because almost everything that goes wrong in a restaurant is settled later by whoever kept the better record. This series is that record: the checklists that make every shift run the same way, the logs that prove your food was safe, the employment paperwork that decides a wage claim, the incident reports written before anyone knew they mattered, the compliance file that an inspector, an insurer and an attorney will each ask you for, and the purchasing paper that catches what an invoice hides. Built on more than 36 years of real restaurant operations.</p>
        <p>Across all six manuals you’ll follow Copper Fork Kitchen &amp; Bar, a sample restaurant, as it times its own closing routine, cools a stockpot through both stages, splits a tip pool by points, writes up a guest who slipped on a wet floor, finds a liquor renewal that needs a health permit it is about to lose, and traces a forty-cent price increase to $1,768 a year.</p>
        <h3>What you’ll find here</h3>
        <ul>
          <li><strong>Opening and Closing Checklists.</strong> Fifteen checklists and 207 items that make the shift run the same way whether you are there or not.</li>
          <li><strong>Health and Safety Forms.</strong> The daily records that prove your food was safe, and the self-inspection that finds what the inspector would.</li>
          <li><strong>HR Documents.</strong> Hiring through separation, including the tip credit notice and the tip pool math that wage claims turn on.</li>
          <li><strong>Incident Reports.</strong> Facts, same day, no conclusions — the record that holds up when somebody reads it back to you two years later.</li>
          <li><strong>Compliance Logs.</strong> Licences, certifications, inspections, insurance and postings, with expiry dates that flag themselves before they lapse.</li>
          <li><strong>Vendor and PO Forms.</strong> Match the order, the delivery and the bill, and catch the price increase nobody announced.</li>
        </ul>
        <h3>What’s included</h3>
        <ul>
          <li>165 pages of plain-language guidance, with worked examples and practice exercises</li>
          <li>96 interactive forms that calculate automatically as you type</li>
          <li>2026 research and federal standards, each cited to the agency that publishes it, with operating practice labeled as practice rather than law</li>
          <li>NRO Standards: clear targets for every record your restaurant keeps</li>
        </ul>
        <h3>How to use this series</h3>
        <p>Start with Manual 1 and work through in order, or go straight to the forms you need today. Each manual stands on its own. For the forms to calculate, open the files in Adobe Acrobat Reader (free), Chrome or Edge.</p>
        <p>These manuals are educational guides and operating templates, not legal advice. Several of these forms become evidence: incident reports, employment paperwork, wage and hour records and compliance files are all read later by insurers, investigators, inspectors and attorneys, which is exactly why they ask for facts and refuse to ask for conclusions. Food codes, employment paperwork, pay practices, alcohol rules, posting requirements, record retention periods and automatic renewal terms all vary by state and change: have your attorney, your CPA, your payroll provider, your insurance broker and your local health and licensing authorities review these before you rely on them.</p>
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
