/** Typography scale tokens — Alice (font-serif) + Montserrat (font-sans). */
export const type = {
  hero: "font-serif text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.92]",
  section: "font-serif text-4xl leading-tight sm:text-5xl",
  statement: "font-serif text-[clamp(2.35rem,6vw,4.5rem)] leading-[0.98]",
  cardTitle: "font-serif text-3xl leading-tight sm:text-4xl",
  cardTitleLarge: "font-serif text-4xl leading-tight sm:text-5xl",
  displayHeading:
    "font-serif text-[clamp(2.35rem,6.5vw,4.5rem)] leading-[0.94]",
  eyebrow: "text-sm font-medium text-muted-foreground",
} as const;
