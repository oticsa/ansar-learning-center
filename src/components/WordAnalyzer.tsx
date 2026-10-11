import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookA, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function WordAnalyzer() {
  const [word, setWord] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!word.trim()) {
      toast.error("Type a word first.");
      return;
    }
    setBusy(true);
    setAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-word", {
        body: { word: word.trim() },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalysis((data as any).analysis);
    } catch (err: any) {
      toast.error(err?.message ?? "The word analyzer could not be reached.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="field !w-auto flex-1 min-w-[160px] !py-2"
          placeholder="Type a word to analyze…"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
        />
        <button onClick={run} disabled={busy} className="console-btn-ghost !px-4 !py-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookA className="h-4 w-4" />}
          {busy ? "Analyzing…" : "Analyze word"}
        </button>
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="console-panel mt-3 p-5"
          >
            <article className="prose-console space-y-2 text-sm leading-relaxed text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
