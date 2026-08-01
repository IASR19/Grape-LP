"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ExternalArrow } from "@/components/ui/external-arrow";
import { useEffect, useRef, useState } from "react";

import { HeroBackground } from "@/components/media/hero-background";
import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Button } from "@/components/ui/button";
import { ShimmerButton, grapeCtaShimmerOnLight } from "@/registry/magicui/shimmer-button";
import { mediaAssets } from "@/content/media";
import { homeCopy, siteConfig } from "@/content/site";
import { useSiteIntroReady } from "@/hooks/use-site-intro-ready";
import { layout } from "@/lib/layout";
import {
  MOTION,
  heroCta,
  heroEyebrow,
  heroStat,
  heroStagger,
  heroStaggerReturn,
  staggerContainerFast,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const heroTitleClass =
  "text-balance font-serif text-[clamp(2.05rem,7.4vw,2.3rem)] font-normal leading-[1.1] tracking-[-0.02em] sm:text-[clamp(2.25rem,4.6vw,3.65rem)] sm:leading-[1.08]";

function readFastEntrance() {
  if (typeof document === "undefined") return true;
  const html = document.documentElement;
  return !html.hasAttribute("data-site-intro-pending");
}

function useDesktopSplitHeading() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const introReady = useSiteIntroReady();
  const desktopSplitHeading = useDesktopSplitHeading();
  const [fastEntrance] = useState(() => readFastEntrance());

  const containerVariants = fastEntrance ? heroStaggerReturn : heroStagger;
  const animateState = introReady && !prefersReducedMotion ? "show" : "hidden";
  const useSplitHeading =
    introReady && !prefersReducedMotion && desktopSplitHeading;

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-site-hero
      className="relative min-h-svh overflow-hidden"
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
          "relative flex min-h-svh flex-col justify-end pb-7 pt-[4.75rem] text-white sm:pb-16 sm:pt-32 lg:pb-[4.75rem] lg:pt-36",
          layout.container,
          layout.gutter,
        )}
      >
        <div className="grid gap-6 sm:gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-20 xl:gap-x-24">
          <motion.div
            variants={prefersReducedMotion ? undefined : containerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? undefined : animateState}
            className="lg:col-span-7 xl:col-span-8"
          >
            <motion.p
              variants={prefersReducedMotion ? undefined : heroEyebrow}
              className="text-[0.6875rem] tracking-[0.06em] text-white/50 sm:text-xs sm:tracking-normal sm:text-white/54"
            >
              {siteConfig.city}
            </motion.p>

            <div className="mt-3.5 sm:mt-6 lg:mt-7">
              {useSplitHeading ? (
                <AnimatedHeading
                  as="h1"
                  mode="intro"
                  text={homeCopy.heroTitle}
                  startDelay={fastEntrance ? 40 : 120}
                  className={heroTitleClass}
                />
              ) : (
                <h1 className={heroTitleClass}>{homeCopy.heroTitle}</h1>
              )}
            </div>

            <motion.ul
              variants={prefersReducedMotion ? undefined : staggerContainerFast}
              className="mt-5 grid grid-cols-3 justify-items-start gap-x-2.5 gap-y-3 sm:mt-12 sm:gap-x-10 sm:gap-y-4 lg:mt-14 lg:gap-x-14 xl:gap-x-16"
              aria-label="Indicadores da clínica"
            >
              {homeCopy.stats.map((stat) => (
                <motion.li
                  key={stat.label}
                  variants={prefersReducedMotion ? undefined : heroStat}
                  className="min-w-0"
                >
                  <p className="font-sans text-[0.9375rem] font-medium tabular-nums leading-none text-white/90 sm:text-[clamp(1rem,4.8vw,1.375rem)] sm:text-white/92">
                    {stat.value}
                  </p>
                  <p className="mt-1 max-w-[6.5rem] text-[0.6rem] leading-[1.35] text-white/52 sm:mt-2 sm:max-w-none sm:text-xs sm:leading-5 sm:text-white/58">
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
            className="flex w-full flex-col gap-2.5 sm:gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:ml-auto lg:max-w-[17.5rem] lg:flex-col lg:items-stretch xl:col-span-4 [&_a]:w-full [&_button]:w-full sm:[&_a]:w-auto sm:[&_button]:w-auto"
          >
            <ShimmerButton
              href="#contato"
              className="h-11 gap-2 text-[0.8125rem] font-medium text-secondary-foreground sm:h-12 sm:text-sm"
              {...grapeCtaShimmerOnLight}
              background="var(--secondary)"
              hoverBackground="color-mix(in oklch, var(--secondary) 92%, var(--foreground) 8%)"
            >
              {homeCopy.cta}
              <ExternalArrow />
            </ShimmerButton>
            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "header-glass-btn header-glass-btn--hero",
                "h-10 px-5 text-[0.8125rem] sm:h-12 sm:px-6 sm:text-sm",
                "border-white/26 bg-white/[0.16] text-white hover:border-white/32 hover:bg-white/[0.22] hover:text-white",
              )}
            >
              <Link href="#metodo">Conhecer o método Grape</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
