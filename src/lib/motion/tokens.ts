/** Shared motion tokens — single source for durations, eases and parallax speeds. */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  easeCss: "cubic-bezier(0.22, 1, 0.36, 1)",
  duration: {
    instant: 0,
    fast: 0.22,
    normal: 0.38,
    medium: 0.55,
    reveal: 0.65,
    revealWide: 0.7,
    shell: 0.5,
    menuOpen: 0.55,
    menuClose: 0.4,
    theme: 0.68,
    route: 0.35,
    intro: 3.34,
  },
  parallax: {
    hero: 0.28,
    narrative: 0.24,
    break: 0.32,
    card: 0.22,
    default: 0.3,
  },
  hover: {
    cardMs: 300,
    imageMs: 500,
  },
} as const;

export const GSAP_EASE = {
  out: "power3.out",
  in: "power3.in",
  inOut: "power3.inOut",
} as const;
