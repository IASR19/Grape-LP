import type { MockImageVariant } from "@/components/media/mock-image";

export type MediaAsset = {
  alt: string;
  caption?: string;
  variant?: MockImageVariant;
  src?: string;
  poster?: string;
};

/** Versões web otimizadas — geradas por `npm run optimize:images`. */
const OPT = "/images/opt";
const VIDEO = "/videos";
/** Incremente ao trocar o arquivo de vídeo da hero (evita cache do navegador). */
const HERO_VIDEO_VERSION = "5";

function image(category: string, file: string) {
  return `${OPT}/${category}/${file}`;
}

/** Fotos da clínica por categoria em `public/images/opt/`. */
export const clinicPhotos = {
  // hero
  hero: image("hero", "foto-da-clinica.jpg"),
  linkBioBanner: image("hero", "banner.jpg"),

  // spaces — ambientes da clínica (FX_* e foto-clinica-retrato; DSC_* nesta pasta são retratos)
  institucional: image("spaces", "foto-clinica-retrato.jpg"),
  receptionWide: image("spaces", "foto-clinica-retrato.jpg"),
  receptionAlt: image("spaces", "fx-00090.jpg"),
  lounge: image("spaces", "fx-00052.jpg"),
  corridor: image("spaces", "fx-00052.jpg"),
  consultRoom: image("spaces", "fx-00047.jpg"),
  treatmentRoom: image("spaces", "fx-00047.jpg"),
  detail: image("spaces", "fx-00047.jpg"),
  ambiance: image("spaces", "fx-00024.jpg"),
  teamSpace: image("spaces", "fx-00024.jpg"),
  ctaBackground: image("spaces", "foto-clinica-retrato.jpg"),
  suite: image("spaces", "fx-00024.jpg"),

  // retratos (arquivos DSC_* em opt/spaces — não usar na galeria de ambientes)
  founderPortraitStudio: image("spaces", "doutora.jpg"),

  // sections — fundos editoriais
  carePaths: image("sections", "care-paths.jpg"),
  carePathsAlt: image("sections", "care-paths-alt.jpg"),
  clinicalReading: image("sections", "clinical-reading.jpg"),
  historiasBackground: image("sections", "historias-background.jpg"),
  methodSection: image("sections", "dsc-04740.jpg"),
  visualBreak: image("sections", "dsc-05115.jpg"),

  // services — #cuidado
  weightLossConsultation: image("services", "weight-loss-consultation.jpg"),
  bodyContouring: image("services", "body-contouring-clinic.jpg"),
  metabolicHealthExam: image("services", "metabolic-health-exam.jpg"),
  followUpAppointment: image("services", "follow-up-appointment.jpg"),

  // evaluation — passos legados (formulário antigo)
  patientListening: image("evaluation", "patient-listening-consultation.jpg"),
  clinicalChartReview: image("evaluation", "clinical-chart-review.jpg"),
  treatmentPlanDiscussion: image("evaluation", "treatment-plan-discussion.jpg"),

  // journey — Etapas da Jornada (#cuidado)
  journeyDiagnostico: image("journey", "diagnostico.jpg"),
  journeyImplementacao: image("journey", "implementacao.jpg"),
  journeyMonitoramento: image("journey", "monitoramento.jpg"),
  journeyConsolidacao: image("journey", "consolidacao.jpg"),

  // method — Método Grape
  hormoneBalance: image("method", "hormone-balance-wellness.jpg"),
  antiInflammatoryNutrition: image("method", "anti-inflammatory-nutrition.jpg"),
  muscleStrength: image("method", "muscle-strength-wellness.jpg"),
  gutHealth: image("method", "gut-health-nutrition.jpg"),
  clinicalNutritionPlate: image("method", "clinical-nutrition-plate.jpg"),
  healthyLifestyle: image("method", "healthy-lifestyle-routine.jpg"),
  medicationConsultation: image("method", "medication-consultation.jpg"),
  grapeMethod: image("method", "grape-method.jpg"),
} as const;

const previewPool = [
  clinicPhotos.hero,
  clinicPhotos.institucional,
  clinicPhotos.receptionAlt,
  clinicPhotos.lounge,
  clinicPhotos.corridor,
  clinicPhotos.consultRoom,
  clinicPhotos.treatmentRoom,
  clinicPhotos.detail,
  clinicPhotos.ambiance,
] as const;

export function previewPhoto(index: number) {
  return previewPool[index % previewPool.length]!;
}

export const mediaAssets = {
  heroClinic: {
    alt: "Ambiente da Grape Clinic em Pouso Alegre",
    src: clinicPhotos.hero,
  },
  heroClinicVideo: {
    alt: "Ambiente da Grape Clinic em Pouso Alegre",
    src: `${VIDEO}/clinic-hero-loop.mp4?v=${HERO_VIDEO_VERSION}`,
    poster: clinicPhotos.hero,
  },
  careMoment: {
    alt: "Acompanhamento médico com leitura clínica individualizada",
    src: clinicPhotos.methodSection,
  },
  visualBreak: {
    alt: "Leitura clínica integral na Grape Clinic",
    src: clinicPhotos.visualBreak,
  },
  protocolAtmosphere: {
    alt: "Ambiente de cuidado e protocolo na Grape Clinic",
    src: clinicPhotos.corridor,
  },
  experienceSection: {
    alt: "Experiência de atendimento presencial na Grape Clinic",
    src: clinicPhotos.carePathsAlt,
  },
  gallerySection: {
    alt: "Recepção e ambiente da Grape Clinic",
    src: clinicPhotos.hero,
  },
  patientStoriesSection: {
    alt: "Ambiente da Grape Clinic",
    src: clinicPhotos.historiasBackground,
  },
  founderPortrait: {
    alt: "Retrato profissional da Dra. Marcela Ferreira de Oliveira",
    src: clinicPhotos.founderPortraitStudio,
  },
  ctaBackground: {
    alt: "Ambiente da clínica Grape Clinic",
    src: clinicPhotos.ctaBackground,
  },
  services: {
    emagrecimento: {
      alt: "Consulta de emagrecimento médico com acompanhamento individualizado",
      src: clinicPhotos.weightLossConsultation,
    },
    estetica: {
      alt: "Protocolo de estética corporal e contorno",
      src: clinicPhotos.bodyContouring,
    },
    clinico: {
      alt: "Avaliação de saúde metabólica e exames clínicos",
      src: clinicPhotos.metabolicHealthExam,
    },
    premium: {
      alt: "Consulta de acompanhamento e manutenção do plano de cuidado",
      src: clinicPhotos.followUpAppointment,
    },
  },
  gallery: {
    recepcao: {
      alt: "Recepção da Grape Clinic",
      src: clinicPhotos.receptionWide,
    },
    equipe: {
      alt: "Equipe em atendimento",
      src: clinicPhotos.teamSpace,
    },
    consultorio: {
      alt: "Consultório da clínica",
      src: clinicPhotos.suite,
    },
  },
  linkBioSection: {
    alt: "Ambiente da Grape Clinic",
    src: clinicPhotos.linkBioBanner,
  },
  linkBio: {
    institucional: {
      alt: "Recepção da Grape Clinic",
      src: clinicPhotos.institucional,
    },
    protocolo: {
      alt: "Consultório e tratamentos de emagrecimento, estética e saúde metabólica",
      src: clinicPhotos.suite,
    },
  },
  careJourney: {
    diagnostico: {
      alt: "Etapa de diagnóstico clínico na jornada Grape",
      src: clinicPhotos.journeyDiagnostico,
    },
    implementacao: {
      alt: "Etapa de implementação do protocolo na jornada Grape",
      src: clinicPhotos.journeyImplementacao,
    },
    monitoramento: {
      alt: "Etapa de monitoramento contínuo na jornada Grape",
      src: clinicPhotos.journeyMonitoramento,
    },
    consolidacao: {
      alt: "Etapa de consolidação de resultados na jornada Grape",
      src: clinicPhotos.journeyConsolidacao,
    },
  },
} satisfies Record<string, MediaAsset | Record<string, MediaAsset>>;

export type VideoAsset = {
  id: string;
  title: string;
  /** Label editorial na UI — não depende do nome do arquivo. */
  displayLabel?: string;
  src: string;
  poster: string;
  variant?: MockImageVariant;
};

const REELS_VIDEO_VERSION = "3";

function reelVideo(file: string) {
  return `${VIDEO}/reels/${file}?v=${REELS_VIDEO_VERSION}`;
}

function reelPoster(fileBase: string) {
  return `${OPT}/reels/${fileBase}.jpg`;
}

function localReel(
  id: string,
  quote: string,
  clients: string,
  fileBase: string,
): VideoAsset {
  return {
    id,
    title: clients,
    displayLabel: quote,
    src: reelVideo(`${fileBase}.mp4`),
    poster: reelPoster(fileBase),
  };
}

export const patientReels = {
  sectionTitle: "Histórias reais, vidas transformadas",
  sectionLead:
    "Descubra como o Método Grape impacta a saúde através de seus 7 pilares fundamentais.",
  featured: [
    localReel(
      "ivan-isabela",
      "Recuperamos a nossa autoestima",
      "Ivan & Isabela",
      "ivan-isabela",
    ),
    localReel(
      "junior-leticia-01",
      "A nossa vida mudou completamente",
      "Junior & Letícia",
      "junior-leticia-01",
    ),
    localReel(
      "junior-leticia-02",
      "A nossa vida mudou completamente",
      "Junior & Letícia",
      "junior-leticia-02",
    ),
    localReel(
      "lucio-marcela",
      "Nós fomos os primeiros pacientes",
      "Lúcio & Marcela",
      "lucio-marcela",
    ),
    localReel(
      "marcelo-marianne-01",
      "Nós somos outro casal, vivemos melhor",
      "Marcelo & Marianne",
      "marcelo-marianne-01",
    ),
    localReel(
      "marcelo-marianne-02",
      "Nós somos outro casal, vivemos melhor",
      "Marcelo & Marianne",
      "marcelo-marianne-02",
    ),
    localReel(
      "marcos-dani",
      "O nosso corpo é a base dos nossos sonhos",
      "Marcos & Dani",
      "marcos-dani",
    ),
  ] satisfies VideoAsset[],
} as const;

/** @deprecated Use patientReels */
export const founderVideos = patientReels;
