import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  nickname: string;
  email: string;
  avatar_url: string;
  role: "admin" | "coach" | "student";
  is_active: boolean;
  approval_status: string;
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    let currentUid: string | null = null;
    const loadProfile = (uid: string) => {
      currentUid = uid;
      setProfile(null);
      setLoading(true);
      setTimeout(async () => {
        const [{ data }, { data: role }] = await Promise.all([
          supabase.from("profiles").select("id, full_name, nickname, email, avatar_url, is_active, approval_status").eq("id", uid).maybeSingle(),
          supabase.rpc("get_user_role", { _user_id: uid }),
        ]);
        if (!live || currentUid !== uid) return;
        setProfile(data && role ? { ...data, role } as Profile : null);
        setLoading(false);
      }, 0);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) loadProfile(nextSession.user.id);
      else { currentUid = null; setProfile(null); setLoading(false); }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
      else setLoading(false);
    });

    return () => { live = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("id, full_name, nickname, email, avatar_url, is_active, approval_status").eq("id", user.id).maybeSingle();
    if (data && profile) setProfile({ ...data, role: profile.role });
  };

  return (
    <Ctx.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>{children}</Ctx.Provider>
  );
}
