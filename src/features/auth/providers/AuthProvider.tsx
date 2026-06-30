"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthContext } from "../context/auth-context";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // useRef is correct here — stable instance, not a derived value
  const supabase = useRef(createSupabaseBrowserClient()).current;

  // Track if user was previously authenticated (to detect session loss)
  const hadSessionRef = useRef(false);

  useEffect(() => {
    // Fetch user (server-validated) and session in parallel
    const initAuth = async () => {
      try {
        // Fetch user (server-validated) and session in parallel
        const [{ data: userData }, { data: sessionData }] = await Promise.all([
          supabase.auth.getUser(),
          supabase.auth.getSession(),
        ]);
        setUser(userData.user);
        setSession(sessionData.session);
        hadSessionRef.current = !!userData.user;
      } catch {
        // Network error (offline) — fall back to local session so
        // user stays logged in and can use offline features
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        hadSessionRef.current = !!data.session?.user;
      }
      setLoading(false);
    };

    void initAuth();

    // Keep state in sync on login / logout / token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);

      // Redirect to login when session is lost (user was logged in before)
      const sessionLost =
        (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") &&
        !newSession &&
        hadSessionRef.current;

      if (sessionLost && pathname !== "/login") {
        hadSessionRef.current = false;
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }

      // Update tracking ref
      hadSessionRef.current = !!newSession?.user;
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, pathname]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
