import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  ThemeTokens,
  applyTheme,
  clearTheme,
  hexToHsl,
  hslToHex,
  readCssVar,
  saveTheme,
  useSiteTheme,
} from "@/pagebuilder/theme";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS: { key: keyof ThemeTokens; label: string; cssVar: string }[] = [
  { key: "wine", label: "Wine (brand)", cssVar: "--wine" },
  { key: "gold", label: "Gold (accent)", cssVar: "--gold" },
  { key: "cream", label: "Cream", cssVar: "--cream" },
  { key: "charcoal", label: "Charcoal", cssVar: "--charcoal" },
  { key: "primary", label: "Primary buttons", cssVar: "--primary" },
  { key: "background", label: "Page background", cssVar: "--background" },
  { key: "foreground", label: "Body text", cssVar: "--foreground" },
];

const FONTS = [
  "'Playfair Display', serif",
  "'Inter', sans-serif",
  "'Georgia', serif",
  "'Poppins', sans-serif",
  "'Montserrat', sans-serif",
];

/** Site-wide colors and fonts, saved as a draft/published theme. */
const ThemeEditorDialog = ({ open, onOpenChange }: Props) => {
  const { tokens, setTokens, reload } = useSiteTheme("draft");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof ThemeTokens, value: string) => {
    const next = { ...tokens, [key]: value } as ThemeTokens;
    if (!value) delete next[key];
    setTokens(next);
    applyTheme(next);
  };

  const save = async (status: "draft" | "published") => {
    setSaving(true);
    try {
      await saveTheme(status, tokens);
      if (status === "published") await saveTheme("draft", tokens);
      toast.success(status === "published" ? "Theme published" : "Theme draft saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg z-[70]">
        <DialogHeader>
          <DialogTitle>Site theme</DialogTitle>
          <DialogDescription>
            These colors and fonts apply across every page.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] pr-3">
          <div className="space-y-4">
            {COLORS.map((c) => {
              const current = (tokens[c.key] as string) || readCssVar(c.cssVar);
              return (
                <div key={c.key} className="flex items-center justify-between gap-3">
                  <Label className="text-sm">{c.label}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={c.label}
                      value={hslToHex(current)}
                      onChange={(e) => set(c.key, hexToHsl(e.target.value) ?? "")}
                      className="h-9 w-10 rounded border border-border bg-transparent p-0.5 cursor-pointer"
                    />
                    {tokens[c.key] ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const next = { ...tokens };
                          delete next[c.key];
                          setTokens(next);
                          clearTheme();
                          applyTheme(next);
                        }}
                      >
                        Reset
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div className="space-y-1.5">
              <Label className="text-sm">Heading font</Label>
              <Input
                list="heading-fonts"
                value={tokens.headingFont ?? ""}
                placeholder="'Playfair Display', serif"
                onChange={(e) => set("headingFont", e.target.value)}
              />
              <datalist id="heading-fonts">
                {FONTS.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Body font</Label>
              <Input
                list="heading-fonts"
                value={tokens.bodyFont ?? ""}
                placeholder="'Inter', sans-serif"
                onChange={(e) => set("bodyFont", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Corner roundness</Label>
              <Input
                value={tokens.radius ?? ""}
                placeholder="0.75rem"
                onChange={(e) => set("radius", e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={async () => {
              clearTheme();
              await reload();
            }}
          >
            Revert
          </Button>
          <Button variant="outline" disabled={saving} onClick={() => save("draft")}>
            Save draft
          </Button>
          <Button disabled={saving} onClick={() => save("published")}>
            Publish theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeEditorDialog;
