"use client";

import { Activity, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { ProcessMethodOrbit } from "@/components/sections/home/process-method-orbit";
import { Reveal } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { grapeMethodCopy, grapeMethodSteps } from "@/content/site";
import { layout } from "@/lib/layout";
import { viewportBlock } from "@/lib/motion/reveal";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";

const stepEase = [0.22, 1, 0.36, 1] as const;

const processCardStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const processCardItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: stepEase },
  },
};

const desktopStepGridClass =
  "grid gap-2.5 sm:gap-3 lg:auto-rows-[9rem] lg:grid-cols-7 lg:items-stretch";

const desktopStepButtonClass =
  "group flex h-[9rem] w-full flex-col justify-between rounded-lg border px-3 py-3.5 text-left transition-[background-color,border-color,color,transform] duration-300 motion-safe:hover:-translate-y-0.5 sm:px-3.5 sm:py-4";

const inactiveStepButtonClass =
  "border-primary-foreground/26 bg-primary-foreground/[0.13] text-primary-foreground hover:border-primary-foreground/34 hover:bg-primary-foreground/[0.18]";

const activeStepButtonClass =
  "border-primary/22 bg-primary-foreground text-primary hover:border-primary/28 hover:bg-primary-foreground";

const desktopStepTitleClass =
  "mt-auto text-pretty font-sans text-base font-medium leading-snug line-clamp-3";

const processActivePanelShellClass = "grid min-h-[16rem]";

const processMethodBrandClass =
  "inline-flex items-center rounded-full border border-primary-foreground/28 bg-primary-foreground/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-primary-foreground/95 sm:text-xs";
const onPrimaryBodyClass = "text-pretty text-base leading-7 text-primary-foreground/86";
const onPrimaryMetaClass = "text-sm font-medium text-primary-foreground/66";

function stepIndexClass(active: boolean) {
  return active ? "text-primary/62" : "text-primary-foreground/52";
}

const activeStepCopyClass = "text-primary/76";
const processActiveCopyClass =
  "max-w-2xl text-pretty leading-7";

const processHeadingMotion = {
  delay: 16,
  duration: 0.62,
  ease: "power3.out",
  from: { opacity: 0, y: 14 },
  to: { opacity: 1, y: 0 },
} as const;

function getProcessContentDelays(title: string) {
  const headingStartMs = 120;
  const headingStart = headingStartMs / 1000;
  const titleEnd =
    headingStart + title.length * (processHeadingMotion.delay / 1000) + 0.08;

  return {
    meta: 0.04,
    headingStartMs,
    copy: titleEnd,
  };
}

const processActiveTitleClass = cn(
  "max-w-xl min-h-[3.25rem] text-balance line-clamp-2 text-primary-foreground",
  type.sectionSub,
);

const processMobileActiveCopyClass = cn(
  "block max-w-xl text-pretty px-4 pb-4 pt-0 text-sm leading-7",
  activeStepCopyClass,
);

type ProcessMobileStepButtonProps = {
  step: (typeof grapeMethodSteps)[number];
  index: number;
  active: boolean;
  prefersReducedMotion: boolean;
  onSelect: () => void;
};

function ProcessMobileStepButton({
  step,
  index,
  active,
  prefersReducedMotion,
  onSelect,
}: ProcessMobileStepButtonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border transition-[border-color,background-color] duration-300",
        active ? activeStepButtonClass : inactiveStepButtonClass,
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        aria-expanded={active}
        className="grid w-full px-4 py-4 text-left"
      >
        <span className="flex items-start justify-between gap-4">
          <span className="grid gap-2">
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                stepIndexClass(active),
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "font-sans text-base font-medium leading-snug sm:text-xl",
                active ? "text-primary" : "text-primary-foreground",
              )}
            >
              {step.title}
            </span>
          </span>
          {active ? (
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
          ) : (
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-current text-primary-foreground/32"
              aria-hidden
            />
          )}
        </span>
      </button>

      {prefersReducedMotion ? (
        active ? <p className={processMobileActiveCopyClass}>{step.text}</p> : null
      ) : (
        <AnimatePresence initial={false}>
          {active ? (
            <motion.div
              key={`${step.title}-mobile-panel`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.38, ease: stepEase },
                opacity: { duration: 0.22, ease: stepEase },
              }}
              className="overflow-hidden"
            >
              <p className={processMobileActiveCopyClass}>{step.text}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}

function ProcessActivePanel({
  activeIndex,
  prefersReducedMotion,
}: {
  activeIndex: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <div className={processActivePanelShellClass}>
        {grapeMethodSteps.map((step, index) => {
          const active = index === activeIndex;
          const contentDelays = getProcessContentDelays(step.title);

          return (
            <motion.div
              key={step.title}
              className={cn(
                "col-start-1 row-start-1 flex flex-col gap-3.5",
                active ? "z-10" : "pointer-events-none z-0",
              )}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.24, ease: stepEase }}
              aria-hidden={!active}
            >
              <div
                className={cn(
                  "flex min-h-7 flex-wrap items-center gap-3",
                  onPrimaryMetaClass,
                )}
              >
                <span className="flex items-center gap-2">
                  <Activity className="size-4 text-primary-foreground/72" aria-hidden />
                  Frente ativa
                </span>
                <span className="h-px w-10 bg-primary-foreground/18" aria-hidden />
                <span className="tabular-nums">
                  {String(index + 1).padStart(2, "0")} / 07
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {active ? (
                  <AnimatedHeading
                    as="h3"
                    mode="change"
                    text={step.title}
                    className={processActiveTitleClass}
                    {...processHeadingMotion}
                    startDelay={
                      prefersReducedMotion ? 0 : contentDelays.headingStartMs
                    }
                  />
                ) : (
                  <h3 className={processActiveTitleClass}>{step.title}</h3>
                )}

                {active ? (
                  <motion.p
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 12 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.42,
                      ease: stepEase,
                      delay: prefersReducedMotion ? 0 : contentDelays.copy,
                    }}
                    className={cn(processActiveCopyClass, onPrimaryBodyClass)}
                  >
                    {step.text}
                  </motion.p>
                ) : (
                  <p className={cn(processActiveCopyClass, onPrimaryBodyClass)}>
                    {step.text}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const progress = ((activeIndex + 1) / grapeMethodSteps.length) * 100;

  return (
    <section
      id="experiencia"
      className={cn(
        layout.sectionProcess,
        layout.gutter,
        "relative border-y border-primary-foreground/10 bg-primary text-primary-foreground",
      )}
    >
      <div className={cn("mx-auto flex flex-col", layout.processContentGap, layout.container)}>
        <div className="max-w-3xl lg:hidden">
          <Reveal preset="fadeUp">
            <p className={processMethodBrandClass}>{grapeMethodCopy.eyebrow}</p>
          </Reveal>
          <AnimatedHeading
            text={grapeMethodCopy.title}
            className={cn("mt-4 max-w-3xl text-balance text-primary-foreground", type.sectionCompact)}
          />
          <Reveal preset="fadeUp" delay={0.06}>
            {grapeMethodCopy.description ? (
              <p className={cn("max-w-2xl", onPrimaryBodyClass, "mt-4 sm:mt-5")}>
                {grapeMethodCopy.description}
              </p>
            ) : null}
          </Reveal>
        </div>

        <div className="flex justify-center lg:hidden">
          <ProcessMethodOrbit mode="decorative" />
        </div>

        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-14 xl:gap-x-18">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="max-w-3xl">
              <Reveal preset="fadeUp">
                <p className={processMethodBrandClass}>{grapeMethodCopy.eyebrow}</p>
              </Reveal>
              <AnimatedHeading
                text={grapeMethodCopy.title}
                className={cn("mt-4 max-w-3xl text-balance text-primary-foreground", type.sectionCompact)}
              />
              <Reveal preset="fadeUp" delay={0.06}>
                {grapeMethodCopy.description ? (
                  <p className={cn("max-w-2xl", onPrimaryBodyClass, "mt-4")}>
                    {grapeMethodCopy.description}
                  </p>
                ) : null}
              </Reveal>
            </div>

            <ProcessActivePanel
              activeIndex={activeIndex}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          <ProcessMethodOrbit
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            className="justify-self-end"
          />
        </div>

        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-6">
            <Reveal preset="fadeUp" delay={0.06}>
              <div
                className="h-px overflow-hidden rounded-full bg-primary-foreground/16"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Avanço nas frentes do Método Grape"
              >
                <div
                  className="h-full origin-left rounded-full bg-primary-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
            </Reveal>

            {prefersReducedMotion ? (
              <div className="grid gap-3.5 lg:hidden">
                {grapeMethodSteps.map((step, index) => (
                  <ProcessMobileStepButton
                    key={step.title}
                    step={step}
                    index={index}
                    active={activeIndex === index}
                    prefersReducedMotion
                    onSelect={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-3.5 lg:hidden">
                {grapeMethodSteps.map((step, index) => (
                  <ProcessMobileStepButton
                    key={step.title}
                    step={step}
                    index={index}
                    active={activeIndex === index}
                    prefersReducedMotion={false}
                    onSelect={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            )}

            {prefersReducedMotion ? (
              <div className={cn(desktopStepGridClass, "hidden lg:grid")}>
                {grapeMethodSteps.map((step, index) => {
                  const active = activeIndex === index;

                  return (
                    <div key={step.title} className="h-[9rem]">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={active}
                        className={cn(
                          desktopStepButtonClass,
                          active ? activeStepButtonClass : inactiveStepButtonClass,
                        )}
                      >
                      <span
                        className={cn(
                          "flex items-center justify-between gap-3 text-sm font-medium tabular-nums",
                          stepIndexClass(active),
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                        {active ? (
                          <CheckCircle2 className="size-4 text-primary" aria-hidden />
                        ) : (
                          <span
                            className="size-1.5 rounded-full bg-current"
                            aria-hidden
                          />
                        )}
                      </span>
                      <span
                        className={cn(
                          desktopStepTitleClass,
                          active ? "text-primary" : "text-primary-foreground/92",
                        )}
                      >
                        {step.title}
                      </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                className={cn(desktopStepGridClass, "hidden lg:grid")}
                initial="hidden"
                whileInView="show"
                viewport={viewportBlock}
                variants={processCardStagger}
              >
                {grapeMethodSteps.map((step, index) => {
                  const active = activeIndex === index;

                  return (
                    <motion.div
                      key={step.title}
                      variants={processCardItem}
                      className="h-[9rem]"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={active}
                        className={cn(
                          desktopStepButtonClass,
                          active ? activeStepButtonClass : inactiveStepButtonClass,
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-between gap-3 text-sm font-medium tabular-nums",
                            stepIndexClass(active),
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                          {active ? (
                            <CheckCircle2 className="size-4 text-primary" aria-hidden />
                          ) : (
                            <span
                              className="size-1.5 rounded-full bg-current"
                              aria-hidden
                            />
                          )}
                        </span>
                        <span
                        className={cn(
                          desktopStepTitleClass,
                          active ? "text-primary" : "text-primary-foreground/92",
                        )}
                      >
                        {step.title}
                      </span>
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
        </div>
      </div>
    </section>
  );
}
