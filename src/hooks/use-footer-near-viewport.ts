"use client";

import { useEffect, useState } from "react";

import { getLenis } from "@/lib/lenis";

export const SITE_FOOTER_ID = "site-footer";

function readFooterNearViewport() {
  const footer = document.getElementById(SITE_FOOTER_ID);
  if (!footer) return false;

  const rect = footer.getBoundingClientRect();
  return rect.top < window.innerHeight;
}

/** Verdadeiro quando o footer entra na viewport. */
export function useFooterNearViewport() {
  const [footerNear, setFooterNear] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lenisAttached = false;

    function update() {
      frame = 0;
      setFooterNear(readFooterNearViewport());
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

  return footerNear;
}
