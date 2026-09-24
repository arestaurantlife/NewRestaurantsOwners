import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  User,
  DollarSign,
  Users,
  ChefHat,
  GraduationCap,
  HeartHandshake,
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
    { icon: DollarSign, title: "Financial Operations", description: "Guides and PDFs for running profitable finances", href: "/features/financial-operations", available: true },
    { icon: Users, title: "Labor Cost Management", description: "Scheduling and labor cost resources", href: "/features/labor-cost-management", available: true },
    { icon: ChefHat, title: "Food Cost Control", description: "Inventory, waste and food cost resources", href: "/features/food-cost-control", available: true },
    { icon: GraduationCap, title: "Employee Training", description: "New hire training materials", href: "/features/employee-training", available: true },
    { icon: FileText, title: "Forms & Templates", description: "Browse and download essential restaurant forms", href: "/features/essential-forms", available: true },
    { icon: HeartHandshake, title: "Community Support", description: "Connect with other restaurant owners", href: "/features/community-support", available: true },
    { icon: BookOpen, title: "Courses", description: "Access our library of restaurant management courses", href: "#", available: false },
    { icon: Headphones, title: "Podcasts", description: "Listen to expert interviews and insights", href: "#", available: false },
    { icon: Palette, title: "Design Services", description: "Get professional menu and branding design", href: "#", available: false },
    { icon: MapPin, title: "Supplier Finder", description: "Find trusted suppliers in your area", href: "#", available: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <span className="font-display text-xl font-bold text-foreground">NewRestaurantsOwners.com</span>
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
                {feature.available ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={feature.href}>Open</Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
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
