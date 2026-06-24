import Link from "next/link";
import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

type ShimmerButtonStyleProps = {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerSpread?: string;
  shimmerBlur?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  hoverBackground?: string;
  /** Destaque interno em degradê do Magic UI original — desligado por padrão (fundo flat). */
  showHighlight?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ShimmerButtonAsButton = ShimmerButtonStyleProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ShimmerButtonAsLink = ShimmerButtonStyleProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "children"> & {
    href: string;
  };

export type ShimmerButtonProps = ShimmerButtonAsButton | ShimmerButtonAsLink;

/** Preset Grape — brilho perceptível em CTAs flat. */
export const grapeCtaShimmerProps = {
  shimmerSize: "var(--grape-shimmer-cut)",
  shimmerSpread: "125deg",
  shimmerBlur: "var(--grape-shimmer-blur)",
  shimmerDuration: "2.25s",
} as const satisfies Partial<ShimmerButtonStyleProps>;

export const grapeCtaShimmerOnLight = {
  ...grapeCtaShimmerProps,
  shimmerSpread: "140deg",
  shimmerColor: "var(--grape-shimmer-warm)",
} as const satisfies Partial<ShimmerButtonStyleProps>;

export const grapeCtaShimmerOnPrimary = {
  ...grapeCtaShimmerProps,
  shimmerColor: "var(--grape-shimmer-primary)",
} as const satisfies Partial<ShimmerButtonStyleProps>;

/** Header fixo (fundo primary) — anel mais largo e brilho mais forte que o hero. */
export const grapeCtaShimmerHeaderPrimary = {
  shimmerSize: "0.15em",
  shimmerSpread: "145deg",
  shimmerBlur: "0px",
  shimmerDuration: "2s",
  shimmerColor: "var(--grape-shimmer-primary)",
} as const satisfies Partial<ShimmerButtonStyleProps>;

export const grapeCtaShimmerOnWhite = {
  ...grapeCtaShimmerProps,
  shimmerSpread: "120deg",
  shimmerColor: "var(--grape-shimmer-glass)",
  shimmerBlur: "1px",
} as const satisfies Partial<ShimmerButtonStyleProps>;

function shimmerStyle({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerSpread = "90deg",
  shimmerDuration = "3s",
  borderRadius = "9999px",
  background = "rgba(0, 0, 0, 1)",
  hoverBackground,
}: ShimmerButtonStyleProps): CSSProperties {
  return {
    "--spread": shimmerSpread,
    "--shimmer-color": shimmerColor,
    "--radius": borderRadius,
    "--speed": shimmerDuration,
    "--cut": shimmerSize,
    "--bg": background,
    "--bg-hover": hoverBackground ?? background,
  } as CSSProperties;
}

const shimmerShellClassName =
  "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border-0 px-6 py-3 whitespace-nowrap [background:var(--bg)] transition-[transform,background-color] duration-300 ease-in-out hover:[background:var(--bg-hover)] active:translate-y-px motion-reduce:transition-none";

function shimmerBlurStyles(shimmerBlur: string) {
  if (shimmerBlur === "0px") {
    return { className: "blur-none" as const };
  }

  if (shimmerBlur === "1px") {
    return { className: "blur-[1px]" as const };
  }

  if (shimmerBlur === "2px") {
    return { className: "blur-[2px]" as const };
  }

  return {
    className: undefined,
    style: { filter: `blur(${shimmerBlur})` },
  };
}

function ShimmerButtonContent({
  children,
  shimmerBlur = "2px",
  showHighlight = false,
}: {
  children?: React.ReactNode;
  shimmerBlur?: string;
  showHighlight?: boolean;
}) {
  const blur = shimmerBlurStyles(shimmerBlur);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-visible @container-[size] -z-30 motion-reduce:hidden",
          blur.className,
        )}
        style={blur.style}
      >
        <div className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none] motion-reduce:animate-none">
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] motion-reduce:animate-none" />
        </div>
      </div>

      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>

      {showHighlight ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 size-full rounded-2xl",
            "shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
          )}
        />
      ) : null}

      <div
        aria-hidden
        className="absolute inset-[var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)] transition-[background-color] duration-300 ease-in-out group-hover:[background:var(--bg-hover)]"
      />
    </>
  );
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ShimmerButtonProps
>(function ShimmerButton(props, ref) {
  const {
    shimmerColor,
    shimmerSize,
    shimmerSpread,
    shimmerBlur,
    shimmerDuration,
    borderRadius,
    background,
    hoverBackground,
    showHighlight,
    className,
    children,
    ...rest
  } = props;

  const style = shimmerStyle({
    shimmerColor,
    shimmerSize,
    shimmerSpread,
    shimmerDuration,
    borderRadius,
    background,
    hoverBackground,
  });

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest;

    return (
      <Link
        href={href}
        style={style}
        className={cn(shimmerShellClassName, className)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...linkProps}
      >
        <ShimmerButtonContent shimmerBlur={shimmerBlur} showHighlight={showHighlight}>
          {children}
        </ShimmerButtonContent>
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ShimmerButtonAsButton;

  return (
    <button
      type={type}
      style={style}
      className={cn(shimmerShellClassName, className)}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...buttonProps}
    >
      <ShimmerButtonContent shimmerBlur={shimmerBlur} showHighlight={showHighlight}>
        {children}
      </ShimmerButtonContent>
    </button>
  );
});

ShimmerButton.displayName = "ShimmerButton";
