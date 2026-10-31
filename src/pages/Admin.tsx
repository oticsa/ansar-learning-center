import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Check, X, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";

type PendingStudent = {
  id: string;
  email: string;
  full_name: string;
  nickname: string;
  created_at: string;
};

type Notification = {
  id: string;
  subject: string;
  body: string;
  student_email: string;
  student_name: string;
  created_at: string;
  read: boolean;
};

export default function Admin() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [pending, setPending] = useState<PendingStudent[]>([]);
  const [notes, setNotes] = useState<Notification[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === "admin";

  const load = async () => {
    const [{ data: p }, { data: n }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, nickname, created_at")
        .eq("role", "student")
        .eq("is_active", false)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("registration_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    setPending((p as PendingStudent[]) ?? []);
    setNotes((n as Notification[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin]);

  const decide = async (s: PendingStudent, approve: boolean) => {
    setBusyId(s.id);
    try {
      const { error } = await supabase.rpc("decide_student_registration", { _student_id: s.id, _approve: approve });
      if (error) throw error;
      if (approve) {
        toast.success(`${s.full_name || s.email} approved — they can now sign in.`);
      } else {
        toast.success(`${s.full_name || s.email} rejected — the account stays inactive.`);
      }
      setPending((list) => list.filter((x) => x.id !== s.id));
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? "Could not update the account.");
    } finally {
      setBusyId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="console-panel max-w-md p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-magenta" />
          <h1 className="mt-4 font-display text-lg font-bold uppercase tracking-widest">
            Admins only
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This station is reserved for administrators.
          </p>
          <button onClick={() => navigate("/dashboard")} className="console-btn-ghost mt-6 !px-4 !py-2">
            <ArrowLeft className="h-4 w-4" /> Back to console
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <button onClick={() => navigate("/dashboard")} className="console-btn-ghost !px-4 !py-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Console</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="font-display text-base font-black uppercase tracking-[0.2em]">Admin</h1>
        </div>
        <div className="w-[88px]" />
      </header>

      <main className="relative z-10 mx-auto mt-8 w-full max-w-4xl space-y-8">
        <section>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
            Pending student approvals
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
            </div>
          ) : pending.length === 0 ? (
            <div className="console-panel mt-4 p-6 text-center text-sm text-muted-foreground">
              No students waiting for approval.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {pending.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="console-panel flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <p className="font-semibold text-foreground">{s.full_name || s.nickname || "New student"}</p>
                    <p className="text-sm text-muted-foreground">{s.email}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      Registered {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide(s, true)}
                      disabled={busyId === s.id}
                      className="console-btn-neon !px-4 !py-2"
                    >
                      {busyId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Approve
                    </button>
                    <button
                      onClick={() => decide(s, false)}
                      disabled={busyId === s.id}
                      className="console-btn-ghost !px-4 !py-2"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
            <Mail className="h-4 w-4" /> Registration notifications
          </h2>
          <div className="mt-4 space-y-3">
            {notes.length === 0 ? (
              <div className="console-panel p-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="console-panel p-5">
                  <p className="text-sm font-semibold text-foreground">{n.subject}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
