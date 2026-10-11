import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import QuestionFlow from "@/components/QuestionFlow";

type Section = { id: string; name: string; description: string; emoji: string; image_url: string | null; sort_order: number };
type Category = { id: string; slug: string; name: string; emoji: string; color: string; icon_url: string | null; section_id: string | null; sort_order: number };

export default function TalkAboutIt() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: s, error: e1 }, { data: c, error: e2 }] = await Promise.all([
        supabase.from("talk_sections").select("*").order("sort_order"),
        supabase.from("categories").select("*").order("sort_order"),
      ]);
      if (e1 || e2) toast.error("Could not load missions.");
      setSections((s as Section[]) ?? []);
      setCategories((c as Category[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (active) {
    return (
      <div className="relative min-h-screen px-4 py-8 sm:px-8">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
        <main className="relative z-10 mx-auto w-full max-w-3xl">
          <QuestionFlow categoryId={active.id} categoryName={active.name} onExit={() => setActive(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
        <button onClick={() => navigate("/dashboard")} className="console-btn-ghost !px-4 !py-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Console</span>
        </button>
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          <h1 className="font-display text-base font-black uppercase tracking-[0.2em]">Talk About It</h1>
        </div>
        <div className="w-[88px]" />
      </header>

      <main className="relative z-10 mx-auto mt-8 w-full max-w-5xl space-y-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          </div>
        ) : (
          sections.map((sec) => {
            const cats = categories.filter((c) => c.section_id === sec.id);
            if (cats.length === 0) return null;
            return (
              <section key={sec.id}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sec.emoji}</span>
                  <div>
                    <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-secondary">
                      {sec.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{sec.description}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cats.map((cat, i) => (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActive(cat)}
                      className="console-panel group p-5 text-left transition hover:neon-edge"
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon_url ? (
                          <img src={cat.icon_url} alt="" className="h-11 w-11 rounded-xl border border-border object-cover" />
                        ) : (
                          <span className="text-3xl">{cat.emoji}</span>
                        )}
                        <div>
                          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
                            {cat.name}
                          </h3>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                            Start mission →
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            );
          })
        )}
        {!loading && categories.length === 0 && (
          <div className="console-panel p-8 text-center text-muted-foreground">
            No speaking missions yet — check back soon.
          </div>
        )}
      </main>
    </div>
  );
}
