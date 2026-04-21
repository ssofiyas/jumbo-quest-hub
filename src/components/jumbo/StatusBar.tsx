import { Signal, Wifi, BatteryFull } from "lucide-react";

export const StatusBar = ({ dark = false }: { dark?: boolean }) => {
  const cls = dark ? "text-primary-foreground" : "text-foreground";
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold ${cls}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </div>
    </div>
  );
};
