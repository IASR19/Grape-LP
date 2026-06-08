"use client";

import { useEffect, useState } from "react";

import { getLenis } from "@/lib/lenis";

const HERO_SELECTOR = "[data-site-hero]";
const HEADER_HEIGHT_PX = 80;

function readHeroInView() {
  const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);
  if (!hero) return false;

  const rect = hero.getBoundingClientRect();
  return rect.bottom > HEADER_HEIGHT_PX;
}

export function useHeroInView() {
  const [inHero, setInHero] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lenisAttached = false;

    function update() {
      frame = 0;
      setInHero(readHeroInView());
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    function attachLenis() {
      if (lenisAttached) return;
      const lenis = getLenis();
      if (!lenis) return;
      lenis.on("scroll", scheduleUpdate);
      lenisAttached = true;
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    attachLenis();

    const retryId = window.setInterval(() => {
      attachLenis();
      if (lenisAttached) window.clearInterval(retryId);
    }, 100);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.clearInterval(retryId);
      getLenis()?.off("scroll", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return inHero;
}
