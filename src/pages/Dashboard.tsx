import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Headphones, 
  FileText, 
  Palette, 
  MapPin, 
  Loader2,
  LogOut,
  User
} from "lucide-react";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      icon: BookOpen,
      title: "Courses",
      description: "Access our library of restaurant management courses",
      href: "/dashboard/courses",
      available: false,
    },
    {
      icon: Headphones,
      title: "Podcasts",
      description: "Listen to expert interviews and insights",
      href: "/dashboard/podcasts",
      available: false,
    },
    {
      icon: FileText,
      title: "Forms & Templates",
      description: "Download essential restaurant forms",
      href: "/dashboard/forms",
      available: false,
    },
    {
      icon: Palette,
      title: "Design Services",
      description: "Get professional menu and branding design",
      href: "/dashboard/design",
      available: false,
    },
    {
      icon: MapPin,
      title: "Supplier Finder",
      description: "Find trusted suppliers in your area",
      href: "/dashboard/suppliers",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-primary">NewRestaurantsOwners</span>
            <span className="text-gold font-display text-xl">.com</span>
          </a>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Access all your restaurant resources and tools in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="relative overflow-hidden">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!feature.available}
                >
                  {feature.available ? "Access" : "Coming Soon"}
                </Button>
              </CardContent>
              {!feature.available && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
