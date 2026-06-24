"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { scrollToHash } from "@/lib/navigation/scroll-to-hash";

const HOME_HASH_PATTERN = /^\/#[A-Za-z][\w-]*$/;

export function isHomeSectionHref(href: string) {
  return HOME_HASH_PATTERN.test(href);
}

/** Link para seções da home (`/#galeria`, `/#contato`, etc.). */
export function HomeSectionLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          typeof href !== "string" ||
          !isHomeSectionHref(href)
        ) {
          return;
        }

        const hash = href.slice(href.indexOf("#"));

        if (pathname === "/") {
          event.preventDefault();
          scrollToHash(hash);
          window.history.replaceState(null, "", href);
        }
      }}
      {...props}
    />
  );
}
