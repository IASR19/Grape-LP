/** Âncoras da home para o assistente de navegação lateral. */
export const homeScrollNavItems = [
  { hash: "#hero", label: "Início" },
  { hash: "#metodo", label: "Método" },
  { hash: "#cuidado", label: "Cuidado" },
  { hash: "#avaliacao", label: "Avaliação" },
  { hash: "#experiencia", label: "Método Grape" },
  { hash: "#fundadora", label: "Dra. Marcela" },
  { hash: "#reels", label: "Depoimentos" },
  { hash: "#historias", label: "Relatos" },
  { hash: "#duvidas", label: "Dúvidas" },
  { hash: "#contato", label: "Agendar" },
  { hash: "#galeria", label: "Galeria" },
] as const;

export const homeScrollNavSectionIds = homeScrollNavItems.map((item) =>
  item.hash.slice(1),
);
