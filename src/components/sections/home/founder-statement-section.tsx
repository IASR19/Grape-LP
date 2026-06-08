"use client";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal, RevealMedia } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { mediaAssets } from "@/content/media";
import { doctorProfile, homeCopy } from "@/content/site";
import { MOTION } from "@/lib/motion";

export function FounderStatementSection() {
  return (
    <PageSection id="fundadora" className="overflow-x-clip" containerClassName="grid min-w-0 gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
      <RevealMedia className="relative min-h-[32rem] w-full min-w-0 overflow-hidden rounded-xl">
        <ParallaxImage
          alt={mediaAssets.founderPortrait.alt}
          src={mediaAssets.founderPortrait.src}
          speed={MOTION.parallax.narrative}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/54 to-transparent" />
        <p className="absolute bottom-6 left-6 text-sm font-medium text-white">
          {doctorProfile.name}
        </p>
      </RevealMedia>
      <Reveal preset="fadeUp" delay={0.1} className="flex min-h-[28rem] w-full min-w-0 overflow-hidden flex-col justify-between gap-10 rounded-xl bg-primary p-6 text-primary-foreground sm:min-h-[32rem] sm:p-9 lg:p-12">
        <p className="max-w-md text-pretty text-base leading-8 text-primary-foreground/74">
          {doctorProfile.note}
        </p>
        <h2 className="max-w-full text-balance font-sans text-3xl font-medium leading-[1.12] sm:text-4xl lg:text-5xl">
          {homeCopy.founderTitle}
        </h2>
      </Reveal>
    </PageSection>
  );
}
