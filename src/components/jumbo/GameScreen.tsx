import { useState } from "react";
import { Trophy, Coffee, Gift, Sparkles, Lock, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const stamps = [
  { id: 1, label: "Plaza", icon: Sparkles, done: true },
  { id: 2, label: "Café", icon: Coffee, done: true },
  { id: 3, label: "Fashion", icon: Gift, done: true },
  { id: 4, label: "Grocery", icon: Sparkles, done: false, current: true },
  { id: 5, label: "Reward", icon: Trophy, done: false },
];

export const GameScreen = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setResult("+50 PTS");
    }, 2200);
  };

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up">
      <header className="px-5 pt-2 pb-3">
        <p className="text-xs text-muted-foreground font-medium">Play & earn</p>
        <h1 className="text-2xl font-bold">Game Center</h1>
      </header>

      {/* Daily Adventure */}
      <section className="px-5 mb-6">
        <div className="rounded-3xl bg-card shadow-card p-5 overflow-hidden">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Daily Adventure</p>
              <h3 className="text-lg font-bold">Stamp Collection</h3>
            </div>
            <span className="text-xs font-bold bg-secondary text-primary px-2.5 py-1 rounded-full">3 / 5</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Visit zones across Jumbo to collect stamps. Win a free coffee!</p>

          {/* Path */}
          <div className="relative">
            <div className="absolute top-7 left-7 right-7 h-1 bg-secondary rounded-full" />
            <div className="absolute top-7 left-7 h-1 bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "55%" }} />
            <div className="relative flex justify-between">
              {stamps.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex flex-col items-center gap-2 w-12">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center border-[3px] transition-smooth",
                        s.done && "gradient-primary border-primary text-primary-foreground shadow-primary",
                        s.current && !s.done && "bg-accent border-accent text-accent-foreground animate-pulse-glow",
                        !s.done && !s.current && "bg-card border-border text-muted-foreground",
                      )}
                    >
                      {s.done ? <Check className="h-5 w-5" /> : s.current ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                    </div>
                    <span className="text-[10px] font-semibold text-center">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-accent-soft flex items-center gap-3">
            <Coffee className="h-5 w-5 text-accent shrink-0" />
            <p className="text-xs font-semibold text-foreground">2 stamps to go for a <span className="text-accent">free coffee</span> at Robert's!</p>
          </div>
        </div>
      </section>

      {/* Daily Spin */}
      <section className="px-5 mb-6">
        <div className="relative rounded-3xl gradient-hero p-5 overflow-hidden shadow-card">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/30 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="relative h-28 w-28 shrink-0">
              <div
                className={cn(
                  "h-full w-full rounded-full border-[6px] border-primary-foreground/90 shadow-glow",
                  spinning && "animate-spin-slow",
                )}
                style={{
                  background:
                    "conic-gradient(hsl(var(--accent)) 0 60deg, hsl(var(--gold)) 60deg 120deg, hsl(var(--primary-glow)) 120deg 180deg, hsl(var(--accent)) 180deg 240deg, hsl(var(--gold)) 240deg 300deg, hsl(var(--primary-glow)) 300deg 360deg)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-card flex items-center justify-center shadow-card">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent border-t-card" />
            </div>
            <div className="flex-1 text-primary-foreground">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-90">Daily Spin</p>
              <h3 className="text-lg font-bold leading-tight mb-1">Win bonus points</h3>
              <p className="text-xs opacity-90 mb-3">{result ? `You won ${result} 🎉` : "One free spin every day"}</p>
              <button
                onClick={spin}
                disabled={spinning}
                className="bg-card text-primary text-xs font-bold px-4 py-2 rounded-xl shadow-soft disabled:opacity-60"
              >
                {spinning ? "Spinning…" : "Spin now"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="px-5">
        <h3 className="text-base font-bold mb-3">Milestones</h3>
        <div className="space-y-2">
          {[
            { label: "5 stamps · Free coffee", icon: Coffee, done: false, progress: 60 },
            { label: "1,500 pts · Cinema ticket", icon: Trophy, done: false, progress: 83 },
            { label: "First receipt scanned", icon: Check, done: true, progress: 100 },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-card rounded-2xl p-3 flex items-center gap-3 shadow-soft">
                <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center", m.done ? "gradient-primary text-primary-foreground" : "bg-secondary text-primary")}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{m.label}</p>
                  <div className="h-1.5 bg-secondary rounded-full mt-1.5 overflow-hidden">
                    <div className={cn("h-full rounded-full", m.done ? "bg-primary" : "gradient-accent")} style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">{m.progress}%</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
