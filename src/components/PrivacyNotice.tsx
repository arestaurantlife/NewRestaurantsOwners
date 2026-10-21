import { cn } from "@/lib/utils";

export default function PrivacyNotice({ purchasing = false, className }: { purchasing?: boolean; className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground text-center leading-relaxed", className)}>
      By {purchasing ? "purchasing" : "continuing"}, you agree to our{" "}
      <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">Terms of Service</a> and{" "}
      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">Privacy Policy</a>.
    </p>
  );
}