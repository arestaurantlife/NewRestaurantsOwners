import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, Play, Headphones, Video, BookOpen, Clock, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, KIND_LABEL, PUBLIC_COLUMNS, useThumbnail } from "@/lib/content";

type Filter = "all" | "course" | "video" | "podcast";

const KindIcon = ({ kind, className }: { kind: string; className?: string }) =>
  kind === "podcast" ? <Headphones className={className} /> : kind === "course" ? <BookOpen className={className} /> : <Video className={className} />;

const ItemCard = ({ item }: { item: ContentItem }) => {
  const thumb = useThumbnail(item.thumbnail);
  return (
    <Link
      to={`/learn/${item.slug}`}
      className="group bg-card rounded-2xl overflow-hidden border border-primary/10 shadow-soft hover:shadow-wine transition-all duration-300 hover:-translate-y-1 block"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-hero">
        {thumb ? (
          <img src={thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <KindIcon kind={item.kind} className="w-10 h-10 text-primary-foreground/80" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          {item.access === "free" ? (
            <Badge className="bg-gold text-charcoal hover:bg-gold">Free</Badge>
          ) : (
            <Badge variant="secondary" className="gap-1"><Lock className="w-3 h-3" />Members</Badge>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal/30">
          <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary ml-1" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">{KIND_LABEL[item.kind]}</p>
        <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
        {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>}
        {item.duration && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />{item.duration}
          </div>
        )}
      </div>
    </Link>
  );
};

const Learn = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    supabase
      .from("content_items")
      .select(PUBLIC_COLUMNS)
      .eq("published", true)
      .in("kind", ["course", "video", "podcast"])
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data ?? []) as unknown as ContentItem[]);
        setLoading(false);
      });
  }, []);

  const shown = useMemo(() => (filter === "all" ? items : items.filter((i) => i.kind === filter)), [items, filter]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Learning Library | NewRestaurantsOwners.com</title>
        <meta name="description" content="Courses, videos and podcasts for new restaurant owners." />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-medium text-sm mb-4">Learning Library</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Courses, Videos & Podcasts</h1>
          <p className="text-lg text-muted-foreground">Learn from operators who've built profitable restaurants.</p>
        </div>

        <div className="flex justify-center mb-10">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="course">Courses</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="podcast">Podcasts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : shown.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">New content is coming soon. Check back shortly.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {shown.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
