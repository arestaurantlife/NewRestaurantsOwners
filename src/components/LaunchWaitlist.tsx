import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Crown, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import PrivacyNotice from "@/components/PrivacyNotice";
import { supabase } from "@/integrations/supabase/client";
import { WAITLIST_CONSENT, waitlistSchema } from "@/lib/waitlist";

export default function LaunchWaitlist() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const check = () => { if (window.location.hash === "#waitlist") setOpen(true); };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = waitlistSchema.safeParse({ name, email, marketingConsent: consent, website });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Please check your information."); return; }
    setError(""); setSending(true);
    try {
      const { data, error: failure } = await supabase.functions.invoke("submit-waitlist", { body: parsed.data });
      if (failure || !data?.ok) throw new Error("Signup failed");
      setSent(true); setName(""); setEmail("");
    } catch { setError("We couldn’t save your signup. Please try again shortly."); }
    finally { setSending(false); }
  };

  return <>
    <div id="waitlist" className="mt-8 max-w-2xl animate-fade-up">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Join the launch waiting list for 30% off your first month of Professional"
        className="group relative isolate w-full overflow-hidden rounded-2xl border border-gold/40 bg-charcoal/45 p-5 text-left shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-gold/80 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:p-6"
      >
        <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-90" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-gold/10 via-transparent to-wine/20 opacity-80" />
        <span aria-hidden="true" className="absolute -inset-y-8 -left-1/2 -z-10 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-gold/15 to-transparent blur-md transition-transform duration-1000 ease-out group-hover:translate-x-[450%] group-focus-visible:translate-x-[450%] motion-reduce:transition-none" />

        <span className="flex items-center justify-between gap-4 border-b border-gold/20 pb-4">
          <span className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 shadow-gold">
              <Crown className="h-4 w-4 text-gold" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-gold sm:text-[11px]">NRO · Private launch invitation</span>
              <span className="mt-1 block text-xs text-primary-foreground/60">An exclusive first-month offer</span>
            </span>
          </span>
          <span className="hidden rounded-full border border-gold/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold sm:block">15 · 12 · 2026</span>
        </span>

        <span className="flex flex-col gap-5 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <span className="max-w-md">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Launching December 15, 2026</span>
            <span className="mt-2 block font-display text-2xl leading-snug text-primary-foreground">Join for <span className="text-gradient-gold">30% off</span> your first month of Professional.</span>
          </span>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/60 bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal shadow-gold transition-all duration-300 group-hover:bg-gold-light group-focus-visible:bg-gold-light">
            Join the waiting list
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
        </span>
      </button>
    </div>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-lg border-gold/30 p-6 sm:p-8">
        {sent ? <div className="py-8 text-center space-y-4" role="status">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <DialogTitle className="font-display text-3xl">You’re on the list.</DialogTitle>
          <DialogDescription>Your email is on our launch waiting list for December 15, 2026 and the 30% first-month Professional offer. Thank you for joining New Restaurants Owners.</DialogDescription>
          <Button variant="outline" onClick={() => setOpen(false)}>Back to NRO</Button>
        </div> : <>
          <div className="flex items-center gap-2 text-primary text-xs uppercase font-semibold"><Mail className="w-4 h-4" /> NRO · Launch waiting list</div>
          <DialogTitle className="font-display text-3xl leading-tight text-foreground">Your next chapter starts here.</DialogTitle>
          <DialogDescription className="leading-relaxed">New Restaurants Owners launches December 15, 2026. Join for 30% off your first month of Professional. The discount applies to your first month only.</DialogDescription>
          <form onSubmit={submit} className="space-y-4 mt-2" noValidate>
            <div className="space-y-2"><Label htmlFor="waitlist-name">Your name</Label><Input id="waitlist-name" autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="waitlist-email">Email address</Label><Input id="waitlist-email" type="email" autoComplete="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="hidden" aria-hidden="true"><label htmlFor="waitlist-website">Website</label><input id="waitlist-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></div>
            <div className="flex items-start gap-3"><Checkbox id="waitlist-consent" checked={consent} onCheckedChange={value => setConsent(value === true)} className="mt-1 shrink-0" /><Label htmlFor="waitlist-consent" className="text-xs leading-relaxed font-normal">{WAITLIST_CONSENT}</Label></div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button className="w-full gap-2" type="submit" disabled={sending}>{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}{sending ? "Joining…" : "Join the waiting list"}</Button>
            <PrivacyNotice />
          </form>
        </>}
      </DialogContent>
    </Dialog>
  </>;
}