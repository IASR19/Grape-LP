"use client";

import {
  Apple,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  SunMedium,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { GrapeMark } from "@/components/brand/grape-mark";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { grapeMethodSteps } from "@/content/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ORBIT_SIZES = {
  /** Mobile — órbita decorativa abaixo dos pilares. */
  decorative: { icon: 48, radius: 128, center: 88 },
  /** Desktop lg — órbita interativa ao lado do painel. */
  interactive: { icon: 58, radius: 192, center: 116 },
  /** Desktop xl — mais presença em telas largas. */
  interactiveXl: { icon: 64, radius: 212, center: 128 },
} as const;
const PILLAR_COUNT = grapeMethodSteps.length;
const ORBIT_SLOT_STEP = 360 / PILLAR_COUNT;
const ORBIT_ANGLE_OFFSET = -90;

/** Distribui os 7 pilares em intervalos iguais ao longo da órbita. */
function orbitSlotAngle(slotIndex: number) {
  return slotIndex * ORBIT_SLOT_STEP + ORBIT_ANGLE_OFFSET;
}

const pillarIcons: LucideIcon[] = [
  HeartPulse,
  Zap,
  Flame,
  Dumbbell,
  Leaf,
  Apple,
  SunMedium,
];

type ProcessMethodOrbitProps = {
  activeIndex?: number;
  onSelect?: (index: number) => void;
  /** `decorative` — órbita estática no mobile, sem seleção de pilares. */
  mode?: "interactive" | "decorative";
  className?: string;
};

function PillarIconSlot({
  index,
  active,
  onSelect,
  decorative = false,
  iconClassName,
}: {
  index: number;
  active: boolean;
  onSelect?: (index: number) => void;
  decorative?: boolean;
  iconClassName?: string;
}) {
  const step = grapeMethodSteps[index];
  const Icon = pillarIcons[index] ?? HeartPulse;
  const iconSizeClass =
    iconClassName ?? "size-[1.125rem] shrink-0 sm:size-5";

  const slotClass = cn(
    "relative z-10 grid size-full max-h-full max-w-full shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-300",
    decorative
      ? "border-primary-foreground/30 bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--primary)]"
      : active
        ? "border-primary/20 bg-primary-foreground text-primary shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary-foreground)_100%,transparent)]"
        : "border-primary-foreground/30 bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--primary)] hover:border-primary-foreground/42 hover:bg-[color-mix(in_oklch,var(--primary)_90%,var(--primary-foreground)_10%)]",
  );

  if (decorative) {
    return (
      <div className={slotClass} aria-hidden>
        <Icon className={iconSizeClass} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(index)}
      aria-label={`Selecionar pilar: ${step?.title ?? ""}`}
      aria-pressed={active}
      className={slotClass}
    >
      <Icon className={iconSizeClass} aria-hidden />
    </button>
  );
}

export function ProcessMethodOrbit({
  activeIndex = 0,
  onSelect,
  mode = "interactive",
  className,
}: ProcessMethodOrbitProps) {
  const isDecorative = mode === "decorative";
  const isXlViewport = useMediaQuery("(min-width: 1280px)");
  const {
    icon: orbitIconSize,
    radius: orbitRadius,
    center: centerMarkSize,
  } = isDecorative
    ? ORBIT_SIZES.decorative
    : isXlViewport
      ? ORBIT_SIZES.interactiveXl
      : ORBIT_SIZES.interactive;
  const orbitCanvas = orbitRadius * 2 + orbitIconSize;
  const pillarIconClass = isDecorative
    ? "size-[1.125rem] shrink-0 sm:size-5"
    : isXlViewport
      ? "size-5 shrink-0 xl:size-6"
      : "size-[1.125rem] shrink-0 lg:size-5";
  const centerMarkIconClass = isDecorative
    ? "size-[1.5rem] sm:size-7"
    : isXlViewport
      ? "size-8 xl:size-9"
      : "size-7 lg:size-8";
  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeStep = grapeMethodSteps[activeIndex] ?? grapeMethodSteps[0];
  const pillarAngles = grapeMethodSteps.map((_, index) => orbitSlotAngle(index));
  const pillarKeys = grapeMethodSteps.map((step) => step.title);
  const showCenterPulse = !prefersReducedMotion && isVisible;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { rootMargin: "120px 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative mx-auto shrink-0",
        isDecorative && "pointer-events-none",
        className,
      )}
      style={{ width: orbitCanvas, height: orbitCanvas }}
      role={isDecorative ? "presentation" : "img"}
      aria-label={
        isDecorative
          ? undefined
          : `Pilar ativo: ${activeStep.title}. Sete pilares orbitam ao redor do símbolo Grape.`
      }
    >
      <div className="relative size-full overflow-visible">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ width: centerMarkSize, height: centerMarkSize }}
          aria-hidden
        >
          {showCenterPulse ? (
            <>
              <span className="grape-orbit-pulse-ring absolute inset-0 rounded-full bg-primary-foreground" />
              <span className="grape-orbit-pulse-ring grape-orbit-pulse-ring-delay absolute inset-0 rounded-full bg-primary-foreground" />
            </>
          ) : null}
          <div
            className={cn(
              "relative grid size-full place-items-center rounded-full border border-primary/14 bg-primary-foreground",
              showCenterPulse && "grape-orbit-center-breathe",
            )}
          >
            <GrapeMark className={centerMarkIconClass} />
          </div>
        </div>

        <OrbitingCircles
          radius={orbitRadius}
          iconSize={orbitIconSize}
          duration={32}
          speed={0.65}
          path
          pathClassName="stroke-primary-foreground/34 stroke-[1.5] [stroke-dasharray:6_8]"
          paused={prefersReducedMotion || !isVisible}
          itemAngles={pillarAngles}
          itemKeys={pillarKeys}
          className={cn(
            "size-full",
            isDecorative ? "[&>div]:pointer-events-none" : "[&>div]:pointer-events-auto",
          )}
        >
          {grapeMethodSteps.map((step, index) => (
            <PillarIconSlot
              key={step.title}
              index={index}
              active={index === activeIndex}
              onSelect={onSelect}
              decorative={isDecorative}
              iconClassName={pillarIconClass}
            />
          ))}
        </OrbitingCircles>
      </div>

      {!isDecorative ? (
        <p className="sr-only">
          {activeStep.title}: {activeStep.text}
        </p>
      ) : null}
    </div>
  );
}
