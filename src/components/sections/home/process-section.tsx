"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal, RevealItem, StaggerReveal } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { mediaAssets } from "@/content/media";
import { grapeMethodCopy, grapeMethodSteps } from "@/content/site";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { scrollTriggerScroller } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";
import { zIndex } from "@/lib/z-index";

const headerOffset = layout.headerHeight;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const sticky = stickyRef.current;
    const steps = stepsRef.current;

    if (!section || !grid || !sticky || !steps || prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: grid,
          scroller: scrollTriggerScroller(),
          start: `top top+=${headerOffset}`,
          endTrigger: steps,
          end: "bottom bottom",
          pin: sticky,
          pinSpacing: true,
          pinReparent: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        const refresh = () => ScrollTrigger.refresh();
        requestAnimationFrame(refresh);
        window.addEventListener("load", refresh);

        return () => {
          window.removeEventListener("load", refresh);
        };
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      className={cn(
        layout.sectionLarge,
        layout.gutter,
        "relative isolate overflow-hidden",
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ParallaxImage
          alt={mediaAssets.experienceSection.alt}
          src={mediaAssets.experienceSection.src}
          speed={MOTION.parallax.break}
          sizes="100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-background/86" />
        <div className="absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background/72" />
      </div>

      <div
        ref={gridRef}
        className={cn(
          "relative z-10 mx-auto grid items-start gap-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20",
          layout.container,
        )}
      >
        <div
          ref={stickyRef}
          className={cn(
            "lg:self-start lg:will-change-transform",
            prefersReducedMotion && "lg:sticky lg:top-24",
          )}
          style={prefersReducedMotion ? undefined : { zIndex: zIndex.pinned }}
        >
          <Reveal preset="fadeUp" className="max-w-xl lg:pt-8">
            <p className="text-sm font-medium text-muted-foreground">
              {grapeMethodCopy.eyebrow}
            </p>
            <h2 className="mt-6 max-w-2xl text-balance font-sans text-4xl font-medium leading-[1.12] sm:text-5xl">
              {grapeMethodCopy.title}
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-muted-foreground">
              {grapeMethodCopy.description}
            </p>
          </Reveal>
        </div>

        <StaggerReveal ref={stepsRef} className="space-y-8">
          {grapeMethodSteps.map((step, index) => (
            <RevealItem key={step.title}>
            <div
              className="group grid min-h-[22rem] min-w-0 overflow-hidden rounded-xl border border-border bg-card motion-safe:transition-[transform,border-color] motion-safe:duration-500 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/24 lg:min-h-[24rem] lg:grid-cols-[1fr_0.72fr]"
            >
              <div className="flex min-w-0 flex-col justify-between p-6 sm:p-8">
                <span className="font-sans text-6xl font-medium leading-none text-primary/24 sm:text-7xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-3xl font-medium leading-[1.12] sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-pretty text-base leading-7 text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
              <div className="relative min-h-[14rem] min-w-0 overflow-hidden border-t border-border lg:min-h-[16rem] lg:border-l lg:border-t-0">
                <ParallaxImage
                  alt={step.title}
                  src={step.src}
                  variant={step.variant}
                  speed={MOTION.parallax.card}
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="absolute inset-0"
                />
              </div>
            </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
