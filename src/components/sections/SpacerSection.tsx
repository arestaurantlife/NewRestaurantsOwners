import { merge } from "@/pagebuilder/types";

export const spacerDefaults = {
  height: "md",
  divider: "no",
};

const HEIGHTS: Record<string, string> = {
  sm: "h-6",
  md: "h-14",
  lg: "h-24",
  xl: "h-40",
};

const SpacerSection = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(spacerDefaults, content);
  return (
    <div className={`container mx-auto px-4 ${HEIGHTS[c.height] ?? HEIGHTS.md} flex items-center`}>
      {c.divider === "yes" ? <hr className="w-full border-border" /> : null}
    </div>
  );
};

export default SpacerSection;
