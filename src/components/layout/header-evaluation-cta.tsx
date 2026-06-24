"use client";

import {
  grapeCtaShimmerHeaderPrimary,
  grapeCtaShimmerOnWhite,
  ShimmerButton,
} from "@/registry/magicui/shimmer-button";
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
    <ShimmerButton
      href={siteConfig.evaluationFormHref}
      onClick={onNavigate}
      aria-label={homeCopy.cta}
      {...(inHero ? grapeCtaShimmerOnWhite : grapeCtaShimmerHeaderPrimary)}
      background={
        inHero
          ? "color-mix(in oklch, white 90%, transparent)"
          : "var(--primary)"
      }
      hoverBackground={
        inHero
          ? "white"
          : "color-mix(in oklch, var(--primary) 90%, white 10%)"
      }
      className={cn(
        "relative h-11 shrink-0 px-4 text-sm font-semibold sm:px-5",
        mobileVisible ? "inline-flex" : "hidden sm:inline-flex",
        inHero
          ? "border border-white/28 text-primary backdrop-blur-xl"
          : "text-primary-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {homeCopy.cta}
    </ShimmerButton>
  );
}
