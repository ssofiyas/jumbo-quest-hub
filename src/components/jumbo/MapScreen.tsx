import { useRef, useState } from "react";
import {
  ArrowLeft, Search, Navigation, Store, Coffee, Shirt, ShoppingBag, Sparkles,
  MapPin, Plus, Minus, Locate, X, Footprints, ChevronUp,
} from "lucide-react";
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
  { id: "marimekko", name: "Marimekko", category: "fashion", floor: 1, x: 28, y: 30 },
  { id: "prisma", name: "Prisma", category: "grocery", floor: 1, x: 70, y: 35 },
  { id: "roberts", name: "Robert's Coffee", category: "food", floor: 1, x: 52, y: 60 },
  { id: "info1", name: "Info Desk", category: "service", floor: 1, x: 50, y: 82 },
  { id: "stadium", name: "Stadium", category: "fashion", floor: 2, x: 32, y: 40 },
  { id: "lindex", name: "Lindex", category: "fashion", floor: 2, x: 65, y: 28 },
  { id: "burger", name: "Hesburger", category: "food", floor: 2, x: 75, y: 65 },
  { id: "stockmann", name: "Stockmann", category: "fashion", floor: 2, x: 22, y: 70 },
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

// User starting location (entry near the plaza, floor 1)
const userLoc = { x: 50, y: 50 };

// Build an L-shaped route via the plaza for a "corridor" feel
const buildRoute = (target: Pin) => {
  const points = [
    { x: userLoc.x, y: userLoc.y },
    { x: target.x, y: userLoc.y },
    { x: target.x, y: target.y },
  ];
  const dx = Math.abs(target.x - userLoc.x);
  const dy = Math.abs(target.y - userLoc.y);
  // ~1% map ≈ 1.2 m in a 120m mall
  const meters = Math.round((dx + dy) * 1.2);
  const minutes = Math.max(1, Math.round(meters / 70));
  return { points, meters, minutes };
};

export const MapScreen = ({ onClose }: MapScreenProps) => {
  const [floor, setFloor] = useState<FloorId>(1);
  const [selected, setSelected] = useState<Pin | null>(null);
  const [routeOn, setRouteOn] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Pin["category"] | "all">("all");

  // Pan & zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const visible = pins.filter(
    (p) =>
      p.floor === floor &&
      (activeCat === "all" || p.category === activeCat) &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase())),
  );

  const route = selected && routeOn && selected.floor === floor ? buildRoute(selected) : null;
  const routePath = route ? route.points.map((p) => `${p.x},${p.y}`).join(" ") : "";

  const clampPan = (x: number, y: number, z: number) => {
    const max = 50 * (z - 1); // percent
    return {
      x: Math.max(-max, Math.min(max, x)),
      y: Math.max(-max, Math.min(max, y)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = ((e.clientX - dragRef.current.x) / e.currentTarget.clientWidth) * 100;
    const dy = ((e.clientY - dragRef.current.y) / e.currentTarget.clientHeight) * 100;
    setPan(clampPan(dragRef.current.px + dx, dragRef.current.py + dy, zoom));
  };
  const onPointerUp = () => { dragRef.current = null; };

  const setZoomClamped = (z: number) => {
    const nz = Math.max(1, Math.min(2.5, z));
    setZoom(nz);
    setPan((p) => clampPan(p.x, p.y, nz));
  };

  const recenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFloor(1);
  };

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

        {/* Search suggestions */}
        {query && (
          <div className="mt-2 bg-card border border-border rounded-2xl shadow-soft max-h-48 overflow-y-auto">
            {pins
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5)
              .map((p) => {
                const I = categoryStyle[p.category].icon;
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
                    <span className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white", categoryStyle[p.category].bg)}>
                      <I className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">Floor {p.floor} · {categoryStyle[p.category].label}</p>
                    </div>
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                  </button>
                );
              })}
          </div>
        )}
      </header>

      {/* Floor switcher + filter chips */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div className="flex bg-secondary rounded-full p-1">
          {([1, 2, 3] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFloor(f); }}
              className={cn(
                "text-xs font-bold px-4 py-1.5 rounded-full transition-smooth",
                floor === f ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground",
              )}
            >
              Floor {f}
            </button>
          ))}
        </div>
        <button
          onClick={recenter}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue"
        >
          <Locate className="h-3.5 w-3.5" /> My location
        </button>
      </div>

      {/* Category filter */}
      <div className="px-5 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveCat("all")}
          className={cn(
            "shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border",
            activeCat === "all" ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border",
          )}
        >
          All
        </button>
        {(Object.entries(categoryStyle) as [Pin["category"], typeof categoryStyle.fashion][]).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveCat(k)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-smooth",
              activeCat === k ? "text-white border-transparent " + v.bg : "bg-card text-foreground border-border",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", activeCat === k ? "bg-white" : v.bg)} />
            {v.label}
          </button>
        ))}
      </div>

      {/* Map canvas */}
      <div className="flex-1 px-5 pt-1 pb-3 min-h-0">
        <div
          className="relative h-full w-full rounded-3xl overflow-hidden bg-brand-blue-soft shadow-card touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Pan/zoom wrapper */}
          <div
            className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
            style={{ transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})` }}
          >
            {/* Floorplan SVG */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <rect x="4" y="4" width="92" height="92" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.6" />
              <rect x="4" y="46" width="92" height="8" fill="hsl(var(--muted))" />
              <rect x="46" y="4" width="8" height="92" fill="hsl(var(--muted))" />
              <rect x="8" y="8" width="34" height="34" rx="2" fill="hsl(var(--brand-red-soft, var(--primary-soft)))" opacity="0.5" />
              <rect x="58" y="8" width="34" height="34" rx="2" fill="hsl(var(--brand-yellow-soft))" opacity="0.7" />
              <rect x="8" y="58" width="34" height="34" rx="2" fill="hsl(var(--brand-green-soft))" opacity="0.7" />
              <rect x="58" y="58" width="34" height="34" rx="2" fill="hsl(var(--brand-blue-soft))" opacity="0.9" />
              <circle cx="50" cy="50" r="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="1 1" />
              <text x="50" y="51.5" textAnchor="middle" fontSize="2.6" fontWeight="700" fill="hsl(var(--primary))">PLAZA</text>
              <text x="25" y="26" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--primary))" opacity="0.55">FASHION</text>
              <text x="75" y="26" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--brand-yellow))" opacity="0.7">DINING</text>
              <text x="25" y="76" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--brand-green))" opacity="0.6">GROCERY</text>
              <text x="75" y="76" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="hsl(var(--brand-blue))" opacity="0.6">SERVICES</text>

              {/* Route */}
              {route && (
                <polyline
                  points={routePath}
                  fill="none"
                  stroke="hsl(var(--brand-blue))"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 1.5"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* User location (only on floor 1) */}
            {floor === 1 && (
              <div
                style={{ left: `${userLoc.x}%`, top: `${userLoc.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-brand-blue/40 animate-ping-pin" />
                <span className="relative block h-4 w-4 rounded-full bg-brand-blue ring-4 ring-white shadow-card" />
              </div>
            )}

            {/* Pins */}
            {visible.map((p) => {
              const s = categoryStyle[p.category];
              const Icon = s.icon;
              const isSelected = selected?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(p);
                    setRouteOn(false);
                  }}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  aria-label={p.name}
                >
                  {isSelected && (
                    <span className={cn("absolute inset-0 m-auto h-9 w-9 rounded-full animate-ping-pin", s.bg)} />
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
          </div>

          {/* Zoom controls (fixed) */}
          <div className="absolute right-3 bottom-3 flex flex-col bg-card rounded-full shadow-card overflow-hidden border border-border">
            <button
              onClick={() => setZoomClamped(zoom + 0.3)}
              className="h-9 w-9 flex items-center justify-center text-foreground hover:bg-secondary"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="h-px bg-border" />
            <button
              onClick={() => setZoomClamped(zoom - 0.3)}
              className="h-9 w-9 flex items-center justify-center text-foreground hover:bg-secondary"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* Empty state */}
          {visible.length === 0 && (
            <div className="absolute inset-x-0 bottom-20 text-center text-xs font-semibold text-muted-foreground">
              No stores match "{query}" on Floor {floor}
            </div>
          )}
        </div>
      </div>

      {/* Selected store sheet / route panel */}
      {selected && (
        <div className="px-5 pb-5 animate-slide-up">
          <div className="bg-card rounded-3xl shadow-card border border-border overflow-hidden">
            <div className="p-4 flex items-center gap-3">
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
                {selected.floor !== floor ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <ChevronUp className="h-4 w-4 text-brand-blue" />
                    Take escalator to <span className="font-bold">Floor {selected.floor}</span>
                    <button
                      onClick={() => setFloor(selected.floor)}
                      className="ml-auto text-[11px] font-bold text-brand-blue underline"
                    >
                      Go
                    </button>
                  </div>
                ) : (
                  route && (
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-full bg-brand-blue/15 text-brand-blue flex items-center justify-center">
                        <Footprints className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{route.minutes} min walk · {route.meters} m</p>
                        <p className="text-[11px] text-muted-foreground">From entrance · via Plaza</p>
                      </div>
                      <button
                        onClick={() => setRouteOn(false)}
                        className="text-[11px] font-bold text-muted-foreground"
                      >
                        Stop
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
