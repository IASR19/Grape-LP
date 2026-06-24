import { mediaAssets } from "@/content/media";

/** Seção «Etapas da Jornada» na home — fonte única de copy e mídia. */
export const HOME_CARE_PATHS_SECTION_ID = "cuidado" as const;

const journeyImages = mediaAssets.careJourney;

export const journeySteps = [
  {
    id: "diagnostico",
    title: "Diagnóstico",
    description:
      "Histórico, exames e composição corporal para revelar onde o corpo está travado.",
    image: journeyImages.diagnostico,
  },
  {
    id: "implementacao",
    title: "Implementação",
    description:
      "Terapias e acompanhamento exclusivo entram em prática com critério médico.",
    image: journeyImages.implementacao,
  },
  {
    id: "monitoramento",
    title: "Monitoramento",
    description:
      "Dados, escuta e reavaliações orientam cada ajuste do protocolo.",
    image: journeyImages.monitoramento,
  },
  {
    id: "consolidacao",
    title: "Consolidação",
    description:
      "Estratégia para sustentar resultados e reduzir recaídas no dia a dia.",
    image: journeyImages.consolidacao,
  },
] as const;

export type JourneyStep = (typeof journeySteps)[number];
export type HomeCarePath = JourneyStep;

export const homeCarePathsSection = {
  id: HOME_CARE_PATHS_SECTION_ID,
  title: "Etapas da Jornada",
  paths: journeySteps,
} as const;
