import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Sparkles,
  Printer,
  Download,
  Loader2,
  PenTool,
  Save,
} from "lucide-react";
import { TOPIC_PACKS } from "@/data/ieltsTopics";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function WriterSpider() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [packId, setPackId] = useState(TOPIC_PACKS[0].id);
  const [topic, setTopic] = useState("");
  const [custom, setCustom] = useState(false);
  const [essay, setEssay] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const pack = TOPIC_PACKS.find((p) => p.id === packId) ?? TOPIC_PACKS[0];
  const taskType = custom ? "task2" : pack.task;

  const words = useMemo(
    () => essay.trim().split(/\s+/).filter(Boolean).length,
    [essay],
  );
  const target = taskType === "task1" ? 150 : 250;

  const runReview = async () => {
    if (words < 20) {
      toast.error("Write at least 20 words before requesting a review.");
      return;
    }
    setBusy(true);
    setReview(null);
    setBand(null);
    try {
      const { data, error } = await supabase.functions.invoke("writer-spider-review", {
        body: { topic, taskType, essay },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setReview((data as any).review);
      setBand((data as any).band ?? null);
      toast.success("Review ready.");
    } catch (err: any) {
      toast.error(err?.message ?? "The reviewer could not be reached.");
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("writer_essays").insert({
        user_id: user.id,
        topic: topic || "(untitled)",
        task_type: taskType,
        content: essay,
        review,
        band_estimate: band,
        word_count: words,
      });
      if (error) throw error;
      toast.success("Draft saved to your library.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save the draft.");
    } finally {
      setSaving(false);
    }
  };

  const downloadReport = () => {
    const body = `ANSAR LEARNING CENTER — WRITER SPIDER\n\nTOPIC: ${topic || "(not provided)"}\nTASK: ${
      taskType === "task1" ? "Task 1" : "Task 2"
    }\nWORDS: ${words}\n\n--- ESSAY ---\n\n${essay}\n\n--- REVIEW ---\n\n${review ?? "(no review yet)"}\n`;
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "writer-spider-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40 no-print" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-3 no-print">
        <button onClick={() => navigate("/dashboard")} className="console-btn-ghost !px-4 !py-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Console</span>
        </button>
        <div className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-secondary" />
          <h1 className="font-display text-base font-black uppercase tracking-[0.2em]">
            Writer Spider
          </h1>
        </div>
        <div className="w-[88px]" />
      </header>

      <main className="relative z-10 mx-auto mt-8 w-full max-w-5xl space-y-6">
        {/* Topic selection */}
        <section className="console-panel p-6 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
              1 · Choose a topic
            </h2>
            <button
              type="button"
              onClick={() => setCustom((c) => !c)}
              className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
            >
              {custom ? "Use topic bank" : "Write my own topic"}
            </button>
          </div>

          {custom ? (
            <textarea
              className="field mt-4 min-h-[90px]"
              placeholder="Type your own IELTS-style question or topic…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {TOPIC_PACKS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPackId(p.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                      p.id === packId
                        ? "border-secondary bg-secondary/15 text-secondary"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="mr-1">{p.emoji}</span>
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {pack.prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTopic(p)}
                    className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      topic === p
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Writing studio */}
        <section className="console-panel p-6 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
              2 · Write
            </h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {words} words ·{" "}
              <span className={words >= target ? "text-primary" : "text-muted-foreground"}>
                target {target}+
              </span>
            </p>
          </div>

          <textarea
            className="field mt-4 min-h-[340px] leading-relaxed"
            placeholder="Start your essay here. Plan, argue, and give examples…"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={runReview} disabled={busy} className="console-btn-neon">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {busy ? "Reviewing…" : "Review my writing"}
            </button>
            <button onClick={saveDraft} disabled={saving || !essay.trim()} className="console-btn-ghost">
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save draft"}
            </button>
          </div>
        </section>

        {/* Review */}
        <AnimatePresence>
          {review && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="console-panel p-6 print-area"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
                  3 · Examiner report {band && <span className="text-primary">· Band {band}</span>}
                </h2>
                <div className="flex gap-2 no-print">
                  <button onClick={() => window.print()} className="console-btn-ghost !px-4 !py-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button onClick={downloadReport} className="console-btn-ghost !px-4 !py-2">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              <article className="prose-console mt-5 space-y-3 text-sm leading-relaxed text-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{review}</ReactMarkdown>
              </article>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
