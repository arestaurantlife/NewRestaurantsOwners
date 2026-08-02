import { useState } from "react";
import { Block, BlockDesign, FieldSchema, ItemFieldSchema } from "@/pagebuilder/types";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import MediaField from "./MediaField";
import LinkPicker from "./LinkPicker";
import ColorField from "./ColorField";

interface Props {
  block: Block | null;
  onClose: () => void;
  onChange: (props: Record<string, unknown>) => void;
  onDesignChange: (design: BlockDesign) => void;
}

type Item = Record<string, string>;

const PADDINGS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra large" },
];

const ALIGNS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

/** One editor input for any field type (used for both block fields and list items). */
const FieldInput = ({
  field,
  value,
  onChange,
}: {
  field: FieldSchema | ItemFieldSchema;
  value: string;
  onChange: (v: string) => void;
}) => {
  switch (field.type) {
    case "textarea":
      return <Textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} />;
    case "richtext":
      return (
        <>
          <Textarea
            rows={6}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Tip: you can also click the text on the page and type directly.
          </p>
        </>
      );
    case "image":
      return <MediaField kind="image" value={value} onChange={onChange} />;
    case "video":
      return <MediaField kind="video" value={value} onChange={onChange} allowUrl />;
    case "pdf":
      return <MediaField kind="pdf" value={value} onChange={onChange} />;
    case "link":
      return <LinkPicker value={value} onChange={onChange} />;
    case "color":
      return <ColorField value={value} onChange={onChange} />;
    case "select":
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent className="z-[80]">
            {(field as FieldSchema).options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
  }
};

const BlockInspector = ({ block, onClose, onChange, onDesignChange }: Props) => {
  const [tab, setTab] = useState("content");
  if (!block) return null;
  const schema = SECTIONS[block.type];
  if (!schema) return null;

  const design = block.design ?? {};

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

  const setDesign = (key: keyof BlockDesign, v: unknown) => {
    const next = { ...design } as Record<string, unknown>;
    if (v === "" || v === undefined) delete next[key];
    else next[key] = v;
    onDesignChange(next as BlockDesign);
  };

  return (
    <Sheet open={!!block} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-3">
          <SheetTitle>Edit {schema.label}</SheetTitle>
          <SheetDescription>Changes are saved to your draft.</SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="flex-1 min-h-0 mt-3">
            <ScrollArea className="h-full px-6 pb-10">
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
                                <FieldInput
                                  field={f}
                                  value={item[f.key] ?? ""}
                                  onChange={(v) => {
                                    const next = [...items];
                                    next[i] = { ...next[i], [f.key]: v };
                                    updateItems(next);
                                  }}
                                />
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
                      <FieldInput
                        field={field}
                        value={String(value(field.key) ?? "")}
                        onChange={(v) => setValue(field.key, v)}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="design" className="flex-1 min-h-0 mt-3">
            <ScrollArea className="h-full px-6 pb-10">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm">Background color</Label>
                  <ColorField value={design.background ?? ""} onChange={(v) => setDesign("background", v)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Heading color</Label>
                  <ColorField value={design.heading ?? ""} onChange={(v) => setDesign("heading", v)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Body text color</Label>
                  <ColorField value={design.text ?? ""} onChange={(v) => setDesign("text", v)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Vertical spacing</Label>
                  <Select
                    value={design.padding ?? ""}
                    onValueChange={(v) => setDesign("padding", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Section default" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      {PADDINGS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Text alignment</Label>
                  <Select value={design.align ?? ""} onValueChange={(v) => setDesign("align", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Section default" />
                    </SelectTrigger>
                    <SelectContent className="z-[80]">
                      {ALIGNS.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onDesignChange({})}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset design
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default BlockInspector;
