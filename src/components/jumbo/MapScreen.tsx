import { useRef, useState } from "react";
import {
  ArrowLeft, Search, Navigation, Store, Coffee, Shirt, ShoppingBag, Sparkles,
  MapPin, Plus, Minus, Locate, X, Footprints, ChevronUp, Car, Utensils, Film,
  Gem, Smartphone, Heart, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import jumboMap from "@/assets/jumbo-map.jpg";

interface MapScreenProps {
  onClose: () => void;
}

// Real Jumbo floors
type FloorId = "B1" | "G" | "1" | "2";

const floors: { id: FloorId; label: string; sub: string }[] = [
  { id: "B1", label: "B1", sub: "Car Park" },
  { id: "G", label: "G", sub: "Ground" },
  { id: "1", label: "1", sub: "1st Floor" },
  { id: "2", label: "2", sub: "2nd Floor" },
];

type Category = "fashion" | "food" | "grocery" | "service" | "entertainment" | "beauty" | "electronics" | "jewelry";

type Pin = {
  id: string;
  name: string;
  category: Category;
  floor: FloorId;
  x: number; // percent within floor canvas
  y: number;
  hours?: string;
};

// Real stores from the Jumbo directory
const pins: Pin[] = [
  // B1 — Car Park
  { id: "park-a", name: "Parking Zone A", category: "service", floor: "B1", x: 30, y: 35 },
  { id: "park-b", name: "Parking Zone B", category: "service", floor: "B1", x: 65, y: 50 },
  { id: "atm-akbank", name: "Akbank ATM", category: "service", floor: "B1", x: 50, y: 70 },

  // Ground Floor
  { id: "carrefour", name: "CarrefourSA", category: "grocery", floor: "G", x: 70, y: 55, hours: "09:00 – 22:00" },
  { id: "ikea", name: "IKEA", category: "service", floor: "G", x: 75, y: 75, hours: "10:00 – 22:00" },
  { id: "boyner", name: "Boyner", category: "fashion", floor: "G", x: 35, y: 30 },
  { id: "lcw-g", name: "LC Waikiki", category: "fashion", floor: "G", x: 25, y: 50 },
  { id: "mango-g", name: "Mango", category: "fashion", floor: "G", x: 50, y: 25 },
  { id: "starbucks", name: "Starbucks", category: "food", floor: "G", x: 55, y: 45, hours: "08:00 – 23:00" },
  { id: "mcd", name: "McDonald's", category: "food", floor: "G", x: 60, y: 70 },
  { id: "watsons", name: "Watsons", category: "beauty", floor: "G", x: 40, y: 65 },
  { id: "swarovski", name: "Swarovski", category: "jewelry", floor: "G", x: 45, y: 38 },

  // 1st Floor
  { id: "zara", name: "Zara", category: "fashion", floor: "1", x: 32, y: 30, hours: "10:00 – 22:00" },
  { id: "hm", name: "H&M", category: "fashion", floor: "1", x: 50, y: 28 },
  { id: "stradivarius", name: "Stradivarius", category: "fashion", floor: "1", x: 65, y: 35 },
  { id: "bershka", name: "Bershka", category: "fashion", floor: "1", x: 70, y: 50 },
  { id: "mavi", name: "Mavi", category: "fashion", floor: "1", x: 28, y: 55 },
  { id: "us-polo", name: "US Polo", category: "fashion", floor: "1", x: 40, y: 50 },
  { id: "kahve", name: "Kahve Dünyası", category: "food", floor: "1", x: 55, y: 60 },
  { id: "krispy", name: "Krispy Kreme", category: "food", floor: "1", x: 45, y: 70 },
  { id: "vakko", name: "Vakko Boutique", category: "fashion", floor: "1", x: 22, y: 38 },
  { id: "info", name: "Info Desk", category: "service", floor: "1", x: 50, y: 50 },

  // 2nd Floor
  { id: "cinemaxx", name: "Cinemaximum", category: "entertainment", floor: "2", x: 30, y: 30, hours: "10:00 – 00:00" },
  { id: "legoland", name: "Legoland Discovery", category: "entertainment", floor: "2", x: 70, y: 30 },
  { id: "sealife", name: "Sea Life Istanbul", category: "entertainment", floor: "2", x: 75, y: 55 },
  { id: "joypark", name: "Joy Park Bowling", category: "entertainment", floor: "2", x: 25, y: 55 },
  { id: "burger-king", name: "Burger King", category: "food", floor: "2", x: 50, y: 70 },
  { id: "popeyes", name: "Popeyes", category: "food", floor: "2", x: 60, y: 75 },
  { id: "dominos", name: "Domino's Pizza", category: "food", floor: "2", x: 40, y: 75 },
  { id: "tekno", name: "Teknosa", category: "electronics", floor: "2", x: 55, y: 40 },
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
const userFloor: FloorId = "G";

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

// Map crops for the real Jumbo plan image (4 floors, side-by-side)
const floorCrops: Record<FloorId, { x: string; w: string }> = {
  B1: { x: "0%", w: "25%" },
  G:  { x: "25%", w: "25%" },
  "1": { x: "50%", w: "25%" },
  "2": { x: "75%", w: "25%" },
};

export const MapScreen = ({ onClose }: MapScreenProps) => {
  const [floor, setFloor] = useState<FloorId>("G");
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

  const crop = floorCrops[floor];

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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jumbo Mall map</p>
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
                      <p className="text-[10px] text-muted-foreground">Floor {p.floor} · {categoryStyle[p.category].label}</p>
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
      <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-2">
        <div className="flex bg-secondary rounded-full p-1">
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setFloor(f.id)}
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full transition-smooth flex items-center gap-1",
                floor === f.id ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground",
              )}
              title={f.sub}
            >
              {f.id === "B1" && <Car className="h-3 w-3" />}
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={recenter}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue shrink-0"
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
          className="relative h-full w-full rounded-3xl overflow-hidden bg-muted shadow-card touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Floor label */}
          <div className="absolute top-3 left-3 z-20 bg-card/95 backdrop-blur rounded-full px-3 py-1.5 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Floor</p>
            <p className="text-sm font-bold leading-tight">{floors.find((f) => f.id === floor)?.sub}</p>
          </div>

          {/* Pan/zoom wrapper */}
          <div
            className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
            style={{ transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})` }}
          >
            {/* Real Jumbo floorplan crop */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={jumboMap}
                alt={`Jumbo Mall floor ${floor}`}
                draggable={false}
                className="absolute h-[55%] top-[5%] max-w-none pointer-events-none"
                style={{
                  width: "400%",
                  left: `-${parseFloat(crop.x) * 4}%`,
                }}
              />
              {/* subtle overlay for readability */}
              <div className="absolute inset-0 bg-card/20" />
            </div>

            {/* Route overlay */}
            {route && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                <polyline
                  points={routePath}
                  fill="none"
                  stroke="hsl(var(--brand-blue))"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2.5 1.5"
                  className="animate-pulse"
                />
                {/* destination dot */}
                <circle cx={selected!.x} cy={selected!.y} r="2" fill="hsl(var(--brand-blue))" />
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
              No stores match your filter on this floor
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
                  {categoryStyle[selected.category].label} · Floor {selected.floor}
                </p>
                <p className="text-sm font-bold truncate">{selected.name}</p>
                <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Open · {selected.hours ?? "10:00 – 22:00"}
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
                    Take escalator from <b>Ground</b> to <b>Floor {selected.floor}</b>
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
