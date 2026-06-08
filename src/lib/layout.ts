import { type } from "@/lib/typography";

/** Shared layout rhythm for pages, header, footer and sections. */
export const layout = {
  gutter: "px-4 sm:px-6 lg:px-8",
  section: "py-16 lg:py-24",
  sectionLarge: "py-24 sm:py-32",
  sectionEnd: "pb-12 pt-8 lg:pb-16",
  hubSection: "py-10 lg:py-14",
  heroShell: "py-2 lg:py-3",
  container: "mx-auto w-full max-w-7xl",
  containerHub: "mx-auto w-full max-w-6xl",
  sectionTitle: `mb-12 max-w-2xl text-balance ${type.section}`,
  sectionTitleWide: `mb-12 max-w-xl text-balance ${type.section}`,
  displayHeading: type.displayHeading,
  headerHeight: "5rem",
  scrollMarginHeader: "scroll-mt-20",
  viewportMinusHeader: "min-h-[calc(100svh-5rem)]",
} as const;
