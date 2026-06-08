"use client";

import { Reveal, RevealText } from "@/components/motion/reveal";
import { layout } from "@/lib/layout";
import { cn } from "@/lib/utils";

type PageSectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  hub?: boolean;
  end?: boolean;
  children: React.ReactNode;
};

/** Standard page section with shared gutters, rhythm and max-width. */
export function PageSection({
  id,
  className,
  containerClassName,
  hub = false,
  end = false,
  children,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        layout.gutter,
        hub ? layout.hubSection : end ? layout.sectionEnd : layout.section,
        className,
      )}
    >
      <div className={cn(hub ? layout.containerHub : layout.container, "min-w-0", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  wide?: boolean;
  animated?: boolean;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  wide = false,
  animated = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        title ? (wide ? layout.sectionTitleWide : layout.sectionTitle) : "mb-10 max-w-3xl",
        className,
      )}
    >
      {eyebrow ? (
        animated ? (
          <Reveal preset="fadeIn" className="mb-3 text-sm font-medium text-muted-foreground">
            {eyebrow}
          </Reveal>
        ) : (
          <p className="mb-3 text-sm font-medium text-muted-foreground">{eyebrow}</p>
        )
      ) : null}
      {title ? (
        animated ? (
          <RevealText lines={[title]} as="h2" />
        ) : (
          <h2>{title}</h2>
        )
      ) : null}
      {description ? (
        animated ? (
          <Reveal preset="fadeUpSoft" delay={0.08} className="mt-3 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
            {description}
          </Reveal>
        ) : (
          <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
            {description}
          </p>
        )
      ) : null}
    </div>
  );
}

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

/** Legacy wrapper for institutional pages — aligned with home rhythm. */
export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionShellProps) {
  return (
    <PageSection id={id} className={className}>
      {(eyebrow || title || description) && (
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      )}
      {children}
    </PageSection>
  );
}
