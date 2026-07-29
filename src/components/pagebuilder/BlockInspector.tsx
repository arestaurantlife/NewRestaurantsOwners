import { Block } from "@/pagebuilder/types";
import { SECTIONS } from "@/pagebuilder/registry";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";

interface Props {
  block: Block | null;
  onClose: () => void;
  onChange: (props: Record<string, unknown>) => void;
}

type Item = Record<string, string>;

const BlockInspector = ({ block, onClose, onChange }: Props) => {
  if (!block) return null;
  const schema = SECTIONS[block.type];
  if (!schema) return null;

  const value = (key: string) => {
    const v = block.props[key];
    return v !== undefined ? v : (schema.defaults as Record<string, unknown>)[key];
  };

  const setValue = (key: string, v: unknown) => onChange({ ...block.props, [key]: v });

  const resetField = (key: string) => {
    const next = { ...block.props };
    delete next[key];
    onChange(next);
  };

  return (
    <Sheet open={!!block} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>Edit {schema.label}</SheetTitle>
          <SheetDescription>Changes are saved to your draft.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 pb-10">
          <div className="space-y-6">
            {schema.fields.map((field) => {
              if (field.type === "list") {
                const items = (value(field.key) as Item[]) ?? [];
                const updateItems = (next: Item[]) => setValue(field.key, next);
                return (
                  <div key={field.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">{field.label}</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateItems([...items, { ...(field.itemDefaults as Item) }])
                        }
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Item {i + 1}</span>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={i === 0}
                              onClick={() => {
                                const next = [...items];
                                [next[i - 1], next[i]] = [next[i], next[i - 1]];
                                updateItems(next);
                              }}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              disabled={i === items.length - 1}
                              onClick={() => {
                                const next = [...items];
                                [next[i + 1], next[i]] = [next[i], next[i + 1]];
                                updateItems(next);
                              }}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive"
                              onClick={() => updateItems(items.filter((_, j) => j !== i))}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        {field.itemFields?.map((f) => (
                          <div key={f.key} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{f.label}</Label>
                            {f.type === "textarea" ? (
                              <Textarea
                                rows={3}
                                value={item[f.key] ?? ""}
                                onChange={(e) => {
                                  const next = [...items];
                                  next[i] = { ...next[i], [f.key]: e.target.value };
                                  updateItems(next);
                                }}
                              />
                            ) : (
                              <Input
                                value={item[f.key] ?? ""}
                                onChange={(e) => {
                                  const next = [...items];
                                  next[i] = { ...next[i], [f.key]: e.target.value };
                                  updateItems(next);
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{field.label}</Label>
                    {block.props[field.key] !== undefined && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        onClick={() => resetField(field.key)}
                      >
                        <RotateCcw className="w-3 h-3" /> reset
                      </button>
                    )}
                  </div>
                  {field.type === "textarea" ? (
                    <Textarea
                      rows={4}
                      value={String(value(field.key) ?? "")}
                      onChange={(e) => setValue(field.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={String(value(field.key) ?? "")}
                      onChange={(e) => setValue(field.key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default BlockInspector;
