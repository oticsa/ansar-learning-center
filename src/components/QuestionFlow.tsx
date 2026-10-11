import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Send, Loader2, Lightbulb, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LessonViewer from "@/components/LessonViewer";
import GrammarCheck from "@/components/GrammarCheck";
import WordAnalyzer from "@/components/WordAnalyzer";

type Question = {
  id: string;
  question_text: string;
  image_url: string | null;
  hint_text: string | null;
  lesson_content: string | null;
  lesson_image_url: string | null;
  sort_order: number;
};

export default function QuestionFlow({
  categoryId,
  categoryName,
  onExit,
}: {
  categoryId: string;
  categoryName: string;
  onExit: () => void;
}) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, question_text, image_url, hint_text, lesson_content, lesson_image_url, sort_order")
        .eq("category_id", categoryId)
        .order("sort_order");
      if (error) toast.error("Could not load questions.");
      setQuestions((data as Question[]) ?? []);
      setLoading(false);
    })();
  }, [categoryId]);

  const q = questions[idx];

  const submit = async () => {
    if (!user || !q) return;
    if (!answer.trim()) {
      toast.error("Write your answer first.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("student_submissions").insert({
        student_id: user.id,
        category_id: categoryId,
        question_index: idx,
        question_text: q.question_text,
        response_text: answer,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Answer submitted to your coach.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not submit your answer.");
    } finally {
      setSaving(false);
    }
  };

  const next = () => {
    setIdx((i) => Math.min(i + 1, questions.length - 1));
    setAnswer("");
    setSubmitted(false);
  };
  const prev = () => {
    setIdx((i) => Math.max(i - 1, 0));
    setAnswer("");
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="console-panel p-8 text-center">
        <p className="text-muted-foreground">No questions in this mission yet.</p>
        <button onClick={onExit} className="console-btn-ghost mt-4 !px-4 !py-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="console-btn-ghost !px-4 !py-2">
          <ArrowLeft className="h-4 w-4" /> Missions
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
          {categoryName} · {idx + 1} / {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="space-y-5"
        >
          {q.lesson_content && (
            <section className="console-panel p-6">
              <h3 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <BookOpen className="h-4 w-4" /> 5-minute lesson
              </h3>
              {q.lesson_image_url && (
                <img src={q.lesson_image_url} alt="" className="mt-3 max-h-48 rounded-xl border border-border object-cover" />
              )}
              <div className="mt-3">
                <LessonViewer content={q.lesson_content} />
              </div>
            </section>
          )}

          <section className="console-panel p-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-secondary">
              Question {idx + 1}
            </h3>
            <p className="mt-3 text-lg font-semibold leading-relaxed">{q.question_text}</p>
            {q.image_url && (
              <img src={q.image_url} alt="" className="mt-3 max-h-56 rounded-xl border border-border object-cover" />
            )}
            {q.hint_text && (
              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {q.hint_text}
              </p>
            )}

            <textarea
              className="field mt-4 min-h-[140px] leading-relaxed"
              placeholder="Type your answer here…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={submit} disabled={saving || submitted} className="console-btn-neon">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitted ? "Submitted" : saving ? "Sending…" : "Submit answer"}
              </button>
              <div className="flex gap-2">
                <button onClick={prev} disabled={idx === 0} className="console-btn-ghost !px-4 !py-2">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  disabled={idx === questions.length - 1}
                  className="console-btn-ghost !px-4 !py-2"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <GrammarCheck text={answer} question={q.question_text} />
            <WordAnalyzer />
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
