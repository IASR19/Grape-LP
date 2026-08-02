"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

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

const CustomCursor = dynamic(
  () =>
    import("@/components/layout/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

/** Carrega o cursor só em desktop com pointer fino — evita JS extra no mobile. */
export function CustomCursorLoader() {
  const enabled = useSyncExternalStore(
    subscribeCursorCapability,
    canUseCustomCursor,
    () => false,
  );

  if (!enabled) return null;
  return <CustomCursor />;
}
