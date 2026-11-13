import { UtensilsCrossed } from "lucide-react";
import FeaturePageLayout from "./FeaturePageLayout";

const FoodCostControl = () => (
  <FeaturePageLayout
    featureSlug="food-cost-control"
    icon={UtensilsCrossed}
    title="Food Cost & Bar Cost Control"
    intro="Learn proven strategies to manage inventory, reduce waste, and maintain healthy food and bar cost percentages."
    overview={
      <>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Food Cost &amp; Bar Cost Control Series
        </h3>
        <p className="text-xl text-foreground">
          Six interactive manuals to count it, cost it, protect it, and keep every food and bar dollar working
        </p>
        <p>
          Food and beverage is the one cost you buy twice: once at the back door and again every time
          a plate or a pour leaves the line. Most restaurants lose points of margin between those two
          moments without ever seeing where. This series gives you a complete system for controlling
          food and bar cost, built on more than 36 years of real restaurant operations.
        </p>
        <p>
          Across all six manuals you’ll follow Copper Fork Kitchen &amp; Bar, a sample restaurant, as
          it counts its shelves, costs its recipes, tracks its waste, engineers its menu, negotiates
          with its vendors, and finally bridges the gap between what the month should have cost and
          what it did. The numbers carry from one manual to the next, so you can see how every piece
          connects.
        </p>

        <h3 className="font-display text-2xl font-bold text-foreground">What you’ll find here</h3>
        <ul>
          <li>
            <strong>Inventory Systems &amp; Counts.</strong> Count food and the bar accurately, turn
            counts into cost of goods sold, and keep only what you need on the shelf.
          </li>
          <li>
            <strong>Yield Testing &amp; Recipe Costing.</strong> Find the true cost of every ingredient
            after trim, and cost every plate, batch and pour.
          </li>
          <li>
            <strong>Waste Tracking.</strong> Write down everything you throw away, price it, and shut
            off the causes one by one.
          </li>
          <li>
            <strong>Menu Engineering &amp; Pricing.</strong> Sort your menu into stars, plowhorses,
            puzzles and dogs, and price with margin dollars, not guesswork.
          </li>
          <li>
            <strong>Supplier Negotiation.</strong> Run honest bids, put vendor terms in writing, and
            handle price increases without burning relationships.
          </li>
          <li>
            <strong>Theoretical vs. Actual Variance.</strong> Compare what you should have spent with
            what you did, and trace the gap until it has a name.
          </li>
        </ul>

        <h3 className="font-display text-2xl font-bold text-foreground">What’s included</h3>
        <ul>
          <li>130 pages of plain-language guidance, with worked examples and practice exercises</li>
          <li>31 interactive forms that calculate automatically as you type</li>
          <li>
            2026 research and benchmarks for the kitchen and the bar, with vendor claims and disputed
            findings labeled honestly
          </li>
          <li>NRO Standards: clear targets for every part of your food and bar cost operation</li>
        </ul>

        <h3 className="font-display text-2xl font-bold text-foreground">How to use this series</h3>
        <p>
          Start with Manual 1 and work through in order, or go straight to the topic you need today.
          Each manual stands on its own. For the forms to calculate, open the files in Adobe Acrobat
          Reader (free), Chrome or Edge.
        </p>
        <p>
          These manuals are educational guides, not accounting, tax or legal advice. Alcohol
          purchasing, food donation and employment rules vary by state, so confirm them with your
          attorney, your CPA and your state authorities.
        </p>
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
  />
);

export default FoodCostControl;
