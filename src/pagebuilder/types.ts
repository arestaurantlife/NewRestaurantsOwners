export type FieldType = "text" | "textarea" | "list";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  /** For list fields: schema of each item */
  itemFields?: { key: string; label: string; type: "text" | "textarea" }[];
  /** For list fields: default new item */
  itemDefaults?: Record<string, string>;
}

export interface SectionSchema {
  type: string;
  label: string;
  fields: FieldSchema[];
  defaults: Record<string, unknown>;
  Component: React.ComponentType<{ content?: Record<string, unknown> }>;
}

export interface Block {
  id: string;
  type: string;
  visible: boolean;
  props: Record<string, unknown>;
}

export const newId = () =>
  `blk_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;

export function merge<T extends Record<string, unknown>>(
  defaults: T,
  content?: Record<string, unknown>,
): T {
  return { ...defaults, ...(content ?? {}) } as T;
}
