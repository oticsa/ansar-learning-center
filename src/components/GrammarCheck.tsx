import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SpellCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function GrammarCheck({ text, question }: { text: string; question?: string }) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!text.trim()) {
      toast.error("Write an answer first, then check it.");
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase.functions.invoke("grammar-check", {
        body: { text, question },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setFeedback((data as any).feedback);
      toast.success("Grammar check ready.");
    } catch (err: any) {
      toast.error(err?.message ?? "The grammar coach could not be reached.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3">
      <button onClick={run} disabled={busy} className="console-btn-ghost !px-4 !py-2">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <SpellCheck className="h-4 w-4" />}
        {busy ? "Checking…" : "Check grammar"}
      </button>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="console-panel mt-3 p-5"
          >
            <article className="prose-console space-y-2 text-sm leading-relaxed text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback}</ReactMarkdown>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
