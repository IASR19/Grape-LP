import type { MockImageVariant } from "@/components/media/mock-image";
import { youtubeThumbnail } from "@/lib/youtube";

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

  // spaces — ambientes
  institucional: image("spaces", "foto-clinica-retrato.jpg"),
  receptionAlt: image("spaces", "fx-00090.jpg"),
  lounge: image("spaces", "dsc-04710.jpg"),
  corridor: image("spaces", "fx-00052.jpg"),
  consultRoom: image("spaces", "dsc-05176.jpg"),
  treatmentRoom: image("spaces", "dsc-04537.jpg"),
  detail: image("spaces", "fx-00047.jpg"),
  ambiance: image("spaces", "fx-00024.jpg"),
  receptionWide: image("spaces", "dsc-04462.jpg"),
  teamSpace: image("spaces", "dsc-04504.jpg"),
  ctaBackground: image("spaces", "dsc-04504.jpg"),
  suite: image("spaces", "dsc-04644.jpg"),

  // sections — fundos editoriais
  carePaths: image("sections", "care-paths.jpg"),
  carePathsAlt: image("sections", "care-paths-alt.jpg"),
  clinicalReading: image("sections", "clinical-reading.jpg"),
  methodSection: image("sections", "dsc-04740.jpg"),
  visualBreak: image("sections", "dsc-05115.jpg"),

  // services — #cuidado
  weightLossConsultation: image("services", "weight-loss-consultation.jpg"),
  bodyContouring: image("services", "body-contouring-clinic.jpg"),
  metabolicHealthExam: image("services", "metabolic-health-exam.jpg"),
  followUpAppointment: image("services", "follow-up-appointment.jpg"),

  // evaluation — #avaliacao
  patientListening: image("evaluation", "patient-listening-consultation.jpg"),
  clinicalChartReview: image("evaluation", "clinical-chart-review.jpg"),
  treatmentPlanDiscussion: image("evaluation", "treatment-plan-discussion.jpg"),

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
  patientStoriesSection: {
    alt: "Pacientes e acompanhamento na Grape Clinic",
    src: clinicPhotos.clinicalReading,
  },
  founderPortrait: {
    alt: "Retrato profissional da Dra. Marcela Ferreira",
    src: clinicPhotos.receptionWide,
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
} satisfies Record<string, MediaAsset | Record<string, MediaAsset>>;

export type VideoAsset = {
  id: string;
  title: string;
  src?: string;
  youtubeId?: string;
  thumbSrc?: string;
  variant?: MockImageVariant;
};

function youtubeTestimonial(id: string, title: string): VideoAsset {
  return {
    id: `yt-${id}`,
    title,
    youtubeId: id,
    thumbSrc: youtubeThumbnail(id),
  };
}

export const founderVideos = {
  sectionTitle: "Depoimentos em vídeo",
  sectionLead: "Pacientes compartilhando como foi viver o acompanhamento na prática.",
  featured: [
    youtubeTestimonial("S9pcoAQslDw", "Cheguei mais confiante"),
    youtubeTestimonial("LDBjCcrwVuY", "Parei de recomeçar sozinha"),
    youtubeTestimonial("13Dzxh0-wcg", "Tive direção e segurança"),
    youtubeTestimonial("Pbv98CMUuTs", "Um plano que coube na rotina"),
    youtubeTestimonial("cWpqCq2gfgg", "Acompanhamento com escuta"),
    youtubeTestimonial("BPC9Vh9GF_8", "Cuidado até a manutenção"),
    youtubeTestimonial("12HsQYBvMBg", "Voltei a confiar no processo"),
    youtubeTestimonial("fBMTseog9Rk", "Menos ansiedade, mais clareza"),
  ] satisfies VideoAsset[],
};
