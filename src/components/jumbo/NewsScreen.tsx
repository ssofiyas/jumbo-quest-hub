import { useState } from "react";
import { Heart, CalendarPlus, Clock, MapPin } from "lucide-react";
import newsFashion from "@/assets/news-fashion.jpg";
import newsCoffee from "@/assets/news-coffee.jpg";
import newsFamily from "@/assets/news-family.jpg";
import { cn } from "@/lib/utils";

const articles = [
  {
    img: newsFashion,
    tag: "Fashion",
    headline: "Spring Fashion Preview 2026",
    desc: "Discover this season's pastel palette across 30+ Jumbo fashion stores. Live looks daily at the central plaza.",
    date: "Apr 24 · All week",
    location: "Plaza, Floor 1",
    isEvent: true,
  },
  {
    img: newsCoffee,
    tag: "New Opening",
    headline: "Robert's Coffee opens this Friday",
    desc: "Finland's beloved coffee chain joins Jumbo. First 100 visitors get a free signature latte.",
    date: "Friday 9:00",
    location: "Floor 2, near Stockmann",
    isEvent: false,
  },
  {
    img: newsFamily,
    tag: "Family",
    headline: "Kids Adventure Weekend",
    desc: "Free face painting, balloons and a treasure hunt across the mall. Bring the whole family for a day of fun.",
    date: "May 3–4",
    location: "Family Zone",
    isEvent: true,
  },
];

const filters = ["All", "Events", "New Stores", "Offers", "Workshops"];

export const NewsScreen = () => {
  const [active, setActive] = useState("All");
  const [liked, setLiked] = useState<number[]>([1]);

  const toggleLike = (i: number) =>
    setLiked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide animate-slide-up">
      <header className="px-5 pt-2 pb-3">
        <p className="text-xs text-muted-foreground font-medium">What's happening</p>
        <h1 className="text-2xl font-bold">News & Events</h1>
      </header>

      {/* Filters */}
      <div className="px-5 mb-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                "text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-smooth",
                active === f
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-5 space-y-4">
        {articles.map((a, i) => (
          <article key={i} className="rounded-3xl overflow-hidden bg-card shadow-soft hover:shadow-card transition-smooth">
            <div className="relative h-44">
              <img src={a.img} alt={a.headline} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-3 left-3 bg-card/95 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {a.tag}
              </span>
              <button
                onClick={() => toggleLike(i)}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center transition-smooth"
                aria-label="Save"
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-smooth",
                    liked.includes(i) ? "fill-accent text-accent scale-110" : "text-foreground",
                  )}
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-base font-bold leading-snug mb-1.5">{a.headline}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{a.desc}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.date}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
              </div>
              {a.isEvent && (
                <button className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-primary text-xs font-bold py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-smooth">
                  <CalendarPlus className="h-4 w-4" /> Add to Calendar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
