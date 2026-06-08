"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { mediaAssets } from "@/content/media";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  GSAP_EASE,
  gsapDuration,
  MOTION,
  scrollTriggerScroller,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const careModes = {
  comum: {
    label: "Tentativas isoladas",
    title: "Quando emagrecer parece depender de recomeçar sempre.",
    text: "Dietas rígidas e respostas simples ignoram rotina, hormônios e histórico de saúde.",
  },
  grape: {
    label: "Metodo Grape",
    title: "Acompanhamento com ciência, leitura clínica e constância.",
    text: "Avaliação, plano individual e monitoramento. Cuidado como percurso, não impulso.",
  },
} as const;

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

    const trigger = ScrollTrigger.create({
      trigger: section,
      scroller: scrollTriggerScroller(),
      start: "top 42%",
      end: "top 12%",
      onUpdate: (self) => {
        if (manualOverrideRef.current || modeRef.current === "grape") return;
        if (self.progress >= 0.88) {
          setCareMode("grape");
        }
      },
    });

    return () => trigger.kill();
  }, [prefersReducedMotion, setCareMode]);

  useEffect(() => {
    const thumb = thumbRef.current;
    const content = contentRef.current;
    if (!thumb) return;

    if (prefersReducedMotion || document.hidden) {
      gsap.set(thumb, { x: grapeMode ? 28 : 0 });
      if (content) {
        gsap.set(content, { y: 0, opacity: 1, filter: "blur(0px)" });
      }
      return;
    }

    gsap.to(thumb, {
      x: grapeMode ? 28 : 0,
      duration: gsapDuration(prefersReducedMotion, MOTION.duration.medium),
      ease: GSAP_EASE.out,
    });

    if (!content) return;

    gsap.fromTo(
      content,
      { y: 10, opacity: 0.72, filter: "blur(6px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: gsapDuration(prefersReducedMotion, MOTION.duration.medium),
        ease: GSAP_EASE.out,
      },
    );
  }, [grapeMode, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="metodo"
      className={cn(
        "relative isolate min-h-svh overflow-hidden py-24 transition-colors duration-700 sm:py-32",
        grapeMode ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
      )}
    >
      <ParallaxImage
        alt={mediaAssets.careMoment.alt}
        src={mediaAssets.careMoment.src}
        speed={MOTION.parallax.narrative}
        sizes="100vw"
        className="absolute inset-0 opacity-35"
      />
      <div
        className={cn(
          "absolute inset-0",
          grapeMode ? "bg-primary/72" : "bg-background/80",
        )}
      />
      <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-5xl items-center justify-center px-4 text-center">
        <Reveal preset="fadeUp" className="relative flex h-[31rem] w-full flex-col items-center justify-center sm:h-[29rem]">
          <div className="absolute left-1/2 top-0 grid w-[min(100%,15rem)] -translate-x-1/2 grid-cols-[minmax(0,1fr)_4rem] items-center gap-3 sm:w-auto sm:grid-cols-[11rem_4rem] sm:gap-4">
            <span className="text-right text-xs font-semibold">
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
                "relative h-9 w-16 rounded-full p-1 transition-colors",
                grapeMode ? "bg-primary-foreground/28" : "bg-primary/18",
              )}
            >
              <span
                ref={thumbRef}
                className={cn(
                  "block size-7 rounded-full bg-current",
                  grapeMode ? "text-primary-foreground" : "text-primary",
                )}
              />
            </button>
          </div>
          <div
            ref={contentRef}
            className="flex min-h-[21rem] flex-col items-center justify-center pt-16 sm:min-h-[18rem]"
          >
            <h2 className="max-w-4xl text-balance font-sans text-[clamp(2.2rem,5.4vw,4.1rem)] font-medium leading-[1.08]">
              {active.title}
            </h2>
            <p
              className={cn(
                "mt-7 max-w-2xl text-pretty text-base leading-8 sm:text-lg",
                grapeMode ? "text-primary-foreground/78" : "text-muted-foreground",
              )}
            >
              {active.text}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
