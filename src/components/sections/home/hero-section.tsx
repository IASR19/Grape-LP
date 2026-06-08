"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ExternalArrow } from "@/components/ui/external-arrow";
import { useRef, useState } from "react";

import { HeroBackground } from "@/components/media/hero-background";
import { Button } from "@/components/ui/button";
import { mediaAssets } from "@/content/media";
import { homeCopy, siteConfig } from "@/content/site";
import { useSiteIntroReady } from "@/hooks/use-site-intro-ready";
import { layout } from "@/lib/layout";
import {
  MOTION,
  heroCta,
  heroEyebrow,
  heroLine,
  heroStat,
  heroStagger,
  heroStaggerReturn,
  staggerContainerFast,
  textLineStagger,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

function readFastEntrance() {
  if (typeof document === "undefined") return true;
  const html = document.documentElement;
  return !html.hasAttribute("data-site-intro-pending");
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const introReady = useSiteIntroReady();
  const [fastEntrance] = useState(readFastEntrance);

  const containerVariants = fastEntrance ? heroStaggerReturn : heroStagger;
  const animateState = introReady && !prefersReducedMotion ? "show" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-site-hero
      className="relative isolate min-h-svh overflow-hidden"
    >
      <HeroBackground
        triggerRef={sectionRef}
        videoSrc={mediaAssets.heroClinicVideo.src!}
        posterSrc={mediaAssets.heroClinicVideo.poster!}
        alt={mediaAssets.heroClinicVideo.alt}
        speed={MOTION.parallax.hero}
        overlayClassName="bg-[linear-gradient(90deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0)_100%),linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.01)_42%,rgba(0,0,0,0.46)_100%)]"
      />

      <div
        className={cn(
          "relative z-10 flex min-h-svh flex-col justify-end pb-14 pt-28 text-white sm:pb-16 sm:pt-32 lg:pb-[4.75rem] lg:pt-36",
          layout.container,
          layout.gutter,
        )}
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-20 xl:gap-x-24">
          <motion.div
            variants={prefersReducedMotion ? undefined : containerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? undefined : animateState}
            className="lg:col-span-7 xl:col-span-8"
          >
            <motion.p
              variants={prefersReducedMotion ? undefined : heroEyebrow}
              className="text-xs text-white/54 sm:text-sm"
            >
              {siteConfig.city}
            </motion.p>

            <motion.div
              variants={prefersReducedMotion ? undefined : textLineStagger}
              className="mt-5 sm:mt-6 lg:mt-7"
            >
              <h1 className="text-balance font-serif text-[clamp(2.25rem,4.6vw,3.65rem)] font-normal leading-[1.08] tracking-[-0.02em]">
                {homeCopy.heroTitleLines.map((line) => (
                  <motion.span
                    key={line}
                    variants={prefersReducedMotion ? undefined : heroLine}
                    className="block"
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            <motion.ul
              variants={prefersReducedMotion ? undefined : staggerContainerFast}
              className="mt-10 grid grid-cols-3 justify-items-start gap-x-6 sm:mt-12 sm:gap-x-10 lg:mt-14 lg:gap-x-14 xl:gap-x-16"
              aria-label="Indicadores da clínica"
            >
              {homeCopy.stats.map((stat) => (
                <motion.li
                  key={stat.label}
                  variants={prefersReducedMotion ? undefined : heroStat}
                  className="min-w-0"
                >
                  <p className="font-sans text-[clamp(1.125rem,2.2vw,1.375rem)] font-medium tabular-nums leading-none text-white/92">
                    {stat.value}
                  </p>
                  <p className="mt-2 max-w-[9rem] text-[0.6875rem] leading-[1.45] text-white/58 sm:max-w-none sm:text-xs sm:leading-5">
                    {stat.label}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : heroCta}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? undefined : animateState}
            transition={prefersReducedMotion ? undefined : { delay: fastEntrance ? 0.28 : 0.48 }}
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:ml-auto lg:max-w-[17.5rem] lg:flex-col lg:items-stretch xl:col-span-4"
          >
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="#contato">
                Solicitar avaliação
                <ExternalArrow />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/22 text-white/88 hover:border-white/32 hover:bg-white/8 hover:text-white"
            >
              <Link href="#metodo">Conhecer o método</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
