"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { patientReels, type VideoAsset } from "@/content/media";
import { homeCopy } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

const featuredReels = patientReels.featured;

function getReelDisplayLabel(video: VideoAsset) {
  return video.displayLabel ?? video.title;
}

function isPlayableVideo(video: VideoAsset) {
  return Boolean(video.src && video.poster);
}

const reelEase = [0.22, 1, 0.36, 1] as const;

function formatReelIndex(value: number) {
  return String(value).padStart(2, "0");
}

function VideoControl({
  label,
  onClick,
  disabled,
  children,
  size = "md",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid place-items-center rounded-full bg-primary text-primary-foreground transition-[background-color,transform,opacity] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "size-10" : "size-11",
      )}
    >
      {children}
    </button>
  );
}

function resolveDirection(current: number, next: number, total: number): 1 | -1 {
  if (next === 0 && current === total - 1) return 1;
  if (next === total - 1 && current === 0) return -1;
  return next > current ? 1 : -1;
}

type VideoNavState = {
  index: number;
  direction: 1 | -1;
};

function videoNavReducer(
  state: VideoNavState,
  action: { type: "select"; index: number } | { type: "move"; direction: -1 | 1 },
): VideoNavState {
  const total = featuredReels.length;

  if (action.type === "move") {
    const next = state.index + action.direction;
    const index = next < 0 ? total - 1 : next >= total ? 0 : next;
    if (index === state.index) return state;
    return { index, direction: action.direction };
  }

  const index = action.index;
  if (index < 0 || index >= total || index === state.index) return state;
  return { index, direction: resolveDirection(state.index, index, total) };
}

function VideoStoryNav({
  activeIndex,
  total,
  onMove,
  className,
  showCounter = true,
}: {
  activeIndex: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  className?: string;
  showCounter?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        showCounter ? "justify-between" : "justify-center",
        className,
      )}
    >
      {showCounter ? (
        <p className="text-xs tabular-nums text-muted-foreground">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      ) : null}
      <div className="flex items-center gap-1.5" role="group" aria-label="Navegar depoimentos">
        <VideoControl label="Depoimento anterior" onClick={() => onMove(-1)}>
          <ChevronLeft className="size-4" />
        </VideoControl>
        <VideoControl label="Próximo depoimento" onClick={() => onMove(1)}>
          <ChevronRight className="size-4" />
        </VideoControl>
      </div>
    </div>
  );
}

function VideoStoryMobileRail() {
  return (
    <p className="mt-3 text-center text-[0.6875rem] leading-4 tracking-[0.04em] text-muted-foreground/82 uppercase">
      Deslize no vídeo para trocar
    </p>
  );
}

function VideoStoryList({
  videos,
  activeIndex,
  onSelect,
  onMove,
}: {
  videos: readonly VideoAsset[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [edgeFade, setEdgeFade] = useState({ top: false, bottom: false });

  const updateEdgeFade = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const threshold = 6;
    setEdgeFade({
      top: list.scrollTop > threshold,
      bottom: list.scrollTop + list.clientHeight < list.scrollHeight - threshold,
    });
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    updateEdgeFade();
    list.addEventListener("scroll", updateEdgeFade, { passive: true });
    const observer = new ResizeObserver(updateEdgeFade);
    observer.observe(list);

    return () => {
      list.removeEventListener("scroll", updateEdgeFade);
      observer.disconnect();
    };
  }, [updateEdgeFade, videos.length]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, videos.length);
  }, [videos.length]);

  useEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    activeItem?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion ? "auto" : "smooth" });
    requestAnimationFrame(updateEdgeFade);
  }, [activeIndex, prefersReducedMotion, updateEdgeFade]);

  return (
    <div className="relative mt-10 min-h-0">
      <div className="relative">
        <div
          ref={listRef}
          className={cn(
            "space-y-0 overflow-y-auto overscroll-y-auto pr-1",
            "max-h-[19.75rem] sm:max-h-[22.5rem]",
            "[-ms-overflow-style:none] [scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
          )}
          role="listbox"
          aria-label="Lista de depoimentos em video"
          aria-activedescendant={`reels-option-${activeIndex}`}
        >
          {videos.map((video, index) => {
            const active = index === activeIndex;
            const displayTitle = getReelDisplayLabel(video);

            return (
              <button
                key={video.id}
                id={`reels-option-${index}`}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onSelect(index)}
                aria-controls="reels-preview"
                aria-label={`${displayTitle} — ${video.title}`}
                className={cn(
                  "group flex w-full scroll-mt-2 items-center justify-between border-b border-border px-3 py-3.5 text-left transition-colors sm:px-3.5 sm:py-4",
                  active
                    ? "bg-muted/35 text-foreground"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground",
                )}
              >
                <span className="max-w-[15rem] text-sm font-medium leading-snug sm:max-w-xs sm:text-base">
                  {displayTitle}
                </span>
                <span
                  className={cn(
                    "font-sans text-[0.6875rem] font-semibold tabular-nums leading-none transition-colors sm:text-sm",
                    active ? "text-primary" : "text-muted-foreground/72 group-hover:text-foreground/72",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-background via-background/72 to-transparent transition-opacity duration-300",
            edgeFade.top ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-background via-background/72 to-transparent transition-opacity duration-300",
            edgeFade.bottom ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      <VideoStoryNav
        activeIndex={activeIndex}
        total={videos.length}
        onMove={onMove}
        className="mt-4"
      />
    </div>
  );
}

function VideoOverlayNav({
  onMove,
  size = "md",
}: {
  onMove: (direction: -1 | 1) => void;
  size?: "sm" | "md";
}) {
  const buttonClass = cn(
    "grid place-items-center rounded-full border border-white/28 bg-black/28 text-white backdrop-blur-[2px] transition-[background-color,transform,border-color] duration-300 hover:border-white/42 hover:bg-black/42 motion-safe:hover:-translate-y-0.5",
    size === "sm" ? "size-9" : "size-10",
  );

  return (
    <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label="Navegar depoimentos">
      <button
        type="button"
        aria-label="Depoimento anterior"
        onClick={() => onMove(-1)}
        className={buttonClass}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Próximo depoimento"
        onClick={() => onMove(1)}
        className={buttonClass}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function VideoPreviewCard({
  video,
  displayTitle,
  activeIndex,
  total,
  onMove,
  swipeEnabled,
  transitionDirection = 1,
  showIndexBadge = true,
  showTitleOverlay = true,
  overlayMode = "desktop",
}: {
  video: VideoAsset;
  displayTitle: string;
  activeIndex: number;
  total: number;
  onMove?: (direction: -1 | 1) => void;
  swipeEnabled?: boolean;
  transitionDirection?: -1 | 1;
  showIndexBadge?: boolean;
  showTitleOverlay?: boolean;
  overlayMode?: "desktop" | "mobile";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const swipeRef = useRef({ startX: 0, startY: 0, swiped: false });
  const prefersReducedMotion = usePrefersReducedMotion();

  const playable = isPlayableVideo(video);
  const isMobileOverlay = overlayMode === "mobile";
  const progress = ((activeIndex + 1) / total) * 100;

  const togglePlayback = useCallback(() => {
    setPlaying((current) => !current);
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!swipeEnabled) return;
    const touch = event.touches[0];
    if (!touch) return;

    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      swiped: false,
    };
  }, [swipeEnabled]);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!swipeEnabled) return;
      const touch = event.touches[0];
      if (!touch) return;

      const { startX, startY } = swipeRef.current;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        swipeRef.current.swiped = true;
        event.preventDefault();
      }
    },
    [swipeEnabled],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!swipeEnabled || !onMove) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const { startX, startY, swiped } = swipeRef.current;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (!swiped || Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY)) return;

      onMove(deltaX > 0 ? -1 : 1);
    },
    [onMove, swipeEnabled],
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !swipeEnabled) return;

    card.addEventListener("touchstart", handleTouchStart, { passive: true });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      card.removeEventListener("touchstart", handleTouchStart);
      card.removeEventListener("touchmove", handleTouchMove);
      card.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchEnd, handleTouchMove, handleTouchStart, swipeEnabled, video.id]);

  return (
    <motion.div
      ref={cardRef}
      key={video.id}
      initial={swipeEnabled && !prefersReducedMotion ? { opacity: 0.94, x: transitionDirection * 12 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.26, ease: MOTION.ease }}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-primary text-white ring-1 ring-border/40 max-sm:rounded-2xl max-sm:shadow-[0_28px_56px_-28px_oklch(0.31_0.115_322/0.34)] motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:-translate-y-0.5"
      style={{ touchAction: swipeEnabled ? "pan-y pinch-zoom" : undefined }}
    >
      {playable && !playing ? (
        <ParallaxImage
          alt=""
          src={video.poster}
          speed={MOTION.parallax.card}
          sizes="(min-width: 1024px) 24rem, 100vw"
          layerDepth="contained"
          zoom={false}
          className="absolute inset-0 z-0"
          imageClassName="motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.02]"
        />
      ) : null}

      {playable && playing ? (
        <video
          ref={videoRef}
          key={video.id}
          src={video.src}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          controls
          autoPlay
          playsInline
          preload="metadata"
          aria-label={`${displayTitle} — ${video.title}`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}

      {!playing && showTitleOverlay && !isMobileOverlay ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%] bg-linear-to-t from-black/58 via-black/18 to-transparent" />
      ) : null}

      {!playing && isMobileOverlay ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%] bg-linear-to-t from-black/68 via-black/28 to-transparent" />
      ) : null}

      {isMobileOverlay && !playing ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-white/18"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Progresso nos depoimentos em vídeo"
        >
          <motion.div
            className="h-full origin-left bg-white/88"
            animate={{ scaleX: progress / 100 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.42,
              ease: reelEase,
            }}
          />
        </div>
      ) : null}

      {showIndexBadge && !isMobileOverlay ? (
        <div className="absolute inset-x-0 top-0 z-30 p-5">
          <span className="pointer-events-none text-sm font-medium tabular-nums text-white/82">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {swipeEnabled ? (
            <span className="sr-only">
              Deslize horizontalmente para trocar de depoimento.
            </span>
          ) : null}
        </div>
      ) : swipeEnabled ? (
        <span className="sr-only">
          Deslize horizontalmente para trocar de depoimento.
        </span>
      ) : null}

      {!playing && isMobileOverlay ? (
        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1 pointer-events-none">
              <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-white/80 uppercase tabular-nums">
                {formatReelIndex(activeIndex + 1)} · {formatReelIndex(total)}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.h3
                  key={displayTitle}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: transitionDirection * 5 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: transitionDirection * -5 }
                  }
                  transition={{ duration: 0.24, ease: reelEase }}
                  className="mt-1.5 text-balance font-sans text-[0.9375rem] font-medium leading-snug text-white sm:text-base"
                >
                  {displayTitle}
                </motion.h3>
              </AnimatePresence>
            </div>

            {onMove ? (
              <div className="pointer-events-auto shrink-0">
                <VideoOverlayNav onMove={onMove} size="sm" />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {!playing ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
            <button
              type="button"
              onClick={(event) => {
                if (swipeRef.current.swiped) {
                  event.preventDefault();
                  return;
                }
                togglePlayback();
              }}
              className="pointer-events-auto grid size-14 place-items-center rounded-full bg-white text-primary ring-1 ring-white/50 transition-transform duration-300 hover:scale-[1.04] sm:size-16"
              aria-label={
                playing
                  ? `Pausar depoimento: ${displayTitle}`
                  : `Reproduzir depoimento: ${displayTitle}`
              }
            >
              {playing ? (
                <Pause className="size-5 fill-current" aria-hidden />
              ) : (
                <Play className="ml-0.5 size-5 fill-current" aria-hidden />
              )}
            </button>
          </div>

          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5",
              showTitleOverlay && !isMobileOverlay && "pt-20",
            )}
          >
            {showTitleOverlay && !isMobileOverlay ? (
              <h3 className="text-balance font-sans text-xl font-medium leading-[1.2] sm:text-2xl">
                {displayTitle}
              </h3>
            ) : null}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

export function VideoStorySection() {
  const [{ index: activeIndex, direction: transitionDirection }, dispatch] = useReducer(
    videoNavReducer,
    { index: 0, direction: 1 as const },
  );
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const total = featuredReels.length;
  const activeVideo = featuredReels[activeIndex] ?? featuredReels[0]!;

  const selectVideo = useCallback(
    (index: number) => {
      dispatch({ type: "select", index });

      if (isDesktop || typeof window === "undefined") return;

      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [isDesktop, prefersReducedMotion],
  );

  const moveVideo = useCallback((direction: -1 | 1) => {
    dispatch({ type: "move", direction });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (!section?.contains(document.activeElement)) return;

      event.preventDefault();
      dispatch({ type: "move", direction: event.key === "ArrowLeft" ? -1 : 1 });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeDisplayTitle = getReelDisplayLabel(activeVideo);

  return (
    <section
      ref={sectionRef}
      id="reels"
      className={cn("overflow-hidden bg-transparent", layout.sectionBandStart, layout.gutter)}
    >
      <div className={cn("mx-auto w-full", layout.container)}>
        {isDesktop ? (
          <div className="grid min-h-0 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.68fr)] lg:items-start lg:gap-18">
            <div className="max-w-2xl">
              <Reveal preset="fadeUp">
                <p className={type.eyebrow}>{patientReels.sectionTitle}</p>
              </Reveal>
              <AnimatedHeading
                text={homeCopy.reelsTitle}
                className={cn("mt-4 max-w-xl text-balance", type.sectionSub)}
              />
              <Reveal preset="fadeUp" delay={0.08}>
                <p className={cn("max-w-lg", type.body, layout.proseAfterHeading)}>
                  {patientReels.sectionLead}
                </p>

                <VideoStoryList
                  videos={featuredReels}
                  activeIndex={activeIndex}
                  onSelect={selectVideo}
                  onMove={moveVideo}
                />
              </Reveal>
            </div>

            <Reveal
              preset="fadeUp"
              delay={0.12}
              className={cn(
                "relative mx-auto w-full max-w-[24rem] self-start lg:mr-0 lg:sticky",
                layout.stickyAside,
              )}
            >
              <div id="reels-preview" ref={previewRef}>
                <VideoPreviewCard
                  key={activeVideo.id}
                  video={activeVideo}
                  displayTitle={activeDisplayTitle}
                  activeIndex={activeIndex}
                  total={total}
                  onMove={moveVideo}
                  swipeEnabled={false}
                  transitionDirection={transitionDirection}
                />
              </div>
            </Reveal>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="max-w-2xl">
              <Reveal preset="fadeUp">
                <p className={type.eyebrow}>{patientReels.sectionTitle}</p>
              </Reveal>
              <AnimatedHeading
                text={homeCopy.reelsTitle}
                className={cn("mt-3 text-balance sm:mt-4", type.section)}
              />
              <Reveal preset="fadeUp" delay={0.06}>
                <p className={cn("max-w-md", type.body, layout.proseAfterHeading)}>
                  {patientReels.sectionLead}
                </p>
              </Reveal>
            </div>

            <Reveal preset="fadeUp" delay={0.1} className="mt-8 w-full min-w-0 sm:mt-10">
              <div id="reels-preview" ref={previewRef} className="min-w-0">
                <VideoPreviewCard
                  key={activeVideo.id}
                  video={activeVideo}
                  displayTitle={activeDisplayTitle}
                  activeIndex={activeIndex}
                  total={total}
                  onMove={moveVideo}
                  swipeEnabled
                  transitionDirection={transitionDirection}
                  overlayMode="mobile"
                />
              </div>

              <VideoStoryMobileRail />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
