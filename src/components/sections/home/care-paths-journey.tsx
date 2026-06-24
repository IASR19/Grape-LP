"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Reveal, RevealItem, StaggerReveal } from "@/components/motion/reveal";
import {
  JourneyProgress,
  JourneyStepDetail,
  journeySteps,
  resolveStepDirection,
  stepEase,
  type JourneyStep,
} from "@/components/sections/home/care-paths-journey-shared";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type StepButtonProps = {
  step: JourneyStep;
  index: number;
  active: boolean;
  panelId?: string;
  onSelect: () => void;
};

function StepButton({
  step,
  index,
  active,
  panelId,
  onSelect,
}: StepButtonProps) {
  const order = String(index + 1).padStart(2, "0");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-expanded={panelId ? active : undefined}
      aria-controls={panelId}
      className={cn(
        "group relative grid w-full grid-cols-[2.5rem_minmax(0,1fr)_2.25rem] items-center gap-4 px-4 py-4 text-left transition-[background-color,border-color,color] duration-300 sm:px-5",
        "min-h-[4.75rem] sm:min-h-20 lg:h-full lg:min-h-0",
        active && panelId
          ? "bg-secondary text-foreground"
          : active
            ? "text-foreground"
            : "text-foreground hover:border-primary/22",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-3 left-0 w-px rounded-full transition-colors",
          active ? "bg-primary" : "bg-transparent",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "font-sans text-base font-medium tabular-nums transition-colors duration-300 sm:text-lg",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {order}
      </span>
      <span className="min-w-0 font-sans text-sm font-medium leading-snug sm:text-lg lg:text-[1.1875rem]">
        {step.title}
      </span>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full transition-[background-color,color] duration-300 sm:size-9",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
        )}
      >
        {active ? (
          <CheckCircle2 className="size-4" strokeWidth={2.25} aria-hidden />
        ) : (
          <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
        )}
      </span>
    </button>
  );
}

type MobileStepAccordionProps = {
  step: JourneyStep;
  index: number;
  active: boolean;
  prefersReducedMotion: boolean;
  direction: 1 | -1;
  onSelect: () => void;
};

function MobileStepAccordion({
  step,
  index,
  active,
  prefersReducedMotion,
  direction,
  onSelect,
}: MobileStepAccordionProps) {
  const order = String(index + 1).padStart(2, "0");
  const panelId = `journey-mobile-panel-${index}`;

  return (
    <RevealItem>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border/80 bg-card/88 transition-[border-color,background-color] duration-300",
        )}
      >
        <StepButton
          step={step}
          index={index}
          active={active}
          panelId={panelId}
          onSelect={onSelect}
        />

        <AnimatePresence initial={false}>
          {active ? (
            <motion.div
              id={panelId}
              key={`${step.title}-mobile-panel`}
              role="region"
              aria-label={`Etapa ${order}: ${step.title}`}
              initial={
                prefersReducedMotion ? false : { height: 0, opacity: 0.94 }
              }
              animate={{ height: "auto", opacity: 1 }}
              exit={
                prefersReducedMotion ? undefined : { height: 0, opacity: 0.94 }
              }
              transition={{
                height: { duration: 0.46, ease: stepEase },
                opacity: { duration: 0.32, ease: stepEase },
              }}
              className="overflow-hidden"
            >
              <JourneyStepDetail
                step={step}
                stepIndex={index}
                prefersReducedMotion={prefersReducedMotion}
                direction={direction}
                className="aspect-[5/4] w-full"
                contentClassName="p-4 sm:p-6"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </RevealItem>
  );
}

export function CarePathsJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeStep = journeySteps[activeStepIndex] ?? journeySteps[0];

  function selectStep(index: number) {
    setStepDirection(resolveStepDirection(activeStepIndex, index));
    setActiveStepIndex(index);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-stretch lg:gap-12">
      <Reveal
        preset="fadeUp"
        delay={0.08}
        className="hidden lg:order-1 lg:block lg:h-[28rem] lg:sticky lg:top-24 lg:min-h-0"
      >
        <div
          id="journey-featured-panel"
          className="aspect-[5/4] h-full w-full overflow-hidden rounded-lg border border-border/70 bg-card lg:aspect-auto lg:h-[28rem]"
          aria-live="polite"
          aria-atomic="true"
        >
          <JourneyStepDetail
            step={activeStep}
            stepIndex={activeStepIndex}
            prefersReducedMotion={prefersReducedMotion}
            direction={stepDirection}
            className="h-full"
            contentClassName="p-8 lg:p-10"
          />
        </div>
      </Reveal>

      <div
        className="flex flex-col gap-4 scroll-mt-28 lg:order-2 lg:h-[28rem] lg:min-h-0"
      >
        <Reveal preset="fadeUp" className="shrink-0">
          <JourneyProgress
            activeStepIndex={activeStepIndex}
            activeTitle={activeStep.title}
            className="lg:hidden"
          />
          <JourneyProgress
            activeStepIndex={activeStepIndex}
            activeTitle={activeStep.title}
            showHeading
            className="hidden lg:block"
          />
        </Reveal>

        <StaggerReveal className="grid gap-2.5 lg:hidden">
          {journeySteps.map((step, index) => (
            <MobileStepAccordion
              key={step.title}
              step={step}
              index={index}
              active={activeStepIndex === index}
              prefersReducedMotion={prefersReducedMotion}
              direction={stepDirection}
              onSelect={() => selectStep(index)}
            />
          ))}
        </StaggerReveal>

        <StaggerReveal className="hidden min-h-0 flex-1 gap-3.5 lg:grid lg:grid-rows-4">
          {journeySteps.map((step, index) => (
            <RevealItem key={step.title} className="h-full min-h-0">
              <div
                className={cn(
                  "h-full overflow-hidden rounded-lg border transition-[border-color,background-color] duration-300",
                  activeStepIndex === index
                    ? "border-primary/38 bg-secondary/82"
                    : "border-border/78 bg-card/86 hover:border-primary/22 hover:bg-card",
                )}
              >
                <StepButton
                  step={step}
                  index={index}
                  active={activeStepIndex === index}
                  onSelect={() => selectStep(index)}
                />
              </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </div>
  );
}
