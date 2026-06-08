"use client";

import { ThemeProvider } from "next-themes";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect } from "react";

import { SiteIntro } from "@/components/layout/site-intro";
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { setLenis } from "@/lib/lenis";
import {
  initHashNavigation,
  scrollToInitialHash,
} from "@/lib/navigation/scroll-to-hash";
import { registerGsapPlugins } from "@/lib/motion/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

registerGsapPlugins();

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      scrollToInitialHash();
      const removeHashNav = initHashNavigation();
      return () => {
        removeHashNav();
      };
    }

    const lenis = new Lenis({
      duration: 1,
      smoothWheel: true,
      allowNestedScroll: true,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    let frame = 0;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    const removeHashNav = initHashNavigation();
    scrollToInitialHash();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      cancelAnimationFrame(frame);
      removeHashNav();
      lenis.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
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
