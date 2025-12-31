import { Play, Headphones, Video, Calendar, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const podcasts = [
  {
    title: "From Dishwasher to Owner: My 20-Year Journey",
    host: "Marcus Chen",
    role: "Owner, The Golden Dragon (3 locations)",
    duration: "45 min",
    rating: 4.9,
  },
  {
    title: "Mastering Labor Costs Without Sacrificing Quality",
    host: "Sarah Mitchell",
    role: "GM, Oceanview Restaurant Group",
    duration: "38 min",
    rating: 4.8,
  },
  {
    title: "Building a Kitchen Team That Stays",
    host: "Roberto Vasquez",
    role: "Executive Chef & Owner, Casa Bella",
    duration: "52 min",
    rating: 4.9,
  },
];

const courses = [
  {
    title: "Restaurant Financial Mastery",
    instructor: "David Thompson",
    lessons: 24,
    hours: 8,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
  },
  {
    title: "Staff Training & Retention Strategies",
    instructor: "Angela Rodriguez",
    lessons: 18,
    hours: 6,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
  },
  {
    title: "Menu Engineering for Maximum Profit",
    instructor: "Chef Michael Torres",
    lessons: 15,
    hours: 5,
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
  },
];

const PodcastsCourses = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-wider uppercase text-sm">
            Learn From The Best
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mt-4 mb-6">
            Weekly Podcasts & Video Courses
          </h2>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
            Get insider knowledge from successful restaurant general managers and owners 
            who've built thriving businesses from the ground up.
          </p>
        </div>

        {/* Podcasts Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Headphones className="w-8 h-8 text-wine" />
            <h3 className="text-2xl font-display font-bold text-charcoal">
              Featured Podcasts
            </h3>
            <span className="bg-wine/10 text-wine px-3 py-1 rounded-full text-sm font-medium">
              New Episodes Weekly
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {podcasts.map((podcast, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-elegant hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-wine to-wine/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{podcast.rating}</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-charcoal mb-2 group-hover:text-wine transition-colors">
                  {podcast.title}
                </h4>
                <p className="text-charcoal/60 text-sm mb-1">{podcast.host}</p>
                <p className="text-charcoal/50 text-xs mb-4">{podcast.role}</p>
                <div className="flex items-center gap-2 text-charcoal/50 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{podcast.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Courses Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-wine" />
            <h3 className="text-2xl font-display font-bold text-charcoal">
              Premium Video Courses
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-xs font-bold">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-wine ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-charcoal mb-2">
                    {course.title}
                  </h4>
                  <p className="text-charcoal/60 text-sm mb-4">
                    by {course.instructor}
                  </p>
                  <div className="flex items-center justify-between text-sm text-charcoal/50">
                    <span>{course.lessons} lessons</span>
                    <span>{course.hours} hours</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg">
              Browse All Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastsCourses;
