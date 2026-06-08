import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsapPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function gsapDuration(prefersReducedMotion: boolean, seconds: number) {
  return prefersReducedMotion ? 0 : seconds;
}

/** Shared ScrollTrigger scroller config — keep Lenis proxy in sync. */
export function scrollTriggerScroller() {
  return document.documentElement;
}
