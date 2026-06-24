"use client";

import { ParallaxImage } from "@/components/media/parallax-image";
import { StaggerReveal, RevealItem } from "@/components/motion/reveal";
import { PageSection } from "@/components/sections/section-shell";
import { mediaAssets } from "@/content/media";
import {
  doctorProfile,
  formatDoctorRegistrationLabel,
  type ProfileTextSegment,
} from "@/content/site";
import { layout } from "@/lib/layout";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProfileRichTextProps = {
  segments: readonly ProfileTextSegment[];
  className?: string;
  emphasisClassName?: string;
};

function FounderOrnament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} aria-hidden>
      <span className="h-px w-8 bg-current opacity-45" />
      <span className="size-[3px] rotate-45 bg-current opacity-65" />
      <span className="h-px flex-1 max-w-16 bg-current opacity-32" />
    </div>
  );
}

function ProfileRichText({
  segments,
  className,
  emphasisClassName = "font-medium text-foreground",
}: ProfileRichTextProps) {
  return (
    <p className={className}>
      {segments.map((segment, index) =>
        segment.emphasis ? (
          <strong key={`${segment.text}-${index}`} className={emphasisClassName}>
            {segment.text}
          </strong>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </p>
  );
}

export function FounderStatementSection() {
  return (
    <PageSection
      id="fundadora"
      className={cn("overflow-x-clip bg-transparent", layout.sectionBandStart)}
      containerClassName="grid min-w-0 gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch lg:gap-16"
    >
      <div className="relative min-h-[22rem] w-full min-w-0 overflow-hidden rounded-lg ring-1 ring-border/35 sm:min-h-[30rem] lg:min-h-[40rem]">
        <ParallaxImage
          alt={mediaAssets.founderPortrait.alt}
          src={mediaAssets.founderPortrait.src}
          speed={MOTION.parallax.card}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0"
          imageClassName="object-[50%_36%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/18 to-transparent" />
        <div className="absolute bottom-7 left-7 right-7 space-y-3 sm:bottom-9 sm:left-9 sm:right-9">
          <p className="max-w-sm text-pretty text-xs leading-relaxed text-white/76 sm:text-[0.8125rem]">
            {doctorProfile.primarySpecialty}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="inline-flex rounded-sm border border-white/14 bg-white/5 px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] text-white/72">
              {formatDoctorRegistrationLabel()}
            </span>
            <span className="text-[10px] font-medium tracking-[0.08em] text-white/58 uppercase">
              {doctorProfile.complementaryRole}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg p-7 sm:p-11 lg:min-h-full lg:justify-center lg:p-16",
          "bg-primary text-primary-foreground",
          "ring-1 ring-primary-foreground/12",
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-linear-to-b from-primary-foreground/[0.06] to-transparent"
          aria-hidden
        />

        <StaggerReveal className="relative z-10 flex w-full flex-col gap-8 sm:gap-12 lg:gap-16">
          <RevealItem className="space-y-3 sm:space-y-4">
            <h2 className="max-w-lg text-balance font-sans text-[clamp(1.5rem,4.8vw,1.875rem)] font-medium leading-[1.12] text-primary-foreground sm:text-[clamp(1.875rem,5vw,2.75rem)] sm:leading-[1.1]">
              {doctorProfile.name}
            </h2>
            <p className="text-[11px] font-medium tracking-[0.16em] text-primary-foreground/66 uppercase">
              {doctorProfile.founderRole}
            </p>
          </RevealItem>

          <RevealItem>
            <ProfileRichText
              segments={doctorProfile.credentialsSegments}
              className="max-w-md text-pretty text-[0.8125rem] leading-[1.8] text-primary-foreground/76 sm:text-[0.95rem] sm:leading-[1.85]"
              emphasisClassName="font-medium text-primary-foreground"
            />
          </RevealItem>

          <RevealItem>
            <FounderOrnament className="text-primary-foreground/55" />
          </RevealItem>

          <RevealItem>
            <ProfileRichText
              segments={doctorProfile.personalStorySegments}
              className="max-w-xl text-pretty text-sm leading-[1.8] text-primary-foreground/88 sm:text-[1.0625rem] sm:leading-[1.9]"
              emphasisClassName="font-medium text-primary-foreground"
            />
          </RevealItem>
        </StaggerReveal>
      </div>
    </PageSection>
  );
}
