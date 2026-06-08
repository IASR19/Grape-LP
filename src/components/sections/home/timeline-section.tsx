"use client";

import { MethodTimeline } from "@/components/sections/home/method-timeline";
import { RevealText } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { homeCopy, methodSteps } from "@/content/site";
import { layout } from "@/lib/layout";

export function TimelineSection() {
  return (
    <PageSection id="avaliacao">
      <RevealText
        lines={[homeCopy.timelineTitle]}
        as="h2"
        className={layout.sectionTitleWide}
      />
      <MethodTimeline steps={methodSteps} />
    </PageSection>
  );
}
