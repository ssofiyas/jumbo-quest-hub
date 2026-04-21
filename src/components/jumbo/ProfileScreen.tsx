import { useState } from "react";
import {
  Settings, Phone, Mail, MapPin, Globe, Bell, Moon, ChevronRight, ChevronDown,
  ArrowUp, ArrowDown, LogOut, Award, IdCard, Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activity = [
  { type: "earn", label: "Marimekko purchase", date: "Today · 14:22", pts: "+85" },
  { type: "earn", label: "Receipt scanned · Prisma", date: "Yesterday", pts: "+24" },
  { type: "spend", label: "Free coffee redeemed", date: "Apr 18", pts: "−500" },
  { type: "earn", label: "Daily spin reward", date: "Apr 17", pts: "+50" },
];

export const ProfileScreen = ({ name }: { name: string }) => {
  const [lang, setLang] = useState<"English" | "Finnish" | "Swedish">("English");
  const [langOpen, setLangOpen] = useState(false);
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up">
      {/* Hero header */}
      <div className="relative gradient-hero pt-2 pb-10 px-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/90">My Profile</p>
          <button className="h-10 w-10 rounded-full bg-primary-foreground/15 backdrop-blur flex items-center justify-center text-primary-foreground">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <div className="h-16 w-16 rounded-full bg-gradient-gold flex items-center justify-center text-foreground font-bold text-xl shadow-glow">
            {name.charAt(0)}
          </div>
          <div className="text-primary-foreground">
            <h2 className="text-xl font-bold">{name} Korhonen</h2>
            <p className="text-xs opacity-90">ID · JMB-998822</p>
            <span className="inline-flex items-center gap-1 mt-1.5 bg-gradient-gold text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              <Award className="h-3 w-3" /> Silver Member
            </span>
          </div>
        </div>
      </div>

      {/* Score card */}
      <section className="px-5 mt-4 mb-5">
        <div className="bg-card rounded-3xl p-5 shadow-card">
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jumbo Score</p>
            <span className="text-[10px] font-bold text-accent">250 pts to Gold</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-primary">1,250</span>
            <span className="text-sm text-muted-foreground font-semibold">PTS</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-accent rounded-full" style={{ width: "83%" }} />
          </div>
          <div className="flex justify-between text-[10px] font-semibold mt-2 text-muted-foreground">
            <span>Silver</span>
            <span>Gold · 1,500</span>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold">Activity history</h3>
          <button className="text-xs font-semibold text-primary">See all</button>
        </div>
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden divide-y divide-border">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5">
              <span
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                  a.type === "earn" ? "bg-secondary text-primary" : "bg-accent-soft text-accent",
                )}
              >
                {a.type === "earn" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{a.label}</p>
                <p className="text-[11px] text-muted-foreground">{a.date}</p>
              </div>
              <span className={cn("text-sm font-bold", a.type === "earn" ? "text-primary" : "text-accent")}>{a.pts}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Personal Info */}
      <section className="px-5 mb-6">
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

      {/* App Settings */}
      <section className="px-5 mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">App Settings</h3>
        <div className="bg-card rounded-2xl shadow-soft divide-y divide-border">
          {/* Language dropdown */}
          <div className="p-3.5">
            <button onClick={() => setLangOpen((v) => !v)} className="w-full flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-brand-green shrink-0">
                <Globe className="h-4 w-4" />
              </span>
              <p className="flex-1 text-sm font-semibold text-left">Language</p>
              <span className="text-xs font-bold text-muted-foreground">{lang}</span>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-smooth", langOpen && "rotate-180")} />
            </button>
            {langOpen && (
              <div className="mt-3 ml-12 space-y-1">
                {(["English", "Finnish", "Swedish"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
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

      <section className="px-5 flex flex-col items-center gap-2">
        <button className="w-full flex items-center justify-center gap-2 text-destructive font-semibold text-sm py-3 rounded-2xl bg-card shadow-soft">
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
      className={cn("h-6 w-11 rounded-full relative transition-smooth", value ? "bg-brand-green" : "bg-muted")}
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
