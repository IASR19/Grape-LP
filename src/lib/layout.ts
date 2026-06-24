import { type } from "@/lib/typography";

/** Shared layout rhythm for pages, header, footer and sections. */
export const layout = {
  gutter: "px-4 sm:px-6 lg:px-8",
  /** Ritmo padrão entre seções autônomas. */
  section: "py-12 sm:py-16 lg:py-20",
  sectionCompact: "py-10 sm:py-14 lg:py-16",
  /** Método Grape (#experiencia) — faixa primary com respiro ampliado. */
  sectionProcess: "py-12 sm:py-16 lg:py-20",
  /** Espaçamento vertical interno da seção Método Grape. */
  processContentGap: "gap-6 sm:gap-8 lg:gap-9",
  sectionLarge: "py-14 sm:py-20 lg:py-24",
  /** Faixas de destaque (primary, narrativa) fora de pattern band. */
  sectionStatement: "py-14 sm:py-20 lg:py-24",
  /** Primeira seção dentro de uma logo-pattern-band. */
  sectionBandStart: "pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20",
  /** Seções intermediárias dentro da band. */
  sectionBandInner: "py-10 sm:py-14 lg:py-16",
  /** Última seção dentro da band. */
  sectionBandEnd: "pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24",
  /** Única seção dentro de uma band (combina start + end). */
  sectionBandSolo: "pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24",
  /** Separador editorial entre seções na mesma faixa. */
  sectionDivider: "py-7 sm:py-10 lg:py-12",
  /** Colunas laterais sticky — offset único na home. */
  stickyAside: "lg:top-24 lg:scroll-mt-24",
  /** Care toggle — bloco narrativo de altura editorial. */
  careToggle: "py-14 sm:py-20 lg:py-24",
  sectionEnd: "pb-10 pt-7 sm:pb-16 sm:pt-8 lg:pb-20",
  /** Espaço título → parágrafo de apoio. */
  proseAfterHeading: "mt-4 sm:mt-6 lg:mt-7",
  /** Espaço bloco introdutório → conteúdo principal (grid, carrossel, etc.). */
  gridAfterProse: "mt-8 sm:mt-12 lg:mt-14",
  hubSection: "py-8 lg:py-14",
  heroShell: "py-2 lg:py-3",
  container: "mx-auto w-full max-w-7xl",
  containerHub: "mx-auto w-full max-w-6xl",
  sectionTitle: `mb-10 max-w-2xl text-balance sm:mb-14 ${type.section}`,
  sectionTitleWide: `mb-10 max-w-xl text-balance sm:mb-14 ${type.section}`,
  displayHeading: type.displayHeading,
  headerHeight: "5rem",
  scrollMarginHeader: "scroll-mt-20",
  viewportMinusHeader: "min-h-[calc(100svh-5rem)]",
} as const;
