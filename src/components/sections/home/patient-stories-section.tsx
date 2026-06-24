"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SplitText } from "@/components/effects/split-text";
import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { LiquidGlassSurface } from "@/components/ui/liquid-glass-surface";
import {
  googleReviews,
  googleReviewsMeta,
  type GoogleReview,
} from "@/content/google-reviews";
import { mediaAssets } from "@/content/media";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

const reviewEase = [0.22, 1, 0.36, 1] as const;

/** Depoimentos visíveis na lista lateral por página. */
const REVIEWS_PER_PAGE = 5;

const patientStoriesTitleLines = [
  "O que nossos pacientes",
  "contam sobre a Grape.",
] as const;

const reviewQuoteBlockClass =
  "min-h-[10.5rem] sm:min-h-[12rem] lg:min-h-[15rem]";

function resolveReviewDirection(current: number, next: number): 1 | -1 {
  if (next === current) return 1;
  return next > current ? 1 : -1;
}

const reviewQuoteClassName =
  "max-w-3xl text-pretty font-sans text-[1.05rem] font-medium leading-[1.36] text-card-foreground sm:text-2xl sm:leading-[1.32] lg:text-[1.85rem]";

/** Texto sobre a foto de fundo — sempre claro, independente do tema. */
const storiesOverlayTextClass = "text-white";

function quoteWordCount(quote: string) {
  return quote.trim().split(/\s+/).filter(Boolean).length;
}

type ReviewQuoteTextProps = {
  quote: string;
  direction: 1 | -1;
  prefersReducedMotion: boolean;
  onAnimationComplete?: () => void;
};

function ReviewQuoteText({
  quote,
  direction,
  prefersReducedMotion,
  onAnimationComplete,
}: ReviewQuoteTextProps) {
  const isStatic = prefersReducedMotion || quoteWordCount(quote) > 30;

  useEffect(() => {
    if (isStatic) onAnimationComplete?.();
  }, [isStatic, quote, onAnimationComplete]);

  if (isStatic) {
    return (
      <blockquote className={reviewQuoteClassName}>
        &ldquo;{quote}&rdquo;
      </blockquote>
    );
  }

  return (
    <SplitText
      key={quote}
      tag="blockquote"
      text={`“${quote}”`}
      triggerMode="change"
      splitType="words"
      delay={22}
      startDelay={110}
      duration={0.44}
      ease="power4.out"
      from={{ opacity: 0, y: direction * 18, scale: 0.975 }}
      to={{ opacity: 1, y: 0, scale: 1 }}
      className={reviewQuoteClassName}
      onLetterAnimationComplete={onAnimationComplete}
    />
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ReviewAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function ReviewAvatar({ name, size = "md", className }: ReviewAvatarProps) {
  const sizeClass =
    size === "sm"
      ? "size-9"
      : size === "lg"
        ? "size-16 sm:size-[4.5rem]"
        : "size-12";
  const textClass =
    size === "sm" ? "text-[11px]" : size === "lg" ? "text-lg sm:text-xl" : "text-sm";

  return (
    <span
      className={cn(
        "box-border grid shrink-0 place-items-center rounded-full bg-primary/14 font-semibold text-primary",
        sizeClass,
        textClass,
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}

function StaticRatingStars({ value = 5 }: { value?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Avaliação: ${value} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-2.5",
            index < value ? "fill-primary text-primary" : "fill-transparent text-primary/22",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

function RatingStars({
  value = 5,
  animateKey,
}: {
  value?: number;
  animateKey?: string | number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex gap-0.5" role="img" aria-label={`Avaliação: ${value} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.span
          key={`${animateKey ?? "rating"}-${index}`}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.72, y: 3 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.32,
            delay: prefersReducedMotion ? 0 : index * 0.055,
            ease: MOTION.ease,
          }}
          className="inline-flex"
        >
          <Star
            className={cn(
              "size-3",
              index < value ? "fill-primary text-primary" : "fill-transparent text-primary/22",
            )}
            aria-hidden
          />
        </motion.span>
      ))}
    </div>
  );
}

type FeaturedReviewPanelProps = {
  review: GoogleReview;
  reviewIndex: number;
  direction: 1 | -1;
  prefersReducedMotion: boolean;
};

type MobileReviewAccordionProps = {
  review: GoogleReview;
  index: number;
  active: boolean;
  prefersReducedMotion: boolean;
  onSelect: () => void;
};

function MobileReviewAccordion({
  review,
  index,
  active,
  prefersReducedMotion,
  onSelect,
}: MobileReviewAccordionProps) {
  const panelId = `review-mobile-panel-${index}`;
  const order = String(index + 1).padStart(2, "0");

  return (
    <LiquidGlassSurface
      variant={active ? "listActive" : "list"}
      className="w-full overflow-hidden"
      contentClassName="flex flex-col p-0"
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        aria-expanded={active}
        aria-controls={panelId}
        aria-label={`${review.name}${active ? ", expandido" : ""}`}
        className="flex w-full items-center px-3 py-3 text-left sm:px-3.5 sm:py-3.5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ReviewAvatar
            name={review.name}
            size="sm"
            className={cn(
              "border transition-colors duration-300",
              active ? "border-primary/24" : "border-border/80",
            )}
          />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight sm:text-sm">
                {review.name}
              </p>
              <div className="mt-1">
                <StaticRatingStars />
              </div>
            </div>
            <span className="shrink-0 font-sans text-xs font-semibold tabular-nums leading-none opacity-70">
              {order}
            </span>
          </div>
        </div>
      </button>

      {prefersReducedMotion ? (
        active ? (
          <div
            id={panelId}
            role="region"
            aria-label={`Depoimento de ${review.name}`}
            className="border-t border-border/60 px-3 pb-4 pt-3 sm:px-3.5 sm:pb-5 sm:pt-4"
          >
            <Quote className="mb-3 size-7 text-primary/36" aria-hidden />
            <blockquote className="text-pretty font-sans text-sm font-medium leading-[1.38] text-card-foreground sm:text-lg">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
              Avaliação verificada no Google
            </p>
          </div>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {active ? (
            <motion.div
              id={panelId}
              key={`${review.name}-mobile-panel`}
              role="region"
              aria-label={`Depoimento de ${review.name}`}
              initial={{ height: 0, opacity: 0.94 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0.94 }}
              transition={{
                height: { duration: 0.46, ease: reviewEase },
                opacity: { duration: 0.32, ease: reviewEase },
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-border/60 px-3 pb-4 pt-3 sm:px-3.5 sm:pb-5 sm:pt-4">
                <Quote className="mb-3 size-7 text-primary/36" aria-hidden />
                <blockquote className="text-pretty font-sans text-sm font-medium leading-[1.38] text-card-foreground sm:text-lg">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <p className="mt-3 text-xs text-muted-foreground sm:text-sm">
                  Avaliação verificada no Google
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </LiquidGlassSurface>
  );
}

function FeaturedReviewPanel({
  review,
  reviewIndex,
  direction,
  prefersReducedMotion,
}: FeaturedReviewPanelProps) {
  const metaOffset = direction * 8;
  const [quoteAnimatedIndex, setQuoteAnimatedIndex] = useState<number | null>(
    prefersReducedMotion ? reviewIndex : null,
  );
  const quoteReady = prefersReducedMotion || quoteAnimatedIndex === reviewIndex;

  const handleQuoteComplete = useCallback(() => {
    setQuoteAnimatedIndex(reviewIndex);
  }, [reviewIndex]);

  const metaTransition = {
    duration: prefersReducedMotion ? 0 : 0.46,
    ease: reviewEase,
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`review-${reviewIndex}`}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.24, ease: reviewEase }}
        className="flex h-full flex-col"
      >
        <div className="mt-3 flex flex-col gap-5 sm:mt-4 sm:gap-6">
          <motion.div
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.34,
              ease: reviewEase,
              delay: prefersReducedMotion ? 0 : 0.04,
            }}
          >
            <Quote className="size-10 text-primary/36" aria-hidden />
          </motion.div>

          <div className={reviewQuoteBlockClass}>
            <ReviewQuoteText
              quote={review.quote}
              direction={direction}
              prefersReducedMotion={prefersReducedMotion}
              onAnimationComplete={handleQuoteComplete}
            />
          </div>
        </div>

        <motion.figcaption
          initial={
            prefersReducedMotion ? false : { opacity: 0, y: metaOffset }
          }
          animate={
            quoteReady ? { opacity: 1, y: 0 } : { opacity: 0, y: metaOffset }
          }
          transition={metaTransition}
          className="mt-auto flex items-center gap-4 pt-6 sm:pt-8"
        >
          <motion.div
            initial={
              prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }
            }
            animate={
              quoteReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }
            }
            transition={metaTransition}
          >
            <ReviewAvatar
              name={review.name}
              size="lg"
              className="border-2 border-border"
            />
          </motion.div>
          <div>
            <motion.p
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 8 }
              }
              animate={quoteReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{
                ...metaTransition,
                delay: prefersReducedMotion || !quoteReady ? 0 : 0.06,
              }}
              className="text-sm font-semibold text-card-foreground"
            >
              {review.name}
            </motion.p>
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 6 }
              }
              animate={quoteReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{
                ...metaTransition,
                delay: prefersReducedMotion || !quoteReady ? 0 : 0.12,
              }}
              className="mt-2"
            >
              <RatingStars animateKey={`${review.name}-${reviewIndex}`} />
            </motion.div>
            <motion.p
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 6 }
              }
              animate={quoteReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{
                ...metaTransition,
                delay: prefersReducedMotion || !quoteReady ? 0 : 0.2,
              }}
              className="mt-2 text-sm text-muted-foreground"
            >
              Avaliação verificada no Google
            </motion.p>
          </div>
        </motion.figcaption>
      </motion.div>
    </AnimatePresence>
  );
}

export function PatientStoriesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [page, setPage] = useState(0);
  const activeReview = googleReviews[activeIndex];
  const totalPages = Math.ceil(googleReviews.length / REVIEWS_PER_PAGE);
  const pageStart = page * REVIEWS_PER_PAGE;
  const visibleReviews = googleReviews.slice(
    pageStart,
    pageStart + REVIEWS_PER_PAGE,
  );

  const selectReview = (index: number) => {
    setDirection(resolveReviewDirection(activeIndex, index));
    setActiveIndex(index);
    setPage(Math.floor(index / REVIEWS_PER_PAGE));
  };

  const goToPage = (nextPage: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
    if (clamped === page) return;

    const nextStart = clamped * REVIEWS_PER_PAGE;
    const nextIndex =
      activeIndex >= nextStart && activeIndex < nextStart + REVIEWS_PER_PAGE
        ? activeIndex
        : nextStart;

    setDirection(clamped > page ? 1 : -1);
    setActiveIndex(nextIndex);
    setPage(clamped);
  };

  return (
    <section
      id="historias"
      className={cn(
        "relative isolate overflow-hidden",
        layout.sectionBandSolo,
        layout.gutter,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ParallaxImage
          alt={mediaAssets.patientStoriesSection.alt}
          src={mediaAssets.patientStoriesSection.src}
          speed={MOTION.parallax.narrative}
          sizes="100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/48 via-black/34 to-black/52" />
      </div>

      <div className={cn("relative z-10 mx-auto", layout.container)}>
        <div className={cn(storiesOverlayTextClass, "max-w-3xl")}>
          <Reveal preset="fadeUp">
            <p className="text-sm font-medium text-white/82">
              Avaliações reais no Google
            </p>
          </Reveal>
          <RevealText
            as="h2"
            lines={patientStoriesTitleLines}
            lineClassName="block text-pretty lg:whitespace-nowrap"
            className={cn(
              layout.proseAfterHeading,
              "text-white",
              type.section,
            )}
          />
            <Reveal preset="fadeUp" delay={0.06}>
              <Link
                href={googleReviewsMeta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-white/22 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/16 sm:px-4 sm:text-sm"
              >
                <span className="font-semibold">Google</span>
                <RatingStars value={googleReviewsMeta.rating} />
                <span className="tabular-nums text-white/90">
                  {googleReviewsMeta.rating.toFixed(1).replace(".", ",")} ·{" "}
                  {googleReviewsMeta.count.toLocaleString("pt-BR")} avaliações
                </span>
              </Link>
            </Reveal>
        </div>

        <div className={cn("flex flex-col gap-2 lg:hidden", layout.gridAfterProse)}>
          <div
            className="flex flex-col gap-1.5"
            role="group"
            aria-label="Selecionar avaliação do Google"
          >
            {visibleReviews.map((review, visibleIndex) => {
              const index = pageStart + visibleIndex;
              const active = activeIndex === index;

              return (
                <MobileReviewAccordion
                  key={`${index}-${review.name}`}
                  review={review}
                  index={index}
                  active={active}
                  prefersReducedMotion={prefersReducedMotion}
                  onSelect={() => selectReview(index)}
                />
              );
            })}
          </div>

          {totalPages > 1 ? (
            <div className="flex shrink-0 items-center justify-between gap-3 pt-0.5">
              <p className="text-sm tabular-nums text-white/72">
                {String(page + 1).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </p>

              <div className="flex items-center gap-2">
                <LiquidGlassSurface
                  as="button"
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  aria-label="Avaliações anteriores"
                  variant="list"
                  className="size-10 shrink-0 !rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                  contentClassName="flex size-full items-center justify-center"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </LiquidGlassSurface>
                <LiquidGlassSurface
                  as="button"
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  aria-label="Próximas avaliações"
                  variant="list"
                  className="size-10 shrink-0 !rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                  contentClassName="flex size-full items-center justify-center"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </LiquidGlassSurface>
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "hidden min-w-0 gap-5 sm:gap-6 lg:grid",
            layout.gridAfterProse,
            "lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-stretch lg:gap-x-6 lg:gap-y-3",
          )}
        >
          <div className="flex min-h-0 flex-col lg:col-start-1">
            <LiquidGlassSurface
              as="figure"
              variant="featured"
              className="min-h-[26rem] w-full text-card-foreground sm:min-h-[28rem] lg:h-[36rem] lg:min-h-0"
              contentClassName="flex min-h-0 flex-1 flex-col p-5 sm:p-9 lg:p-12"
            >
              <FeaturedReviewPanel
                review={activeReview}
                reviewIndex={activeIndex}
                direction={direction}
                prefersReducedMotion={prefersReducedMotion}
              />
            </LiquidGlassSurface>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-2 lg:col-start-2 lg:h-[36rem]">
            <div
              className="flex min-h-0 flex-1 flex-col gap-1.5 lg:min-h-0"
              role="group"
              aria-label="Selecionar avaliação do Google"
            >
              <AnimatePresence initial={false}>
                {visibleReviews.map((review, visibleIndex) => {
                  const index = pageStart + visibleIndex;
                  const active = activeIndex === index;

                  return (
                    <motion.div
                      key={`${index}-${review.name}`}
                      className="flex min-h-0 flex-1"
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 8 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        prefersReducedMotion ? undefined : { opacity: 0, y: -6 }
                      }
                      transition={{
                        duration: 0.28,
                        ease: reviewEase,
                        delay: prefersReducedMotion ? 0 : visibleIndex * 0.03,
                      }}
                    >
                      <LiquidGlassSurface
                        as="button"
                        type="button"
                        onClick={() => selectReview(index)}
                        aria-pressed={active}
                        aria-label={`${review.name}${active ? ", selecionado" : ""}`}
                        variant={active ? "listActive" : "list"}
                        className="h-[3.75rem] w-full sm:h-[4.5rem] lg:h-full lg:min-h-[4.5rem]"
                        contentClassName="flex h-full w-full items-center px-3 text-left sm:px-3.5"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <ReviewAvatar
                            name={review.name}
                            size="sm"
                            className={cn(
                              "border transition-colors duration-300",
                              active ? "border-primary/24" : "border-border/80",
                            )}
                          />
                          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold leading-tight sm:text-sm">
                                {review.name}
                              </p>
                              <div className="mt-1">
                                <StaticRatingStars />
                              </div>
                            </div>
                            <span className="shrink-0 font-sans text-xs font-semibold tabular-nums leading-none opacity-70">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </LiquidGlassSurface>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {totalPages > 1 ? (
              <div className="flex shrink-0 items-center justify-between gap-3 pt-0.5">
                <p className="text-sm tabular-nums text-white/72">
                  {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
                </p>

                <div className="flex items-center gap-2">
                  <LiquidGlassSurface
                    as="button"
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 0}
                    aria-label="Avaliações anteriores"
                    variant="list"
                    className="size-10 shrink-0 !rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                    contentClassName="flex size-full items-center justify-center"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </LiquidGlassSurface>
                  <LiquidGlassSurface
                    as="button"
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages - 1}
                    aria-label="Próximas avaliações"
                    variant="list"
                    className="size-10 shrink-0 !rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                    contentClassName="flex size-full items-center justify-center"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </LiquidGlassSurface>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
