"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { zIndex } from "@/lib/z-index";

const interactiveSelector =
  'a, button, input, textarea, select, label[for], summary, [role="button"], [role="link"], [role="tab"], [data-cursor="interactive"]';
const cursorSuppressedSelector = ".home-scroll-nav";

const DOT_LERP = 0.42;
const RING_LERP = 0.14;

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

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

/**
 * Cursor leve só em desktop com pointer fino.
 * Mobile/touch não monta nada; desktop usa rAF + CSS (sem springs do Motion).
 */
export function CustomCursor() {
  const enabled = useSyncExternalStore(
    subscribeCursorCapability,
    canUseCustomCursor,
    () => false,
  );

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringAccentRef = useRef<HTMLSpanElement>(null);
  const ringBaseRef = useRef<HTMLSpanElement>(null);
  const dotInnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const ringNode = ringRef.current;
    const dotNode = dotRef.current;
    const ringAccentNode = ringAccentRef.current;
    const ringBaseNode = ringBaseRef.current;
    const dotInnerNode = dotInnerRef.current;
    if (!ringNode || !dotNode || !ringAccentNode || !ringBaseNode || !dotInnerNode) {
      return;
    }

    const els = {
      ring: ringNode,
      dot: dotNode,
      ringAccent: ringAccentNode,
      ringBase: ringBaseNode,
      dotInner: dotInnerNode,
    };

    document.documentElement.classList.add("has-custom-cursor");

    let frame = 0;
    let visible = false;
    let interactive = false;
    let pressed = false;

    let targetX = -100;
    let targetY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;

    function setCursorActive(active: boolean) {
      document.documentElement.classList.toggle("has-custom-cursor-active", active);
    }

    function applyVisualState() {
      const visibility = visible ? 1 : 0;
      const ringScale = pressed
        ? interactive
          ? 1.24
          : 0.92
        : interactive
          ? 1.42
          : 1;
      const dotScale = pressed ? 0.82 : interactive ? 0.9 : 1;

      els.ring.style.opacity = String(visibility);
      els.dot.style.opacity = String(visibility);
      els.ringBase.style.opacity = String(0.26 * visibility);
      els.ringAccent.style.opacity = String((interactive ? 0.38 : 0) * visibility);
      els.ringBase.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
      els.ringAccent.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
      els.dotInner.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
    }

    function tick() {
      frame = 0;
      dotX = lerp(dotX, targetX, DOT_LERP);
      dotY = lerp(dotY, targetY, DOT_LERP);
      ringX = lerp(ringX, targetX, RING_LERP);
      ringY = lerp(ringY, targetY, RING_LERP);

      els.dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      els.ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      const settled =
        Math.abs(dotX - targetX) < 0.15 &&
        Math.abs(dotY - targetY) < 0.15 &&
        Math.abs(ringX - targetX) < 0.2 &&
        Math.abs(ringY - targetY) < 0.2;

      // Para quando o lerp estabiliza — pointermove religa o loop.
      if (!settled) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    function scheduleTick() {
      if (frame) return;
      frame = window.requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;

      const target = event.target;
      const suppressCursor =
        target instanceof Element &&
        Boolean(target.closest(cursorSuppressedSelector));

      if (suppressCursor) {
        visible = false;
        interactive = false;
        setCursorActive(false);
        applyVisualState();
        scheduleTick();
        return;
      }

      visible = true;
      setCursorActive(true);

      const nextInteractive =
        target instanceof Element && Boolean(target.closest(interactiveSelector));
      if (nextInteractive !== interactive) {
        interactive = nextInteractive;
        applyVisualState();
      }

      scheduleTick();
    }

    function onPointerDown() {
      pressed = true;
      applyVisualState();
    }

    function onPointerUp() {
      pressed = false;
      applyVisualState();
    }

    function onPointerOut(event: PointerEvent) {
      if (event.relatedTarget === null) {
        visible = false;
        interactive = false;
        pressed = false;
        setCursorActive(false);
        applyVisualState();
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        visible = false;
        interactive = false;
        setCursorActive(false);
        applyVisualState();
      }
    }

    applyVisualState();
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
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        data-custom-cursor
        className="pointer-events-none fixed left-0 top-0 will-change-transform"
        style={{ zIndex: zIndex.cursor, opacity: 0 }}
      >
        <span
          ref={ringBaseRef}
          className="absolute left-0 top-0 block size-16 rounded-full border border-foreground/16 transition-[opacity,transform] duration-200 ease-out"
          style={{ transform: "translate(-50%, -50%) scale(1)", opacity: 0 }}
        />
        <span
          ref={ringAccentRef}
          className="absolute left-0 top-0 block size-16 rounded-full border border-primary/30 transition-[opacity,transform] duration-200 ease-out"
          style={{ transform: "translate(-50%, -50%) scale(1)", opacity: 0 }}
        />
      </div>

      <div
        ref={dotRef}
        aria-hidden
        data-custom-cursor
        className="pointer-events-none fixed left-0 top-0 will-change-transform"
        style={{ zIndex: zIndex.cursor, opacity: 0 }}
      >
        <span
          ref={dotInnerRef}
          className="absolute left-0 top-0 block size-2.5 rounded-full bg-foreground/75 transition-transform duration-150 ease-out"
          style={{ transform: "translate(-50%, -50%) scale(1)" }}
        />
      </div>
    </>
  );
}
