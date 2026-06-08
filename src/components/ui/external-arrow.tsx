import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ExternalArrowProps = {
  className?: string;
  size?: "sm" | "md";
};

export function ExternalArrow({ className, size = "md" }: ExternalArrowProps) {
  return (
    <ArrowRight
      aria-hidden
      strokeWidth={2.25}
      className={cn(
        "shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-rotate-45",
        size === "sm" ? "size-3.5" : "size-4",
        className,
      )}
    />
  );
}
