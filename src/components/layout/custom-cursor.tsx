"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { zIndex } from "@/lib/z-index";

const interactiveSelector =
  'a, button, input, textarea, select, label[for], summary, [role="button"], [role="link"], [role="tab"], [data-cursor="interactive"]';
const cursorSuppressedSelector = ".home-scroll-nav";

/** Dot follows the pointer closely; ring trails for a calmer, premium feel. */
const dotSpring = { stiffness: 380, damping: 42, mass: 0.35 };
const ringSpring = { stiffness: 118, damping: 24, mass: 1.12 };
const scaleSpring = { stiffness: 240, damping: 32, mass: 0.62 };
const visibilitySpring = { stiffness: 280, damping: 36, mass: 0.48 };

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function subscribeCursorCapability(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  pointer.addEventListener("change", onStoreChange);
  reduced.addEventListener("change", onStoreChange);

  return () => {
    pointer.removeEventListener("change", onStoreChange);
    reduced.removeEventListener("change", onStoreChange);
  };
}

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringScale = useMotionValue(1);
  const dotScale = useMotionValue(1);
  const accent = useMotionValue(0);
  const visibility = useMotionValue(0);

  const dotX = useSpring(cursorX, dotSpring);
  const dotY = useSpring(cursorY, dotSpring);
  const ringX = useSpring(cursorX, ringSpring);
  const ringY = useSpring(cursorY, ringSpring);
  const smoothRingScale = useSpring(ringScale, scaleSpring);
  const smoothDotScale = useSpring(dotScale, scaleSpring);
  const smoothAccent = useSpring(accent, scaleSpring);
  const smoothVisibility = useSpring(visibility, visibilitySpring);

  const ringOpacity = useTransform(smoothVisibility, [0, 1], [0, 0.26]);
  const dotOpacity = useTransform(smoothVisibility, [0, 1], [0, 0.68]);
  const accentOpacity = useTransform(
    [smoothAccent, smoothVisibility],
    ([a, v]) => (a as number) * (v as number) * 0.38,
  );

  const enabled = useSyncExternalStore(
    subscribeCursorCapability,
    canUseCustomCursor,
    () => false,
  );

  const activeRef = useRef(false);
  const pressedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    function setCursorActive(active: boolean) {
      document.documentElement.classList.toggle("has-custom-cursor-active", active);
    }

    function setInteractive(next: boolean) {
      activeRef.current = next;
      accent.set(next ? 1 : 0);
      ringScale.set(next ? 1.42 : 1);
      dotScale.set(next ? 0.9 : 1);
    }

    function setPressed(next: boolean) {
      pressedRef.current = next;
      if (next) {
        ringScale.set(activeRef.current ? 1.24 : 0.92);
        dotScale.set(0.82);
        return;
      }

      ringScale.set(activeRef.current ? 1.42 : 1);
      dotScale.set(activeRef.current ? 0.9 : 1);
    }

    function onPointerMove(event: PointerEvent) {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);

      const target = event.target;
      const suppressCursor =
        target instanceof Element &&
        Boolean(target.closest(cursorSuppressedSelector));

      if (suppressCursor) {
        visibility.set(0);
        accent.set(0);
        setInteractive(false);
        setCursorActive(false);
        return;
      }

      visibility.set(1);
      setCursorActive(true);

      const isInteractive =
        target instanceof Element && Boolean(target.closest(interactiveSelector));
      if (isInteractive !== activeRef.current) {
        setInteractive(isInteractive);
      }
    }

    function onPointerDown() {
      setPressed(true);
    }

    function onPointerUp() {
      setPressed(false);
    }

    function onPointerOut(event: PointerEvent) {
      if (event.relatedTarget === null) {
        visibility.set(0);
        accent.set(0);
        setInteractive(false);
        setPressed(false);
        setCursorActive(false);
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        visibility.set(0);
        accent.set(0);
        setCursorActive(false);
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.documentElement.classList.remove("has-custom-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [accent, cursorX, cursorY, dotScale, enabled, ringScale, visibility]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        data-custom-cursor
        className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          zIndex: zIndex.cursor,
        }}
      >
        <motion.span
          className="absolute left-1/2 top-1/2 block size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/16"
          style={{
            scale: smoothRingScale,
            opacity: ringOpacity,
          }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 block size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30"
          style={{
            scale: smoothRingScale,
            opacity: accentOpacity,
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        data-custom-cursor
        className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          zIndex: zIndex.cursor,
        }}
      >
        <motion.span
          className="absolute left-1/2 top-1/2 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/75 shadow-[0_0_10px_color-mix(in_oklch,var(--foreground)_8%,transparent)]"
          style={{
            scale: smoothDotScale,
            opacity: dotOpacity,
          }}
        />
      </motion.div>
    </>
  );
}
