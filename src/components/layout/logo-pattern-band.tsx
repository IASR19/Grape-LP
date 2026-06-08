import { cn } from "@/lib/utils";

type LogoPatternBandProps = {
  children: React.ReactNode;
  className?: string;
};

/** Faixa contínua com pattern da marca (`/brand/grapeclinic-pattern.svg`). */
export function LogoPatternBand({ children, className }: LogoPatternBandProps) {
  return (
    <div className={cn("logo-pattern-band relative isolate overflow-x-clip bg-background", className)}>
      <div className="logo-pattern-band__pattern pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
