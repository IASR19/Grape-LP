/** Semantic z-index scale — avoid arbitrary z-[n] in components. */
export const zIndex = {
  base: 0,
  sticky: 10,
  /** ScrollTrigger pin acima do shell da home (`z-10`). */
  pinned: 11,
  header: 50,
  fab: 45,
  /** Navegação lateral da home, abaixo do header e acima do WhatsApp. */
  scrollNav: 44,
  menuBackdrop: 60,
  modal: 70,
  intro: 80,
  cursor: 90,
} as const;
