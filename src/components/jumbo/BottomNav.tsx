import { Home, Newspaper, QrCode, Gamepad2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "home" | "news" | "wallet" | "game" | "profile";

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "news", label: "News", icon: Newspaper },
  { id: "wallet", label: "Wallet", icon: QrCode },
  { id: "game", label: "Play", icon: Gamepad2 },
  { id: "profile", label: "Profile", icon: User },
];

interface BottomNavProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export const BottomNav = ({ active, onChange }: BottomNavProps) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          const isWallet = t.id === "wallet";
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-smooth flex-1 max-w-[80px]",
                isActive && !isWallet && "text-primary",
                !isActive && "text-muted-foreground hover:text-foreground",
              )}
              aria-label={t.label}
            >
              {isWallet ? (
                <span
                  className={cn(
                    "flex items-center justify-center h-12 w-12 rounded-full -mt-6 transition-smooth",
                    isActive ? "gradient-accent shadow-glow" : "gradient-primary shadow-primary",
                  )}
                >
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </span>
              ) : (
                <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              )}
              <span className={cn("text-[10px] font-semibold", isWallet && "mt-0")}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
