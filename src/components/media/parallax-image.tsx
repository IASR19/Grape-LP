"use client";

import Image from "next/image";
import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  MockImage,
  type MockImageVariant,
} from "@/components/media/mock-image";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { MOTION } from "@/lib/motion";
import { scrollTriggerScroller } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

type ParallaxImageProps = {
  alt: string;
  src?: string;
  variant?: MockImageVariant;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Intensidade do deslocamento (0.18 = sutil, 0.28 = perceptivel, 0.34+ = forte). */
  speed?: number;
  /** scroll = parallax vertical; fixed = imagem fixa no viewport (hero). */
  mode?: "scroll" | "fixed";
  /** Obrigatorio quando mode="fixed" — secao que delimita a visibilidade do fundo. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** Largura estimada do slot (ex.: coluna estreita de card ≈ 320px). */
  sizes?: string;
  overlayClassName?: string;
  /** Zoom leve no scroll. Desligue para capas editoriais (ex.: reels). */
  zoom?: boolean;
  /** contained = menos overscan — ideal para capas 9:16 em cards. */
  layerDepth?: "default" | "contained";
};

export function ParallaxImage({
  alt,
  src,
  variant = "muted",
  priority = false,
  className,
  imageClassName,
  speed = MOTION.parallax.default,
  mode = "scroll",
  triggerRef,
  overlayClassName,
  sizes = "100vw",
  zoom = true,
  layerDepth = "default",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const fixedBgRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || mode !== "scroll") {
      return;
    }

    const container = containerRef.current;
    const layer = layerRef.current;

    if (!container || !layer) {
      return;
    }

    const isTouchLayout =
      window.matchMedia("(max-width: 1023px), (hover: none) and (pointer: coarse)").matches;

    if (isTouchLayout) {
      return;
    }

    const travel = speed * 100;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer,
        { yPercent: -travel * 0.5 },
        {
          yPercent: travel * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            scroller: scrollTriggerScroller(),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [mode, prefersReducedMotion, speed]);

  useEffect(() => {
    if (prefersReducedMotion || mode !== "fixed") {
      return;
    }

    const trigger = triggerRef?.current;
    const fixedBg = fixedBgRef.current;
    const layer = layerRef.current;

    if (!trigger || !fixedBg || !layer) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer,
        { scale: 1 },
        {
          scale: 1 + speed * 1.65,
          ease: "none",
          scrollTrigger: {
            trigger,
            scroller: scrollTriggerScroller(),
            start: "top top",
            end: "bottom top",
            scrub: 0.45,
          },
        },
      );

      ScrollTrigger.create({
        trigger,
        scroller: scrollTriggerScroller(),
        start: "bottom top",
        onLeave: () => {
          fixedBg.style.visibility = "hidden";
        },
        onEnterBack: () => {
          fixedBg.style.visibility = "visible";
        },
      });
    }, trigger);

    return () => ctx.revert();
  }, [mode, prefersReducedMotion, speed, triggerRef]);

  const layerClasses = cn(
    layerDepth === "contained"
      ? "absolute inset-x-0 top-[-12%] h-[124%] w-full motion-safe:will-change-transform"
      : "absolute inset-x-0 top-[-26%] h-[152%] w-full motion-safe:will-change-transform",
    !prefersReducedMotion && mode === "scroll" && "motion-reduce:top-0 motion-reduce:h-full",
    mode === "fixed" && !prefersReducedMotion && "inset-0 top-0 h-full",
    "relative",
  );

  const imageLayer = (
    <div ref={layerRef} className={layerClasses}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover object-center min-h-full min-w-full",
            !prefersReducedMotion && mode === "scroll" && zoom && "scale-105",
            imageClassName,
          )}
        />
      ) : (
        <MockImage
          label={alt}
          variant={variant}
          className={cn("h-full", imageClassName)}
        />
      )}
    </div>
  );

  if (mode === "fixed") {
    if (prefersReducedMotion) {
      return (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden bg-muted",
            className,
          )}
          aria-hidden
        >
          {imageLayer}
          {overlayClassName ? (
            <div className={cn("absolute inset-0", overlayClassName)} />
          ) : null}
        </div>
      );
    }

    return (
      <div
        ref={fixedBgRef}
        className={cn(
          "pointer-events-none fixed inset-0 z-0 h-svh w-full overflow-hidden bg-muted",
          className,
        )}
        aria-hidden
      >
        {imageLayer}
        {overlayClassName ? (
          <div className={cn("absolute inset-0", overlayClassName)} />
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-muted", className)}
    >
      {imageLayer}
    </div>
  );
}
