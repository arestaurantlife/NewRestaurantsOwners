import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Headphones, Video, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { merge } from "@/pagebuilder/types";
import { useGo } from "@/lib/navigate";
import { supabase } from "@/integrations/supabase/client";
import { ContentItem, PUBLIC_COLUMNS, useThumbnail } from "@/lib/content";

const CourseImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const url = useThumbnail(src);
  return url ? (
    <img
      src={url}
      alt={alt}
      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
    />
  ) : (
    <div className="w-full h-48 bg-gradient-to-br from-wine to-wine/70 flex items-center justify-center">
      <Video className="w-10 h-10 text-white/80" />
    </div>
  );
};

export const podcastsCoursesDefaults = {
  eyebrow: "Learn From The Best",
  title: "Weekly Podcasts & Video Courses",
  subtitle:
    "Get insider knowledge from successful restaurant general managers and owners who've built thriving businesses from the ground up.",
  podcastsHeading: "Featured Podcasts",
  podcastsBadge: "New Episodes Weekly",
  coursesHeading: "Premium Video Courses",
  coursesCta: "Browse All Courses",
  coursesHref: "/learn",
};

const fetchLatest = async (kind: "podcast" | "course") => {
  const { data } = await supabase
    .from("content_items")
    .select(PUBLIC_COLUMNS)
    .eq("published", true)
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(3);
  return (data ?? []) as unknown as ContentItem[];
};

const PodcastsCourses = ({ content }: { content?: Record<string, unknown> }) => {
  const c = merge(podcastsCoursesDefaults, content);
  const go = useGo();
  const [podcasts, setPodcasts] = useState<ContentItem[]>([]);
  const [courses, setCourses] = useState<ContentItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchLatest("podcast"), fetchLatest("course")]).then(([p, co]) => {
      if (cancelled) return;
      setPodcasts(p);
      setCourses(co);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || (podcasts.length === 0 && courses.length === 0)) return null;

  // Older saved layouts pointed this button at the dashboard; the library now lives at /learn.
  const coursesHref = !c.coursesHref || c.coursesHref === "/dashboard" ? "/learn" : c.coursesHref;

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-wider uppercase text-sm">
            {c.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mt-4 mb-6">
            {c.title}
          </h2>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">{c.subtitle}</p>
        </div>

        {podcasts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Headphones className="w-8 h-8 text-wine" />
              <h3 className="text-2xl font-display font-bold text-charcoal">
                {c.podcastsHeading}
              </h3>
              <span className="bg-wine/10 text-wine px-3 py-1 rounded-full text-sm font-medium">
                {c.podcastsBadge}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {podcasts.map((podcast) => (
                <Link
                  key={podcast.id}
                  to={`/learn/${podcast.slug}`}
                  className="bg-white rounded-2xl p-6 shadow-elegant hover:shadow-xl transition-all duration-300 group block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-wine to-wine/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    {podcast.access === "free" ? (
                      <span className="bg-gold text-charcoal px-2 py-0.5 rounded-full text-xs font-bold">Free</span>
                    ) : (
                      <Lock className="w-4 h-4 text-charcoal/50" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-charcoal mb-2 group-hover:text-wine transition-colors">
                    {podcast.title}
                  </h4>
                  {podcast.description && (
                    <p className="text-charcoal/60 text-sm mb-4 line-clamp-2">{podcast.description}</p>
                  )}
                  {podcast.duration && (
                    <div className="flex items-center gap-2 text-charcoal/50 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{podcast.duration}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Video className="w-8 h-8 text-wine" />
              <h3 className="text-2xl font-display font-bold text-charcoal">
                {c.coursesHeading}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/learn/${course.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-300 group block"
                >
                  <div className="relative overflow-hidden">
                    <CourseImage src={course.thumbnail} alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-xs font-bold">
                        {course.access === "free" ? "Free" : "Members"}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-wine ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-charcoal mb-2">{course.title}</h4>
                    {course.description && (
                      <p className="text-charcoal/60 text-sm mb-4 line-clamp-2">{course.description}</p>
                    )}
                    {course.duration && (
                      <div className="flex items-center gap-2 text-sm text-charcoal/50">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" onClick={() => go(coursesHref)}>
            {c.coursesCta}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PodcastsCourses;
