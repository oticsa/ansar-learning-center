import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PenTool, Mic, BookOpen, ClipboardList, LogOut, Orbit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Station = {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof PenTool;
  accent: string;
  route?: string;
  locked?: boolean;
};

const STATIONS: Station[] = [
  {
    id: "writer",
    title: "Writer Spider",
    subtitle: "IELTS essay studio + AI review",
    icon: PenTool,
    accent: "secondary",
    route: "/writer-spider",
  },
  {
    id: "talk",
    title: "Talk About It",
    subtitle: "Speaking missions & lessons",
    icon: Mic,
    accent: "primary",
    locked: true,
  },
  {
    id: "books",
    title: "E-Books",
    subtitle: "Read, answer, level up",
    icon: BookOpen,
    accent: "accent",
    locked: true,
  },
  {
    id: "assignments",
    title: "Assignments",
    subtitle: "Tasks from your coach",
    icon: ClipboardList,
    accent: "primary",
    locked: true,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();

  const name = profile?.nickname || profile?.full_name || user?.email?.split("@")[0] || "Explorer";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 rotate-45 items-center justify-center rounded-xl border border-secondary/60 bg-card/80 neon-edge">
            <Orbit className="h-6 w-6 -rotate-45 text-secondary" strokeWidth={1.6} />
          </div>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-secondary">
              Learning Console
            </p>
            <h1 className="text-lg font-black uppercase tracking-widest">Ansar Learning</h1>
          </div>
        </div>

        <button onClick={signOut} className="console-btn-ghost !px-4 !py-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </header>

      <section className="relative z-10 mx-auto mt-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="console-panel p-6"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Player</p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-wide text-foreground">
            {name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a station to begin your mission.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {STATIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 24, rotateX: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.45 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                disabled={s.locked}
                onClick={() => s.route && navigate(s.route)}
                className={`console-panel group relative overflow-hidden p-6 text-left transition ${
                  s.locked ? "opacity-55" : "hover:neon-edge"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 rotate-45 items-center justify-center rounded-2xl border border-${s.accent}/50 bg-${s.accent}/10`}
                  >
                    <Icon className={`h-6 w-6 -rotate-45 text-${s.accent}`} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-widest text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.subtitle}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                      {s.locked ? "Coming soon" : "Enter →"}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
