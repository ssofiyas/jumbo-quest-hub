import { ScanLine, Plus, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  { brand: "Prisma", points: "342 pts", color: "from-[#005EB8] to-[#0089D0]", text: "S-Group" },
  { brand: "Marimekko", points: "Member", color: "from-[#E30613] to-[#FF6B6B]", text: "Club" },
  { brand: "Stadium", points: "1,120 pts", color: "from-foreground to-foreground/70", text: "Member" },
  { brand: "Lindex", points: "Gold tier", color: "from-[#D4AF37] to-[#F5D27A]", text: "Lindex&Me" },
];

// Simple QR-like decorative grid
const QrCode = () => {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    // deterministic pseudo-random pattern
    const x = i % 21;
    const y = Math.floor(i / 21);
    const isCorner =
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (isCorner) {
      const lx = x % 7;
      const ly = y % 7;
      const onEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
      const center = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      return onEdge || center;
    }
    return ((x * 31 + y * 17 + x * y) % 7) > 3;
  });
  return (
    <div className="grid grid-cols-21 gap-0 bg-foreground p-3 rounded-2xl" style={{ gridTemplateColumns: "repeat(21, 1fr)" }}>
      {cells.map((on, i) => (
        <div key={i} className={cn("aspect-square", on ? "bg-background" : "bg-foreground")} />
      ))}
    </div>
  );
};

export const WalletScreen = ({ name }: { name: string }) => {
  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up">
      <header className="px-5 pt-2 pb-3">
        <p className="text-xs text-muted-foreground font-medium">Tap, scan, collect</p>
        <h1 className="text-2xl font-bold">Digital Wallet</h1>
      </header>

      {/* QR Card */}
      <section className="px-5 mb-6">
        <div className="relative rounded-3xl gradient-primary p-6 shadow-primary overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
          <div className="relative">
            <p className="text-primary-foreground/80 text-xs font-semibold uppercase tracking-wider">Show at checkout</p>
            <h2 className="text-primary-foreground text-xl font-bold mb-4">Your Jumbo ID</h2>
            <div className="bg-background rounded-3xl p-4 mx-auto max-w-[240px]">
              <QrCode />
              <p className="text-center text-foreground font-mono text-xs font-bold mt-3">JMB · 8421 · ANNA</p>
            </div>
            <div className="flex items-center justify-between mt-5 text-primary-foreground">
              <div>
                <p className="text-[11px] opacity-80">Member</p>
                <p className="font-bold text-sm">{name} K.</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] opacity-80">Balance</p>
                <p className="font-bold text-sm">1,250 pts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick action */}
      <section className="px-5 mb-6">
        <button className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-card transition-smooth">
          <span className="h-12 w-12 rounded-2xl bg-accent-soft flex items-center justify-center">
            <Receipt className="h-5 w-5 text-accent" />
          </span>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm">Scan Receipt</p>
            <p className="text-xs text-muted-foreground">Forgot to scan? Claim points manually</p>
          </div>
          <ScanLine className="h-5 w-5 text-muted-foreground" />
        </button>
      </section>

      {/* Loyalty cards */}
      <section>
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h3 className="text-base font-bold">My loyalty cards</h3>
            <p className="text-xs text-muted-foreground">{cards.length} stored cards</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-secondary text-primary flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-3 px-5 w-max">
            {cards.map((c) => (
              <div
                key={c.brand}
                className={cn(
                  "relative w-56 h-32 rounded-2xl bg-gradient-to-br p-4 text-white shadow-card overflow-hidden shrink-0",
                  c.color,
                )}
              >
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
                <div className="relative flex flex-col h-full justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-80">{c.text}</p>
                    <p className="font-bold text-lg leading-tight">{c.brand}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-xs font-semibold bg-white/20 backdrop-blur px-2 py-1 rounded-md">{c.points}</span>
                    <span className="font-mono text-[10px] opacity-70">**** 4821</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
