import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, Send, Loader2, CalendarClock, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Assignment = {
  id: string;
  title: string;
  description: string;
  document_url: string | null;
  due_date: string | null;
  created_at: string;
  classroom_id: string | null;
  student_id: string | null;
};

export default function Assignments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<Assignment[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: a, error: e1 }, { data: r }] = await Promise.all([
        supabase.from("assignments").select("*").order("created_at", { ascending: false }),
        supabase.from("assignment_responses").select("assignment_id").eq("student_id", user.id),
      ]);
      if (e1) toast.error("Could not load assignments.");
      setItems((a as Assignment[]) ?? []);
      setSubmittedIds(new Set((r ?? []).map((x: any) => x.assignment_id)));
      setLoading(false);
    })();
  }, [user]);

  const submit = async (a: Assignment) => {
    if (!user) return;
    const text = (responses[a.id] ?? "").trim();
    if (!text) {
      toast.error("Write your response first.");
      return;
    }
    setSavingId(a.id);
    try {
      const { error } = await supabase.from("assignment_responses").insert({
        assignment_id: a.id,
        student_id: user.id,
        response_text: text,
      });
      if (error) throw error;
      setSubmittedIds((s) => new Set(s).add(a.id));
      toast.success("Response submitted to your coach.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not submit your response.");
    } finally {
      setSavingId(null);
    }
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <button onClick={() => navigate("/dashboard")} className="console-btn-ghost !px-4 !py-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Console</span>
        </button>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h1 className="font-display text-base font-black uppercase tracking-[0.2em]">Assignments</h1>
        </div>
        <div className="w-[88px]" />
      </header>

      <main className="relative z-10 mx-auto mt-8 w-full max-w-4xl space-y-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="console-panel p-8 text-center text-muted-foreground">
            No assignments yet — your coach will post them here.
          </div>
        ) : (
          items.map((a, i) => {
            const overdue = a.due_date && new Date(a.due_date) < new Date() && !submittedIds.has(a.id);
            return (
              <motion.section
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="console-panel p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-base font-bold uppercase tracking-widest text-foreground">
                      {a.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {a.due_date && (
                      <span
                        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          overdue
                            ? "border-magenta/50 text-magenta"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <CalendarClock className="h-3 w-3" />
                        {overdue ? "Overdue · " : "Due "}
                        {fmt(a.due_date)}
                      </span>
                    )}
                    {submittedIds.has(a.id) && (
                      <span className="rounded-full border border-primary/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Submitted ✓
                      </span>
                    )}
                  </div>
                </div>

                {a.document_url && (
                  <a
                    href={a.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:underline"
                  >
                    <Paperclip className="h-3 w-3" /> Attachment
                  </a>
                )}

                {!submittedIds.has(a.id) && (
                  <div className="mt-4">
                    <textarea
                      className="field min-h-[110px]"
                      placeholder="Write your response…"
                      value={responses[a.id] ?? ""}
                      onChange={(e) => setResponses((r) => ({ ...r, [a.id]: e.target.value }))}
                    />
                    <button
                      onClick={() => submit(a)}
                      disabled={savingId === a.id}
                      className="console-btn-neon mt-3 !px-4 !py-2"
                    >
                      {savingId === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Submit response
                    </button>
                  </div>
                )}
              </motion.section>
            );
          })
        )}
      </main>
    </div>
  );
}
