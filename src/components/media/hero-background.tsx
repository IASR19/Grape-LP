"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSiteIntroReady } from "@/hooks/use-site-intro-ready";
import { resolveHeroVideoSrc } from "@/lib/intro/media-cache";
import { isAutomationClient } from "@/lib/intro/should-play-intro";
import { MOTION } from "@/lib/motion";
import { registerGsapPlugins, scrollTriggerScroller } from "@/lib/motion/gsap";
import { cn } from "@/lib/utils";

registerGsapPlugins();

const MAX_PLAY_ATTEMPTS = 6;

type HeroBackgroundProps = {
  videoSrc: string;
  posterSrc: string;
  alt: string;
  triggerRef: RefObject<HTMLElement | null>;
  speed?: number;
  overlayClassName?: string;
};

function shouldDeferVideoForConnection() {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return true;
  return connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
}

function isDesktopPointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function HeroBackground({
  videoSrc,
  posterSrc,
  alt,
  triggerRef,
  speed = MOTION.parallax.hero,
  overlayClassName,
}: HeroBackgroundProps) {
  const fixedBgRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const whiteFadeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAttemptsRef = useRef(0);
  const tryPlayRef = useRef<() => void>(() => {});

  const [mountVideo, setMountVideo] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const introReady = useSiteIntroReady();

  const canAutoplay = introReady && !prefersReducedMotion && mountVideo && Boolean(resolvedSrc);

  const markVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  const scheduleReadyAfterFirstFrame = useCallback((video: HTMLVideoElement) => {
    if (video.currentTime > 0 && !video.paused) {
      markVideoReady();
      return;
    }

    const requestFrame = (
      video as HTMLVideoElement & {
        requestVideoFrameCallback?: (callback: () => void) => number;
      }
    ).requestVideoFrameCallback;

    if (requestFrame) {
      requestFrame.call(video, () => markVideoReady());
      return;
    }

    const onTimeUpdate = () => {
      if (video.currentTime > 0) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        markVideoReady();
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
  }, [markVideoReady]);

  const tryPlay = useCallback(() => {
    if (!introReady || prefersReducedMotion || !mountVideo) return;

    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {
      if (playAttemptsRef.current < MAX_PLAY_ATTEMPTS) {
        playAttemptsRef.current += 1;
        window.setTimeout(() => {
          tryPlayRef.current();
        }, 300 * playAttemptsRef.current);
      }
    });
  }, [introReady, mountVideo, prefersReducedMotion]);

  useEffect(() => {
    tryPlayRef.current = tryPlay;
  }, [tryPlay]);

  /** Poster-first: só monta o vídeo após o intro, em idle (desktop) ou primeira interação (mobile). */
  useEffect(() => {
    if (prefersReducedMotion || !introReady) return;
    if (isAutomationClient()) return;
    if (shouldDeferVideoForConnection()) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const startVideo = () => {
      if (cancelled) return;
      setResolvedSrc(resolveHeroVideoSrc(videoSrc));
      setMountVideo(true);
    };

    const onFirstInteraction = () => {
      startVideo();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };

    if (isDesktopPointer()) {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(startVideo, { timeout: 2200 });
      } else {
        timeoutId = window.setTimeout(startVideo, 900);
      }
    } else {
      window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
      window.addEventListener("scroll", onFirstInteraction, { passive: true });
      timeoutId = window.setTimeout(startVideo, 4000);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };
  }, [introReady, prefersReducedMotion, videoSrc]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const trigger = triggerRef.current;
    const fixedBg = fixedBgRef.current;
    const layer = layerRef.current;

    if (!trigger || !fixedBg || !layer) return;

    const isTouchLayout =
      window.matchMedia("(max-width: 1023px), (hover: none) and (pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      const scrollConfig = {
        trigger,
        scroller: scrollTriggerScroller(),
        start: "top top",
        end: "bottom top",
        scrub: 0.55,
      };

      // Parallax só no desktop — no mobile custa main-thread sem ganho visual.
      if (!isTouchLayout) {
        gsap.fromTo(
          layer,
          {
            scale: 1,
            scaleX: 1,
            yPercent: 0,
          },
          {
            scale: 1 + speed * 1.55,
            scaleX: 1 + speed * 2.05,
            yPercent: -10,
            ease: "none",
            scrollTrigger: scrollConfig,
          },
        );

        if (whiteFadeRef.current) {
          gsap.fromTo(
            whiteFadeRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: scrollConfig,
            },
          );
        }
      }

      ScrollTrigger.create({
        trigger,
        scroller: scrollTriggerScroller(),
        start: "bottom top",
        onLeave: () => {
          fixedBg.style.visibility = "hidden";
          videoRef.current?.pause();
        },
        onEnterBack: () => {
          fixedBg.style.visibility = "visible";
          tryPlay();
        },
      });
    }, trigger);

    return () => ctx.revert();
  }, [prefersReducedMotion, speed, triggerRef, tryPlay]);

  useEffect(() => {
    if (!canAutoplay) return;

    const video = videoRef.current;
    if (!video) return;

    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const onTimeUpdate = () => {
      if (video.currentTime > 0) {
        markVideoReady();
      }
    };
    const onPlaying = () => scheduleReadyAfterFirstFrame(video);
    const onCanPlay = () => tryPlay();
    const onCanPlayThrough = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("loadeddata", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);

    playAttemptsRef.current = 0;
    tryPlay();

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("loadeddata", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [canAutoplay, resolvedSrc, tryPlay, markVideoReady, scheduleReadyAfterFirstFrame]);

  const poster = (
    <Image
      src={posterSrc}
      alt={prefersReducedMotion ? alt : ""}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );

  const mediaLayer = prefersReducedMotion ? (
    poster
  ) : (
    <>
      {mountVideo && resolvedSrc ? (
        <video
          ref={videoRef}
          data-hero-video
          src={resolvedSrc}
          loop
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          disablePictureInPicture
          controls={false}
          className={cn(
            "absolute inset-0 z-0 h-full w-full object-cover",
            "transition-opacity duration-500 ease-out",
            videoReady ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 z-[1] transition-opacity duration-500 ease-out",
          videoReady ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        {poster}
      </div>
    </>
  );

  const layer = (
    <div
      ref={layerRef}
      className="absolute inset-0 h-full w-full origin-center will-change-transform"
    >
      {mediaLayer}
    </div>
  );

  const whiteFade = (
    <div
      ref={whiteFadeRef}
      className="pointer-events-none absolute inset-0 bg-background opacity-0"
      aria-hidden
    />
  );

  if (prefersReducedMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden bg-muted"
        aria-hidden
      >
        {layer}
        {overlayClassName ? (
          <div className={cn("absolute inset-0", overlayClassName)} />
        ) : null}
        {whiteFade}
      </div>
    );
  }

  return (
    <div
      ref={fixedBgRef}
      className="pointer-events-none fixed inset-0 z-0 h-svh w-full overflow-hidden bg-background"
      aria-hidden
    >
      {layer}
      {overlayClassName ? (
        <div className={cn("absolute inset-0", overlayClassName)} />
      ) : null}
      {whiteFade}
    </div>
  );
}
