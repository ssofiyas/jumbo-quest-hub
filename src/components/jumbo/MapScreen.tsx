import { useState } from "react";
import {
  ArrowLeft, Search, Navigation, MapPin, X, Footprints, ChevronUp,
  Coffee, Shirt, ShoppingBag, Sparkles, Film, Heart, Smartphone, Gem, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapScreenProps {
  onClose: () => void;
}

type FloorId = 1 | 2 | 3;
type Category = "fashion" | "food" | "grocery" | "service" | "fun" | "beauty" | "tech";

type Pin = {
  id: string;
  name: string;
  category: Category;
  floor: FloorId;
  x: number; // % position on the floor
  y: number;
};

// Real Jumbo Vantaa stores, simple grid layout
const pins: Pin[] = [
  // Floor 1
  { id: "stockmann", name: "Stockmann", category: "fashion", floor: 1, x: 25, y: 30 },
  { id: "citymarket", name: "K-Citymarket", category: "grocery", floor: 1, x: 75, y: 30 },
  { id: "halonen", name: "Halonen", category: "fashion", floor: 1, x: 50, y: 50 },
  { id: "lindex", name: "Lindex", category: "fashion", floor: 1, x: 25, y: 70 },
  { id: "alko", name: "Alko", category: "grocery", floor: 1, x: 75, y: 70 },
  // Floor 2
  { id: "zara", name: "Zara", category: "fashion", floor: 2, x: 25, y: 30 },
  { id: "hm", name: "H&M", category: "fashion", floor: 2, x: 50, y: 30 },
  { id: "intersport", name: "Intersport", category: "fashion", floor: 2, x: 75, y: 30 },
  { id: "starbucks", name: "Starbucks", category: "food", floor: 2, x: 50, y: 55 },
  { id: "gigantti", name: "Gigantti", category: "tech", floor: 2, x: 25, y: 75 },
  { id: "pandora", name: "Pandora", category: "beauty", floor: 2, x: 75, y: 75 },
  // Floor 3
  { id: "finnkino", name: "Finnkino", category: "fun", floor: 3, x: 25, y: 35 },
  { id: "superpark", name: "SuperPark", category: "fun", floor: 3, x: 75, y: 35 },
  { id: "hesburger", name: "Hesburger", category: "food", floor: 3, x: 35, y: 65 },
  { id: "subway", name: "Subway", category: "food", floor: 3, x: 65, y: 65 },
];

const cat: Record<Category, { bg: string; icon: typeof Store; label: string }> = {
  fashion: { bg: "bg-primary", icon: Shirt, label: "Fashion" },
  food: { bg: "bg-brand-yellow", icon: Coffee, label: "Food" },
  grocery: { bg: "bg-brand-green", icon: ShoppingBag, label: "Grocery" },
  service: { bg: "bg-brand-blue", icon: Sparkles, label: "Services" },
  fun: { bg: "bg-accent", icon: Film, label: "Fun" },
  beauty: { bg: "bg-pink-500", icon: Heart, label: "Beauty" },
  tech: { bg: "bg-slate-700", icon: Smartphone, label: "Tech" },
};

// "You are here" — entrance, floor 1
const me = { x: 50, y: 90, floor: 1 as FloorId };

export const MapScreen = ({ onClose }: MapScreenProps) => {
  const [floor, setFloor] = useState<FloorId>(1);
  const [selected, setSelected] = useState<Pin | null>(null);
  const [routeOn, setRouteOn] = useState(false);
  const [query, setQuery] = useState("");

  const visible = pins.filter(
    (p) => p.floor === floor && (query === "" || p.name.toLowerCase().includes(query.toLowerCase())),
  );

  // Simple L-route: only render when on user's floor
  const route =
    selected && routeOn && selected.floor === floor && floor === me.floor
      ? {
          d: `M ${me.x} ${me.y} L ${selected.x} ${me.y} L ${selected.x} ${selected.y}`,
          meters: Math.round((Math.abs(selected.x - me.x) + Math.abs(selected.y - me.y)) * 1.4),
        }
      : null;

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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jumbo Vantaa</p>
            <h1 className="text-lg font-bold leading-tight">Mall map</h1>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stores…"
            className="w-full bg-secondary/70 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Search results */}
        {query && (
          <div className="mt-2 bg-card border border-border rounded-2xl shadow-soft max-h-48 overflow-y-auto">
            {pins
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 6)
              .map((p) => {
                const I = cat[p.category].icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setFloor(p.floor);
                      setSelected(p);
                      setRouteOn(true);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 text-left"
                  >
                    <span className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white", cat[p.category].bg)}>
                      <I className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">Floor {p.floor} · {cat[p.category].label}</p>
                    </div>
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                  </button>
                );
              })}
            {pins.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">No stores found</p>
            )}
          </div>
        )}
      </header>

      {/* Floor switcher */}
      <div className="px-5 pt-3 pb-3 flex items-center justify-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">Floor</span>
        {([1, 2, 3] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFloor(f)}
            className={cn(
              "h-10 w-10 rounded-full text-sm font-black transition-smooth flex items-center justify-center",
              floor === f
                ? "bg-brand-yellow text-brand-green shadow-soft scale-110"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map canvas — simple labeled floor */}
      <div className="flex-1 px-5 pb-3 min-h-0">
        <div className="relative h-full w-full rounded-3xl overflow-hidden bg-brand-green-soft border-2 border-brand-green/20 shadow-card">
          {/* Simple building outline */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {/* Mall outline */}
            <rect x="6" y="6" width="88" height="88" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--brand-green))" strokeWidth="0.5" />
            {/* Corridors */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="hsl(var(--brand-green-soft))" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="hsl(var(--brand-green-soft))" strokeWidth="6" strokeLinecap="round" />
            {/* Plaza */}
            <circle cx="50" cy="50" r="4" fill="hsl(var(--brand-yellow))" />

            {/* Route */}
            {route && (
              <path
                d={route.d}
                fill="none"
                stroke="hsl(var(--brand-blue))"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2.5 1.5"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Floor badge */}
          <div className="absolute top-3 left-3 bg-brand-yellow rounded-full px-3 py-1 shadow-soft">
            <p className="text-xs font-black text-brand-green">Floor {floor}</p>
          </div>

          {/* You are here */}
          {floor === me.floor && (
            <div
              style={{ left: `${me.x}%`, top: `${me.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-brand-blue/40 animate-ping-pin" />
              <span className="relative block h-4 w-4 rounded-full bg-brand-blue ring-4 ring-white shadow-card" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-bold text-brand-blue">You</span>
            </div>
          )}

          {/* Pins */}
          {visible.map((p) => {
            const s = cat[p.category];
            const Icon = s.icon;
            const isSelected = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => { setSelected(p); setRouteOn(false); }}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={p.name}
              >
                {isSelected && (
                  <span className={cn("absolute inset-0 m-auto h-10 w-10 rounded-full animate-ping-pin", s.bg)} />
                )}
                <span
                  className={cn(
                    "relative flex items-center justify-center h-9 w-9 rounded-full text-white shadow-card ring-[3px] ring-white transition-smooth",
                    s.bg,
                    isSelected && "scale-125",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-bold bg-card/95 backdrop-blur px-1.5 py-0.5 rounded shadow-soft">
                  {p.name}
                </span>
              </button>
            );
          })}

          {visible.length === 0 && query && (
            <div className="absolute inset-x-0 bottom-20 text-center text-xs font-semibold text-muted-foreground">
              No stores match on Floor {floor}
            </div>
          )}
        </div>
      </div>

      {/* Selected store sheet */}
      {selected && (
        <div className="px-5 pb-5 animate-slide-up">
          <div className="bg-card rounded-3xl shadow-card border border-border overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <span className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0", cat[selected.category].bg)}>
                {(() => { const I = cat[selected.category].icon; return <I className="h-5 w-5" />; })()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {cat[selected.category].label} · Floor {selected.floor}
                </p>
                <p className="text-sm font-bold truncate">{selected.name}</p>
                <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Open · 10:00 – 21:00
                </p>
              </div>
              <button
                onClick={() => { setSelected(null); setRouteOn(false); }}
                className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!routeOn ? (
              <button
                onClick={() => { setFloor(selected.floor); setRouteOn(true); }}
                className="w-full bg-primary text-primary-foreground text-sm font-bold py-3 inline-flex items-center justify-center gap-2"
              >
                <Navigation className="h-4 w-4" /> Get directions
              </button>
            ) : (
              <div className="border-t border-border bg-secondary/40 p-3">
                {selected.floor !== me.floor ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <ChevronUp className="h-4 w-4 text-brand-blue" />
                    Take escalator to <b>Floor {selected.floor}</b>
                    <button
                      onClick={() => setFloor(selected.floor)}
                      className="ml-auto text-[11px] font-bold text-brand-blue underline"
                    >
                      Show
                    </button>
                  </div>
                ) : route ? (
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-brand-blue/15 text-brand-blue flex items-center justify-center">
                      <Footprints className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{Math.max(1, Math.round(route.meters / 70))} min walk · {route.meters} m</p>
                      <p className="text-[11px] text-muted-foreground">From entrance</p>
                    </div>
                    <button
                      onClick={() => setRouteOn(false)}
                      className="text-[11px] font-bold text-muted-foreground"
                    >
                      Stop
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
