"use client";

import Link from "next/link";
import {
  Camera,
  MapPin,
  PlayCircle,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal, RevealItem, StaggerReveal } from "@/components/motion/reveal";
import { ExternalArrow } from "@/components/ui/external-arrow";
import { mediaAssets } from "@/content/media";
import { siteConfig } from "@/content/site";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

const columns = [
  {
    featured: {
      title: "Conheça a clínica",
      description: "Ambiente, método e presença em Pouso Alegre.",
      href: "/",
      image: mediaAssets.linkBio.institucional,
      label: "Institucional",
      icon: Sparkles,
    },
    support: [
      {
        title: "Depoimentos em vídeo",
        description: "Histórias de pacientes",
        href: "/#reels",
        icon: Star,
        tone: "dark" as const,
        hideOnMobile: true,
      },
      {
        title: "Instagram",
        description: "Rotina da clínica",
        href: siteConfig.instagramHref,
        icon: Camera,
        tone: "light" as const,
        hideOnMobile: true,
      },
    ],
  },
  {
    featured: {
      title: "Tratamentos",
      description: "Emagrecimento, estética e saúde metabólica.",
      href: "/#cuidado",
      image: mediaAssets.linkBio.protocolo,
      label: "Especialidades",
      icon: Stethoscope,
    },
    support: [
      {
        title: "Localização",
        description: siteConfig.city,
        href: siteConfig.mapsHref,
        icon: MapPin,
        tone: "light" as const,
      },
      {
        title: "YouTube",
        description: "Conteúdos da clínica",
        href: siteConfig.youtubeHref,
        icon: PlayCircle,
        tone: "light" as const,
      },
    ],
  },
] as const;

const proofPoints = [
  { value: "4.9", label: "no Google" },
  { value: "+800", label: "acompanhadas" },
  { value: "1:1", label: "avaliação" },
] as const;

const mobileSupportLinks = columns.flatMap((column) =>
  column.support.filter((item) => !("hideOnMobile" in item && item.hideOnMobile)),
);

export function LinkBioBento() {
  return (
    <section className="relative isolate flex min-h-0 w-full max-w-[100vw] flex-1 flex-col overflow-hidden max-lg:h-full lg:h-full">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ParallaxImage
          alt={mediaAssets.linkBioSection.alt}
          src={mediaAssets.linkBioSection.src}
          speed={MOTION.parallax.break}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-background/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_38%),linear-gradient(160deg,var(--background),transparent_52%)]" />
      </div>

      <div
        className={cn(
          "relative z-10 flex min-h-0 flex-1 flex-col max-lg:h-full max-lg:overflow-hidden lg:h-full lg:overflow-hidden",
          layout.gutter,
          "pb-[max(5rem,env(safe-area-inset-bottom))] pt-[calc(5rem+0.875rem+env(safe-area-inset-top,0px))] lg:pb-4 lg:pt-[calc(5rem+0.75rem)]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-6xl flex-col",
            "max-lg:min-h-0 max-lg:flex-1 max-lg:gap-3 sm:max-lg:gap-3.5",
            "lg:h-full lg:min-h-0 lg:grid lg:grid-cols-[minmax(18rem,0.62fr)_minmax(0,1.38fr)] lg:gap-5",
          )}
        >
          <LinkBioIntroPanel />

          <div className="grid w-full min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)_auto] gap-2.5 sm:gap-3 lg:hidden">
            {columns.map((column) => (
              <FeaturedBioCard
                key={column.featured.title}
                item={column.featured}
                density="mobile"
                className="h-full min-h-0"
              />
            ))}
            {mobileSupportLinks.map((item) => (
              <SupportBioCard key={item.title} item={item} density="mobile" />
            ))}
          </div>

          {/* Desktop: bento completo com todos os cards e copy */}
          <StaggerReveal className="hidden min-h-0 min-w-0 grid-cols-2 gap-3 lg:grid lg:h-full">
            {columns.map((column) => (
              <RevealItem
                key={column.featured.title}
                className="flex min-h-0 min-w-0 flex-col gap-3"
              >
                <FeaturedBioCard
                  item={column.featured}
                  density="desktop"
                  className="min-h-0 flex-1"
                />
                {column.support.map((item) => (
                  <SupportBioCard key={item.title} item={item} density="desktop" />
                ))}
              </RevealItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

function LinkBioIntroPanel() {
  return (
    <Reveal
      preset="fadeIn"
      className="flex shrink-0 flex-col gap-3 rounded-2xl border border-border/70 bg-background/88 p-4 backdrop-blur-xl max-lg:gap-3 sm:max-lg:gap-3.5 lg:h-full lg:justify-between lg:gap-5 lg:p-6"
    >
      <div className="min-w-0 space-y-3 lg:space-y-0">
        <p className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground lg:inline-flex">
          <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden />
          {siteConfig.city}
        </p>

        <div className="lg:mt-3">
          <h1 className="font-serif text-[clamp(1.5625rem,5.5vw,2.65rem)] font-normal leading-[1.1] text-balance text-foreground max-lg:tracking-normal lg:leading-[1.08]">
            Estética avançada com olhar médico.
          </h1>

          <p className="mt-2.5 max-w-none text-pretty text-sm leading-6 text-muted-foreground sm:mt-3 lg:mt-4 lg:max-w-[32ch] lg:text-[0.9375rem] lg:leading-7">
            Tecnologia, avaliação individual e acompanhamento próximo em Pouso Alegre.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border/80 rounded-xl border border-border/70 bg-card/40">
        {proofPoints.map((item) => (
          <div key={item.label} className="min-w-0 px-2 py-3 text-center lg:px-3 lg:py-4">
            <p className="text-[0.9375rem] font-semibold leading-none tabular-nums text-foreground lg:text-lg">
              {item.value}
            </p>
            <p className="mt-1.5 text-[0.6875rem] leading-4 text-muted-foreground lg:mt-2 lg:text-xs lg:leading-4">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="shrink-0">
        <Link
          href={siteConfig.evaluationFormHref}
          className="group relative flex min-h-[3.625rem] items-center overflow-hidden rounded-2xl bg-primary px-4 py-3 text-primary-foreground motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 lg:min-h-[5.75rem] lg:p-4"
        >
          <span
            className="absolute inset-y-0 right-0 w-[55%] bg-linear-to-l from-primary-foreground/14 to-transparent opacity-90 motion-safe:transition motion-safe:duration-500 group-hover:translate-x-3"
            aria-hidden
          />
          <span className="relative flex w-full items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-base font-medium leading-tight lg:text-[1.45rem] lg:leading-none">
                Solicitar avaliação
              </span>
              <span className="mt-1 hidden text-sm leading-5 text-primary-foreground/76 lg:mt-2 lg:block">
                Receba uma avaliação personalizada.
              </span>
            </span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary motion-safe:transition motion-safe:duration-300 group-hover:scale-105 lg:size-11">
              <ExternalArrow />
            </span>
          </span>
        </Link>
      </div>
    </Reveal>
  );
}

type FeaturedItem = (typeof columns)[number]["featured"];
type SupportItem = (typeof columns)[number]["support"][number];
type Density = "mobile" | "desktop";

function FeaturedBioCard({
  item,
  className,
  density = "desktop",
}: {
  item: FeaturedItem;
  className?: string;
  density?: Density;
}) {
  const Icon = item.icon;
  const isMobile = density === "mobile";

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex min-h-0 overflow-hidden rounded-2xl bg-primary text-white",
        className,
      )}
    >
      <ParallaxImage
        alt={item.image.alt}
        src={item.image.src}
        speed={MOTION.parallax.card}
        className="absolute inset-0"
        imageClassName="motion-safe:transition motion-safe:duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/86 via-black/30 to-black/8" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.2),transparent_28%)] opacity-80"
        aria-hidden
      />

      <div
        className={cn(
          "relative flex h-full w-full flex-col justify-between",
          isMobile ? "gap-3 p-3.5" : "p-3.5 sm:p-4 lg:p-5",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full bg-white/92 font-medium text-zinc-950",
              isMobile
                ? "gap-1 px-2.5 py-1 text-[0.6875rem]"
                : "gap-1.5 px-2.5 py-1.5 text-[0.68rem] sm:text-xs",
            )}
          >
            <Icon className={isMobile ? "size-3.5" : "size-3.5 sm:size-4"} aria-hidden />
            {item.label}
          </span>
          <span
            className={cn(
              "grid place-items-center rounded-full bg-white text-zinc-950 motion-safe:transition motion-safe:duration-300 group-hover:scale-105",
              isMobile ? "size-8" : "size-8 sm:size-9",
            )}
          >
            <ExternalArrow size={isMobile ? "sm" : "md"} />
          </span>
        </div>
        <div className="min-w-0">
          <h2
            className={cn(
              "text-balance font-sans font-medium leading-[1.15]",
              isMobile
                ? "text-[0.9375rem]"
                : "text-[1.35rem] sm:text-[1.65rem] lg:text-[clamp(1.4rem,2.1vw,1.85rem)]",
            )}
          >
            {item.title}
          </h2>
          {!isMobile ? (
            <p className="mt-1.5 max-w-[32ch] text-pretty text-xs leading-5 text-white/80 sm:mt-2 sm:text-[0.8125rem]">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function SupportBioCard({
  item,
  density = "desktop",
}: {
  item: SupportItem;
  density?: Density;
}) {
  const Icon = item.icon;
  const isDark = item.tone === "dark";
  const isMobile = density === "mobile";
  const isExternal = item.href.startsWith("http");

  const className = cn(
    "group flex items-center justify-between border motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-0.5",
    isMobile
      ? "min-h-[3.5rem] gap-2.5 rounded-2xl px-3.5 py-3"
      : "min-h-[4.25rem] shrink-0 gap-2.5 rounded-2xl px-3.5 py-3 sm:min-h-[4.5rem] sm:gap-3 sm:px-4",
    isDark
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card/90 text-card-foreground hover:border-primary/20 hover:bg-muted/70",
  );

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-full",
            isMobile ? "size-8" : "size-9 sm:size-10",
            isDark ? "bg-primary-foreground/14" : "bg-muted text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block font-semibold leading-snug",
              isMobile ? "text-sm" : "text-sm sm:text-[0.9375rem] sm:leading-5",
            )}
          >
            {item.title}
          </span>
          <span
            className={cn(
              "mt-0.5 block text-pretty leading-4",
              isMobile ? "text-xs" : "text-xs sm:leading-snug",
              isDark ? "text-primary-foreground/76" : "text-muted-foreground",
            )}
          >
            {item.description}
          </span>
        </span>
      </span>
      <ExternalArrow
        size={isMobile ? "sm" : "md"}
        className={cn(
          "shrink-0 motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5",
          isDark ? "text-primary-foreground/72" : "text-muted-foreground",
        )}
      />
    </>
  );

  if (isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}
