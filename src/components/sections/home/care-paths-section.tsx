"use client";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { CarePathsJourney } from "@/components/sections/home/care-paths-journey";
import { PageSection } from "@/components/sections/section-shell";
import { HOME_CARE_PATHS_SECTION_ID } from "@/content/home-care-paths";
import { layout } from "@/lib/layout";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function CarePathsSection() {
  return (
    <PageSection
      id={HOME_CARE_PATHS_SECTION_ID}
      className={cn("bg-transparent", layout.sectionBandEnd)}
      containerClassName="grid gap-10 sm:gap-14 lg:gap-18"
    >
      <div>
        <Reveal preset="fadeUp">
          <p className={type.eyebrow}>Etapas da Jornada</p>
        </Reveal>
        <AnimatedHeading
          text="Saúde contínua, inteligente e integrada"
          className={cn(layout.proseAfterHeading, "max-w-3xl text-balance", type.section)}
        />
        <Reveal preset="fadeUp" delay={0.08}>
          <p className={cn("max-w-2xl", type.body, layout.proseAfterHeading)}>
            Acompanhamento contínuo, personalizado e baseado em dados com foco em
            energia, performance, equilíbrio hormonal e qualidade de vida.
          </p>
        </Reveal>
      </div>

      <CarePathsJourney />
    </PageSection>
  );
}
