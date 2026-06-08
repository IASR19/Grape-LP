"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { THEME_ICON_DURATION_MS, THEME_VT_DURATION } from "@/lib/motion/theme";
import { readDomTheme } from "@/lib/theme/transition-clip-paths";
import { runThemeViewTransition } from "@/lib/theme/run-theme-view-transition";
import { cn } from "@/lib/utils";

export type { ThemeTransitionVariant as TransitionVariant } from "@/lib/theme/transition-clip-paths";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  variant?: import("@/lib/theme/transition-clip-paths").ThemeTransitionVariant;
  fromCenter?: boolean;
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
}

export function AnimatedThemeToggler({
  className,
  duration = THEME_VT_DURATION,
  variant,
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}: AnimatedThemeTogglerProps) {
  const isControlled = theme !== undefined;
  const [internalTheme, setInternalTheme] = useState<"light" | "dark">(() =>
    typeof document === "undefined" ? "light" : readDomTheme(),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);

  const activeTheme = isControlled ? theme : internalTheme;
  const isDark = activeTheme === "dark";

  useEffect(() => {
    if (isControlled) return;

    const observer = new MutationObserver(() => {
      if (isTransitioningRef.current) return;
      setInternalTheme(readDomTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button || isTransitioningRef.current) return;

    const nextTheme: "light" | "dark" = activeTheme === "dark" ? "light" : "dark";
    isTransitioningRef.current = true;

    runThemeViewTransition({
      button,
      nextTheme,
      duration,
      variant,
      fromCenter,
      onSync: (syncedTheme) => {
        if (isControlled) {
          onThemeChange?.(syncedTheme);
          return;
        }

        setInternalTheme(syncedTheme);
        localStorage.setItem("theme", syncedTheme);
      },
      onComplete: () => {
        isTransitioningRef.current = false;
      },
    });
  }, [
    activeTheme,
    duration,
    fromCenter,
    isControlled,
    onThemeChange,
    variant,
  ]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-pressed={isDark}
      data-theme-toggle
      className={cn(
        "grid size-11 min-h-11 min-w-11 place-items-center overflow-hidden rounded-full border border-border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <Sun
        data-theme-toggle-icon
        aria-hidden
        className={cn(
          "absolute size-4 motion-safe:transition motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-75 -rotate-90 opacity-0",
        )}
        style={{ transitionDuration: `${THEME_ICON_DURATION_MS}ms` }}
      />
      <Moon
        data-theme-toggle-icon
        aria-hidden
        className={cn(
          "absolute size-4 motion-safe:transition motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          isDark
            ? "scale-75 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
        style={{ transitionDuration: `${THEME_ICON_DURATION_MS}ms` }}
      />
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
