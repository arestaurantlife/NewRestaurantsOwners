import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

interface Props {
  label: string;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisible: () => void;
  onRemove: () => void;
  children: ReactNode;
}

const BlockWrapper = ({
  label,
  visible,
  isFirst,
  isLast,
  onEdit,
  onMoveUp,
  onMoveDown,
  onToggleVisible,
  onRemove,
  children,
}: Props) => (
  <div className="relative group/block ring-2 ring-transparent hover:ring-primary/60 transition-shadow">
    {!visible && (
      <div className="absolute inset-0 z-30 bg-background/70 pointer-events-none flex items-start justify-center pt-10">
        <span className="text-xs uppercase tracking-widest text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
          Hidden section
        </span>
      </div>
    )}
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 opacity-0 group-hover/block:opacity-100 transition-opacity">
      <div className="flex items-center gap-1 bg-card/95 backdrop-blur border border-border rounded-full shadow-lg px-2 py-1">
        <span className="text-xs font-medium text-foreground px-2">{label}</span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit} title="Edit content">
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onMoveUp} disabled={isFirst} title="Move up">
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onMoveDown} disabled={isLast} title="Move down">
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onToggleVisible} title={visible ? "Hide" : "Show"}>
          {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={onRemove} title="Remove section">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
    <div className={visible ? "" : "opacity-40"}>{children}</div>
  </div>
);

export default BlockWrapper;
