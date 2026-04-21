import { useState } from "react";
import { Trophy, Coffee, Gift, Check, Lock, Star, Zap, ShoppingCart, Share2, MapPin, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Level = {
  id: number;
  label: string;
  color: "red" | "green" | "yellow" | "blue";
  reward?: string;
  isChest?: boolean;
};

const levels: Level[] = [
  { id: 1, label: "Start", color: "green" },
  { id: 2, label: "Lvl 2", color: "yellow" },
  { id: 3, label: "Lvl 3", color: "blue" },
  { id: 4, label: "Chest", color: "yellow", isChest: true, reward: "+50 PTS" },
  { id: 5, label: "Lvl 5", color: "red" },
  { id: 6, label: "Lvl 6", color: "green" },
  { id: 7, label: "Coffee", color: "yellow", isChest: true, reward: "Free coffee" },
  { id: 8, label: "Lvl 8", color: "blue" },
  { id: 9, label: "Lvl 9", color: "red" },
  { id: 10, label: "Grand", color: "yellow", isChest: true, reward: "200€ Gift Card" },
];

const colorMap = {
  red: { bg: "bg-primary", text: "text-primary-foreground", soft: "bg-primary-soft text-primary", ring: "ring-primary" },
  green: { bg: "bg-brand-green", text: "text-white", soft: "bg-brand-green-soft text-brand-green", ring: "ring-brand-green" },
  yellow: { bg: "bg-brand-yellow", text: "text-foreground", soft: "bg-brand-yellow-soft text-foreground", ring: "ring-brand-yellow" },
  blue: { bg: "bg-brand-blue", text: "text-white", soft: "bg-brand-blue-soft text-brand-blue", ring: "ring-brand-blue" },
} as const;

type Quest = {
  id: number;
  title: string;
  desc: string;
  xp: number;
  icon: typeof ShoppingCart;
  color: "red" | "green" | "yellow" | "blue";
  progress: number;
  total: number;
};

const initialQuests: Quest[] = [
  { id: 1, title: "Visit Citymarket", desc: "Visit Citymarket and scan the QR", xp: 10, icon: ShoppingCart, color: "green", progress: 1, total: 1 },
  { id: 2, title: "Share a deal", desc: "Share a deal with a friend", xp: 20, icon: Share2, color: "blue", progress: 0, total: 1 },
  { id: 3, title: "Coffee break", desc: "Buy any coffee today", xp: 50, icon: Coffee, color: "red", progress: 0, total: 1 },
  { id: 4, title: "Mall explorer", desc: "Visit 3 different floors", xp: 30, icon: MapPin, color: "yellow", progress: 2, total: 3 },
];

export const GameScreen = () => {
  const currentLevel = 4;
  const xp = 3450;
  const xpTarget = 5000;

  const [quests, setQuests] = useState(initialQuests);
  const [openLevel, setOpenLevel] = useState<Level | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const completeQuest = (id: number) => {
    const q = quests.find((x) => x.id === id);
    if (!q || q.progress >= q.total) return;
    setQuests((prev) =>
      prev.map((x) => (x.id === id ? { ...x, progress: Math.min(x.total, x.progress + 1) } : x)),
    );
    setToast(`+${q.xp} XP — ${q.title}!`);
    setTimeout(() => setToast(null), 1800);
  };

  const spin = () => {
    if (spinning) return;
    setSpinResult(null);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      const prizes = ["+50 PTS", "+100 PTS", "Free coffee", "+20 PTS"];
      setSpinResult(prizes[Math.floor(Math.random() * prizes.length)]);
    }, 2200);
  };

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up bg-gradient-to-b from-brand-blue-soft via-background to-background">
      {/* Header with XP bar */}
      <header className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Quest board</p>
            <h1 className="text-2xl font-bold">Level {currentLevel} / 20</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-brand-yellow text-foreground px-3 py-1.5 rounded-full shadow-soft">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold">{xp.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-green via-brand-yellow to-primary transition-all duration-700"
            style={{ width: `${(xp / xpTarget) * 100}%` }}
          />
        </div>
      </header>

      {/* Level path board */}
      <section className="px-5 mb-5">
        <div className="relative rounded-3xl bg-card shadow-card p-5 overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-brand-yellow/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-brand-blue/20 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1">Adventure Map</p>
            <h3 className="text-base font-bold mb-4">Tap a level to play</h3>

            {/* Snake path of levels */}
            <div className="grid grid-cols-4 gap-3">
              {levels.map((lvl, idx) => {
                const row = Math.floor(idx / 4);
                const isReversed = row % 2 === 1;
                const visualIdx = isReversed ? 3 - (idx % 4) : idx % 4;
                const c = colorMap[lvl.color];
                const isDone = lvl.id < currentLevel;
                const isCurrent = lvl.id === currentLevel;
                const isLocked = lvl.id > currentLevel;

                return (
                  <button
                    key={lvl.id}
                    onClick={() => setOpenLevel(lvl)}
                    style={{ order: row * 4 + visualIdx }}
                    className="relative flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center font-bold text-sm border-[3px] border-card transition-smooth shadow-soft",
                        isDone && `${c.bg} ${c.text}`,
                        isCurrent && `${c.bg} ${c.text} ring-4 ${c.ring}/30 animate-pulse-glow scale-110`,
                        isLocked && "bg-muted text-muted-foreground",
                        lvl.isChest && !isLocked && "rounded-2xl",
                      )}
                    >
                      {isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : lvl.isChest ? (
                        <Gift className="h-5 w-5" />
                      ) : isDone ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        lvl.id
                      )}
                    </div>
                    <span className="text-[9px] font-semibold text-center leading-tight max-w-[52px] truncate">
                      {lvl.label}
                    </span>
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping-pin" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grand prize teaser */}
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-green p-4 flex items-center gap-3 text-white">
              <div className="h-12 w-12 rounded-2xl bg-brand-yellow flex items-center justify-center shrink-0 shadow-glow">
                <Trophy className="h-6 w-6 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">Grand Prize</p>
                <p className="text-sm font-bold leading-tight">200€ Jumbo Gift Card</p>
                <p className="text-[11px] opacity-90">Reach Level 20 to win</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Quests */}
      <section className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold">Active Quests</h3>
          <span className="text-[11px] font-bold text-muted-foreground">
            {quests.filter((q) => q.progress >= q.total).length} / {quests.length} done
          </span>
        </div>
        <div className="space-y-2">
          {quests.map((q) => {
            const Icon = q.icon;
            const c = colorMap[q.color];
            const done = q.progress >= q.total;
            return (
              <div key={q.id} className="bg-card rounded-2xl p-3 flex items-center gap-3 shadow-soft">
                <span className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", c.bg, c.text)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide truncate">{q.title}</p>
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0", c.soft)}>
                      +{q.xp} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{q.desc}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", c.bg)}
                        style={{ width: `${(q.progress / q.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                      {q.progress}/{q.total}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => completeQuest(q.id)}
                  disabled={done}
                  className={cn(
                    "shrink-0 text-[11px] font-bold px-3 py-2 rounded-xl transition-smooth",
                    done
                      ? "bg-brand-green-soft text-brand-green"
                      : "bg-foreground text-background active:scale-95",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : "Do it"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Spin */}
      <section className="px-5">
        <div className="relative rounded-3xl bg-card shadow-card p-5 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0">
              <div
                className={cn(
                  "h-full w-full rounded-full border-[5px] border-card shadow-soft",
                  spinning && "animate-spin-slow",
                )}
                style={{
                  background:
                    "conic-gradient(hsl(var(--primary)) 0 90deg, hsl(var(--brand-yellow)) 90deg 180deg, hsl(var(--brand-green)) 180deg 270deg, hsl(var(--brand-blue)) 270deg 360deg)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-7 w-7 rounded-full bg-card flex items-center justify-center shadow-card">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[12px] border-l-transparent border-r-transparent border-t-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">Daily Spin</p>
              <h3 className="text-base font-bold leading-tight mb-0.5">Win bonus prizes</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {spinResult ? `🎉 You won ${spinResult}!` : "One free spin every day"}
              </p>
              <button
                onClick={spin}
                disabled={spinning}
                className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-soft disabled:opacity-60 active:scale-95 transition-smooth"
              >
                {spinning ? "Spinning…" : spinResult ? "Spin tomorrow" : "Spin now"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Level detail sheet */}
      {openLevel && (
        <div
          className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end animate-slide-up"
          onClick={() => setOpenLevel(null)}
        >
          <div
            className="w-full bg-card rounded-t-3xl p-5 pb-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center font-bold",
                    colorMap[openLevel.color].bg,
                    colorMap[openLevel.color].text,
                  )}
                >
                  {openLevel.isChest ? <Gift className="h-5 w-5" /> : openLevel.id}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Level {openLevel.id}
                  </p>
                  <h3 className="text-lg font-bold">{openLevel.label}</h3>
                </div>
              </div>
              <button
                onClick={() => setOpenLevel(null)}
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {openLevel.id < currentLevel ? (
              <div className="rounded-2xl bg-brand-green-soft text-brand-green p-3 flex items-center gap-2 mb-2">
                <Check className="h-4 w-4" /> <span className="text-xs font-bold">Already completed</span>
              </div>
            ) : openLevel.id === currentLevel ? (
              <div className="rounded-2xl bg-brand-yellow-soft text-foreground p-3 flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-brand-yellow" />
                <span className="text-xs font-bold">You are here! Complete a quest to advance.</span>
              </div>
            ) : (
              <div className="rounded-2xl bg-secondary text-muted-foreground p-3 flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" /> <span className="text-xs font-bold">Reach this level to unlock</span>
              </div>
            )}
            {openLevel.reward && (
              <div className="rounded-2xl bg-primary-soft text-primary p-3 flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span className="text-xs font-bold">Reward: {openLevel.reward}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* XP toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-xs font-bold px-4 py-2 rounded-full shadow-card animate-slide-up">
          {toast}
        </div>
      )}
    </div>
  );
};
