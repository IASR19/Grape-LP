"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { cn } from "@/lib/utils";

const toggleClassName =
  "relative grid size-11 min-h-11 min-w-11 place-items-center overflow-hidden rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function subscribe() {
  return () => undefined;
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Alternar tema"
        aria-hidden
        tabIndex={-1}
        disabled
        className={cn(toggleClassName, "pointer-events-none opacity-0", className)}
      />
    );
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={setTheme}
      aria-label="Alternar tema"
      className={className}
    />
  );
}
