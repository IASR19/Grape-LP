import gsap from "gsap";

import { GSAP_EASE, MOTION } from "@/lib/motion/tokens";

type MenuElements = {
  backdrop: HTMLElement;
  panel: HTMLElement;
  accent: HTMLElement;
  items: HTMLElement[];
};

export function setMobileMenuClosed({ backdrop, panel, accent, items }: MenuElements) {
  gsap.set(backdrop, {
    autoAlpha: 0,
    backgroundColor: "rgba(0,0,0,0)",
    backdropFilter: "blur(0px)",
  });
  gsap.set([panel, accent], { xPercent: 100 });
  gsap.set(items, { y: 26, opacity: 0 });
}

export function setMobileMenuOpen({ backdrop, panel, accent, items }: MenuElements) {
  gsap.set(backdrop, {
    autoAlpha: 1,
    backgroundColor: "rgba(0,0,0,0.34)",
    backdropFilter: "blur(10px)",
  });
  gsap.set([panel, accent], { xPercent: 0 });
  gsap.set(items, { y: 0, opacity: 1 });
}

export function animateMobileMenuOpen(
  elements: MenuElements,
  onComplete?: () => void,
) {
  const { backdrop, panel, accent, items } = elements;

  return gsap
    .timeline({ onComplete })
    .to(
      backdrop,
      {
        autoAlpha: 1,
        backgroundColor: "rgba(0,0,0,0.34)",
        backdropFilter: "blur(10px)",
        duration: MOTION.duration.menuOpen,
        ease: GSAP_EASE.out,
      },
      0,
    )
    .to(
      accent,
      {
        xPercent: 0,
        duration: MOTION.duration.menuOpen,
        ease: GSAP_EASE.out,
      },
      0,
    )
    .to(
      panel,
      {
        xPercent: 0,
        duration: MOTION.duration.menuOpen + 0.08,
        ease: GSAP_EASE.out,
      },
      0.06,
    )
    .to(
      items,
      {
        y: 0,
        opacity: 1,
        duration: MOTION.duration.menuOpen + 0.1,
        ease: GSAP_EASE.out,
        stagger: 0.06,
      },
      0.2,
    );
}

export function animateMobileMenuClose(
  elements: MenuElements,
  onComplete?: () => void,
) {
  const { backdrop, panel, accent, items } = elements;

  return gsap
    .timeline({ onComplete })
    .to(items, {
      y: 16,
      opacity: 0,
      duration: MOTION.duration.fast,
      ease: GSAP_EASE.in,
    })
    .to(
      panel,
      {
        xPercent: 100,
        duration: MOTION.duration.menuClose,
        ease: GSAP_EASE.inOut,
      },
      0.06,
    )
    .to(
      accent,
      {
        xPercent: 100,
        duration: MOTION.duration.menuClose,
        ease: GSAP_EASE.inOut,
      },
      0.1,
    )
    .to(
      backdrop,
      {
        autoAlpha: 0,
        backgroundColor: "rgba(0,0,0,0)",
        backdropFilter: "blur(0px)",
        duration: MOTION.duration.menuClose,
        ease: GSAP_EASE.inOut,
      },
      0.04,
    );
}
