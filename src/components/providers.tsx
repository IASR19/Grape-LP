"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { useEffect, useLayoutEffect } from "react";

import { SiteIntro } from "@/components/layout/site-intro";
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler";
import { MetaPixel } from "@/components/seo/meta-pixel";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SITE_INTRO_READY_EVENT } from "@/hooks/use-site-intro-ready";
import {
  initHashNavigation,
  initScrollRestoration,
  scrollToInitialHash,
  scrollToTop,
} from "@/lib/navigation/scroll-to-hash";
import { registerGsapPlugins } from "@/lib/motion/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

registerGsapPlugins();

function isIntroBlocking() {
  if (typeof document === "undefined") return false;

  return (
    document.documentElement.hasAttribute("data-site-intro-pending") ||
    document.documentElement.hasAttribute("data-site-intro-revealing") ||
    Boolean(document.querySelector("[data-site-intro-root]"))
  );
}

function applyInitialScrollPosition() {
  if (window.location.hash) {
    scrollToInitialHash();
    return;
  }

  scrollToTop(true);
  window.scrollTo(0, 0);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const onIntroReady = () => applyInitialScrollPosition();

    window.addEventListener(SITE_INTRO_READY_EVENT, onIntroReady);

    if (!isIntroBlocking()) {
      onIntroReady();
    }

    return () => {
      window.removeEventListener(SITE_INTRO_READY_EVENT, onIntroReady);
    };
  }, []);

  useEffect(() => {
    initScrollRestoration();

    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const onScroll = () => ScrollTrigger.update();
    window.addEventListener("scroll", onScroll, { passive: true });
    ScrollTrigger.refresh();

    const removeHashNav = initHashNavigation();
    scrollToInitialHash();

    return () => {
      window.removeEventListener("scroll", onScroll);
      removeHashNav();
    };
  }, [prefersReducedMotion]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <MetaPixel />
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
        <SiteIntro />
        <div data-app-shell className="flex min-h-full w-full flex-1 flex-col">
          <HashScrollHandler />
          {children}
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
