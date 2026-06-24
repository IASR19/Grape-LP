"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { journeySteps, type JourneyStep } from "@/content/home-care-paths";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

export const stepEase = [0.22, 1, 0.36, 1] as const;

export const journeyImageTransition = {
  opacity: { duration: 0.58, ease: stepEase },
} as const;

export const journeyTextEase = stepEase;

export const journeyTextTransition = {
  meta: { duration: 0.34, ease: journeyTextEase },
  order: { duration: 0.52, ease: journeyTextEase },
  copy: { duration: 0.56, ease: journeyTextEase },
  detail: { duration: 0.5, ease: journeyTextEase },
  tag: { duration: 0.42, ease: journeyTextEase },
} as const;

export const journeyHeadingMotion = {
  delay: 16,
  duration: 0.62,
  ease: "power3.out",
  from: { opacity: 0, y: 14 },
  to: { opacity: 1, y: 0 },
} as const;

function getJourneyContentDelays(title: string) {
  const order = 0.08;
  const headingStartMs = 150;
  const headingStart = headingStartMs / 1000;
  const titleEnd =
    headingStart + title.length * (journeyHeadingMotion.delay / 1000) + 0.1;

  return {
    meta: 0.04,
    order,
    headingStartMs,
    copy: titleEnd,
    detail: titleEnd + 0.14,
    tags: titleEnd + 0.24,
  };
}

export const journeyTitleBlockClass = "flex w-full flex-col";

export { journeySteps, type JourneyStep };

export function resolveStepDirection(current: number, next: number): 1 | -1 {
  if (next === current) return 1;
  return next > current ? 1 : -1;
}

type JourneyStepMediaProps = {
  steps: readonly JourneyStep[];
  activeStepIndex: number;
  prefersReducedMotion: boolean;
  sizes?: string;
};

function JourneyStepMedia({
  steps,
  activeStepIndex,
  prefersReducedMotion,
  sizes = "(min-width: 1024px) 48vw, 92vw",
}: JourneyStepMediaProps) {
  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : journeyImageTransition;

  return (
    <>
      {steps.map((step, index) => {
        const isActive = activeStepIndex === index;

        return (
          <motion.div
            key={step.id}
            aria-hidden={!isActive}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={fadeTransition}
            className="absolute inset-0 overflow-hidden bg-muted [contain:paint] [transform:translateZ(0)]"
            style={{
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <Image
              src={step.image.src}
              alt={step.image.alt}
              fill
              sizes={sizes}
              className="object-cover object-center"
              priority={index === 0}
            />
          </motion.div>
        );
      })}
    </>
  );
}

export type JourneyStepDetailProps = {
  step: JourneyStep;
  stepIndex: number;
  prefersReducedMotion: boolean;
  direction?: 1 | -1;
  className?: string;
  contentClassName?: string;
};

export function JourneyStepDetail({
  step,
  stepIndex,
  prefersReducedMotion,
  direction = 1,
  className,
  contentClassName,
}: JourneyStepDetailProps) {
  const order = String(stepIndex + 1).padStart(2, "0");
  const copyOffset = direction * 10;
  const delays = getJourneyContentDelays(step.title);

  return (
    <div className={cn("relative h-full overflow-hidden [contain:paint]", className)}>
      <JourneyStepMedia
        steps={journeySteps}
        activeStepIndex={stepIndex}
        prefersReducedMotion={prefersReducedMotion}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-t from-black/78 via-black/32 to-transparent"
        aria-hidden
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.24, ease: journeyTextEase }}
          className={cn(
            "absolute inset-0 z-10 flex flex-col justify-end overflow-hidden text-white [transform:translateZ(0)]",
            contentClassName,
          )}
        >
          <div
            className={cn(
              journeyTitleBlockClass,
              "relative w-full max-w-xl lg:max-w-2xl",
            )}
          >
            <motion.p
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...journeyTextTransition.meta,
                delay: prefersReducedMotion ? 0 : delays.meta,
              }}
              className="mb-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-white/72 uppercase tabular-nums lg:mb-4"
            >
              Etapa {order}
              <span aria-hidden className="mx-2 text-white/35">
                ·
              </span>
              {order} de 04
            </motion.p>

            <AnimatedHeading
              as="h3"
              mode="change"
              text={step.title}
              className={cn(
                "max-w-2xl shrink-0 text-white",
                type.sectionCompact,
              )}
              {...journeyHeadingMotion}
              startDelay={
                prefersReducedMotion ? 0 : delays.headingStartMs
              }
            />

            <motion.p
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: copyOffset,
                    }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...journeyTextTransition.copy,
                delay: prefersReducedMotion ? 0 : delays.copy,
              }}
              className="mt-3 max-w-[30ch] text-pretty text-[0.9375rem] leading-[1.65] text-white/80 sm:max-w-none sm:text-base sm:leading-8 lg:mt-4"
            >
              {step.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export type JourneyProgressProps = {
  activeStepIndex: number;
  activeTitle: string;
  showHeading?: boolean;
  className?: string;
};

export function JourneyProgress({
  activeStepIndex,
  activeTitle,
  showHeading = false,
  className,
}: JourneyProgressProps) {
  const progress = ((activeStepIndex + 1) / journeySteps.length) * 100;

  return (
    <div className={cn("px-1", className)}>
      {showHeading ? (
        <div className="mb-3 flex items-end justify-between gap-4">
          <p className="font-sans text-xl font-medium leading-tight">{activeTitle}</p>
          <span className="pb-1 text-xs tabular-nums text-muted-foreground">
            {String(activeStepIndex + 1).padStart(2, "0")} / 04
          </span>
        </div>
      ) : null}
      <div
        className="h-px overflow-hidden rounded-full bg-border/80"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label="Avanço nas etapas da jornada"
      >
        <div
          className="h-full origin-left rounded-full bg-primary/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </div>
  );
}
