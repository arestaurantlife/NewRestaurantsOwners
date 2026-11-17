import { useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw, TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { calculatePrimeCost, PRIME_COST_DEFAULTS, PRIME_COST_TARGET } from "@/lib/primeCost";

const dollars = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 0,
}).format(value);

function AnimatedDollars({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = value;
      setDisplay(value);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / 240);
      current.current = from + (value - from) * (1 - (1 - progress) ** 3);
      setDisplay(current.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{dollars(display)}</>;
}

function CostControl({ id, label, value, onChange, min, max, step, unit, hint }: {
  id: string; label: string; value: number; onChange: (value: number) => void;
  min: number; max: number; step: number; unit: string; hint: string;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-base font-medium">{label}</Label>
        <div className="relative w-32 shrink-0">
          <Input id={id} type="number" min={min} max={id === "monthly-sales" ? undefined : max}
            step={step} value={draft} className="pr-8 text-right tabular-nums md:text-base"
            onChange={(event) => {
              setDraft(event.target.value);
              const next = Number(event.target.value);
              if (event.target.value !== "" && Number.isFinite(next) && next >= min &&
                (id === "monthly-sales" || next <= max)) onChange(next);
            }}
            onBlur={() => {
              const next = Number(draft);
              const safe = draft !== "" && Number.isFinite(next)
                ? Math.max(min, id === "monthly-sales" ? next : Math.min(max, next)) : value;
              onChange(safe);
              setDraft(String(safe));
            }} />
          <span className="pointer-events-none absolute right-3 top-2 text-muted-foreground">{unit}</span>
        </div>
      </div>
      <Slider thumbLabel={`${label} slider`} value={[Math.min(max, value)]} min={min} max={max} step={step}
        onValueChange={([next]) => { if (next !== undefined) onChange(next); }}
        className="py-2 [&_[role=slider]]:border-gold [&_[role=slider]]:bg-gold [&_[data-orientation=horizontal]>span]:bg-gold" />
      <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{unit === "$" ? dollars(min) : `${min}%`}</span>
        <span>{unit === "$" ? `${dollars(max)}+` : `${max}%`}</span>
      </div>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

const PrimeCostCalculator = ({ pricingHref = "#pricing" }: { pricingHref?: string }) => {
  const [values, setValues] = useState({ ...PRIME_COST_DEFAULTS });
  const result = calculatePrimeCost(values.sales, values.food, values.labor);
  const status = {
    controlled: { label: "Controlled", className: "text-success bg-success/10 border-success/30" },
    moderate: { label: "Moderate gap", className: "text-accent-foreground bg-accent/20 border-accent/40" },
    critical: { label: "High cost pressure", className: "text-primary-foreground bg-primary border-primary" },
  }[result.status];
  const update = (key: keyof typeof values) => (value: number) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <section id="prime-cost-calculator" aria-labelledby="prime-cost-heading" className="bg-secondary py-20 md:py-24">
      <div className="container max-w-6xl px-4">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><Activity className="h-4 w-4" /> YOUR NUMBERS. YOUR OPPORTUNITY.</div>
          <h2 id="prime-cost-heading" className="text-3xl font-bold leading-tight md:text-4xl">Prime Cost &amp; Profit Leak Calculator</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">Food, bar, and labor costs add up fast. See how your restaurant compares to an illustrative {PRIME_COST_TARGET}% prime cost target.</p>
        </div>
        <div className="grid overflow-hidden rounded-md border border-border bg-card shadow-elevated lg:grid-cols-2">
          <div className="space-y-8 p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">Your monthly numbers</h3>
              <Button variant="ghost" size="icon" title="Reset calculator" aria-label="Reset calculator"
                onClick={() => setValues({ ...PRIME_COST_DEFAULTS })}><RotateCcw /></Button>
            </div>
            <CostControl id="monthly-sales" label="Monthly sales" value={values.sales} onChange={update("sales")}
              min={0} max={250000} step={1000} unit="$" hint="Net sales, excluding sales tax. Amounts above $250,000 can be entered." />
            <CostControl id="food-bar-percent" label="Food & bar cost" value={values.food} onChange={update("food")}
              min={22} max={45} step={0.1} unit="%" hint="Food and beverage cost as a percentage of net sales." />
            <CostControl id="labor-percent" label="Total labor cost" value={values.labor} onChange={update("labor")}
              min={22} max={45} step={0.1} unit="%" hint="Include wages, payroll taxes, and benefits." />
          </div>
          <div className="flex flex-col bg-charcoal p-5 text-primary-foreground sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-sans text-sm font-medium text-primary-foreground/75">YOUR CURRENT PRIME COST</h3>
              <span className={`rounded-sm border px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <output aria-label="Current prime cost" className="text-5xl font-semibold tabular-nums">{Number(result.primeCost.toFixed(1))}%</output>
              <span className="text-sm text-primary-foreground/70">Target: {PRIME_COST_TARGET}%</span>
            </div>
            <svg viewBox="0 0 100 12" className="mt-5 h-12 w-full" role="img" aria-label={`Food and bar ${values.food}%, labor ${values.labor}%, remaining ${Number((100 - result.primeCost).toFixed(1))}%`}>
              <rect y="3" height="6" width={values.food} className="fill-gold" />
              <rect y="3" height="6" x={values.food} width={values.labor} className="fill-wine-light" />
              <rect y="3" height="6" x={result.primeCost} width={100 - result.primeCost} className="fill-primary-foreground/20" />
              <line x1={PRIME_COST_TARGET} x2={PRIME_COST_TARGET} y1="0" y2="12" className="stroke-primary-foreground" strokeWidth="0.5" />
            </svg>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/75">
              <span className="flex items-center gap-2"><span className="h-2 w-2 bg-gold" />Food &amp; bar</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 bg-wine-light" />Labor</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 bg-primary-foreground/20" />Other costs &amp; profit</span>
            </div>
            <div className="my-7 border-t border-primary-foreground/20 pt-6">
              <p className="mb-2 flex items-center gap-2 text-sm text-primary-foreground/75"><TrendingDown className="h-4 w-4 text-gold" />Estimated annual gap above target</p>
              <output aria-label="Annual profit gap" className="block min-h-12 break-words text-4xl font-semibold text-gold tabular-nums sm:text-5xl"><AnimatedDollars value={result.annualGap} /></output>
              <p className="mt-3 text-sm text-primary-foreground/75"><output aria-label="Monthly profit gap"><AnimatedDollars value={result.monthlyGap} /></output> / month · {Number(result.gap.toFixed(1))} percentage points above target</p>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/85">A reduction of 3–5 percentage points would free up <strong className="text-gold">{dollars(result.savingsLow)}–{dollars(result.savingsHigh)}</strong> per year at your current sales. This is a scenario, not a promised result.</p>
            <Button asChild variant="hero" className="mt-6 h-auto min-h-12 whitespace-normal px-4 py-3 text-center">
              <Link to={pricingHref} onClick={(event) => {
                if (pricingHref !== "#pricing") return;
                const pricing = document.getElementById("pricing");
                if (!pricing) return;
                event.preventDefault();
                pricing.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
                window.history.replaceState(null, "", "#pricing");
              }}>Explore Membership &amp; Improve Your Prime Cost <ArrowRight /></Link>
            </Button>
          </div>
        </div>
        <p className="mt-5 max-w-4xl text-xs leading-relaxed text-muted-foreground">Prime cost = food &amp; beverage cost + total labor cost. The 58% target is an illustrative planning assumption, not a universal benchmark. Your concept, service model, and market may require a different target. Estimates are not net profit or guaranteed savings; rent, utilities, debt, and other operating expenses are not included. Your entries stay in this calculator and are not saved.</p>
      </div>
    </section>
  );
};

export default PrimeCostCalculator;