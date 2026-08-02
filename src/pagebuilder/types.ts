export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "list"
  | "image"
  | "video"
  | "pdf"
  | "link"
  | "select"
  | "color";

export interface ItemFieldSchema {
  key: string;
  label: string;
  type: "text" | "textarea" | "richtext" | "image" | "link";
}

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: { value: string; label: string }[];
  /** For list fields: schema of each item */
  itemFields?: ItemFieldSchema[];
  /** For list fields: default new item */
  itemDefaults?: Record<string, string>;
}

/** Per-section visual overrides. All values optional. */
export interface BlockDesign {
  /** CSS color string (any format) for the section background */
  background?: string;
  /** Heading color */
  heading?: string;
  /** Body text color */
  text?: string;
  /** Accent / button color */
  accent?: string;
  /** Vertical padding preset */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Text alignment override */
  align?: "left" | "center" | "right";
}

export interface SectionSchema {
  type: string;
  label: string;
  /** Grouping in the "Add section" menu */
  group?: "Layout" | "Content" | "Marketing" | "Media";
  fields: FieldSchema[];
  defaults: Record<string, unknown>;
  Component: React.ComponentType<{ content?: Record<string, unknown> }>;
}

export interface Block {
  id: string;
  type: string;
  visible: boolean;
  props: Record<string, unknown>;
  design?: BlockDesign;
}

export const newId = () =>
  `blk_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;

export function merge<T extends Record<string, unknown>>(
  defaults: T,
  content?: Record<string, unknown>,
): T {
  return { ...defaults, ...(content ?? {}) } as T;
}

export const PADDING_CLASS: Record<NonNullable<BlockDesign["padding"]>, string> = {
  none: "py-0",
  sm: "py-6",
  md: "py-12",
  lg: "py-20",
  xl: "py-32",
};

/** Turns a BlockDesign into inline style + class so any section can honour it. */
export function designStyle(design?: BlockDesign): React.CSSProperties {
  if (!design) return {};
  const style: React.CSSProperties & Record<string, string> = {} as never;
  if (design.background) style.background = design.background;
  if (design.text) style.color = design.text;
  if (design.heading) style["--section-heading"] = design.heading;
  if (design.accent) style["--section-accent"] = design.accent;
  if (design.align) style.textAlign = design.align;
  return style;
}

export function designClass(design?: BlockDesign): string {
  const parts: string[] = [];
  if (design?.padding) parts.push(PADDING_CLASS[design.padding]);
  if (design?.heading) parts.push("[&_h1]:!text-[var(--section-heading)] [&_h2]:!text-[var(--section-heading)] [&_h3]:!text-[var(--section-heading)]");
  return parts.join(" ");
}
