"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export const SITE_INTRO_READY_EVENT = "grapeclinic:intro-ready";

function isIntroBlocking() {
  if (typeof document === "undefined") return false;

  const html = document.documentElement;

  return (
    html.hasAttribute("data-site-intro-pending") ||
    html.hasAttribute("data-site-intro-revealing") ||
    Boolean(document.querySelector("[data-site-intro-root]"))
  );
}

function readInitialReady(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) return true;
  return !isIntroBlocking();
}

export function dispatchSiteIntroReady() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SITE_INTRO_READY_EVENT));
}

export function useSiteIntroReady() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(() => readInitialReady(prefersReducedMotion));

  useEffect(() => {
    let timeoutId: number | undefined;
    const markReady = () => {
      timeoutId = window.setTimeout(() => setReady(true), 0);
    };

    if (prefersReducedMotion) {
      markReady();
      return () => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      };
    }

    if (!isIntroBlocking()) {
      markReady();
      return () => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      };
    }

    const onReady = () => markReady();

    window.addEventListener(SITE_INTRO_READY_EVENT, onReady);
    return () => {
      window.removeEventListener(SITE_INTRO_READY_EVENT, onReady);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  return ready;
}
