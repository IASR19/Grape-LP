/** Âncoras da home para o assistente de navegação lateral — ordem = fluxo em PremiumHome. */
export const homeScrollNavItems = [
  { hash: "#hero", label: "Início" },
  { hash: "#metodo", label: "Método" },
  { hash: "#galeria", label: "Galeria" },
  { hash: "#cuidado", label: "Jornada" },
  { hash: "#experiencia", label: "Método Grape" },
  { hash: "#fundadora", label: "Dra. Marcela" },
  { hash: "#reels", label: "Depoimentos" },
  { hash: "#historias", label: "Relatos" },
  { hash: "#duvidas", label: "Dúvidas" },
  { hash: "#contato", label: "Agendar" },
] as const;

export const homeScrollNavSectionIds = homeScrollNavItems.map((item) =>
  item.hash.slice(1),
);
