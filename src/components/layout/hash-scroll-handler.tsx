"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { scrollToInitialHash } from "@/lib/navigation/scroll-to-hash";

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToInitialHash();
  }, [pathname]);

  return null;
}
