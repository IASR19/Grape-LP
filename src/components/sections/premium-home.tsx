"use client";

import { CareToggleSection } from "@/components/sections/home/care-toggle-section";
import { ClosingCtaSection } from "@/components/sections/home/closing-cta-section";
import { FaqSectionAlt } from "@/components/sections/home/faq-section-alt";
import { FounderStatementSection } from "@/components/sections/home/founder-statement-section";
import { ClinicGallerySection } from "@/components/sections/home/clinic-gallery-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { PatientStoriesSection } from "@/components/sections/home/patient-stories-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { CarePathsSection } from "@/components/sections/home/care-paths-section";
import { TimelineSection } from "@/components/sections/home/timeline-section";
import { VideoStorySection } from "@/components/sections/home/video-story-section";
import { VisualBreakSection } from "@/components/sections/home/visual-break-section";
import { HomeScrollNav } from "@/components/layout/home-scroll-nav";
import { LogoPatternBand } from "@/components/layout/logo-pattern-band";

export function PremiumHome() {
  return (
    <div className="relative z-10 max-w-[100vw] overflow-x-hidden bg-background">
      <HomeScrollNav />
      <HeroSection />
      <CareToggleSection />
      <VisualBreakSection />
      <CarePathsSection />
      <TimelineSection />
      <ProcessSection />
      <FounderStatementSection />
      <VideoStorySection />
      <PatientStoriesSection />
      <LogoPatternBand>
        <FaqSectionAlt />
        <ClosingCtaSection />
        <ClinicGallerySection />
      </LogoPatternBand>
    </div>
  );
}
