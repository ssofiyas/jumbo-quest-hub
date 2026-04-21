import logoUrl from "@/assets/jumbo-logo.png";
import { cn } from "@/lib/utils";

interface JumboLogoProps {
  className?: string;
  variant?: "default" | "white";
}

/** Jumbo brand logo. Use `variant="white"` over dark/colored backgrounds. */
export const JumboLogo = ({ className, variant = "default" }: JumboLogoProps) => (
  <img
    src={logoUrl}
    alt="Jumbo"
    className={cn(
      "h-7 w-auto object-contain select-none",
      variant === "white" && "brightness-0 invert",
      className,
    )}
    draggable={false}
  />
);
