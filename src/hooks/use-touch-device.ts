"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/** Touch-first or narrow viewport — desliga parallax e scroll triggers pesados. */
export function useTouchDevice() {
  return useMediaQuery("(max-width: 1023px), (hover: none) and (pointer: coarse)");
}
