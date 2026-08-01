"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BrandLogo } from "@/components/layout/brand-logo";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { dispatchSiteIntroReady } from "@/hooks/use-site-intro-ready";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import {
  cancelIntroCircleReveal,
  runIntroCircleReveal,
} from "@/lib/intro/run-intro-circle-reveal";
import {
  preloadCriticalAssets,
  warmHeroOnReturnVisit,
  warmHeroVideoInBackground,
} from "@/lib/intro/preload-critical-assets";
import { MOTION } from "@/lib/motion";
import { THEME_VT_DURATION } from "@/lib/motion/theme";
import { zIndex } from "@/lib/z-index";

export const introStorageKey = "grapeclinic:intro-seen:v4";

const INTRO = {
  logoIn: 0.95,
  holdMinMs: 1600,
  logoOut: 0.72,
  revealGapMs: 180,
} as const;

type IntroPhase = "idle" | "loading" | "logo-out" | "reveal" | "done";

function clearIntroPending() {
  document.documentElement.removeAttribute("data-site-intro-pending");
}

function setIntroRevealing(active: boolean) {
  if (active) {
    document.documentElement.setAttribute("data-site-intro-revealing", "");
    return;
  }

  document.documentElement.removeAttribute("data-site-intro-revealing");
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(introStorageKey, "true");
  } catch {
    /* storage blocked */
  }
}

function shouldPlayIntro(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) return false;

  try {
    return !sessionStorage.getItem(introStorageKey);
  } catch {
    return false;
  }
}

function waitForPaint(frames = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = frames;

    const step = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
        return;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}

function waitMs(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function SiteIntro() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const runIdRef = useRef(0);
  const curtainRef = useRef<HTMLDivElement>(null);
  const animatingCurtainRef = useRef<HTMLDivElement | null>(null);
  const bootTimeoutRef = useRef<number | null>(null);
  const beginRevealRef = useRef<(() => void) | null>(null);

  const active = phase === "loading" || phase === "logo-out" || phase === "reveal";
  useScrollLock(active);

  useLayoutEffect(() => {
    const runId = ++runIdRef.current;

    const isActive = () => runIdRef.current === runId;

    if (!shouldPlayIntro(prefersReducedMotion)) {
      clearIntroPending();
      setIntroRevealing(false);
      warmHeroOnReturnVisit();
      dispatchSiteIntroReady();
      return;
    }

    markIntroSeen();

    const beginReveal = () => {
      if (!isActive()) return;

      void waitMs(INTRO.revealGapMs).then(async () => {
        if (!isActive()) return;

        clearIntroPending();
        setIntroRevealing(true);
        setPhase("reveal");
        warmHeroVideoInBackground();

        await waitForPaint();



        if (!isActive()) return;

        const curtain = curtainRef.current;
        if (!curtain) {
          setIntroRevealing(false);
          setPhase("done");
          dispatchSiteIntroReady();
          return;
        }

        animatingCurtainRef.current = curtain;

        await runIntroCircleReveal(curtain, THEME_VT_DURATION);

        if (!isActive()) return;

        animatingCurtainRef.current = null;
        setIntroRevealing(false);
        setPhase("done");
        dispatchSiteIntroReady();
      });
    };

    beginRevealRef.current = beginReveal;

    bootTimeoutRef.current = window.setTimeout(() => {
      if (!isActive()) return;

      setPhase("loading");
      const startedAt = performance.now();

      void preloadCriticalAssets().then(async () => {
        if (!isActive()) return;

        const logoInEnd = startedAt + INTRO.logoIn * 1000;
        const holdUntil = logoInEnd + INTRO.holdMinMs;
        const remainingHold = Math.max(0, holdUntil - performance.now());

        if (remainingHold > 0) {
          await waitMs(remainingHold);
        }

        if (!isActive()) return;

        setPhase("logo-out");
      });
    }, 0);

    return () => {
      beginRevealRef.current = null;

      if (bootTimeoutRef.current !== null) {
        window.clearTimeout(bootTimeoutRef.current);
        bootTimeoutRef.current = null;
      }

      cancelIntroCircleReveal(animatingCurtainRef.current);
      animatingCurtainRef.current = null;
      clearIntroPending();
      setIntroRevealing(false);
    };
  }, [prefersReducedMotion]);

  if (phase === "idle" || phase === "done") return null;

  const showLogo = phase === "loading" || phase === "logo-out";
  const logoExiting = phase === "logo-out";

  const overlay = (
    <div
      data-site-intro-root
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: zIndex.intro }}
      aria-hidden="true"
    >
      <div
        ref={curtainRef}
        data-site-intro-curtain
        className="absolute inset-0 bg-background will-change-[mask-image,-webkit-mask-image,opacity]"
      />

      {showLogo ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={
              logoExiting
                ? { opacity: 0, y: -8, filter: "blur(4px)" }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            transition={{
              duration: logoExiting ? INTRO.logoOut : INTRO.logoIn,
              ease: MOTION.ease,
            }}
            onAnimationComplete={() => {
              if (logoExiting) {
                beginRevealRef.current?.();
              }
            }}
          >
            <BrandLogo priority width={168} height={52} className="w-40" />
          </motion.div>
        </div>
      ) : null}
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(overlay, document.body);
}
