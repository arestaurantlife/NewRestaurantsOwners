import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const SubscriberRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, subscription, subscriptionLoading } = useAuth();

  useEffect(() => {
    if (!loading && !subscriptionLoading && user && !subscription.subscribed) {
      toast.error("Subscribe to access this content");
    }
  }, [loading, subscriptionLoading, user, subscription.subscribed]);

  if (loading || (user && subscriptionLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!subscription.subscribed) {
    return <Navigate to="/#pricing" replace />;
  }

  return <>{children}</>;
};

export default SubscriberRoute;
