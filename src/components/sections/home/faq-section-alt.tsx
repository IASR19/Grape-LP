"use client";

import { FaqAccordion } from "@/components/interaction/faq-accordion";
import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { faqs, homeCopy } from "@/content/site";
import { layout } from "@/lib/layout";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function FaqSectionAlt() {
  return (
    <PageSection
      id="duvidas"
      className={cn("bg-transparent", layout.sectionBandStart)}
      containerClassName="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-18"
    >
      <div className={cn("mb-0 max-w-md lg:sticky", layout.stickyAside)}>
        <AnimatedHeading
          text={homeCopy.faqTitle}
          className={cn("max-w-md", type.sectionSub)}
        />
        <Reveal preset="fadeUp" delay={0.08}>
          <p className={cn("max-w-md", type.body, layout.proseAfterHeading)}>
            Respostas curtas para decidir se faz sentido conversar com a equipe.
          </p>
        </Reveal>
      </div>
      <FaqAccordion items={faqs.slice(0, 5)} animated />
    </PageSection>
  );
}
