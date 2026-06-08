"use client";

import { FaqAccordion } from "@/components/interaction/faq-accordion";
import { Reveal } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { faqs } from "@/content/site";

export function FaqSectionAlt() {
  return (
    <PageSection
      id="duvidas"
      className="bg-transparent pb-8 pt-24 sm:pb-10 sm:pt-32 lg:pb-12 lg:pt-36"
      containerClassName="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
    >
      <Reveal preset="fadeUp" className="lg:sticky lg:top-28">
        <h2 className="text-balance font-sans text-4xl font-medium leading-[1.12] sm:text-5xl">
          Dúvidas antes da avaliação.
        </h2>
        <p className="mt-4 max-w-md text-pretty text-base leading-7 text-muted-foreground">
          Respostas curtas para decidir se faz sentido conversar com a equipe.
        </p>
      </Reveal>
      <FaqAccordion items={faqs.slice(0, 5)} animated />
    </PageSection>
  );
}
