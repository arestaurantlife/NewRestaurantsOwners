import { useEffect, useMemo, useState } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Block, newId } from "@/pagebuilder/types";
import { SECTIONS, defaultBlocks } from "@/pagebuilder/registry";
import { usePageLayout, saveLayout } from "@/pagebuilder/usePageLayout";
import BlockWrapper from "./BlockWrapper";
import BlockInspector from "./BlockInspector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, RotateCcw, Save, Upload, X } from "lucide-react";

const PageBuilder = () => {
  const { isAdmin } = useIsAdmin();
  const [editing, setEditing] = useState(false);
  const status = editing ? "draft" : "published";
  const { blocks, setBlocks, loading, reload } = usePageLayout(status);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(false);
    setEditingId(null);
  }, [status]);

  const list = blocks ?? defaultBlocks();
  const activeBlock = useMemo(
    () => list.find((b) => b.id === editingId) ?? null,
    [list, editingId],
  );

  const update = (next: Block[]) => {
    setBlocks(next);
    setDirty(true);
  };

  const move = (index: number, delta: number) => {
    const next = [...list];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const persist = async (target: "draft" | "published") => {
    setSaving(true);
    try {
      await saveLayout(target, list);
      if (target === "published") await saveLayout("draft", list);
      setDirty(false);
      toast.success(target === "published" ? "Page published" : "Draft saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const renderBlock = (block: Block, index: number) => {
    const schema = SECTIONS[block.type];
    if (!schema) return null;
    const Component = schema.Component;
    const node = <Component content={block.props} />;
    if (!editing) return block.visible ? <div key={block.id}>{node}</div> : null;
    return (
      <BlockWrapper
        key={block.id}
        label={schema.label}
        visible={block.visible}
        isFirst={index === 0}
        isLast={index === list.length - 1}
        onEdit={() => setEditingId(block.id)}
        onMoveUp={() => move(index, -1)}
        onMoveDown={() => move(index, 1)}
        onToggleVisible={() =>
          update(list.map((b) => (b.id === block.id ? { ...b, visible: !b.visible } : b)))
        }
        onRemove={() => update(list.filter((b) => b.id !== block.id))}
      >
        {node}
      </BlockWrapper>
    );
  };


  return (
    <>
      <main className={editing ? "pt-14" : undefined}>{list.map(renderBlock)}</main>

      {isAdmin && !editing && (
        <Button
          className="fixed bottom-6 right-6 z-50 shadow-lg"
          size="lg"
          onClick={() => setEditing(true)}
        >
          <Pencil className="w-4 h-4 mr-2" /> Edit page
        </Button>
      )}

      {isAdmin && editing && (
        <>
          <div className="fixed top-0 inset-x-0 z-50 bg-charcoal text-white h-14 flex items-center justify-between px-4 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Editing homepage</span>
              <span className="text-white/60">{dirty ? "• unsaved changes" : "• draft"}</span>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary">
                    <Plus className="w-4 h-4 mr-1" /> Add section
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto z-[60]">
                  {Object.values(SECTIONS).map((s) => (
                    <DropdownMenuItem
                      key={s.type}
                      onClick={() =>
                        update([
                          ...list,
                          { id: newId(), type: s.type, visible: true, props: {} },
                        ])
                      }
                    >
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="secondary" onClick={() => persist("draft")} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> Save draft
              </Button>
              <Button size="sm" onClick={() => persist("published")} disabled={saving}>
                <Upload className="w-4 h-4 mr-1" /> Publish
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={async () => {
                  await reload();
                  setDirty(false);
                  toast.info("Draft reloaded");
                }}
                disabled={saving}
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Discard
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={() => setEditing(false)}
              >
                <X className="w-4 h-4 mr-1" /> Exit
              </Button>
            </div>
          </div>

          <BlockInspector
            block={activeBlock}
            onClose={() => setEditingId(null)}
            onChange={(props) =>
              update(list.map((b) => (b.id === activeBlock?.id ? { ...b, props } : b)))
            }
          />
        </>
      )}
    </>
  );
};

export default PageBuilder;
