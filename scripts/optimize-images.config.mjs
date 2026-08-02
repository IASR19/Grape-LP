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
 *   services   → cards legados (não usados na jornada atual)
 *   journey    → Etapas da Jornada (#cuidado / #avaliacao)
 *   evaluation → passos legados da avaliação (formulário antigo)
 *   method     → pilares do Método Grape (#experiencia)
 *   reels      → posters dos depoimentos em vídeo (#reels)
 *
 * Perfis:
 *   hero    → 1920px
 *   section → 1600px
 *   card    → 1200px
 *   thumb   → 640px
 *   journey → 1200×960 (5:4) — painel Etapas da Jornada (#cuidado)
 */

/** @type {Record<string, { maxWidth: number; quality: number; maxBytes?: number; aspectRatio?: number; fit?: "cover" | "inside"; position?: string }>} */
/** Limites em bytes para WebP (mais agressivos que o antigo JPEG). */
export const profiles = {
  hero: { maxWidth: 1920, quality: 74, maxBytes: 120 * 1024 },
  section: { maxWidth: 1600, quality: 72, maxBytes: 140 * 1024 },
  card: { maxWidth: 1200, quality: 70, maxBytes: 100 * 1024 },
  thumb: { maxWidth: 640, quality: 68, maxBytes: 48 * 1024 },
  journey: {
    maxWidth: 1200,
    quality: 70,
    maxBytes: 100 * 1024,
    aspectRatio: 5 / 4,
    fit: "cover",
    position: "centre",
  },
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
  { src: src("hero", "foto-da-clinica.png"), profile: "hero", out: out("hero", "foto-da-clinica.webp") },
  { src: src("hero", "banner.jpg"), profile: "hero", out: out("hero", "banner.webp") },

  // spaces
  { src: src("spaces", "foto clinica retrato.jpg"), profile: "card", out: out("spaces", "foto-clinica-retrato.webp") },
  { src: src("sections", "DSC04462-2.jpg"), profile: "card", out: out("spaces", "dsc-04462.webp") },
  { src: src("spaces", "doutora.png"), profile: "section", out: out("spaces", "doutora.webp") },
  { src: src("sections", "DSC04504.jpg"), profile: "card", out: out("spaces", "dsc-04504.webp") },
  { src: src("sections", "DSC04537.jpg"), profile: "card", out: out("spaces", "dsc-04537.webp") },
  { src: src("sections", "DSC04644.jpg"), profile: "card", out: out("spaces", "dsc-04644.webp") },
  { src: src("sections", "DSC04710.jpg"), profile: "section", out: out("spaces", "dsc-04710.webp") },
  { src: src("sections", "DSC05176-2.jpg"), profile: "card", out: out("spaces", "dsc-05176.webp") },
  { src: src("spaces", "FX_00024.jpg"), profile: "card", out: out("spaces", "fx-00024.webp") },
  { src: src("spaces", "FX_00047-2.jpg"), profile: "card", out: out("spaces", "fx-00047.webp") },
  { src: src("spaces", "FX_00052.jpg"), profile: "section", out: out("spaces", "fx-00052.webp") },
  { src: src("spaces", "FX_00090.jpg"), profile: "section", out: out("spaces", "fx-00090.webp") },

  // sections
  { src: src("sections", "care-paths.jpg"), profile: "section", out: out("sections", "care-paths.webp") },
  { src: src("sections", "care-paths-alt.jpg"), profile: "section", out: out("sections", "care-paths-alt.webp") },
  { src: src("sections", "clinical-reading.jpg"), profile: "section", out: out("sections", "clinical-reading.webp") },
  { src: src("sections", "historias-background.jpg"), profile: "section", out: out("sections", "historias-background.webp") },
  { src: src("sections", "DSC04740.jpg"), profile: "section", out: out("sections", "dsc-04740.webp") },
  { src: src("sections", "DSC05115-2.jpg"), profile: "section", out: out("sections", "dsc-05115.webp") },

  // services
  { src: src("services", "weight-loss-consultation.jpg"), profile: "card", out: out("services", "weight-loss-consultation.webp") },
  { src: src("services", "body-contouring-clinic.jpg"), profile: "card", out: out("services", "body-contouring-clinic.webp") },
  { src: src("services", "metabolic-health-exam.jpg"), profile: "card", out: out("services", "metabolic-health-exam.webp") },
  { src: src("services", "follow-up-appointment.png"), profile: "card", out: out("services", "follow-up-appointment.webp") },

  // evaluation — passos legados (formulário antigo)
  { src: src("evaluation", "patient-listening-consultation.jpg"), profile: "card", out: out("evaluation", "patient-listening-consultation.webp") },
  { src: src("evaluation", "clinical-chart-review.jpg"), profile: "card", out: out("evaluation", "clinical-chart-review.webp") },
  { src: src("evaluation", "treatment-plan-discussion.jpg"), profile: "card", out: out("evaluation", "treatment-plan-discussion.webp") },

  // journey — Etapas da Jornada (#cuidado), recorte 5:4 alinhado ao painel desktop
  { src: src("journey", "diagnostico.png"), profile: "journey", out: out("journey", "diagnostico.webp") },
  { src: src("journey", "implementacao.png"), profile: "journey", out: out("journey", "implementacao.webp") },
  { src: src("journey", "monitoramento.png"), profile: "journey", out: out("journey", "monitoramento.webp") },
  { src: src("journey", "consolidacao.png"), profile: "journey", out: out("journey", "consolidacao.webp") },

  // popup — pop-up de captação de lead (home)
  { src: src("popup", "agende-consulta.png"), profile: "section", out: out("popup", "agende-consulta.webp") },

  // method
  { src: src("method", "hormone-balance-wellness.jpg"), profile: "card", out: out("method", "hormone-balance-wellness.webp") },
  { src: src("method", "anti-inflammatory-nutrition.jpg"), profile: "card", out: out("method", "anti-inflammatory-nutrition.webp") },
  { src: src("method", "muscle-strength-wellness.jpg"), profile: "card", out: out("method", "muscle-strength-wellness.webp") },
  { src: src("method", "gut-health-nutrition.jpg"), profile: "card", out: out("method", "gut-health-nutrition.webp") },
  { src: src("method", "clinical-nutrition-plate.jpg"), profile: "card", out: out("method", "clinical-nutrition-plate.webp") },
  { src: src("method", "healthy-lifestyle-routine.jpg"), profile: "card", out: out("method", "healthy-lifestyle-routine.webp") },
  { src: src("method", "medication-consultation.jpg"), profile: "card", out: out("method", "medication-consultation.webp") },
  { src: src("method", "grape-method.png"), profile: "card", out: out("method", "grape-method.webp") },

  // reels — posters gerados por `npm run optimize:reels` em public/images/opt/reels/
];
