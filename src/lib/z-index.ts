/** Semantic z-index scale — avoid arbitrary z-[n] in components. */
export const zIndex = {
  base: 0,
  sticky: 10,
  /** ScrollTrigger pin acima do conteúdo base da seção. */
  pinned: 11,
  /** Blur gradual fixo no topo da viewport, abaixo do header. */
  headerEdgeBlur: 49,
  header: 50,
  menuBackdrop: 60,
  modal: 70,
  intro: 80,
  cursor: 90,
  fab: 45,
  /** Navegação lateral da home, abaixo do header e acima do WhatsApp. */
  scrollNav: 44,
} as const;
