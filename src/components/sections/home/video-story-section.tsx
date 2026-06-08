"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { YoutubeEmbed } from "@/components/media/youtube-embed";
import { founderVideos, type VideoAsset } from "@/content/media";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Reveal } from "@/components/motion/reveal";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

function isPlayableVideo(video: VideoAsset) {
  return Boolean(video.src || video.youtubeId);
}

function VideoControl({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition-[background-color,transform,opacity] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
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
  const total = founderVideos.featured.length;

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

function VideoStoryList({
  videos,
  activeIndex,
  onSelect,
  onMove,
}: {
  videos: typeof founderVideos.featured;
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
                className={cn(
                  "group flex w-full scroll-mt-2 items-center justify-between border-b border-border py-3.5 text-left transition-colors sm:py-4",
                  active
                    ? "bg-muted/35 text-foreground"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground",
                )}
              >
                <span className="max-w-[15rem] text-base font-medium sm:text-lg">
                  {video.title}
                </span>
                <span
                  className={cn(
                    "font-sans text-sm font-semibold tabular-nums leading-none transition-colors",
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

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs tabular-nums text-muted-foreground">
          {String(activeIndex + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-1.5" role="group" aria-label="Navegar depoimentos">
          <VideoControl
            label="Depoimento anterior"
            onClick={() => onMove(-1)}
          >
            <ChevronLeft className="size-4" />
          </VideoControl>
          <VideoControl
            label="Próximo depoimento"
            onClick={() => onMove(1)}
          >
            <ChevronRight className="size-4" />
          </VideoControl>
        </div>
      </div>
    </div>
  );
}

function VideoPreviewCard({
  video,
  activeIndex,
  total,
  onMove,
  swipeEnabled,
  transitionDirection = 1,
}: {
  video: VideoAsset;
  activeIndex: number;
  total: number;
  onMove?: (direction: -1 | 1) => void;
  swipeEnabled?: boolean;
  transitionDirection?: -1 | 1;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const swipeRef = useRef({ startX: 0, startY: 0, swiped: false });
  const prefersReducedMotion = usePrefersReducedMotion();

  const showInlineVideo = playing && isPlayableVideo(video);

  const togglePlayback = useCallback(() => {
    if (video.youtubeId) {
      setPlaying(true);
      return;
    }

    if (video.src && videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
        return;
      }

      void videoRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }

    setPlaying((current) => !current);
  }, [playing, video.src, video.youtubeId]);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (!swipeEnabled) return;
    swipeRef.current = {
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      swiped: false,
    };
  }, [swipeEnabled]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (!swipeEnabled) return;
    const { startX, startY } = swipeRef.current;
    const deltaX = event.touches[0].clientX - startX;
    const deltaY = event.touches[0].clientY - startY;
    if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      swipeRef.current.swiped = true;
    }
  }, [swipeEnabled]);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!swipeEnabled || !onMove) return;
      const { startX, startY, swiped } = swipeRef.current;
      const deltaX = event.changedTouches[0].clientX - startX;
      const deltaY = event.changedTouches[0].clientY - startY;
      if (!swiped || Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      onMove(deltaX > 0 ? -1 : 1);
    },
    [onMove, swipeEnabled],
  );

  return (
    <motion.div
      key={video.id}
      initial={swipeEnabled && !prefersReducedMotion ? { opacity: 0.88, x: transitionDirection * 20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, ease: MOTION.ease }}
      className="group relative aspect-[9/16] w-full touch-pan-y overflow-hidden rounded-xl bg-primary text-white ring-1 ring-border/40 motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:-translate-y-0.5"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showInlineVideo ? (
        video.youtubeId ? (
          <YoutubeEmbed
            key={video.id}
            videoId={video.youtubeId}
            title={video.title}
          />
        ) : (
          <video
            ref={videoRef}
            key={video.id}
            src={video.src}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            autoPlay
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        )
      ) : (
        <>
          <ParallaxImage
            alt={video.title}
            src={video.thumbSrc}
            speed={MOTION.parallax.card}
            sizes="(min-width: 768px) 280px, 45vw"
            className="absolute inset-0"
            imageClassName={cn(
              "motion-safe:transition motion-safe:duration-700",
              playing ? "scale-100" : "motion-safe:group-hover:scale-[1.02]",
            )}
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/78 via-transparent to-black/12" />
        </>
      )}

      <div className="absolute inset-x-0 top-0 z-30 p-5">
        <span className="pointer-events-none text-sm font-medium tabular-nums text-white/82">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {!showInlineVideo ? (
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
              className="pointer-events-auto grid size-[4.25rem] place-items-center rounded-full bg-white text-primary ring-1 ring-white/50 transition-transform duration-300 hover:scale-[1.04]"
              aria-label={
                playing
                  ? `Pausar depoimento: ${video.title}`
                  : `Reproduzir depoimento: ${video.title}`
              }
            >
              {playing ? (
                <Pause className="size-5 fill-current" aria-hidden />
              ) : (
                <Play className="ml-0.5 size-5 fill-current" aria-hidden />
              )}
            </button>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 pt-20">
            <h3 className="text-balance font-sans text-[1.35rem] font-medium leading-[1.2] sm:text-2xl">
              {video.title}
            </h3>
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const total = founderVideos.featured.length;
  const activeVideo = founderVideos.featured[activeIndex] ?? founderVideos.featured[0]!;

  const selectVideo = useCallback((index: number) => {
    dispatch({ type: "select", index });
  }, []);

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

  return (
    <section
      ref={sectionRef}
      id="reels"
      className={cn("overflow-hidden bg-background py-24 sm:py-32", layout.gutter)}
    >
      <div
        className={cn(
          "mx-auto grid min-h-0 gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.72fr)] lg:items-start",
          layout.container,
        )}
      >
        <Reveal preset="fadeUp" className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            Depoimentos em video
          </p>
          <h2 className="mt-4 text-balance font-sans text-4xl font-medium leading-[1.12] sm:text-5xl">
            O cuidado visto por quem passou pela experiência.
          </h2>
          <p className="mt-4 max-w-lg text-pretty text-base leading-7 text-muted-foreground">
            Reels curtos sobre rotina, segurança e autoestima.
          </p>

          <VideoStoryList
            videos={founderVideos.featured}
            activeIndex={activeIndex}
            onSelect={selectVideo}
            onMove={moveVideo}
          />
        </Reveal>

        <Reveal preset="fadeUp" delay={0.12} className="relative mx-auto w-full max-w-[24rem] self-start lg:mr-0 lg:sticky lg:top-28">
          <VideoPreviewCard
            key={activeVideo.id}
            video={activeVideo}
            activeIndex={activeIndex}
            total={total}
            onMove={moveVideo}
            swipeEnabled={!isDesktop}
            transitionDirection={transitionDirection}
          />
        </Reveal>
      </div>
    </section>
  );
}
