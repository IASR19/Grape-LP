"use client";

import type { ComponentPropsWithoutRef, ElementType } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type LiquidGlassVariant = "featured" | "list" | "listActive";

type LiquidGlassSurfaceProps<T extends ElementType = "div"> = {
  as?: T;
  variant?: LiquidGlassVariant;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "contentClassName">;

const variantClass: Record<LiquidGlassVariant, string> = {
  featured: "liquid-glass-featured text-foreground",
  list: "liquid-glass-list text-primary-foreground",
  listActive: "liquid-glass-list-active text-primary",
};

export function LiquidGlassSurface<T extends ElementType = "div">({
  as,
  variant = "featured",
  children,
  className,
  contentClassName,
  ...props
}: LiquidGlassSurfaceProps<T>) {
  const Component = as ?? "div";
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Component
      {...props}
      className={cn(
        "liquid-glass-surface",
        variantClass[variant],
        prefersReducedMotion && "liquid-glass-surface-static",
        className,
      )}
    >
      <span aria-hidden className="liquid-glass-surface__sheen" />
      <span aria-hidden className="liquid-glass-surface__rim" />
      <div className={cn("liquid-glass-surface__content", contentClassName)}>
        {children}
      </div>
    </Component>
  );
}
