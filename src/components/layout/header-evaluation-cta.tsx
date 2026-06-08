"use client";

import Link from "next/link";

import { homeCopy, siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

type HeaderEvaluationCtaProps = {
  inHero?: boolean;
  onNavigate?: () => void;
  className?: string;
  mobileVisible?: boolean;
};

export function HeaderEvaluationCta({
  inHero,
  onNavigate,
  className,
  mobileVisible = false,
}: HeaderEvaluationCtaProps) {
  return (
    <Link
      href={siteConfig.evaluationFormHref}
      onClick={onNavigate}
      aria-label={homeCopy.cta}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center overflow-visible",
        mobileVisible ? "inline-flex" : "hidden sm:inline-flex",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        className={cn(
          "relative isolate inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-semibold whitespace-nowrap sm:px-5",
          "transition-[background-color,transform] duration-300 ease-out",
          "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-active:translate-y-0",
          inHero
            ? "header-cta-pulse-hero border border-white/28 bg-white/90 text-primary backdrop-blur-xl group-hover:bg-white"
            : "header-cta-pulse-solid bg-primary text-primary-foreground group-hover:bg-primary/92",
        )}
      >
        {homeCopy.cta}
      </span>
    </Link>
  );
}
