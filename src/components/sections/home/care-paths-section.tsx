"use client";

import { ArrowRight } from "lucide-react";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal, RevealItem, StaggerReveal } from "@/components/motion/reveal";
import { PageSection, SectionHeading } from "@/components/sections/section-shell";
import {
  homeCarePathsSection,
  type HomeCarePath,
} from "@/content/home-care-paths";
import { siteConfig } from "@/content/site";
import { newWindowHint } from "@/lib/a11y";
import { MOTION } from "@/lib/motion";

type CarePathPosterProps = {
  path: HomeCarePath;
  index: number;
};

function CarePathPoster({ path, index }: CarePathPosterProps) {
  const order = String(index + 1).padStart(2, "0");

  return (
    <RevealItem>
      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar com a equipe sobre ${path.title}. ${newWindowHint}`}
        className="group relative block min-h-[26rem] overflow-hidden rounded-xl bg-primary text-white ring-1 ring-white/10 motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:-translate-y-1 sm:min-h-[28rem]"
      >
        <ParallaxImage
          alt={path.image.alt}
          src={path.image.src}
          speed={MOTION.parallax.card}
          sizes="(min-width: 1024px) 33vw, 90vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/84 via-black/20 to-black/10 transition-colors duration-300 group-hover:from-black/88" />
        <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm font-medium text-white/80">
            <span className="tabular-nums">{order}</span>
            <span className="grid size-10 place-items-center rounded-full text-white transition-[background-color,color] duration-300 group-hover:bg-white group-hover:text-primary">
              <ArrowRight
                className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-rotate-45"
                strokeWidth={2.25}
                aria-hidden
              />
            </span>
          </div>
          <div>
            <h3 className="max-w-sm text-balance font-sans text-3xl font-medium leading-[1.12] sm:text-4xl">
              {path.title}
            </h3>
            <p className="mt-4 max-w-md text-pretty text-sm leading-7 text-white/78 sm:text-base">
              {path.description}
            </p>
          </div>
        </div>
      </a>
    </RevealItem>
  );
}

export function CarePathsSection() {
  const { id, title, paths } = homeCarePathsSection;

  return (
    <PageSection id={id} className="bg-background">
      <Reveal preset="fadeUp">
        <SectionHeading title={title} wide className="mb-14 sm:mb-16" />
      </Reveal>
      <StaggerReveal className="grid gap-5 lg:grid-cols-2">
        {paths.map((path, index) => (
          <CarePathPoster key={path.id} path={path} index={index} />
        ))}
      </StaggerReveal>
    </PageSection>
  );
}
