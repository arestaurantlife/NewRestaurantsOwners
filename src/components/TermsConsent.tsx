import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/** Required, unchecked-by-default agreement shown next to every purchase button. */
export default function TermsConsent({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-2 text-left text-xs leading-relaxed", className)}>
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" aria-required="true" />
      <label htmlFor={id} className="cursor-pointer">
        I agree to the{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">Terms of Service</a>{" "}
        and{" "}
        <a href="/refunds" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">Refund Policy</a>.
        <span className="block opacity-80">
          See our{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">Privacy Policy</a>.
        </span>
      </label>
    </div>
  );
}
