import { layout } from "@/lib/layout";
import { cn } from "@/lib/utils";

type HomeSectionDividerProps = {
  className?: string;
};

/** Separador editorial entre seções dentro da mesma faixa — ritmo sem card aninhado. */
export function HomeSectionDivider({ className }: HomeSectionDividerProps) {
  return (
    <div
      className={cn(
        layout.gutter,
        "pointer-events-none",
        layout.sectionDivider,
        className,
      )}
      aria-hidden
    >
      <div className="mx-auto h-px max-w-7xl bg-linear-to-r from-transparent via-border/55 to-transparent dark:via-white/10" />
    </div>
  );
}
