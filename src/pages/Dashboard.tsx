import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const { user, session, loading, signOut, subscription, subscriptionLoading, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success" && session?.access_token) {
      checkSubscription();
      toast.success("Welcome aboard!", { description: "Your subscription is being activated." });
      const next = new URLSearchParams(searchParams);
      next.delete("checkout");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, session?.access_token, checkSubscription, setSearchParams]);

  const handleManageBilling = async () => {
    if (!session) return;
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error || !data?.url) throw error ?? new Error("No portal URL");
      const w = window.open(data.url, "_blank");
      if (!w || w.closed) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
      toast.error("Couldn't open billing. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Your Plan</CardTitle>
            <CardDescription>Your current membership and billing</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {(() => {
              const tierName = subscription.tier
                ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)
                : "None";
              const statusLabel = !subscription.subscribed
                ? "None"
                : subscription.status === "trialing" ? "Trial" : "Active";
              const date = subscription.status === "trialing" ? subscription.trialEnd : subscription.subscriptionEnd;
              const dateLabel = subscription.status === "trialing" ? "Trial ends" : "Renews";
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p className="font-semibold text-foreground">{subscriptionLoading && !subscription.subscribed ? "Checking..." : tierName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold text-foreground">{statusLabel}</p>
                  </div>
                  {subscription.subscribed && date && (
                    <div>
                      <p className="text-muted-foreground">{dateLabel}</p>
                      <p className="font-semibold text-foreground">{new Date(date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="flex gap-2">
              {subscription.subscribed ? (
                <Button onClick={handleManageBilling} disabled={portalLoading}>
                  {portalLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Manage Billing
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/#pricing">View Plans</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
