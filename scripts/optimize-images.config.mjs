/**
 * Configuração do otimizador de imagens.
 *
 * Estrutura:
 *   public/images/sources/{categoria}/  → masters (não servidos)
 *   public/images/opt/{categoria}/      → versões web (servidas pelo site)
 *
 * Categorias:
 *   hero       → fundos full-screen da home e link-bio
 *   spaces     → ambientes da clínica (recepção, consultório, corredor…)
 *   sections   → fundos editoriais de seções (#experiencia, parallax)
 *   services   → cards «Quatro frentes de cuidado» (#cuidado)
 *   evaluation → passos da avaliação (#avaliacao)
 *   method     → pilares do Método Grape (#experiencia)
 *
 * Perfis:
 *   hero    → 1920px
 *   section → 1600px
 *   card    → 1200px
 *   thumb   → 640px
 */

/** @type {Record<string, { maxWidth: number; quality: number; maxBytes?: number }>} */
export const profiles = {
  hero: { maxWidth: 1920, quality: 78, maxBytes: 200 * 1024 },
  section: { maxWidth: 1600, quality: 76, maxBytes: 250 * 1024 },
  card: { maxWidth: 1200, quality: 74, maxBytes: 180 * 1024 },
  thumb: { maxWidth: 640, quality: 72, maxBytes: 80 * 1024 },
};

export const sourcesRoot = "public/images/sources";
export const defaultOutputDir = "public/images/opt";

/** Pastas escaneadas recursivamente em modo `--scan`. */
export const scanDirs = [sourcesRoot];

export const scanDefaultProfile = "section";

/** @param {string} category @param {string} file */
function src(category, file) {
  return `${sourcesRoot}/${category}/${file}`;
}

/** @param {string} category @param {string} outFile */
function out(category, outFile) {
  return `${category}/${outFile}`;
}

export const images = [
  // hero
  { src: src("hero", "foto-da-clinica.png"), profile: "hero", out: out("hero", "foto-da-clinica.jpg") },
  { src: src("hero", "banner.jpg"), profile: "hero", out: out("hero", "banner.jpg") },

  // spaces
  { src: src("spaces", "foto clinica retrato.jpg"), profile: "card", out: out("spaces", "foto-clinica-retrato.jpg") },
  { src: src("spaces", "DSC04462-2.jpg"), profile: "card", out: out("spaces", "dsc-04462.jpg") },
  { src: src("spaces", "DSC04504.jpg"), profile: "card", out: out("spaces", "dsc-04504.jpg") },
  { src: src("spaces", "DSC04537.jpg"), profile: "card", out: out("spaces", "dsc-04537.jpg") },
  { src: src("spaces", "DSC04644.jpg"), profile: "card", out: out("spaces", "dsc-04644.jpg") },
  { src: src("spaces", "DSC04710.jpg"), profile: "section", out: out("spaces", "dsc-04710.jpg") },
  { src: src("spaces", "DSC05176-2.jpg"), profile: "card", out: out("spaces", "dsc-05176.jpg") },
  { src: src("spaces", "FX_00024.jpg"), profile: "card", out: out("spaces", "fx-00024.jpg") },
  { src: src("spaces", "FX_00047-2.jpg"), profile: "card", out: out("spaces", "fx-00047.jpg") },
  { src: src("spaces", "FX_00052.jpg"), profile: "section", out: out("spaces", "fx-00052.jpg") },
  { src: src("spaces", "FX_00090.jpg"), profile: "section", out: out("spaces", "fx-00090.jpg") },

  // sections
  { src: src("sections", "care-paths.jpg"), profile: "section", out: out("sections", "care-paths.jpg") },
  { src: src("sections", "care-paths-alt.jpg"), profile: "section", out: out("sections", "care-paths-alt.jpg") },
  { src: src("sections", "clinical-reading.jpg"), profile: "section", out: out("sections", "clinical-reading.jpg") },
  { src: src("sections", "DSC04740.jpg"), profile: "section", out: out("sections", "dsc-04740.jpg") },
  { src: src("sections", "DSC05115-2.jpg"), profile: "section", out: out("sections", "dsc-05115.jpg") },

  // services
  { src: src("services", "weight-loss-consultation.jpg"), profile: "card", out: out("services", "weight-loss-consultation.jpg") },
  { src: src("services", "body-contouring-clinic.jpg"), profile: "card", out: out("services", "body-contouring-clinic.jpg") },
  { src: src("services", "metabolic-health-exam.jpg"), profile: "card", out: out("services", "metabolic-health-exam.jpg") },
  { src: src("services", "follow-up-appointment.png"), profile: "card", out: out("services", "follow-up-appointment.jpg") },

  // evaluation
  { src: src("evaluation", "patient-listening-consultation.jpg"), profile: "card", out: out("evaluation", "patient-listening-consultation.jpg") },
  { src: src("evaluation", "clinical-chart-review.jpg"), profile: "card", out: out("evaluation", "clinical-chart-review.jpg") },
  { src: src("evaluation", "treatment-plan-discussion.jpg"), profile: "card", out: out("evaluation", "treatment-plan-discussion.jpg") },

  // method
  { src: src("method", "hormone-balance-wellness.jpg"), profile: "card", out: out("method", "hormone-balance-wellness.jpg") },
  { src: src("method", "anti-inflammatory-nutrition.jpg"), profile: "card", out: out("method", "anti-inflammatory-nutrition.jpg") },
  { src: src("method", "muscle-strength-wellness.jpg"), profile: "card", out: out("method", "muscle-strength-wellness.jpg") },
  { src: src("method", "gut-health-nutrition.jpg"), profile: "card", out: out("method", "gut-health-nutrition.jpg") },
  { src: src("method", "clinical-nutrition-plate.jpg"), profile: "card", out: out("method", "clinical-nutrition-plate.jpg") },
  { src: src("method", "healthy-lifestyle-routine.jpg"), profile: "card", out: out("method", "healthy-lifestyle-routine.jpg") },
  { src: src("method", "medication-consultation.jpg"), profile: "card", out: out("method", "medication-consultation.jpg") },
  { src: src("method", "grape-method.png"), profile: "card", out: out("method", "grape-method.jpg") },
];
