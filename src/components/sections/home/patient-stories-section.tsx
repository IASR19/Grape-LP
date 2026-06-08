"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useState } from "react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { LiquidGlassSurface } from "@/components/ui/liquid-glass-surface";
import { mediaAssets } from "@/content/media";
import { testimonials } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PatientAvatarProps = {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

function PatientAvatar({ src, name, size = "md", className }: PatientAvatarProps) {
  const sizeClass =
    size === "sm" ? "size-11" : size === "lg" ? "size-16 sm:size-[4.5rem]" : "size-12";

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-muted",
        sizeClass,
        className,
      )}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={size === "lg" ? "4.5rem" : size === "sm" ? "2.75rem" : "3rem"}
        className="object-cover"
      />
    </span>
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

export function PatientStoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStory = testimonials[activeIndex];

  return (
    <section
      id="historias"
      className={cn(
        "relative isolate overflow-hidden py-20 text-primary-foreground sm:py-24 lg:py-32",
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
      </div>

      <div className={cn("relative z-10 mx-auto", layout.container)}>
        <Reveal preset="fadeUp" className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
          <div className="drop-shadow-[0_2px_20px_rgba(0,0,0,0.48)] text-primary-foreground dark:text-[oklch(0.975_0.018_84)]">
            <p className="text-sm font-medium opacity-[0.82]">
              O que aparece nos relatos
            </p>
            <h2 className="mt-5 max-w-xl text-balance font-sans text-3xl font-medium leading-[1.12] sm:text-4xl lg:text-5xl">
              Direcao durante o percurso.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid min-w-0 gap-4 sm:mt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <div className="min-h-[22rem] sm:min-h-[28rem] lg:min-h-[30rem]">
            <LiquidGlassSurface
              variant="featured"
              className="h-full min-h-[inherit] p-6 sm:p-9 lg:p-12"
              contentClassName="flex h-full min-h-[inherit] flex-col justify-between gap-6 sm:gap-8"
            >
              <Quote className="size-10 text-primary/36" aria-hidden />
              <blockquote className="max-w-3xl text-balance font-sans text-2xl font-medium leading-[1.2] sm:text-3xl lg:text-4xl">
                &ldquo;{activeStory.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <PatientAvatar
                  src={activeStory.photoSrc}
                  name={activeStory.name}
                  size="lg"
                  className="ring-2 ring-border"
                />
                <div>
                  <p className="text-sm font-semibold">{activeStory.name}</p>
                  <div className="mt-2">
                    <RatingStars animateKey={activeStory.name} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Paciente acompanhada pela Grape Clinic
                  </p>
                </div>
              </figcaption>
            </LiquidGlassSurface>
          </div>

          <div className="grid gap-2.5" role="group" aria-label="Selecionar relato de paciente">
            {testimonials.map((story, index) => {
              const active = activeIndex === index;

              return (
                <LiquidGlassSurface
                  key={story.name}
                  as="button"
                  type="button"
                  variant={active ? "listActive" : "list"}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={active}
                  aria-label={`${story.name}${active ? ", selecionado" : ""}`}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    <PatientAvatar
                      src={story.photoSrc}
                      name={story.name}
                      size="sm"
                      className={cn(
                        "ring-2 transition-colors duration-300",
                        active ? "ring-primary/20" : "ring-primary-foreground/24",
                      )}
                    />
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-5">
                      <div>
                        <p className="text-sm font-semibold">{story.name}</p>
                        {active ? (
                          <>
                            <div className="mt-2">
                              <RatingStars animateKey={`${story.name}-active`} />
                            </div>
                            <p className="mt-3 text-pretty text-sm leading-6 text-primary/72">
                              {story.quote}
                            </p>
                          </>
                        ) : null}
                      </div>
                      <span className="shrink-0 font-sans text-sm font-semibold tabular-nums leading-none opacity-80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </LiquidGlassSurface>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
