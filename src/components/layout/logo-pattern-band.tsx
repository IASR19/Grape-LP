import { cn } from "@/lib/utils";

type LogoPatternBandTone =
  | "default"
  | "pattern"
  | "muted"
  | "plain"
  | "primary"
  | "soft"
  | "soft-muted";

type LogoPatternBandProps = {
  children: React.ReactNode;
  className?: string;
  /** Tom de fundo da faixa — alterna para criar transição entre blocos editoriais. */
  tone?: LogoPatternBandTone;
};

/** Faixa editorial com tint de fundo e pattern local, aplicada apenas onde há intenção de bloco. */
export function LogoPatternBand({
  children,
  className,
  tone = "default",
}: LogoPatternBandProps) {
  const showsLocalPattern =
    tone === "pattern" ||
    tone === "muted" ||
    tone === "primary" ||
    tone === "soft" ||
    tone === "soft-muted";

  return (
    <div
      className={cn(
        "logo-pattern-band relative isolate overflow-x-clip [&>:not(.logo-pattern-band__pattern)]:relative [&>:not(.logo-pattern-band__pattern)]:z-10",
        tone === "default" && "bg-transparent",
        tone === "pattern" && "logo-pattern-band--pattern",
        tone === "muted" && "logo-pattern-band--muted",
        tone === "plain" && "bg-background",
        tone === "primary" && "logo-pattern-band--primary",
        tone === "soft" && "logo-pattern-band--soft",
        tone === "soft-muted" && "logo-pattern-band--soft-muted",
        className,
      )}
    >
      {showsLocalPattern ? (
        <div
          className={cn(
            "logo-pattern-band__pattern pointer-events-none absolute inset-0 z-0",
            tone === "pattern" && "logo-pattern-band__pattern--pattern",
            tone === "muted" && "logo-pattern-band__pattern--muted",
            tone === "primary" && "logo-pattern-band__pattern--primary",
            tone === "soft" && "logo-pattern-band__pattern--soft",
            tone === "soft-muted" && "logo-pattern-band__pattern--soft-muted",
          )}
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  );
}
