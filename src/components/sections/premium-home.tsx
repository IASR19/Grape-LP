"use client";

import dynamic from "next/dynamic";

import { CareToggleSection } from "@/components/sections/home/care-toggle-section";
import { FaqSectionAlt } from "@/components/sections/home/faq-section-alt";
import { FounderStatementSection } from "@/components/sections/home/founder-statement-section";
import { ClinicGallerySection } from "@/components/sections/home/clinic-gallery-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { CarePathsSection } from "@/components/sections/home/care-paths-section";
import { HomeScrollNav } from "@/components/layout/home-scroll-nav";
import { LogoPatternBand } from "@/components/layout/logo-pattern-band";

const ProcessSection = dynamic(
  () =>
    import("@/components/sections/home/process-section").then((module) => ({
      default: module.ProcessSection,
    })),
  { ssr: true },
);

const VideoStorySection = dynamic(
  () =>
    import("@/components/sections/home/video-story-section").then((module) => ({
      default: module.VideoStorySection,
    })),
  { ssr: true },
);

const PatientStoriesSection = dynamic(
  () =>
    import("@/components/sections/home/patient-stories-section").then((module) => ({
      default: module.PatientStoriesSection,
    })),
  { ssr: true },
);

const ClosingCtaSection = dynamic(
  () =>
    import("@/components/sections/home/closing-cta-section").then((module) => ({
      default: module.ClosingCtaSection,
    })),
  { ssr: true },
);

export function PremiumHome() {
  return (
    <div className="relative max-w-[100vw] overflow-x-hidden bg-background">
      <div className="relative z-10">
        <HomeScrollNav />
        <HeroSection />
        <CareToggleSection />

        <LogoPatternBand tone="soft">
          <ClinicGallerySection />
        </LogoPatternBand>

        <LogoPatternBand tone="plain">
          <CarePathsSection />
        </LogoPatternBand>

        <ProcessSection />

        <LogoPatternBand tone="soft">
          <FounderStatementSection />
        </LogoPatternBand>

        <LogoPatternBand tone="plain">
          <VideoStorySection />
        </LogoPatternBand>

        <LogoPatternBand tone="plain">
          <PatientStoriesSection />
        </LogoPatternBand>

        <LogoPatternBand tone="soft">
          <FaqSectionAlt />
        </LogoPatternBand>

        <LogoPatternBand tone="plain">
          <ClosingCtaSection />
        </LogoPatternBand>
      </div>
    </div>
  );
}
