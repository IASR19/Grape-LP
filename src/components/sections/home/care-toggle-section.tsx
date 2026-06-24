"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  GSAP_EASE,
  gsapDuration,
  MOTION,
  scrollTriggerScroller,
} from "@/lib/motion";
import { layout } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

const careModes = {
  comum: {
    label: "Tentativas isoladas",
    headline: "Cansaço constante, mesmo dormindo bem, não é normal da idade.",
    lines: [
      "É um sinal. O corpo está comunicando um desequilíbrio que merece investigação, não adaptação.",
    ],
  },
  grape: {
    label: "Método Grape",
    headline: "Quando o corpo entra em equilíbrio, tudo muda",
    lines: [
      "Quando o seu corpo entra em equilíbrio hormonal e metabólico, a composição corporal muda de forma natural e sustentável. É assim que trabalhamos na Grape.",
    ],
  },
} as const;

const stepEase = [0.22, 1, 0.36, 1] as const;

const careHeadingMotion = {
  delay: 14,
  duration: 0.58,
  ease: "power3.out",
  from: { opacity: 0, y: 14 },
  to: { opacity: 1, y: 0 },
} as const;


const careTitleBlockClass =
  "relative w-full shrink-0 min-h-[calc(1.625rem*1.12*3+14px)] sm:min-h-[calc(2.75rem*1.12*2+22px)] lg:min-h-[calc(4.1rem*1.12*2+22px)]";

const careLinesBlockClass =
  "relative w-full max-w-2xl shrink-0 min-h-[calc(0.875rem*1.55*3+0.375rem*2)] sm:min-h-[6rem]";

/** Altura estável entre modos — evita colapso no crossfade mobile. */
const careContentShellClass =
  "relative w-full max-w-4xl min-h-[calc(1.625rem*1.12*3+14px+1rem+0.875rem*1.55*3+0.375rem*2)] sm:min-h-[calc(2.75rem*1.12*2+22px+1.75rem+6rem)] lg:min-h-[calc(4.1rem*1.12*2+22px+1.75rem+6rem)]";

function getCareContentDelays(headline: string) {
  const headingStartMs = 80;
  const headlineEnd =
    headingStartMs / 1000 + headline.length * (careHeadingMotion.delay / 1000) + 0.08;

  return {
    headingStartMs,
    linesStart: headlineEnd,
  };
}

export function CareToggleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const manualOverrideRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<keyof typeof careModes>("comum");
  const modeRef = useRef<keyof typeof careModes>("comum");
  const active = careModes[mode];
  const grapeMode = mode === "grape";
  const contentDelays = getCareContentDelays(active.headline);

  const setCareMode = useCallback((nextMode: keyof typeof careModes) => {
    modeRef.current = nextMode;
    setMode(nextMode);
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const maybeActivateGrape = (progress: number, threshold: number) => {
      if (manualOverrideRef.current || modeRef.current === "grape") return;
      if (progress >= threshold) {
        setCareMode("grape");
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        scroller: scrollTriggerScroller(),
        start: "top 88%",
        end: "top 38%",
        onUpdate: (self) => maybeActivateGrape(self.progress, 0.42),
        onEnter: (self) => maybeActivateGrape(self.progress, 0.42),
      });

      return () => trigger.kill();
    });

    mm.add("(min-width: 1024px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        scroller: scrollTriggerScroller(),
        start: "top 36%",
        end: "top 4%",
        onUpdate: (self) => maybeActivateGrape(self.progress, 0.54),
        onEnter: (self) => maybeActivateGrape(self.progress, 0.54),
      });

      return () => trigger.kill();
    });

    return () => mm.revert();
  }, [prefersReducedMotion, setCareMode]);

  useEffect(() => {
    const thumb = thumbRef.current;
    const track = thumb?.parentElement;
    if (!thumb || !track) return;

    const travel = track.clientWidth - thumb.offsetWidth - 8;

    if (prefersReducedMotion || document.hidden) {
      gsap.set(thumb, { x: grapeMode ? travel : 0 });
      return;
    }

    gsap.to(thumb, {
      x: grapeMode ? travel : 0,
      duration: gsapDuration(prefersReducedMotion, MOTION.duration.medium),
      ease: GSAP_EASE.out,
    });
  }, [grapeMode, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className={cn(
        "relative isolate overflow-hidden transition-colors duration-500",
        "max-sm:flex max-sm:min-h-[100svh] max-sm:flex-col max-sm:justify-center max-sm:py-0",
        "sm:min-h-[72svh] lg:min-h-[75svh]",
        layout.careToggle,
        grapeMode ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
      )}
    >
      <div className="care-toggle-grape-watermark" aria-hidden>
        <div
          className={cn(
            "care-toggle-grape-watermark__glyph",
            grapeMode && "care-toggle-grape-watermark__glyph--grape",
          )}
        />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full flex-col items-center justify-center text-center",
          "max-sm:flex-1 max-sm:min-h-0",
          "sm:min-h-[60svh]",
          layout.container,
          layout.gutter,
        )}
      >
        <Reveal
          preset="fadeUp"
          className="relative flex w-full flex-col items-center py-6 sm:py-10"
        >
          <div className="mb-10 flex w-full justify-center px-2 sm:mb-12 sm:px-0">
            <div className="inline-flex items-center gap-3 sm:gap-4">
              <span
                className={cn(
                  "text-center text-xs font-semibold leading-tight sm:min-w-[11rem] sm:text-right sm:text-sm",
                  grapeMode ? "text-primary-foreground/88" : "text-muted-foreground",
                )}
              >
                {active.label}
              </span>
              <button
                type="button"
                aria-pressed={grapeMode}
                aria-label={
                  grapeMode
                    ? "Desativar método Grape"
                    : "Ativar método Grape"
                }
                onClick={() => {
                  manualOverrideRef.current = true;
                  setCareMode(grapeMode ? "comum" : "grape");
                }}
                className={cn(
                  "relative h-8 w-14 shrink-0 rounded-full p-1 transition-colors sm:h-9 sm:w-16",
                  grapeMode ? "bg-primary-foreground/28" : "bg-primary/18",
                )}
              >
                <span
                  ref={thumbRef}
                  className={cn(
                    "block size-6 rounded-full bg-current sm:size-7",
                    grapeMode ? "text-primary-foreground" : "text-primary",
                  )}
                />
              </button>
            </div>
          </div>

          <div
            ref={contentRef}
            className="flex w-full flex-col items-center justify-center"
          >
            <div className={careContentShellClass}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={mode}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.32, ease: stepEase }}
                  className="absolute inset-0 flex flex-col items-center justify-start gap-4 sm:gap-7"
                >
                  <div className={careTitleBlockClass}>
                    <AnimatedHeading
                      as="h2"
                      mode="change"
                      text={active.headline}
                      textAlign="center"
                      className="mx-auto max-w-4xl px-1 pb-1 text-balance font-sans text-[clamp(1.5rem,6.4vw,1.85rem)] font-medium leading-[1.12] sm:px-0 sm:text-[clamp(2.2rem,5.4vw,4.1rem)] sm:leading-[1.12]"
                      {...careHeadingMotion}
                      startDelay={
                        prefersReducedMotion ? 0 : contentDelays.headingStartMs
                      }
                    />
                  </div>

                  <div
                    className={cn(
                      careLinesBlockClass,
                      "flex flex-col items-center justify-start",
                    )}
                  >
                    <motion.div
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: stepEase,
                        delay: prefersReducedMotion ? 0 : contentDelays.linesStart,
                      }}
                      className="mx-auto flex w-full max-w-[19.5rem] flex-col gap-1.5 px-1 sm:max-w-2xl sm:gap-2 sm:px-0"
                    >
                      {active.lines.map((line, index) => (
                        <p
                          key={`${mode}-${line}`}
                          className={cn(
                            "max-sm:text-justify text-balance text-[0.875rem] leading-[1.55] sm:text-lg sm:leading-8",
                            index === active.lines.length - 1 && "sm:max-w-xl sm:mx-auto",
                            index === 0 && "max-sm:font-medium",
                            grapeMode
                              ? index === 0
                                ? "text-primary-foreground/92"
                                : "text-primary-foreground/72"
                              : index === 0
                                ? "text-foreground/88"
                                : "text-muted-foreground",
                          )}
                        >
                          {line}
                        </p>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
