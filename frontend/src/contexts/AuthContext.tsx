import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  displayName: string;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    (user?.user_metadata?.name as string | undefined)?.trim() ||
    (user?.user_metadata?.username as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    let isMounted = true;

    const loadInitialSession = async () => {
      console.info("[AuthFlow] AuthContext init: fetching initial session");
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        console.error("Error fetching Supabase session:", error);
        console.info("[AuthFlow] Initial session fetch failed");
        setSession(null);
        setUser(null);
      } else {
        console.info("[AuthFlow] Initial session fetched", {
          hasSession: !!data.session,
          userId: data.session?.user?.id ?? null,
          emailConfirmedAt: data.session?.user?.email_confirmed_at ?? null,
        });
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    loadInitialSession();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.info("[AuthFlow] onAuthStateChange", {
        event,
        hasSession: !!newSession,
        userId: newSession?.user?.id ?? null,
        emailConfirmedAt: newSession?.user?.email_confirmed_at ?? null,
      });
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.info("[AuthFlow] logout requested");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      console.info("[AuthFlow] logout failed");
    } else {
      console.info("[AuthFlow] logout succeeded");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        displayName,
        loading,
        logout,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};