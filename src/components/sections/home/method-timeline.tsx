"use client";

import gsap from "gsap";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { RevealItem, StaggerReveal } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { isTypingTarget } from "@/lib/a11y";
import { MOTION } from "@/lib/motion";
import type { MockImageVariant } from "@/components/media/mock-image";
import { cn } from "@/lib/utils";

export type MethodStep = {
  title: string;
  text: string;
  src?: string;
  variant: MockImageVariant;
};

type MethodTimelineProps = {
  steps: MethodStep[];
};

export function MethodTimeline({ steps }: MethodTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const fadeDuration = prefersReducedMotion ? 0 : 0.32;
  const active = steps[activeIndex];

  const moveTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(steps.length - 1, index)));
    },
    [steps.length],
  );

  useEffect(() => {
    const progress = progressRef.current;
    const marker = markerRef.current;
    if (!progress || !marker) return;

    const segment = 100 / steps.length;
    const center = segment * activeIndex + segment / 2;

    gsap.to(progress, {
      width: `${center}%`,
      duration: prefersReducedMotion ? 0 : 0.7,
      ease: "power3.out",
    });

    gsap.to(marker, {
      left: `${center}%`,
      duration: prefersReducedMotion ? 0 : 0.7,
      ease: "power3.out",
    });
  }, [activeIndex, prefersReducedMotion, steps.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function onKeyDown(event: KeyboardEvent) {
      if (!section?.contains(document.activeElement)) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveTo(activeIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveTo(activeIndex - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, moveTo]);

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const { key } = event;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;

    event.preventDefault();

    if (key === "Home") {
      moveTo(0);
      return;
    }

    if (key === "End") {
      moveTo(steps.length - 1);
      return;
    }

    if (key === "ArrowRight") {
      moveTo(activeIndex + 1);
      return;
    }

    moveTo(activeIndex - 1);
  }

  return (
    <StaggerReveal fast className="space-y-6 lg:space-y-8" ref={sectionRef}>
      <div
        role="tablist"
        aria-label="Etapas do método"
        onKeyDown={handleTabKeyDown}
        className="grid grid-cols-3 items-stretch gap-2 sm:gap-3"
      >
        {steps.map((step, index) => {
          const isActive = activeIndex === index;

          return (
            <RevealItem key={step.title} className="min-w-0">
            <button
              type="button"
              role="tab"
              id={`method-tab-${index}`}
              aria-selected={isActive}
              aria-controls="method-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => moveTo(index)}
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches) {
                  moveTo(index);
                }
              }}
              className={cn(
                "block h-full w-full min-h-[6rem] rounded-xl px-3 py-4 text-left motion-safe:transition-[background-color,color,transform] motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 sm:min-h-[6.5rem] sm:px-4 sm:py-5 lg:px-5",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted",
              )}
            >
              <span className="font-sans text-sm font-semibold tabular-nums leading-none sm:text-base">
                0{index + 1}
              </span>
              <span className="mt-2 block text-sm font-medium leading-snug sm:text-base">
                {step.title}
              </span>
            </button>
            </RevealItem>
          );
        })}
      </div>

      <div className="relative px-1">
        <div className="h-px bg-border" aria-hidden>
          <div
            ref={progressRef}
            className="h-full bg-primary"
            style={{ width: `${100 / steps.length / 2}%` }}
          />
        </div>
        <div
          ref={markerRef}
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-background"
          style={{ left: `${100 / steps.length / 2}%` }}
          aria-hidden
        />
      </div>

      <div
        id="method-panel"
        role="tabpanel"
        aria-labelledby={`method-tab-${activeIndex}`}
        className="relative min-h-[18rem] overflow-hidden rounded-xl sm:min-h-[22rem] lg:min-h-[26rem]"
      >
        {steps.map((step, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={step.title}
              aria-hidden={!isActive}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: fadeDuration, ease: MOTION.ease }}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
            >
              <ParallaxImage
                alt={step.title}
                src={step.src}
                variant={step.variant}
                speed={MOTION.parallax.card}
                sizes="(min-width: 1024px) 400px, 90vw"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/10" />
            </motion.div>
          );
        })}

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
          <motion.div
            key={activeIndex}
            initial={prefersReducedMotion ? false : { opacity: 0.88, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: MOTION.ease }}
          >
            <p className="font-sans text-[clamp(2.35rem,8vw,4.2rem)] font-medium leading-none text-white/20">
              0{activeIndex + 1}
            </p>
            <h3 className="mt-2 max-w-md text-balance font-sans text-3xl font-medium leading-[1.14] text-white sm:text-4xl">
              {active.title}
            </h3>
            <p className="mt-3 max-w-lg text-pretty text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
              {active.text}
            </p>
          </motion.div>
        </div>
      </div>
    </StaggerReveal>
  );
}
