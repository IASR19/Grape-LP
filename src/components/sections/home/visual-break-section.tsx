"use client";

import { ParallaxImage } from "@/components/media/parallax-image";
import { Reveal, RevealText } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { mediaAssets } from "@/content/media";
import { homeCopy } from "@/content/site";
import { MOTION } from "@/lib/motion";

export function VisualBreakSection() {
  return (
    <PageSection containerClassName="p-0">
      <Reveal preset="media" className="relative min-h-[30rem] overflow-hidden rounded-xl sm:min-h-[34rem]">
        <ParallaxImage
          alt={mediaAssets.visualBreak.alt}
          src={mediaAssets.visualBreak.src}
          speed={MOTION.parallax.break}
          sizes="100vw"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12">
          <RevealText
            lines={[homeCopy.visualBreakTitle]}
            as="h2"
            className="max-w-xl text-balance font-sans text-4xl font-medium leading-[1.12] text-white sm:text-5xl"
            delay={0.12}
          />
        </div>
      </Reveal>
    </PageSection>
  );
}
