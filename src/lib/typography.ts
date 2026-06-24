/** Typography scale tokens — Montserrat (font-sans) for UI; serif reservado ao hero. */
export const type = {
  hero: "font-serif text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.96]",
  section:
    "font-sans text-[clamp(1.625rem,5vw,1.875rem)] font-medium leading-[1.1] sm:text-[clamp(2rem,4vw,3.5rem)] sm:leading-[1.08]",
  sectionSub:
    "font-sans text-[clamp(1.5rem,4.5vw,1.75rem)] font-medium leading-[1.12] sm:text-[clamp(1.75rem,3.2vw,3rem)] sm:leading-[1.1]",
  /** Títulos dentro de painéis (jornada, cards) — um degrau abaixo de section no mobile. */
  sectionCompact:
    "font-sans text-[clamp(1.375rem,4.2vw,1.625rem)] font-medium leading-[1.12] sm:text-[clamp(1.75rem,3.2vw,2.5rem)] sm:leading-[1.1]",
  statement:
    "font-serif text-[clamp(1.875rem,4.8vw,2.25rem)] leading-[1.02] sm:text-[clamp(2.25rem,5.4vw,4.25rem)] sm:leading-[1]",
  cardTitle:
    "font-serif text-[clamp(1.35rem,2.8vw,1.55rem)] leading-tight sm:text-[clamp(1.55rem,3vw,2.25rem)]",
  cardTitleLarge:
    "font-serif text-[clamp(1.625rem,3.6vw,2rem)] leading-tight sm:text-[clamp(2rem,4vw,3.5rem)]",
  displayHeading:
    "font-serif text-[clamp(1.875rem,5vw,2.25rem)] leading-[1.02] sm:text-[clamp(2.25rem,5.8vw,4.35rem)] sm:leading-[0.98]",
  eyebrow:
    "text-xs font-medium leading-none text-muted-foreground sm:text-sm",
  body:
    "text-pretty text-[0.9375rem] leading-[1.7] text-muted-foreground sm:text-base sm:leading-[1.75]",
} as const;
