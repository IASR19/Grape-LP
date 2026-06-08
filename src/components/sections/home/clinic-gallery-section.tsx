"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Reveal, RevealText } from "@/components/motion/reveal";
import { clinicPhotos } from "@/content/media";
import { layout } from "@/lib/layout";
import { cn } from "@/lib/utils";

const galleryPhotos = [
  {
    src: clinicPhotos.institucional,
    alt: "Recepção ampla da Grape Clinic com balcão curvo e iluminação integrada",
    objectPosition: "50% 45%",
  },
  {
    src: clinicPhotos.ambiance,
    alt: "Consultório com espelho iluminado e ambiente acolhedor",
    objectPosition: "50% 50%",
  },
  {
    src: clinicPhotos.detail,
    alt: "Sala de atendimento com arquitetura curva e equipamentos clínicos",
    objectPosition: "50% 48%",
  },
  {
    src: clinicPhotos.corridor,
    alt: "Corredor interno da Grape Clinic com bancos integrados",
    objectPosition: "50% 50%",
  },
  {
    src: clinicPhotos.receptionAlt,
    alt: "Detalhe decorativo com painel circular iluminado na clínica",
    objectPosition: "50% 50%",
  },
] as const;

export function ClinicGallerySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnnouncement = useMemo(
    () =>
      `Imagem ${activeIndex + 1} de ${galleryPhotos.length}: ${galleryPhotos[activeIndex].alt}`,
    [activeIndex],
  );

  function scrollToSlide(index: number) {
    const slide = slideRefs.current[index];

    if (!slide) return;

    slide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function goToSlide(index: number) {
    setActiveIndex(index);
    scrollToSlide(index);
  }

  function move(direction: -1 | 1) {
    const nextIndex =
      (activeIndex + direction + galleryPhotos.length) % galleryPhotos.length;
    goToSlide(nextIndex);
  }

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible?.target) return;

        const index = slideRefs.current.findIndex(
          (slide) => slide === visible.target,
        );

        if (index >= 0) {
          setActiveIndex(index);
        }
      },
      {
        root: track,
        threshold: [0.55, 0.72, 0.9],
      },
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="galeria" className={cn(layout.gutter, "pb-16 lg:pb-20")}>
      <div className={cn(layout.container, "min-w-0")}>
        <div className="flex h-svh min-h-[36rem] flex-col overflow-hidden">
          <div
            className={cn(
              "flex shrink-0 flex-col gap-4 pb-4 sm:pb-5",
              "pt-16 sm:pt-20 lg:flex-row lg:items-end lg:justify-between lg:pb-4 lg:pt-20",
            )}
          >
            <Reveal>
              <p className="text-sm font-medium text-muted-foreground">
                Galeria da clínica
              </p>
              <RevealText
                lines={["Ambientes, detalhes e presença."]}
                as="h2"
                delay={0.08}
                className="mt-4 max-w-2xl text-balance font-sans text-4xl font-medium leading-[1.12] sm:text-5xl"
              />
            </Reveal>

            <Reveal preset="fadeIn" delay={0.12} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:border-primary/35 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 lg:size-11"
                aria-label="Imagem anterior da galeria"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:border-primary/35 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 lg:size-11"
                aria-label="Próxima imagem da galeria"
              >
                <ChevronRight className="size-4" />
              </button>
            </Reveal>
          </div>

          <div className="relative min-h-0 flex-1">
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {slideAnnouncement}
            </p>
            <div
              ref={trackRef}
              role="region"
              aria-roledescription="carrossel"
              aria-label="Fotos da clínica"
              className={cn(
                "absolute inset-0 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4",
              )}
            >
              {galleryPhotos.map((photo, index) => (
                <div
                  key={photo.src}
                  ref={(node) => {
                    slideRefs.current[index] = node;
                  }}
                  className="relative h-full min-w-[86%] snap-center overflow-hidden rounded-xl bg-muted ring-1 ring-border sm:min-w-[78%] lg:min-w-[calc(100%-2.5rem)]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 75rem, 88vw"
                    className="object-cover"
                    style={{ objectPosition: photo.objectPosition }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-2 pb-6 pt-3 sm:pb-7 lg:pb-8 lg:pt-4">
            {galleryPhotos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
                  activeIndex === index
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-border hover:bg-primary/45",
                )}
                aria-label={`Ir para imagem ${index + 1} da galeria`}
                aria-current={activeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
