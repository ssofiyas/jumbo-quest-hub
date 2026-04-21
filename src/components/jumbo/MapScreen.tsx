import { useRef, useState } from "react";
import {
  ArrowLeft, Search, Navigation, Coffee, Shirt, ShoppingBag, Sparkles,
  MapPin, Plus, Minus, Locate, X, Footprints, ChevronUp, Car, Film,
  Smartphone, Heart, Gem, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapScreenProps {
  onClose: () => void;
}

// Real Jumbo Vantaa floors (Krs)
type FloorId = "P" | "1" | "2" | "3";

const floors: { id: FloorId; label: string; sub: string }[] = [
  { id: "P", label: "P", sub: "Parking" },
  { id: "1", label: "1", sub: "1st floor" },
  { id: "2", label: "2", sub: "2nd floor" },
  { id: "3", label: "3", sub: "3rd floor" },
];

type Category = "fashion" | "food" | "grocery" | "service" | "entertainment" | "beauty" | "electronics" | "jewelry";

type Pin = {
  id: string;
  name: string;
  category: Category;
  floor: FloorId;
  x: number;
  y: number;
  hours?: string;
};

// Real Jumbo Vantaa stores
const pins: Pin[] = [
  // Parking
  { id: "park-p1", name: "P1 Parking Hall", category: "service", floor: "P", x: 28, y: 45, hours: "24h · Free 5h" },
  { id: "park-p2", name: "P2 Parking Hall", category: "service", floor: "P", x: 70, y: 55, hours: "24h" },

  // 1st floor
  { id: "stockmann", name: "Stockmann", category: "fashion", floor: "1", x: 35, y: 30, hours: "10:00 – 21:00" },
  { id: "halonen", name: "Halonen", category: "fashion", floor: "1", x: 50, y: 60 },
  { id: "k-citymarket", name: "K-Citymarket", category: "grocery", floor: "1", x: 70, y: 45, hours: "07:00 – 23:00" },
  { id: "lindex", name: "Lindex", category: "fashion", floor: "1", x: 42, y: 42 },
  { id: "hm-1", name: "H&M", category: "fashion", floor: "1", x: 58, y: 35 },
  { id: "kicks", name: "Kicks", category: "beauty", floor: "1", x: 48, y: 50 },
  { id: "alko", name: "Alko", category: "grocery", floor: "1", x: 62, y: 58 },
  { id: "info-1", name: "Info Desk", category: "service", floor: "1", x: 50, y: 70 },

  // 2nd floor
  { id: "zara", name: "Zara", category: "fashion", floor: "2", x: 30, y: 32, hours: "10:00 – 21:00" },
  { id: "kappahl", name: "KappAhl", category: "fashion", floor: "2", x: 45, y: 28 },
  { id: "intersport", name: "Intersport", category: "fashion", floor: "2", x: 60, y: 35 },
  { id: "clas-ohlson", name: "Clas Ohlson", category: "service", floor: "2", x: 70, y: 50 },
  { id: "gigantti", name: "Gigantti", category: "electronics", floor: "2", x: 38, y: 55 },
  { id: "starbucks", name: "Starbucks", category: "food", floor: "2", x: 52, y: 50, hours: "08:00 – 21:00" },
  { id: "shasha", name: "Shasha Beauty", category: "beauty", floor: "2", x: 25, y: 60 },
  { id: "fazer", name: "Fazer Cafe", category: "food", floor: "2", x: 55, y: 65, hours: "08:30 – 21:00" },
  { id: "pandora", name: "Pandora", category: "jewelry", floor: "2", x: 48, y: 40 },

  // 3rd floor
  { id: "finnkino", name: "Finnkino Cinema", category: "entertainment", floor: "3", x: 35, y: 35, hours: "10:00 – 00:00" },
  { id: "superpark", name: "SuperPark", category: "entertainment", floor: "3", x: 65, y: 40 },
  { id: "hesburger", name: "Hesburger", category: "food", floor: "3", x: 50, y: 55 },
  { id: "rax", name: "Rax Buffet", category: "food", floor: "3", x: 38, y: 60 },
  { id: "subway", name: "Subway", category: "food", floor: "3", x: 60, y: 65 },
  { id: "zhao-tea", name: "Zhao Tea", category: "food", floor: "3", x: 48, y: 70 },
];

const categoryStyle: Record<Category, { bg: string; icon: typeof Store; label: string }> = {
  fashion: { bg: "bg-primary", icon: Shirt, label: "Fashion" },
  food: { bg: "bg-brand-yellow", icon: Coffee, label: "Food" },
  grocery: { bg: "bg-brand-green", icon: ShoppingBag, label: "Grocery" },
  service: { bg: "bg-brand-blue", icon: Sparkles, label: "Services" },
  entertainment: { bg: "bg-accent", icon: Film, label: "Fun" },
  beauty: { bg: "bg-pink-500", icon: Heart, label: "Beauty" },
  electronics: { bg: "bg-slate-700", icon: Smartphone, label: "Tech" },
  jewelry: { bg: "bg-amber-500", icon: Gem, label: "Jewelry" },
};

const userLoc = { x: 50, y: 50 };
const userFloor: FloorId = "1";

const buildRoute = (target: Pin) => {
  const points = [
    { x: userLoc.x, y: userLoc.y },
    { x: target.x, y: userLoc.y },
    { x: target.x, y: target.y },
  ];
  const dx = Math.abs(target.x - userLoc.x);
  const dy = Math.abs(target.y - userLoc.y);
  const meters = Math.round((dx + dy) * 1.5);
  const minutes = Math.max(1, Math.round(meters / 70));
  return { points, meters, minutes };
};

// Authentic Jumbo Vantaa floorplan (stylized, brand colors)
const Floorplan = ({ floor }: { floor: FloorId }) => {
  // Brand: dark green building, light green corridors, yellow accents
  const building = "hsl(var(--brand-green))";
  const corridor = "hsl(var(--brand-green-soft))";
  const street = "hsl(var(--muted))";
  const streetLabel = "hsl(var(--muted-foreground))";

  if (floor === "P") {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect width="100" height="100" fill="hsl(var(--background))" />
        {/* Streets */}
        <rect x="0" y="0" width="100" height="8" fill={street} />
        <rect x="0" y="92" width="100" height="8" fill={street} />
        {/* Parking blocks */}
        <rect x="10" y="15" width="35" height="70" rx="2" fill={building} opacity="0.85" />
        <rect x="55" y="15" width="35" height="70" rx="2" fill={building} opacity="0.85" />
        {/* Parking lines */}
        {[...Array(6)].map((_, i) => (
          <line key={`l-${i}`} x1="12" y1={20 + i * 11} x2="43" y2={20 + i * 11} stroke="white" strokeWidth="0.3" opacity="0.5" />
        ))}
        {[...Array(6)].map((_, i) => (
          <line key={`r-${i}`} x1="57" y1={20 + i * 11} x2="88" y2={20 + i * 11} stroke="white" strokeWidth="0.3" opacity="0.5" />
        ))}
        {/* Drive lane */}
        <rect x="45" y="15" width="10" height="70" fill={corridor} />
        <text x="27" y="51" textAnchor="middle" fontSize="6" fontWeight="900" fill="white" opacity="0.9">P1</text>
        <text x="72" y="51" textAnchor="middle" fontSize="6" fontWeight="900" fill="white" opacity="0.9">P2</text>
        <text x="50" y="4" textAnchor="middle" fontSize="2.4" fontWeight="700" fill={streetLabel}>VANTAANPORTINKATU</text>
        <text x="50" y="98" textAnchor="middle" fontSize="2.4" fontWeight="700" fill={streetLabel}>KEHÄ III</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <rect width="100" height="100" fill="hsl(var(--background))" />
      {/* Streets surrounding the mall */}
      <rect x="0" y="0" width="100" height="6" fill={street} />
      <rect x="0" y="94" width="100" height="6" fill={street} />
      <rect x="0" y="0" width="6" height="100" fill={street} />
      <rect x="94" y="0" width="6" height="100" fill={street} />

      {/* Main mall outline (organic Jumbo shape) */}
      <path
        d="M 12 18
           L 38 12
           L 62 14
           L 86 20
           L 88 40
           L 84 58
           L 86 78
           L 70 86
           L 50 84
           L 30 86
           L 14 80
           L 10 60
           L 12 40 Z"
        fill={building}
        stroke="hsl(var(--brand-green-dark, var(--brand-green)))"
        strokeWidth="0.4"
      />

      {/* Main corridor (light green walking paths) */}
      <path
        d="M 20 50 L 80 50"
        stroke={corridor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 50 22 L 50 78"
        stroke={corridor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 30 30 L 70 30 M 30 70 L 70 70"
        stroke={corridor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Central plaza */}
      <circle cx="50" cy="50" r="5" fill="hsl(var(--brand-yellow))" opacity="0.9" />
      <circle cx="50" cy="50" r="5" fill="none" stroke="white" strokeWidth="0.4" />
      <text x="50" y="51.2" textAnchor="middle" fontSize="2" fontWeight="900" fill="hsl(var(--brand-green))">PLAZA</text>

      {/* Escalators (yellow circles at corridor ends) */}
      <circle cx="22" cy="50" r="2" fill="hsl(var(--brand-yellow))" />
      <circle cx="78" cy="50" r="2" fill="hsl(var(--brand-yellow))" />
      <circle cx="50" cy="24" r="2" fill="hsl(var(--brand-yellow))" />
      <circle cx="50" cy="76" r="2" fill="hsl(var(--brand-yellow))" />

      {/* Floor label inside building */}
      <text x="50" y="18" textAnchor="middle" fontSize="3" fontWeight="900" fill="white" opacity="0.4">JUMBO · KRS {floor}</text>

      {/* Street names */}
      <text x="50" y="3.5" textAnchor="middle" fontSize="2.2" fontWeight="700" fill={streetLabel}>VANTAANPORTINKATU</text>
      <text x="50" y="98" textAnchor="middle" fontSize="2.2" fontWeight="700" fill={streetLabel}>KEHÄ III</text>
      <text x="3" y="50" textAnchor="middle" fontSize="2.2" fontWeight="700" fill={streetLabel} transform="rotate(-90 3 50)">VALUUTTAKATU</text>
      <text x="97" y="50" textAnchor="middle" fontSize="2.2" fontWeight="700" fill={streetLabel} transform="rotate(90 97 50)">RATASTIE</text>
    </svg>
  );
};

export const MapScreen = ({ onClose }: MapScreenProps) => {
  const [floor, setFloor] = useState<FloorId>("1");
  const [selected, setSelected] = useState<Pin | null>(null);
  const [routeOn, setRouteOn] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category | "all">("all");

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const visible = pins.filter(
    (p) =>
      p.floor === floor &&
      (activeCat === "all" || p.category === activeCat) &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase())),
  );

  const route = selected && routeOn && selected.floor === floor && floor === userFloor ? buildRoute(selected) : null;
  const routePath = route ? route.points.map((p) => `${p.x},${p.y}`).join(" ") : "";

  const clampPan = (x: number, y: number, z: number) => {
    const max = 50 * (z - 1);
    return { x: Math.max(-max, Math.min(max, x)), y: Math.max(-max, Math.min(max, y)) };
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
    const nz = Math.max(1, Math.min(2.8, z));
    setZoom(nz);
    setPan((p) => clampPan(p.x, p.y, nz));
  };

  const recenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFloor(userFloor);
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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jumbo · Vantaa</p>
            <h1 className="text-lg font-bold leading-tight">Floormap</h1>
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
            placeholder="Hae liikettä · Search stores…"
            className="w-full bg-secondary/70 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {query && (
          <div className="mt-2 bg-card border border-border rounded-2xl shadow-soft max-h-48 overflow-y-auto">
            {pins
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 6)
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
                      <p className="text-[10px] text-muted-foreground">Krs {p.floor} · {categoryStyle[p.category].label}</p>
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

      {/* Floor switcher (Jumbo style: yellow circle buttons "Krs") */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Krs</span>
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setFloor(f.id)}
              className={cn(
                "h-9 w-9 rounded-full text-xs font-black transition-smooth flex items-center justify-center border-2",
                floor === f.id
                  ? "bg-brand-yellow text-brand-green border-brand-yellow shadow-soft"
                  : "bg-card text-muted-foreground border-border",
              )}
              title={f.sub}
            >
              {f.id === "P" ? <Car className="h-4 w-4" /> : f.label}
            </button>
          ))}
        </div>
        <button
          onClick={recenter}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue shrink-0"
        >
          <Locate className="h-3.5 w-3.5" /> Locate
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
        {(Object.entries(categoryStyle) as [Category, typeof categoryStyle.fashion][]).map(([k, v]) => (
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
          className="relative h-full w-full rounded-3xl overflow-hidden bg-background shadow-card touch-none select-none border border-border"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Floor label badge */}
          <div className="absolute top-3 left-3 z-20 bg-brand-yellow rounded-full px-3 py-1.5 shadow-soft">
            <p className="text-[10px] font-black uppercase tracking-wider text-brand-green leading-none">Floor</p>
            <p className="text-sm font-black text-brand-green leading-tight">{floors.find((f) => f.id === floor)?.sub}</p>
          </div>

          {/* Pan/zoom wrapper */}
          <div
            className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
            style={{ transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})` }}
          >
            <Floorplan floor={floor} />

            {/* Route overlay */}
            {route && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                  points={routePath}
                  fill="none"
                  stroke="hsl(var(--brand-yellow))"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2.5 1.5"
                  className="animate-pulse"
                />
                <circle cx={selected!.x} cy={selected!.y} r="2" fill="hsl(var(--brand-yellow))" />
              </svg>
            )}

            {/* User location */}
            {floor === userFloor && (
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
                      "relative flex items-center justify-center h-8 w-8 rounded-full text-white shadow-card ring-[3px] transition-smooth",
                      s.bg,
                      isSelected ? "ring-white scale-125" : "ring-white/80",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {isSelected && (
                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-bold bg-card px-2 py-0.5 rounded-full shadow-soft">
                      {p.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div className="absolute right-3 bottom-3 flex flex-col bg-card rounded-full shadow-card overflow-hidden border border-border z-20">
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

          {visible.length === 0 && (
            <div className="absolute inset-x-0 bottom-20 text-center text-xs font-semibold text-muted-foreground z-10">
              No stores match your filter on Krs {floor}
            </div>
          )}
        </div>
      </div>

      {/* Selected store sheet */}
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
                  {categoryStyle[selected.category].label} · Krs {selected.floor}
                </p>
                <p className="text-sm font-bold truncate">{selected.name}</p>
                <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Open · {selected.hours ?? "10:00 – 21:00"}
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
                {selected.floor !== userFloor ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <ChevronUp className="h-4 w-4 text-brand-blue" />
                    Take escalator from <b>Krs {userFloor}</b> to <b>Krs {selected.floor}</b>
                    <button
                      onClick={() => setFloor(selected.floor)}
                      className="ml-auto text-[11px] font-bold text-brand-blue underline"
                    >
                      Show
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
                        <p className="text-[11px] text-muted-foreground">From your location · via main corridor</p>
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
