import { useState } from "react";
import { ArrowLeft, Search, Navigation, Store, Coffee, Shirt, ShoppingBag, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapScreenProps {
  onClose: () => void;
}

type FloorId = 1 | 2 | 3;

type Pin = {
  id: string;
  name: string;
  category: "fashion" | "food" | "grocery" | "service";
  floor: FloorId;
  x: number; // percent
  y: number; // percent
};

const pins: Pin[] = [
  // Floor 1
  { id: "marimekko", name: "Marimekko", category: "fashion", floor: 1, x: 28, y: 30 },
  { id: "prisma", name: "Prisma", category: "grocery", floor: 1, x: 70, y: 35 },
  { id: "roberts", name: "Robert's Coffee", category: "food", floor: 1, x: 52, y: 60 },
  { id: "info1", name: "Info Desk", category: "service", floor: 1, x: 50, y: 82 },
  // Floor 2
  { id: "stadium", name: "Stadium", category: "fashion", floor: 2, x: 32, y: 40 },
  { id: "lindex", name: "Lindex", category: "fashion", floor: 2, x: 65, y: 28 },
  { id: "burger", name: "Hesburger", category: "food", floor: 2, x: 75, y: 65 },
  { id: "stockmann", name: "Stockmann", category: "fashion", floor: 2, x: 22, y: 70 },
  // Floor 3
  { id: "cinema", name: "Finnkino Cinema", category: "service", floor: 3, x: 50, y: 35 },
  { id: "playzone", name: "Family Play Zone", category: "service", floor: 3, x: 28, y: 65 },
  { id: "foodcourt", name: "Food Court", category: "food", floor: 3, x: 72, y: 70 },
];

const categoryStyle: Record<Pin["category"], { bg: string; ring: string; icon: typeof Store; label: string }> = {
  fashion: { bg: "bg-primary", ring: "ring-primary/30", icon: Shirt, label: "Fashion" },
  food: { bg: "bg-brand-yellow", ring: "ring-brand-yellow/30", icon: Coffee, label: "Food" },
  grocery: { bg: "bg-brand-green", ring: "ring-brand-green/30", icon: ShoppingBag, label: "Grocery" },
  service: { bg: "bg-brand-blue", ring: "ring-brand-blue/30", icon: Sparkles, label: "Service" },
};

export const MapScreen = ({ onClose }: MapScreenProps) => {
  const [floor, setFloor] = useState<FloorId>(1);
  const [selected, setSelected] = useState<Pin | null>(null);
  const [query, setQuery] = useState("");

  const visible = pins.filter(
    (p) => p.floor === floor && (query === "" || p.name.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col animate-slide-up">
      {/* Header */}
      <header className="px-5 pt-3 pb-3 bg-card border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary"
            aria-label="Close map"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mall map</p>
            <h1 className="text-lg font-bold leading-tight">Find a Store</h1>
          </div>
          <span className="text-[11px] font-bold bg-brand-green-soft text-brand-green px-2.5 py-1 rounded-full">
            170+ stores
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stores, cafés, services…"
            className="w-full bg-secondary/70 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>

      {/* Floor switcher */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div className="flex bg-secondary rounded-full p-1">
          {([1, 2, 3] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFloor(f);
                setSelected(null);
              }}
              className={cn(
                "text-xs font-bold px-4 py-1.5 rounded-full transition-smooth",
                floor === f ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground",
              )}
            >
              Floor {f}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue">
          <Navigation className="h-3.5 w-3.5" /> My location
        </button>
      </div>

      {/* Map canvas */}
      <div className="flex-1 px-5 pt-2 pb-3 min-h-0">
        <div className="relative h-full w-full rounded-3xl overflow-hidden bg-brand-blue-soft shadow-card">
          {/* Floorplan SVG */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {/* outer mall outline */}
            <rect x="4" y="4" width="92" height="92" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.6" />
            {/* corridors */}
            <rect x="4" y="46" width="92" height="8" fill="hsl(var(--muted))" />
            <rect x="46" y="4" width="8" height="92" fill="hsl(var(--muted))" />
            {/* store blocks */}
            <rect x="8" y="8" width="34" height="34" rx="2" fill="hsl(var(--brand-red-soft, var(--primary-soft)))" opacity="0.5" />
            <rect x="58" y="8" width="34" height="34" rx="2" fill="hsl(var(--brand-yellow-soft))" opacity="0.7" />
            <rect x="8" y="58" width="34" height="34" rx="2" fill="hsl(var(--brand-green-soft))" opacity="0.7" />
            <rect x="58" y="58" width="34" height="34" rx="2" fill="hsl(var(--brand-blue-soft))" opacity="0.9" />
            {/* central plaza */}
            <circle cx="50" cy="50" r="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1 1" />
            <text x="50" y="51.5" textAnchor="middle" fontSize="2.6" fontWeight="700" fill="hsl(var(--primary))">PLAZA</text>
            {/* zone labels */}
            <text x="25" y="26" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--primary))" opacity="0.55">FASHION</text>
            <text x="75" y="26" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--brand-yellow))" opacity="0.7">DINING</text>
            <text x="25" y="76" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--brand-green))" opacity="0.6">GROCERY</text>
            <text x="75" y="76" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--brand-blue))" opacity="0.6">SERVICES</text>
          </svg>

          {/* Pins */}
          {visible.map((p) => {
            const s = categoryStyle[p.category];
            const Icon = s.icon;
            const isSelected = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                aria-label={p.name}
              >
                {isSelected && (
                  <span
                    className={cn(
                      "absolute inset-0 m-auto h-9 w-9 rounded-full animate-ping-pin",
                      s.bg,
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative flex items-center justify-center h-9 w-9 rounded-full text-white shadow-card ring-4 transition-smooth",
                    s.bg,
                    isSelected ? "ring-white scale-110" : "ring-white/70",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </button>
            );
          })}

          {/* Empty state */}
          {visible.length === 0 && (
            <div className="absolute inset-x-0 bottom-20 text-center text-xs font-semibold text-muted-foreground">
              No stores match "{query}" on Floor {floor}
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
            {(Object.entries(categoryStyle) as [Pin["category"], typeof categoryStyle.fashion][]).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1 bg-card/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-full shadow-soft">
                <span className={cn("h-2 w-2 rounded-full", v.bg)} />
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected store sheet */}
      {selected && (
        <div className="px-5 pb-5 animate-slide-up">
          <div className="bg-card rounded-3xl shadow-card p-4 flex items-center gap-3 border border-border">
            <span
              className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0",
                categoryStyle[selected.category].bg,
              )}
            >
              {(() => {
                const I = categoryStyle[selected.category].icon;
                return <I className="h-5 w-5" />;
              })()}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {categoryStyle[selected.category].label} · Floor {selected.floor}
              </p>
              <p className="text-sm font-bold truncate">{selected.name}</p>
              <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Open · 10:00 – 21:00
              </p>
            </div>
            <button className="bg-primary text-primary-foreground text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 inline-flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" /> Route
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
