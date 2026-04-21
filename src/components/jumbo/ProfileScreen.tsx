import { useState } from "react";
import {
  Phone, Mail, MapPin, Globe, Bell, Moon, ChevronRight, LogOut, Award,
  Coffee, ShoppingBag, Lock, Check, IdCard, Pencil, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activity = [
  { date: "April 15", label: "Prisma Shopping", pts: 45, type: "earn" as const },
  { date: "April 12", label: "Marimekko Sale", pts: 120, type: "earn" as const },
  { date: "April 10", label: "Espresso House", pts: -50, type: "spend" as const },
];

const rewards = [
  { label: "Free Coffee", req: "500 PTS", status: "unlocked" as const, icon: Coffee },
  { label: "−20% Fashion Deal", req: "1,500 PTS", status: "progress" as const, remaining: "250 PTS to go", icon: ShoppingBag },
  { label: "VIP Parking", req: "5,000 PTS", status: "locked" as const, icon: Lock },
];

export const ProfileScreen = ({ name }: { name: string }) => {
  const [lang, setLang] = useState<"English" | "Finnish" | "Swedish">("English");
  const [langOpen, setLangOpen] = useState(false);
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);

  const points = 1250;
  const target = 1500;
  const pct = (points / target) * 100;

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up bg-background">
      {/* 1. Identity Header */}
      <header className="px-5 pt-6 pb-5 flex flex-col items-center text-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center text-white font-bold text-2xl shadow-card">
            {name.charAt(0)}
          </div>
          <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-brand-yellow flex items-center justify-center shadow-soft border-2 border-background">
            <Award className="h-3.5 w-3.5 text-foreground" />
          </span>
        </div>
        <h1 className="text-2xl font-bold mt-3">Hello, {name}!</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Silver Member since 2024</p>
      </header>

      {/* 2. Loyalty Dashboard */}
      <section className="px-5 mb-5">
        <div className="bg-card rounded-3xl p-5 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Jumbo Score</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-brand-green">{points.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground font-semibold">PTS</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold mt-2">
            <span className="text-muted-foreground">Silver</span>
            <span className="text-brand-yellow">Gold</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            <span className="font-bold text-foreground">{target - points} points</span> until your next reward!
          </p>
        </div>
      </section>

      {/* 3. Rewards Progress */}
      <section className="px-5 mb-5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">My Progress</h3>
        <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
          {rewards.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3.5">
                <span
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    r.status === "unlocked" && "bg-brand-green-soft text-brand-green",
                    r.status === "progress" && "bg-brand-yellow-soft text-foreground",
                    r.status === "locked" && "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{r.label}</p>
                  <p className="text-[11px] text-muted-foreground">{r.req}</p>
                </div>
                {r.status === "unlocked" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green bg-brand-green-soft px-2.5 py-1 rounded-full">
                    <Check className="h-3 w-3" /> Unlocked
                  </span>
                )}
                {r.status === "progress" && (
                  <span className="text-[11px] font-bold text-foreground bg-brand-yellow-soft px-2.5 py-1 rounded-full">
                    {r.remaining}
                  </span>
                )}
                {r.status === "locked" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Personal Info */}
      <section className="px-5 mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Personal Info</h3>
          <button className="text-xs font-bold text-brand-green inline-flex items-center gap-1">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="bg-card rounded-2xl shadow-soft divide-y divide-border">
          {[
            { icon: Phone, label: "Phone", value: "+358 40 123 4567" },
            { icon: Mail, label: "Email", value: "user@example.com" },
            { icon: MapPin, label: "Address", value: "Vantaantie 10, 01510 Vantaa" },
            { icon: IdCard, label: "Membership ID", value: "#JMB-998822" },
          ].map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3.5">
                <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-brand-green shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">{r.label}</p>
                  <p className="text-sm font-semibold truncate">{r.value}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Activity */}
      <section className="px-5 mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
          <button className="text-xs font-bold text-brand-green">See all</button>
        </div>
        <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{a.label}</p>
                <p className="text-[11px] text-muted-foreground">{a.date}</p>
              </div>
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  a.type === "earn" ? "text-brand-green" : "text-primary",
                )}
              >
                {a.type === "earn" ? `+${a.pts}` : `${a.pts}`} PTS
                {a.type === "spend" && <span className="text-[10px] font-semibold text-muted-foreground ml-1">(Used)</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. App Settings */}
      <section className="px-5 mb-5">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">App Settings</h3>
        <div className="bg-card rounded-2xl shadow-soft divide-y divide-border">
          {/* Language dropdown */}
          <div className="p-3.5">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="w-full flex items-center gap-3"
            >
              <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-brand-green shrink-0">
                <Globe className="h-4 w-4" />
              </span>
              <p className="flex-1 text-sm font-semibold text-left">Language</p>
              <span className="text-xs font-bold text-muted-foreground">{lang}</span>
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-smooth", langOpen && "rotate-180")}
              />
            </button>
            {langOpen && (
              <div className="mt-3 ml-12 space-y-1">
                {(["English", "Finnish", "Swedish"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={cn(
                      "w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-smooth",
                      lang === l ? "bg-brand-green text-white" : "bg-muted text-foreground",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Toggle icon={Bell} label="Notifications" value={notif} onChange={setNotif} />
          <Toggle icon={Moon} label="Dark mode" value={dark} onChange={setDark} />
        </div>
      </section>

      {/* 7. Footer */}
      <section className="px-5 flex flex-col items-center gap-2">
        <button className="inline-flex items-center justify-center gap-2 text-primary font-semibold text-sm py-2.5 px-6 rounded-xl">
          <LogOut className="h-4 w-4" /> Logout
        </button>
        <p className="text-[10px] text-muted-foreground">v.2.4.0</p>
      </section>
    </div>
  );
};

const Toggle = ({
  icon: Icon, label, value, onChange,
}: { icon: typeof Bell; label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-3 p-3.5">
    <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-brand-green">
      <Icon className="h-4 w-4" />
    </span>
    <p className="flex-1 text-sm font-semibold">{label}</p>
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "h-6 w-11 rounded-full relative transition-smooth",
        value ? "bg-brand-green" : "bg-muted",
      )}
      aria-label={label}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-soft transition-smooth",
          value ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  </div>
);
