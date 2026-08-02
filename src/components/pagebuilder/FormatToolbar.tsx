import { useEffect, useState } from "react";
import { Bold, Italic, Link2, List, Underline, Eraser } from "lucide-react";

interface Pos {
  top: number;
  left: number;
}

const exec = (cmd: string, value?: string) => {
  document.execCommand(cmd, false, value);
};

/**
 * Floating rich-text toolbar. Appears when text is selected inside any
 * contentEditable region while the page editor is active.
 */
const FormatToolbar = () => {
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPos(null);
        return;
      }
      const node = sel.anchorNode;
      const el = (node?.nodeType === 1 ? node : node?.parentElement) as HTMLElement | null;
      if (!el || !el.closest('[contenteditable="true"]')) {
        setPos(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) {
        setPos(null);
        return;
      }
      setPos({ top: rect.top - 46, left: rect.left + rect.width / 2 });
    };

    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, true);
    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  if (!pos) return null;

  const Btn = ({
    onClick,
    label,
    children,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/15"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      className="fixed z-[70] -translate-x-1/2 flex items-center gap-0.5 rounded-lg bg-charcoal text-white px-1 py-1 shadow-xl border border-white/10"
      style={{ top: Math.max(pos.top, 60), left: pos.left }}
    >
      <Btn label="Bold" onClick={() => exec("bold")}>
        <Bold className="w-4 h-4" />
      </Btn>
      <Btn label="Italic" onClick={() => exec("italic")}>
        <Italic className="w-4 h-4" />
      </Btn>
      <Btn label="Underline" onClick={() => exec("underline")}>
        <Underline className="w-4 h-4" />
      </Btn>
      <Btn label="Bullet list" onClick={() => exec("insertUnorderedList")}>
        <List className="w-4 h-4" />
      </Btn>
      <Btn
        label="Add link"
        onClick={() => {
          const url = window.prompt("Link URL (e.g. /pricing or https://example.com)");
          if (url) exec("createLink", url);
        }}
      >
        <Link2 className="w-4 h-4" />
      </Btn>
      <Btn label="Clear formatting" onClick={() => exec("removeFormat")}>
        <Eraser className="w-4 h-4" />
      </Btn>
    </div>
  );
};

export default FormatToolbar;
