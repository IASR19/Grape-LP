import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsapPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);
  registered = true;
}

export function gsapDuration(prefersReducedMotion: boolean, seconds: number) {
  return prefersReducedMotion ? 0 : seconds;
}

/** Shared ScrollTrigger scroller — document nativo (sem smooth-scroll proxy). */
export function scrollTriggerScroller() {
  registerGsapPlugins();
  return document.documentElement;
}
