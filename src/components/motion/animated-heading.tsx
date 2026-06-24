"use client";

import type { ElementType } from "react";

import { SplitText, type SplitTextProps } from "@/components/effects/split-text";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const splitPresets = {
  scroll: {
    triggerMode: "scroll" as const,
    splitType: "words" as const,
    delay: 32,
    duration: 0.62,
    ease: "power4.out",
    from: { opacity: 0, y: 22 },
    to: { opacity: 1, y: 0 },
    rootMargin: "-48px",
    threshold: 0.12,
  },
  change: {
    triggerMode: "change" as const,
    splitType: "chars" as const,
    delay: 24,
    duration: 0.54,
    ease: "power4.out",
    from: { opacity: 0, y: 22 },
    to: { opacity: 1, y: 0 },
  },
  intro: {
    triggerMode: "change" as const,
    splitType: "chars" as const,
    delay: 26,
    duration: 0.58,
    ease: "power4.out",
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0 },
  },
} satisfies Record<string, Partial<SplitTextProps>>;

type AnimatedHeadingProps = {
  text: string;
  as?: ElementType;
  mode?: keyof typeof splitPresets;
  className?: string;
  textAlign?: SplitTextProps["textAlign"];
} & Partial<SplitTextProps>;

/** Título com SplitText — scroll na entrada ou reanimação ao mudar o texto. */
export function AnimatedHeading({
  text,
  as = "h2",
  mode = "scroll",
  className,
  textAlign = "left",
  ...overrides
}: AnimatedHeadingProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const preset = splitPresets[mode];
  const Tag = as as ElementType;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <SplitText
      key={
        mode === "change" || mode === "intro"
          ? text
          : "scroll"
      }
      tag={as}
      text={text}
      textAlign={textAlign}
      className={cn("block", className)}
      {...preset}
      {...overrides}
    />
  );
}
