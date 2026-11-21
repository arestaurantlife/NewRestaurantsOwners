import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, CheckCircle2, Loader2, Mail } from "lucide-react";
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

  const daysLeft = Math.max(0, Math.ceil((new Date("2026-12-15T00:00:00").getTime() - Date.now()) / 86400000));

  return <>
    <div id="waitlist" className="mt-8 max-w-2xl animate-fade-up">
      <button type="button" onClick={() => setOpen(true)} aria-label="Join the launch waiting list for 30% off your first month of Professional" className="group relative w-full text-left flex flex-col sm:flex-row items-stretch rounded-xl border border-gold/40 bg-charcoal/50 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300 hover:border-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_-5px_hsl(var(--gold)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
        <div className="flex items-center gap-3 px-5 py-4 sm:w-56 shrink-0">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 shrink-0">
            <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
            <CalendarDays className="relative w-5 h-5 text-gold" />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-gold">Dec 15, 2026</p>
            <p className="text-primary-foreground text-sm mt-0.5">{daysLeft > 0 ? <><span className="font-display text-xl text-gold">{daysLeft}</span> days to launch</> : "Launching now"}</p>
          </div>
        </div>
        <div className="relative hidden sm:block w-px my-3 border-l-2 border-dashed border-gold/40" aria-hidden="true" />
        <div className="sm:hidden mx-5 border-t-2 border-dashed border-gold/40" aria-hidden="true" />
        <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-gold">Launching December 15, 2026</p>
            <p className="text-sm text-primary-foreground/90 mt-1">Join for <span className="font-semibold text-gold">30% off</span> your first month of Professional.</p>
          </div>
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm font-semibold text-gold whitespace-nowrap transition-colors group-hover:bg-gold group-hover:text-charcoal">
            Join the waiting list <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
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