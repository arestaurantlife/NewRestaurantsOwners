import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionStatus {
  subscribed: boolean;
  tier: string | null;
  subscriptionEnd: string | null;
  status: string | null;
  trialEnd: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionStatus;
  subscriptionLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    tier: null,
    subscriptionEnd: null,
    status: null,
    trialEnd: null,
  });
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription({ subscribed: false, tier: null, subscriptionEnd: null, status: null, trialEnd: null });
      return;
    }

    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setSubscription({ subscribed: false, tier: null, subscriptionEnd: null, status: null, trialEnd: null });
        return;
      }

      setSubscription({
        subscribed: data.subscribed ?? false,
        tier: data.tier ?? null,
        subscriptionEnd: data.subscription_end ?? null,
        status: data.status ?? null,
        trialEnd: data.trial_end ?? null,
      });
    } catch (err) {
      console.error("Failed to check subscription:", err);
      setSubscription({ subscribed: false, tier: null, subscriptionEnd: null, status: null, trialEnd: null });
    } finally {
      setSubscriptionLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session?.access_token) {
      checkSubscription();
    } else {
      setSubscription({ subscribed: false, tier: null, subscriptionEnd: null, status: null, trialEnd: null });
    }
  }, [session?.access_token, checkSubscription]);

  // Refresh subscription status when the window regains focus
  useEffect(() => {
    if (!session?.access_token) return;
    const onFocus = () => checkSubscription();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [session?.access_token, checkSubscription]);

  // Refresh after returning from checkout
  useEffect(() => {
    if (!session?.access_token) return;
    if (new URLSearchParams(window.location.search).get("checkout") === "success") {
      checkSubscription();
    }
  }, [session?.access_token, checkSubscription]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || "",
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription({ subscribed: false, tier: null, subscriptionEnd: null, status: null, trialEnd: null });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      subscription, 
      subscriptionLoading,
      signUp, 
      signIn, 
      signOut,
      checkSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
