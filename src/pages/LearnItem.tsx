import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, Loader2, ArrowLeft, PlayCircle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { embedUrl } from "@/pagebuilder/media";
import { ContentItem, KIND_LABEL, PUBLIC_COLUMNS, TIER_LABEL, useThumbnail } from "@/lib/content";

type Playback =
  | { state: "loading" }
  | { state: "ready"; url: string | null; type: "embed" | "file" | null }
  | { state: "locked"; reason: "signin" | "subscribe" }
  | { state: "error" };

const Player = ({ playback, poster }: { playback: Extract<Playback, { state: "ready" }>; poster?: string }) => {
  if (!playback.url) {
    return <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">No media has been added yet.</div>;
  }
  const embed = playback.type === "embed" ? embedUrl(playback.url) : null;
  if (embed) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-charcoal shadow-wine">
        <iframe src={embed} title="Player" className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  const isAudio = /\.(mp3|m4a|wav|ogg|aac)(\?|$)/i.test(playback.url);
  return isAudio ? (
    <audio src={playback.url} controls className="w-full" />
  ) : (
    <video src={playback.url} poster={poster} controls className="w-full aspect-video rounded-2xl bg-charcoal shadow-wine" />
  );
};

const LockCard = ({ reason, minTier }: { reason: "signin" | "subscribe"; minTier: string }) => (
  <div className="aspect-video rounded-2xl bg-gradient-hero flex items-center justify-center p-6 text-center">
    <div className="max-w-md">
      <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-6 h-6 text-gold" />
      </div>
      <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">Members only</h2>
      <p className="text-primary-foreground/80 mb-6">
        {reason === "signin"
          ? "Sign in or start your free trial to watch this."
          : `This requires the ${TIER_LABEL[minTier as keyof typeof TIER_LABEL] ?? "Starter"} plan or higher.`}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="hero" asChild>
          <Link to={reason === "signin" ? "/auth?mode=signup" : "/#pricing"}>Start 7-Day Free Trial</Link>
        </Button>
        {reason === "signin" && (
          <Button variant="outline" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        )}
      </div>
    </div>
  </div>
);

const LearnItem = () => {
  const { slug = "" } = useParams();
  const { session } = useAuth();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "missing">("loading");
  const [lessons, setLessons] = useState<ContentItem[]>([]);
  const [parent, setParent] = useState<ContentItem | null>(null);
  const [playback, setPlayback] = useState<Playback>({ state: "loading" });
  const poster = useThumbnail(item?.thumbnail);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setLessons([]);
    setParent(null);
    supabase
      .from("content_items")
      .select(PUBLIC_COLUMNS)
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (cancelled) return;
        const it = data as unknown as ContentItem | null;
        setItem(it);
        setStatus(it ? "found" : "missing");
        if (!it) return;
        if (it.kind === "course") {
          const { data: ls } = await supabase
            .from("content_items").select(PUBLIC_COLUMNS).eq("parent_id", it.id).eq("published", true)
            .order("sort_order", { ascending: true }).order("created_at", { ascending: true });
          if (!cancelled) setLessons((ls ?? []) as unknown as ContentItem[]);
        } else if (it.parent_id) {
          const { data: p } = await supabase.from("content_items").select(PUBLIC_COLUMNS).eq("id", it.parent_id).maybeSingle();
          if (!cancelled) setParent(p as unknown as ContentItem | null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    setPlayback({ state: "loading" });
    supabase.functions
      .invoke("get-content-url", {
        body: { slug: item.slug },
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined,
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) return setPlayback({ state: "error" });
        if (data.allowed === false) return setPlayback({ state: "locked", reason: data.reason === "signin" ? "signin" : "subscribe" });
        setPlayback({ state: "ready", url: data.url ?? null, type: data.type ?? null });
      });
    return () => {
      cancelled = true;
    };
  }, [item, session?.access_token]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }
  if (status === "missing" || !item) return <NotFound />;

  // Courses with lessons and no media of their own show the lesson list as the main content.
  const showPlayer = item.kind !== "course" || lessons.length === 0 || playback.state !== "ready" || !!playback.url;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${item.title} | NewRestaurantsOwners.com`}</title>
        {item.description ? <meta name="description" content={item.description} /> : null}
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20 max-w-5xl">
        <Link to={parent ? `/learn/${parent.slug}` : "/learn"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> {parent ? parent.title : "Learning Library"}
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider text-gold font-semibold">{KIND_LABEL[item.kind]}</span>
          {item.access === "free" ? (
            <Badge className="bg-gold text-charcoal hover:bg-gold">Free</Badge>
          ) : (
            <Badge variant="secondary" className="gap-1"><Lock className="w-3 h-3" />Members</Badge>
          )}
          {item.duration && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" />{item.duration}</span>}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">{item.title}</h1>

        {showPlayer && (
          <div className="mb-8">
            {playback.state === "loading" && <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}
            {playback.state === "error" && <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">Couldn't load this. Please try again.</div>}
            {playback.state === "locked" && <LockCard reason={playback.reason} minTier={item.min_tier} />}
            {playback.state === "ready" && <Player playback={playback} poster={poster} />}
          </div>
        )}

        {item.description && <p className="text-lg text-muted-foreground leading-relaxed mb-10 whitespace-pre-line">{item.description}</p>}

        {item.kind === "course" && (
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Lessons</h2>
            {lessons.length === 0 ? (
              <p className="text-muted-foreground">Lessons are coming soon.</p>
            ) : (
              <ol className="space-y-3">
                {lessons.map((l, i) => (
                  <li key={l.id}>
                    <Link to={`/learn/${l.slug}`} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/10 hover:border-primary/30 hover:shadow-soft transition-all">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">{i + 1}</span>
                      <span className="flex-1 font-medium text-foreground">{l.title}</span>
                      {l.duration && <span className="text-xs text-muted-foreground">{l.duration}</span>}
                      {l.access === "free" ? <Badge className="bg-gold text-charcoal hover:bg-gold">Free</Badge> : <Lock className="w-4 h-4 text-muted-foreground" />}
                      <PlayCircle className="w-5 h-5 text-primary" />
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LearnItem;
