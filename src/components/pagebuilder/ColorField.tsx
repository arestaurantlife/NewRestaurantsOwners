import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PRESETS = [
  { label: "Wine", value: "hsl(var(--wine))" },
  { label: "Gold", value: "hsl(var(--gold))" },
  { label: "Cream", value: "hsl(var(--cream))" },
  { label: "Charcoal", value: "hsl(var(--charcoal))" },
  { label: "White", value: "#ffffff" },
];

const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

/** Color picker that also accepts brand tokens and any CSS color string. */
const ColorField = ({ value, onChange }: Props) => {
  const [text, setText] = useState(value);

  const commit = (v: string) => {
    setText(v);
    onChange(v);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Pick a color"
          value={isHex(value) ? value : "#7b1e3c"}
          onChange={(e) => commit(e.target.value)}
          className="h-9 w-10 rounded border border-border bg-transparent p-0.5 cursor-pointer"
        />
        <Input
          value={text}
          placeholder="Default"
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onChange(text)}
          className="flex-1"
        />
        {value ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-9 w-9"
            onClick={() => commit("")}
            title="Clear"
          >
            <X className="w-4 h-4" />
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => commit(p.value)}
            className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-[11px] hover:bg-muted"
          >
            <span
              className="w-3 h-3 rounded-full border border-border"
              style={{ background: p.value }}
            />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorField;
