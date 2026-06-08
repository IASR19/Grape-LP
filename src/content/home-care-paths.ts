import { mediaAssets } from "@/content/media";

/** Seção «Quatro frentes de cuidado» na home — fonte única de copy e mídia. */
export const HOME_CARE_PATHS_SECTION_ID = "cuidado" as const;

export const homeCarePathsSection = {
  id: HOME_CARE_PATHS_SECTION_ID,
  title: "Quatro frentes de cuidado.",
  paths: [
    {
      id: "emagrecimento",
      title: "Emagrecimento",
      description: "Quando o corpo para de responder a tentativas isoladas.",
      image: mediaAssets.services.emagrecimento,
    },
    {
      id: "estetica-corporal",
      title: "Estética corporal",
      description: "Contorno, pele e autoestima com recursos indicados caso a caso.",
      image: mediaAssets.services.estetica,
    },
    {
      id: "saude-metabolica",
      title: "Saúde metabólica",
      description: "Energia, exames, hormônios e rotina no mesmo plano.",
      image: mediaAssets.services.clinico,
    },
    {
      id: "manutencao",
      title: "Manutenção",
      description: "Ajustes e reavaliações para manter a evolução possível.",
      image: mediaAssets.services.premium,
    },
  ],
} as const;

export type HomeCarePath = (typeof homeCarePathsSection.paths)[number];
