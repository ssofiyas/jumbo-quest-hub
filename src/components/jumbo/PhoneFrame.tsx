import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export const PhoneFrame = ({ children }: PhoneFrameProps) => {
  return (
    <div className="min-h-screen w-full gradient-hero flex items-center justify-center p-0 sm:p-6">
      {/* Phone shell — full viewport on mobile, framed on desktop */}
      <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[860px] sm:rounded-[2.75rem] overflow-hidden bg-background sm:border-[10px] sm:border-foreground/90 sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
        {/* Notch (desktop only) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/90 rounded-b-2xl z-50" />
        <div className="relative w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
