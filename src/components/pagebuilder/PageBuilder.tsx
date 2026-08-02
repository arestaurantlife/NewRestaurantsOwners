import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Block, BlockDesign, designClass, designStyle, newId } from "@/pagebuilder/types";
import { SECTIONS, defaultBlocks } from "@/pagebuilder/registry";
import { usePageLayout, saveLayout } from "@/pagebuilder/usePageLayout";
import { EditorContext } from "@/pagebuilder/EditorContext";
import BlockWrapper from "./BlockWrapper";
import BlockInspector from "./BlockInspector";
import FormatToolbar from "./FormatToolbar";
import MediaLibraryDialog from "./MediaLibraryDialog";
import ThemeEditorDialog from "./ThemeEditorDialog";
import PagesDialog from "./PagesDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  FolderOpen,
  Image as ImageIcon,
  Palette,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Upload,
  X,
} from "lucide-react";

interface Props {
  /** Page slug this builder edits. */
  slug?: string;
  /** Blocks used when the page has never been saved. */
  fallback?: () => Block[];
}

const GROUP_ORDER = ["Layout", "Content", "Media", "Marketing"] as const;

const PageBuilder = ({ slug = "home", fallback }: Props) => {
  const { isAdmin } = useIsAdmin();
  const [editing, setEditing] = useState(false);
  const status = editing ? "draft" : "published";
  const defaults = useMemo(
    () => fallback ?? (() => (slug === "home" ? defaultBlocks() : [])),
    [fallback, slug],
  );
  const { blocks, setBlocks, reload } = usePageLayout(status, slug, defaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  useEffect(() => {
    setDirty(false);
    setEditingId(null);
  }, [status, slug]);

  const list = blocks ?? defaults();
  const activeBlock = useMemo(
    () => list.find((b) => b.id === editingId) ?? null,
    [list, editingId],
  );

  const update = useCallback(
    (next: Block[]) => {
      setBlocks(next);
      setDirty(true);
    },
    [setBlocks],
  );

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
      await saveLayout(target, list, slug);
      if (target === "published") await saveLayout("draft", list, slug);
      setDirty(false);
      toast.success(target === "published" ? "Page published" : "Draft saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  /* ---- inline editing plumbing ---- */
  const setProp = useCallback(
    (key: string, value: unknown) => {
      setBlocks((prev) => {
        const source = prev ?? list;
        return source.map((b) =>
          b.id === activeBlockId ? { ...b, props: { ...b.props, [key]: value } } : b,
        );
      });
      setDirty(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeBlockId, setBlocks, list],
  );

  const setListItemProp = useCallback(
    (listKey: string, index: number, key: string, value: unknown) => {
      setBlocks((prev) => {
        const source = prev ?? list;
        return source.map((b) => {
          if (b.id !== activeBlockId) return b;
          const schema = SECTIONS[b.type];
          const current =
            (b.props[listKey] as Record<string, unknown>[]) ??
            ((schema?.defaults?.[listKey] as Record<string, unknown>[]) ?? []);
          const items = current.map((item, i) =>
            i === index ? { ...item, [key]: value } : item,
          );
          return { ...b, props: { ...b.props, [listKey]: items } };
        });
      });
      setDirty(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeBlockId, setBlocks, list],
  );

  const renderBlock = (block: Block, index: number) => {
    const schema = SECTIONS[block.type];
    if (!schema) return null;
    const Component = schema.Component;
    const styled = (
      <div style={designStyle(block.design)} className={designClass(block.design)}>
        <Component content={block.props} />
      </div>
    );

    if (!editing) return block.visible ? <div key={block.id}>{styled}</div> : null;

    return (
      <div key={block.id} onPointerDownCapture={() => setActiveBlockId(block.id)}>
        <BlockWrapper
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
          {styled}
        </BlockWrapper>
      </div>
    );
  };

  const grouped = useMemo(() => {
    const map = new Map<string, typeof SECTIONS[string][]>();
    Object.values(SECTIONS).forEach((s) => {
      const g = s.group ?? "Content";
      map.set(g, [...(map.get(g) ?? []), s]);
    });
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => [g, map.get(g)!] as const);
  }, []);

  return (
    <EditorContext.Provider value={{ editing, setProp, setListItemProp }}>
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
          <FormatToolbar />

          <div className="fixed top-0 inset-x-0 z-50 bg-charcoal text-white h-14 flex items-center justify-between px-4 gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap">
              <span className="font-semibold">Editing /{slug === "home" ? "" : slug}</span>
              <span className="text-white/60">{dirty ? "• unsaved changes" : "• draft"}</span>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary">
                    <Plus className="w-4 h-4 mr-1" /> Add section
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto z-[60]">
                  {grouped.map(([group, sections]) => (
                    <div key={group}>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {group}
                      </DropdownMenuLabel>
                      {sections.map((s) => (
                        <DropdownMenuItem
                          key={s.type}
                          onClick={() => {
                            const id = newId();
                            update([...list, { id, type: s.type, visible: true, props: {} }]);
                            setEditingId(id);
                            setActiveBlockId(id);
                          }}
                        >
                          {s.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="secondary" onClick={() => setMediaOpen(true)}>
                <ImageIcon className="w-4 h-4 mr-1" /> Media
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setThemeOpen(true)}>
                <Palette className="w-4 h-4 mr-1" /> Theme
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setPagesOpen(true)}>
                <FolderOpen className="w-4 h-4 mr-1" /> Pages
              </Button>

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
            onDesignChange={(design: BlockDesign) =>
              update(list.map((b) => (b.id === activeBlock?.id ? { ...b, design } : b)))
            }
          />

          <MediaLibraryDialog open={mediaOpen} onOpenChange={setMediaOpen} />
          <ThemeEditorDialog open={themeOpen} onOpenChange={setThemeOpen} />
          <PagesDialog open={pagesOpen} onOpenChange={setPagesOpen} />
        </>
      )}
    </EditorContext.Provider>
  );
};

export default PageBuilder;
