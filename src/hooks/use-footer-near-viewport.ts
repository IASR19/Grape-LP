"use client";

import { useEffect, useState } from "react";

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

    function update() {
      frame = 0;
      setFooterNear(readFooterNearViewport());
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

  return footerNear;
}
