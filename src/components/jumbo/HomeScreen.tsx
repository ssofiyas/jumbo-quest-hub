import { useState } from "react";
import { Search, Bell, MapPin, ChevronRight, Tag, Sparkles, Coffee, ShoppingBag, Shirt, Gift } from "lucide-react";
import bannerMall from "@/assets/banner-mall.jpg";
import bannerDeal from "@/assets/banner-deal.jpg";
import { cn } from "@/lib/utils";

const banners = [
  { img: bannerMall, tag: "What's New", title: "Spring at Jumbo", subtitle: "12 new stores opened this season" },
  { img: bannerDeal, tag: "Members Only", title: "Double Points Friday", subtitle: "Earn 2× on every receipt today" },
];

const categories = [
  { icon: Shirt, label: "Fashion", color: "bg-accent-soft text-accent" },
  { icon: Coffee, label: "Café", color: "bg-secondary text-primary" },
  { icon: ShoppingBag, label: "Grocery", color: "bg-accent-soft text-accent" },
  { icon: Gift, label: "Gifts", color: "bg-secondary text-primary" },
];

const deals = [
  { brand: "Marimekko", title: "−20% on spring collection", expires: "3 days left", color: "from-accent/90 to-accent" },
  { brand: "Prisma", title: "Buy 2 Get 1 Free coffee", expires: "Today only", color: "from-primary to-primary-glow" },
  { brand: "Stadium", title: "Free Jumbo tote with €40+", expires: "1 week left", color: "from-gold to-accent" },
];

export const HomeScreen = ({ name }: { name: string }) => {
  const [bannerIdx, setBannerIdx] = useState(0);

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up">
      {/* Header */}
      <header className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Welcome back</p>
            <h1 className="text-2xl font-bold text-foreground">Hello, {name} 👋</h1>
          </div>
          <button className="relative h-11 w-11 rounded-full bg-secondary flex items-center justify-center text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search 170+ stores, brands, deals…"
            className="w-full bg-secondary/70 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>

      {/* Banner carousel */}
      <section className="px-5 mb-6">
        <div className="relative rounded-3xl overflow-hidden h-44 shadow-card">
          {banners.map((b, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                i === bannerIdx ? "opacity-100" : "opacity-0",
              )}
            >
              <img src={b.img} alt={b.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-primary-foreground">
                <span className="inline-flex w-fit items-center gap-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                  <Sparkles className="h-3 w-3" /> {b.tag}
                </span>
                <h2 className="text-xl font-bold leading-tight">{b.title}</h2>
                <p className="text-xs opacity-90 mt-1">{b.subtitle}</p>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIdx(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === bannerIdx ? "w-6 bg-primary-foreground" : "w-1.5 bg-primary-foreground/50",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold">Browse</h3>
          <button className="text-xs font-semibold text-primary flex items-center gap-0.5">
            All categories <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card shadow-soft hover:shadow-card transition-smooth">
                <span className={cn("h-11 w-11 rounded-2xl flex items-center justify-center", c.color)}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold text-foreground">{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Deals */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold">Recommended for you</h3>
            <p className="text-xs text-muted-foreground">Picked from your favourite brands</p>
          </div>
          <Tag className="h-4 w-4 text-accent" />
        </div>

        <div className="space-y-3">
          {deals.map((d, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden bg-card shadow-soft p-4 flex items-center gap-4 hover:shadow-card transition-smooth">
              <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0", d.color)}>
                {d.brand.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{d.brand}</p>
                <p className="text-sm font-semibold text-foreground truncate">{d.title}</p>
                <p className="text-[11px] text-accent font-semibold mt-0.5">⏱ {d.expires}</p>
              </div>
              <button className="bg-primary text-primary-foreground text-xs font-bold px-3.5 py-2 rounded-xl shrink-0">
                Use
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Mall map */}
      <section className="px-5">
        <button className="relative w-full rounded-3xl overflow-hidden h-32 shadow-card group">
          <div className="absolute inset-0 gradient-primary" />
          {/* Decorative grid */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-accent flex items-center justify-center animate-pulse-glow">
            <MapPin className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="absolute bottom-0 left-0 p-5 text-left text-primary-foreground">
            <p className="text-xs font-semibold opacity-90">Interactive map</p>
            <h4 className="text-lg font-bold">Find any of 170+ stores</h4>
            <p className="text-xs opacity-80 mt-0.5">Floor 1 · 2 · 3 · Parking</p>
          </div>
        </button>
      </section>
    </div>
  );
};
