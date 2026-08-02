import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { useEditor } from "@/pagebuilder/EditorContext";
import { cn } from "@/lib/utils";

const ALLOWED = {
  ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "a", "br", "span", "ul", "ol", "li", "p"],
  ALLOWED_ATTR: ["href", "target", "rel"],
};

export const sanitize = (html: string) => DOMPurify.sanitize(html, ALLOWED);

const hasMarkup = (v: string) => /<[a-z][\s\S]*>/i.test(v);

interface Props {
  /** Prop key on the current block that this text edits. */
  field: string;
  value?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Disallow formatting — plain text only (badges, button labels, etc.). */
  plain?: boolean;
  placeholder?: string;
  /** Optional: edit an item inside a list prop instead of a top-level prop. */
  list?: { key: string; index: number };
}

/**
 * Renders text normally for visitors. In admin edit mode the same node becomes
 * click-to-type, committing sanitized HTML back into the block props on blur.
 */
const EditableText = ({
  field,
  value = "",
  as: Tag = "span",
  className,
  plain = false,
  placeholder,
  list,
}: Props) => {
  const { editing, setProp, setListItemProp } = useEditor();
  const ref = useRef<HTMLElement>(null);

  // Keep the DOM in sync when the value changes from elsewhere (inspector, undo).
  useEffect(() => {
    const el = ref.current;
    if (!el || !editing) return;
    if (document.activeElement === el) return;
    const next = value ?? "";
    if (el.innerHTML !== next) el.innerHTML = next;
  }, [value, editing]);

  const commit = () => {
    const el = ref.current;
    if (!el) return;
    const raw = plain ? el.innerText : el.innerHTML;
    const next = plain ? raw.replace(/\s+/g, " ").trim() : sanitize(raw);
    if (next === (value ?? "")) return;
    if (list) setListItemProp(list.key, list.index, field, next);
    else setProp(field, next);
  };

  if (!editing) {
    if (!value) return null;
    return hasMarkup(value) ? (
      <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitize(value) }} />
    ) : (
      <Tag className={className}>{value}</Tag>
    );
  }

  return (
    <Tag
      ref={ref as never}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder ?? "Click to edit"}
      onBlur={commit}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Escape") (e.target as HTMLElement).blur();
        if (plain && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      onPaste={(e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
      className={cn(
        className,
        "outline-none rounded-sm transition-shadow cursor-text",
        "ring-1 ring-dashed ring-primary/25 hover:ring-primary/60 focus:ring-2 focus:ring-primary",
        "empty:before:content-[attr(data-placeholder)] empty:before:opacity-40",
      )}
      dangerouslySetInnerHTML={{ __html: sanitize(value ?? "") }}
    />
  );
};

export default EditableText;
