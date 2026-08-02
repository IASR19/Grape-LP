"use client";

import dynamic from "next/dynamic";

import { DeferredMount } from "@/components/layout/deferred-mount";
import { HomeScrollNav } from "@/components/layout/home-scroll-nav";
import { LogoPatternBand } from "@/components/layout/logo-pattern-band";
import { HeroSection } from "@/components/sections/home/hero-section";

const CareToggleSection = dynamic(
  () =>
    import("@/components/sections/home/care-toggle-section").then((module) => ({
      default: module.CareToggleSection,
    })),
  { ssr: false },
);

const ClinicGallerySection = dynamic(
  () =>
    import("@/components/sections/home/clinic-gallery-section").then((module) => ({
      default: module.ClinicGallerySection,
    })),
  { ssr: false },
);

const CarePathsSection = dynamic(
  () =>
    import("@/components/sections/home/care-paths-section").then((module) => ({
      default: module.CarePathsSection,
    })),
  { ssr: false },
);

const ProcessSection = dynamic(
  () =>
    import("@/components/sections/home/process-section").then((module) => ({
      default: module.ProcessSection,
    })),
  { ssr: false },
);

const FounderStatementSection = dynamic(
  () =>
    import("@/components/sections/home/founder-statement-section").then(
      (module) => ({
        default: module.FounderStatementSection,
      }),
    ),
  { ssr: false },
);

const VideoStorySection = dynamic(
  () =>
    import("@/components/sections/home/video-story-section").then((module) => ({
      default: module.VideoStorySection,
    })),
  { ssr: false },
);

const PatientStoriesSection = dynamic(
  () =>
    import("@/components/sections/home/patient-stories-section").then(
      (module) => ({
        default: module.PatientStoriesSection,
      }),
    ),
  { ssr: false },
);

const FaqSectionAlt = dynamic(
  () =>
    import("@/components/sections/home/faq-section-alt").then((module) => ({
      default: module.FaqSectionAlt,
    })),
  { ssr: false },
);

const ClosingCtaSection = dynamic(
  () =>
    import("@/components/sections/home/closing-cta-section").then((module) => ({
      default: module.ClosingCtaSection,
    })),
  { ssr: false },
);

export function PremiumHome() {
  return (
    <div className="relative max-w-[100vw] overflow-x-hidden bg-background">
      <div className="relative z-10">
        <HomeScrollNav />
        <HeroSection />

        <DeferredMount rootMargin="560px 0px" minHeight="100svh">
          <CareToggleSection />
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="28rem">
          <LogoPatternBand tone="soft">
            <ClinicGallerySection />
          </LogoPatternBand>
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="40rem">
          <LogoPatternBand tone="plain">
            <CarePathsSection />
          </LogoPatternBand>
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="36rem">
          <ProcessSection />
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="28rem">
          <LogoPatternBand tone="soft">
            <FounderStatementSection />
          </LogoPatternBand>
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="36rem">
          <LogoPatternBand tone="plain">
            <VideoStorySection />
          </LogoPatternBand>
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="36rem">
          <LogoPatternBand tone="plain">
            <PatientStoriesSection />
          </LogoPatternBand>
        </DeferredMount>

        <DeferredMount rootMargin="480px 0px" minHeight="28rem">
          <LogoPatternBand tone="soft">
            <FaqSectionAlt />
          </LogoPatternBand>
        </DeferredMount>

        <DeferredMount rootMargin="640px 0px" minHeight="40rem">
          <LogoPatternBand tone="plain">
            <ClosingCtaSection />
          </LogoPatternBand>
        </DeferredMount>
      </div>
    </div>
  );
}
