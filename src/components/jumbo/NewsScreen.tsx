import { useState, useMemo } from "react";
import { Heart, CalendarPlus, Clock, MapPin, X, Share2 } from "lucide-react";
import newsFashion from "@/assets/news-fashion.jpg";
import newsCoffee from "@/assets/news-coffee.jpg";
import newsFamily from "@/assets/news-family.jpg";
import { cn } from "@/lib/utils";

type Category = "All" | "Events" | "New Stores" | "Offers" | "Workshops";

type Article = {
  img: string;
  tag: string;
  category: Exclude<Category, "All">;
  headline: string;
  desc: string;
  body: string;
  date: string;
  location: string;
  isEvent: boolean;
};

const articles: Article[] = [
  {
    img: newsFashion,
    tag: "Fashion",
    category: "Events",
    headline: "Spring Fashion Preview 2026",
    desc: "Discover this season's pastel palette across 30+ Jumbo fashion stores.",
    body: "Step into spring with Jumbo's biggest fashion event of the year. Live runway shows take place daily at the central plaza, featuring exclusive previews from over 30 fashion brands. Enjoy 20% off selected items during the event week and meet personal stylists for free consultations.",
    date: "Apr 24 · All week",
    location: "Plaza, Floor 1",
    isEvent: true,
  },
  {
    img: newsCoffee,
    tag: "New Opening",
    category: "New Stores",
    headline: "Robert's Coffee opens this Friday",
    desc: "Finland's beloved coffee chain joins Jumbo. First 100 visitors get a free latte.",
    body: "Robert's Coffee, Finland's iconic coffee house chain, is opening its newest location at Jumbo this Friday at 9:00. The first 100 visitors will receive a free signature latte, and Jumbo members get an extra 50 loyalty points on their first purchase.",
    date: "Friday 9:00",
    location: "Floor 2, near Stockmann",
    isEvent: false,
  },
  {
    img: newsFamily,
    tag: "Family",
    category: "Events",
    headline: "Kids Adventure Weekend",
    desc: "Free face painting, balloons and a treasure hunt across the mall.",
    body: "Bring the whole family for an unforgettable weekend! Free face painting, balloon artists, and a mall-wide treasure hunt with prizes for every child. Activities run from 11:00 to 17:00 both days. Don't miss the magic show at 14:00 each day in the Family Zone.",
    date: "May 3–4",
    location: "Family Zone",
    isEvent: true,
  },
  {
    img: newsFashion,
    tag: "Sale",
    category: "Offers",
    headline: "Members-only: 30% off sportswear",
    desc: "Exclusive weekend offer for Jumbo loyalty members across 8 sport stores.",
    body: "This weekend only, Jumbo loyalty members enjoy 30% off all sportswear at participating stores including Stadium, XXL, and Intersport. Just show your digital member card at checkout. Earn double points on purchases above 50€.",
    date: "This weekend",
    location: "All sport stores",
    isEvent: false,
  },
  {
    img: newsCoffee,
    tag: "Workshop",
    category: "Workshops",
    headline: "Latte Art Workshop with Robert's",
    desc: "Learn barista skills from Finland's coffee experts. Free for members.",
    body: "Join Robert's Coffee head barista for a hands-on latte art workshop. Limited to 12 participants per session. Free for Jumbo Gold members, 15€ for others. Includes coffee, pastries, and a free 250g bag of beans to take home.",
    date: "Apr 28 · 18:00",
    location: "Robert's Coffee, Floor 2",
    isEvent: true,
  },
];

const filters: Category[] = ["All", "Events", "New Stores", "Offers", "Workshops"];

export const NewsScreen = () => {
  const [active, setActive] = useState<Category>("All");
  const [liked, setLiked] = useState<number[]>([1]);
  const [reading, setReading] = useState<Article | null>(null);

  const toggleLike = (i: number) =>
    setLiked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const visible = useMemo(
    () => (active === "All" ? articles : articles.filter((a) => a.category === active)),
    [active],
  );

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
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-5 space-y-4">
        {visible.length === 0 && (
          <div className="text-center py-10 text-sm text-muted-foreground">
            No articles in this category yet.
          </div>
        )}
        {visible.map((a) => {
          const i = articles.indexOf(a);
          return (
            <article
              key={i}
              className="rounded-3xl overflow-hidden bg-card shadow-soft hover:shadow-card transition-smooth"
            >
              <button onClick={() => setReading(a)} className="block w-full text-left">
                <div className="relative h-44">
                  <img src={a.img} alt={a.headline} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <span className="absolute top-3 left-3 bg-card/95 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {a.tag}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(i);
                    }}
                    role="button"
                    aria-label="Save"
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center transition-smooth cursor-pointer"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-smooth",
                        liked.includes(i) ? "fill-primary text-primary scale-110" : "text-foreground",
                      )}
                    />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold leading-snug mb-1.5">{a.headline}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{a.desc}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.date}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-blue-soft text-brand-blue text-xs font-bold py-2.5 rounded-xl">
                      Read more
                    </span>
                    {a.isEvent && (
                      <span
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1 bg-brand-green text-white text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer"
                      >
                        <CalendarPlus className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </article>
          );
        })}
      </div>

      {/* Reader modal */}
      {reading && (
        <div
          className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end animate-slide-up"
          onClick={() => setReading(null)}
        >
          <div
            className="w-full max-h-[90%] bg-card rounded-t-3xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 shrink-0">
              <img src={reading.img} alt={reading.headline} className="absolute inset-0 w-full h-full object-cover" />
              <button
                onClick={() => setReading(null)}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/95 backdrop-blur flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {reading.tag}
              </span>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-hide">
              <h2 className="text-xl font-bold leading-tight mb-2">{reading.headline}</h2>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {reading.date}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {reading.location}</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5">{reading.body}</p>
              <div className="flex gap-2">
                {reading.isEvent && (
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-green text-white text-xs font-bold py-3 rounded-xl">
                    <CalendarPlus className="h-4 w-4" /> Add to Calendar
                  </button>
                )}
                <button className="inline-flex items-center justify-center gap-2 bg-secondary text-primary text-xs font-bold px-4 py-3 rounded-xl">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
