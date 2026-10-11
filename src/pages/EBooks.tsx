import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BookOpen, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LessonViewer from "@/components/LessonViewer";

type Book = { id: string; title: string; description: string; cover_url: string | null; external_url: string | null; category_id: string | null };
type Chapter = { id: string; book_id: string; chapter_number: number; title: string; content: string; image_url: string | null };
type ChapterQuestion = { id: string; chapter_id: string; question_text: string; sort_order: number };

export default function EBooks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<ChapterQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, description, cover_url, external_url, category_id")
        .is("deleted_at", null)
        .order("created_at");
      if (error) toast.error("Could not load the library.");
      setBooks((data as Book[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const openBook = async (b: Book) => {
    setBook(b);
    const { data } = await supabase
      .from("book_chapters")
      .select("*")
      .eq("book_id", b.id)
      .order("chapter_number");
    setChapters((data as Chapter[]) ?? []);
  };

  const openChapter = async (ch: Chapter) => {
    setChapter(ch);
    const { data } = await supabase
      .from("chapter_questions")
      .select("*")
      .eq("chapter_id", ch.id)
      .order("sort_order");
    setQuestions((data as ChapterQuestion[]) ?? []);
    setAnswers({});
    setDoneIds(new Set());
  };

  const submitAnswer = async (q: ChapterQuestion) => {
    if (!user) return;
    const text = (answers[q.id] ?? "").trim();
    if (!text) {
      toast.error("Write your answer first.");
      return;
    }
    setSavingId(q.id);
    try {
      const { error } = await supabase.from("student_chapter_answers").insert({
        question_id: q.id,
        student_id: user.id,
        answer_text: text,
      });
      if (error) throw error;
      setDoneIds((s) => new Set(s).add(q.id));
      toast.success("Answer saved.");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save your answer.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <button
          onClick={() => (chapter ? setChapter(null) : book ? setBook(null) : navigate("/dashboard"))}
          className="console-btn-ghost !px-4 !py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{chapter ? "Chapters" : book ? "Library" : "Console"}</span>
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          <h1 className="font-display text-base font-black uppercase tracking-[0.2em]">
            {chapter ? chapter.title : book ? book.title : "E-Books"}
          </h1>
        </div>
        <div className="w-[88px]" />
      </header>

      <main className="relative z-10 mx-auto mt-8 w-full max-w-5xl">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          </div>
        ) : chapter ? (
          <div className="space-y-6">
            <section className="console-panel p-6">
              {chapter.image_url && (
                <img src={chapter.image_url} alt="" className="mb-4 max-h-64 w-full rounded-xl border border-border object-cover" />
              )}
              <LessonViewer content={chapter.content} />
            </section>

            {questions.length > 0 && (
              <section className="console-panel p-6">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
                  Chapter questions
                </h2>
                <div className="mt-4 space-y-5">
                  {questions.map((q, i) => (
                    <div key={q.id} className="rounded-xl border border-border bg-muted/20 p-4">
                      <p className="text-sm font-semibold">
                        {i + 1}. {q.question_text}
                      </p>
                      <textarea
                        className="field mt-3 min-h-[90px]"
                        placeholder="Your answer…"
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => submitAnswer(q)}
                        disabled={savingId === q.id || doneIds.has(q.id)}
                        className="console-btn-neon mt-3 !px-4 !py-2"
                      >
                        {savingId === q.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {doneIds.has(q.id) ? "Saved" : "Save answer"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : book ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {chapters.map((ch, i) => (
              <motion.button
                key={ch.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ y: -4 }}
                onClick={() => openChapter(ch)}
                className="console-panel p-5 text-left transition hover:neon-edge"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                  Chapter {ch.chapter_number}
                </p>
                <h3 className="mt-1 font-display text-base font-bold uppercase tracking-widest text-foreground">
                  {ch.title}
                </h3>
                <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                  Read <ArrowRight className="h-3 w-3" />
                </p>
              </motion.button>
            ))}
            {chapters.length === 0 && (
              <div className="console-panel p-8 text-center text-muted-foreground sm:col-span-2">
                No chapters yet.
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {books.map((b, i) => (
                <motion.button
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  whileHover={{ y: -6 }}
                  onClick={() => openBook(b)}
                  className="console-panel overflow-hidden text-left transition hover:neon-edge"
                >
                  {b.cover_url ? (
                    <img src={b.cover_url} alt="" className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-muted/30 text-5xl">📖</div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                      {b.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                      Open book →
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {books.length === 0 && (
              <div className="console-panel p-8 text-center text-muted-foreground sm:col-span-2 lg:col-span-3">
                The library is empty — check back soon.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
