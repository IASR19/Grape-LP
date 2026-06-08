import { THEME_VT_DURATION } from "@/lib/motion/theme";
import { getThemeTransitionOrigin } from "@/lib/theme/transition-clip-paths";

function easeOutPremium(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv * inv * inv;
}

function applyIntroCircleMask(
  curtain: HTMLElement,
  x: number,
  y: number,
  holeRadius: number,
) {
  const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${holeRadius}px, #000 ${holeRadius}px)`;
  curtain.style.maskImage = mask;
  curtain.style.webkitMaskImage = mask;
}

export function runIntroCircleReveal(
  curtain: HTMLElement,
  duration = THEME_VT_DURATION,
): Promise<void> {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    curtain.style.opacity = "0";
    curtain.style.pointerEvents = "none";
    return Promise.resolve();
  }

  const { x, y, maxRadius } = getThemeTransitionOrigin(curtain, true);
  const radius = maxRadius * 1.05;

  curtain.dataset.siteIntroRevealing = "true";
  applyIntroCircleMask(curtain, x, y, 0);

  return new Promise((resolve) => {
    const start = performance.now();
    let frameId = 0;

    const finish = () => {
      cancelAnimationFrame(frameId);
      curtain.style.opacity = "0";
      curtain.style.pointerEvents = "none";
      delete curtain.dataset.siteIntroRevealing;
      resolve();
    };

    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);

      if (progress >= 1) {
        applyIntroCircleMask(curtain, x, y, radius);
        finish();
        return;
      }

      applyIntroCircleMask(curtain, x, y, easeOutPremium(progress) * radius);
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
  });
}

export function cancelIntroCircleReveal(curtain: HTMLElement | null) {
  if (!curtain) return;
  delete curtain.dataset.siteIntroRevealing;
  curtain.style.removeProperty("mask-image");
  curtain.style.removeProperty("-webkit-mask-image");
  curtain.style.removeProperty("opacity");
  curtain.style.removeProperty("pointer-events");
}
