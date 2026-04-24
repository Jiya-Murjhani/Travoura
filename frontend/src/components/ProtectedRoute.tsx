import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.info("[AuthFlow] ProtectedRoute check", { path: location.pathname });
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.info("[AuthFlow] ProtectedRoute session result", {
        path: location.pathname,
        hasSession: !!session,
        userId: session?.user?.id ?? null,
        emailConfirmedAt: session?.user?.email_confirmed_at ?? null,
      });
      setSession(session);
      setLoading(false);
    });
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}