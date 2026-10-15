import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { Mail, Phone, Loader2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/siteConfig";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1, "Please enter a message").max(2000),
});

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const phoneDisplay = SITE.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    const { error } = await supabase.from("contact_submissions" as never).insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    } as never);
    setSending(false);
    if (error) {
      toast({ title: "Couldn't send your message", description: "Please try again or email us directly.", variant: "destructive" });
      return;
    }
    setSent(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | NewRestaurantsOwners.com</title>
        <meta name="description" content="Get in touch with the NewRestaurantsOwners.com team by email, phone or our contact form." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Have a question about the platform or your membership? Send us a message and our team will get back to you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground text-sm break-all">{SITE.email}</p>
                  </div>
                </a>
                <a href={`tel:${SITE.phone}`} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground text-sm">{phoneDisplay}</p>
                  </div>
                </a>
              </div>
              <div className="md:col-span-2 p-6 md:p-8 rounded-xl border border-border bg-card">
                {sent ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Message sent</h2>
                    <p className="text-muted-foreground">Thank you for reaching out. We'll reply to the email you provided.</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-5" noValidate>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={form.name} onChange={set("name")} maxLength={100} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={set("email")} maxLength={255} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject (optional)</Label>
                      <Input id="subject" value={form.subject} onChange={set("subject")} maxLength={150} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" rows={6} value={form.message} onChange={set("message")} maxLength={2000} />
                      {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                    </div>
                    <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                      {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
