"use client";

import { useEffect, useState } from "react";

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

    function update() {
      frame = 0;
      setInHero(readHeroInView());
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return inHero;
}
