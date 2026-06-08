import { flushSync } from "react-dom";

import { THEME_VT_DURATION, THEME_VT_EASING } from "@/lib/motion/theme";
import {
  applyDomTheme,
  getThemeTransitionClipPaths,
  getThemeTransitionOrigin,
  type ThemeTransitionVariant,
} from "@/lib/theme/transition-clip-paths";

type RunThemeViewTransitionOptions = {
  button: HTMLElement;
  nextTheme: "light" | "dark";
  duration?: number;
  variant?: ThemeTransitionVariant;
  fromCenter?: boolean;
  /** Sincroniza React/next-themes no mesmo frame do DOM (dentro do callback da VT). */
  onSync?: (theme: "light" | "dark") => void;
  onComplete?: () => void;
};

function beginThemeViewTransition(duration: number, clipFrom: string) {
  const root = document.documentElement;
  root.dataset.magicuiThemeVt = "active";
  root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
  root.style.setProperty("--magicui-theme-vt-clip-from", clipFrom);

  return () => {
    delete root.dataset.magicuiThemeVt;
    root.style.removeProperty("--magicui-theme-toggle-vt-duration");
    root.style.removeProperty("--magicui-theme-vt-clip-from");
  };
}

export function runThemeViewTransition({
  button,
  nextTheme,
  duration = THEME_VT_DURATION,
  variant = "circle",
  fromCenter = false,
  onSync,
  onComplete,
}: RunThemeViewTransitionOptions) {
  const applyTheme = () => {
    flushSync(() => {
      applyDomTheme(nextTheme);
      onSync?.(nextTheme);
    });
  };

  const finish = () => {
    onComplete?.();
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
    applyTheme();
    finish();
    return;
  }

  const { x, y, maxRadius } = getThemeTransitionOrigin(button, fromCenter);
  const clipPath = getThemeTransitionClipPaths(
    variant,
    x,
    y,
    maxRadius,
    window.visualViewport?.width ?? window.innerWidth,
    window.visualViewport?.height ?? window.innerHeight,
  );

  const cleanup = beginThemeViewTransition(duration, clipPath[0]);

  const transition = document.startViewTransition(applyTheme);

  transition.finished
    .finally(() => {
      cleanup();
      finish();
    })
    .catch(() => {
      cleanup();
      finish();
    });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath },
        {
          duration,
          easing: variant === "star" ? "linear" : THEME_VT_EASING,
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => undefined);
}
