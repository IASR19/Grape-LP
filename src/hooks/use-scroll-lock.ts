"use client";

import { useEffect } from "react";

import { getLenis } from "@/lib/lenis";

let lockCount = 0;
let previousOverflow = "";

function lockScroll() {
  lockCount += 1;

  if (lockCount === 1) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
  }
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    getLenis()?.start();
  }
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockScroll();
    return () => unlockScroll();
  }, [active]);
}
