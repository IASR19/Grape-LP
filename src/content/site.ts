import { clinicPhotos } from "@/content/media";

export const siteConfig = {
  name: "Grape Clinic",
  cnpj: "21.762.194/0001-32",
  description:
    "Clínica de estética, emagrecimento médico e cuidado corporal personalizado em Pouso Alegre, MG. Avaliação individual, acompanhamento médico e protocolos sob medida.",
  city: "Pouso Alegre, MG",
  address:
    "R. Cel. Brito Filho, n°461 - e 469 - Fátima, Pouso Alegre - MG, 37554-246",
  phone: "+5535991390358",
  whatsappLabel: "Falar com a equipe",
  whatsappHref:
    "https://api.whatsapp.com/send?phone=5535991390358&text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20consulta!",
  mapsHref:
    "https://www.google.com/maps/dir//R.+Cel.+Brito+Filho,+n%C2%B0461+-+e+469+-+Fatima,+Pouso+Alegre+-+MG,+37554-246/@-22.2244654,-46.0057998,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x94cbc749485e24f5:0xef1266625663eac6!2m2!1d-45.9233982!2d-22.2244861?entry=ttu",
  evaluationFormHref: "/#contato",
  instagramHref: "https://www.instagram.com/grapeclinic_/",
  youtubeHref: "https://www.youtube.com/channel/UCjaaFEZQH5Ef8D9g-OJCTfw",
  reviewsHref:
    "https://www.google.com/maps/place/Grape+Clinic/@-22.2244861,-45.9259731,17z/data=!4m8!3m7!1s0x94cbc749485e24f5:0xef1266625663eac6!8m2!3d-22.2244861!4d-45.9233982!9m1!1b1",
};

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export const sitePages: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Hub",
    href: "/hub",
    description: "Principais links do site e canais da clínica",
  },
];

export const homeSections: NavLink[] = [
  {
    label: "Método",
    href: "/#metodo",
    description: "Ciência, leitura clínica e constância",
  },
  {
    label: "Cuidado",
    href: "/#cuidado",
    description: "Etapas da jornada clínica",
  },
  {
    label: "Avaliação",
    href: "/#cuidado",
    description: "Etapas da primeira consulta",
  },
  {
    label: "Método Grape",
    href: "/#experiencia",
    description: "Sete pilares de leitura clínica",
  },
  {
    label: "Depoimentos",
    href: "/#reels",
    description: "Depoimentos em vídeo de pacientes",
  },
  {
    label: "Dúvidas",
    href: "/#duvidas",
    description: "Respostas antes de agendar",
  },
];

export const footerNavItems: NavLink[] = sitePages.map((item) => ({ ...item }));

export const menuContactLinks = [
  {
    label: "Solicitar avaliação",
    href: siteConfig.whatsappHref,
  },
  {
    label: "Como chegar",
    href: siteConfig.mapsHref,
  },
] as const;

export const homeCopy = {
  heroTitle: "Saúde, performance e longevidade",
  stats: [
    { value: "1000+", label: "vidas transformadas" },
    { value: "1:1", label: "avaliação individual" },
    { value: "MG", label: "atendimento presencial" },
  ],
  timelineTitle: "Primeira avaliação.",
  galleryTitle: "Um ecossistema de saúde premium",
  reelsTitle: "Trajetórias reais e transformações de vida",
  testimonialsTitle: "Relatos de pacientes.",
  faqTitle: "Principais dúvidas antes da primeira avaliação.",
  ctaTitle: "Comece com uma leitura individual do seu momento.",
  cta: "Solicitar avaliação",
};

export const methodSteps = [
  {
    title: "Escuta",
    text: "Rotina, queixas, tentativas anteriores e objetivos entram na conversa.",
    src: clinicPhotos.patientListening,
    variant: "muted" as const,
  },
  {
    title: "Leitura clínica",
    text: "Exames, metabolismo e segurança orientam o que faz sentido.",
    src: clinicPhotos.clinicalChartReview,
    variant: "secondary" as const,
  },
  {
    title: "Próximo passo",
    text: "Você sai com direção clara para um plano possível e ajustável.",
    src: clinicPhotos.treatmentPlanDiscussion,
    variant: "primary" as const,
  },
];

export const grapeMethodCopy = {
  eyebrow: "Método Grape",
  title: "Conheça os 7 pilares de acompanhamento do método",
  description: "",
};

export const grapeMethodSteps = [
  {
    title: "Hormônio",
    text: "O equilíbrio hormonal é a base fundamental da vitalidade, do humor, da libido e da composição corporal. Realizamos uma avaliação minuciosa para ajustar cada detalhe, garantindo que todo o seu sistema funcione em harmonia.",
    src: clinicPhotos.hormoneBalance,
    variant: "muted" as const,
  },
  {
    title: "Metabolismo",
    text: "Investigamos profundamente os fatores que podem estar travando o seu metabolismo e impedindo resultados. A velocidade, a eficiência e a resposta biológica ao tratamento dependem diretamente desta leitura técnica.",
    src: clinicPhotos.metabolicHealthExam,
    variant: "secondary" as const,
  },
  {
    title: "Inflamação",
    text: "A inflamação crônica e silenciosa é a causa oculta por trás do cansaço constante e da dificuldade em emagrecer. Através do nosso método, identificamos esses processos e tratamos a causa para evitar o envelhecimento precoce.",
    src: clinicPhotos.antiInflammatoryNutrition,
    variant: "primary" as const,
  },
  {
    title: "Saúde Muscular",
    text: "Massa muscular não é uma questão apenas estética, mas um pilar essencial para a longevidade e autonomia. Monitoramos e protegemos sua musculatura para garantir um metabolismo ativo e um envelhecimento saudável.",
    src: clinicPhotos.muscleStrength,
    variant: "muted" as const,
  },
  {
    title: "Intestino",
    text: "A saúde intestinal impacta diretamente na sua imunidade, no humor e na capacidade de absorção de nutrientes. Uma microbiota em total equilíbrio é capaz de transformar completamente a sua resposta a qualquer tratamento.",
    src: clinicPhotos.gutHealth,
    variant: "secondary" as const,
  },
  {
    title: "Nutrientes",
    text: "Deficiências nutricionais silenciosas podem comprometer seriamente a sua energia, o sono e a performance cognitiva. Identificamos e corrigimos cada carência com precisão médica para otimizar o funcionamento do seu corpo.",
    src: clinicPhotos.clinicalNutritionPlate,
    variant: "primary" as const,
  },
  {
    title: "Estilo de Vida",
    text: "Fatores como o sono, o estresse e a rotina diária moldam a sua biologia tanto quanto qualquer medicamento. Por isso, integramos esses elementos comportamentais ao seu protocolo individual de forma personalizada.",
    src: clinicPhotos.healthyLifestyle,
    variant: "muted" as const,
  },
] as const;

export const faqs = [
  {
    question: "Em quanto tempo posso perceber mudanças?",
    answer:
      "Cada corpo responde de um jeito. Algumas pacientes percebem sinais nas primeiras semanas, mas o tempo depende da avaliação, adesão e resposta individual.",
  },
  {
    question: "O acompanhamento serve para qualquer pessoa?",
    answer:
      "Não necessariamente. Antes de indicar qualquer caminho, a equipe avalia histórico, exames, rotina, objetivos e segurança.",
  },
  {
    question: "Preciso iniciar com exercícios intensos?",
    answer:
      "Não necessariamente. A proposta é construir uma estratégia possível para a sua rotina, com ajustes ao longo do processo.",
  },
  {
    question: "Preciso seguir uma dieta restritiva?",
    answer:
      "A estratégia busca ser praticável, não extrema. O foco é orientar escolhas, quantidades e constância sem transformar cuidado em sofrimento.",
  },
  {
    question: "Como funciona o acompanhamento?",
    answer:
      "A frequência é definida após avaliação. O acompanhamento pode incluir retornos, monitoramento de evolução e ajustes conforme a resposta do corpo.",
  },
  {
    question: "Os protocolos são seguros?",
    answer:
      "Segurança depende de avaliação, indicação correta e monitoramento. Por isso, o processo não começa por uma fórmula pronta.",
  },
];

export type ProfileTextSegment = {
  text: string;
  emphasis?: boolean;
};

export const doctorProfile = {
  name: "Dra. Marcela Ferreira de Oliveira",
  crm: "55051",
  crmRegion: "MG",
  rqe: "33744",
  primarySpecialty: "Ginecologia e Obstetrícia",
  title:
    "Acompanhamento médico para mulheres que desejam cuidar do corpo com critério, estratégia e proximidade.",
  credentialsSegments: [
    { text: "Médica, " },
    { text: "ginecologista e obstetra", emphasis: true },
    { text: ". Pós-graduada em " },
    { text: "Nutrologia", emphasis: true },
    { text: ", " },
    { text: "Nutriendocrinologia", emphasis: true },
    { text: " e " },
    { text: "Ciências da Obesidade e Sarcopenia", emphasis: true },
    { text: "." },
  ] satisfies ProfileTextSegment[],
  personalStorySegments: [
    { text: "Em " },
    { text: "2022", emphasis: true },
    {
      text: ", após minha gestação, enfrentei obesidade no pós-parto — e foi esse momento que deu origem ao ",
    },
    { text: "Método Grape", emphasis: true },
    {
      text: ". Porque emagrecer não bastava: era preciso entender o corpo por inteiro.",
    },
  ] satisfies ProfileTextSegment[],
  specialties: [
    "Ginecologia e Obstetrícia",
    "Nutrologia",
    "Terapias Hormonais",
    "Medicina Regenerativa",
  ] as const,
  complementaryRole: "Mentora de Médicos",
  founderRole: "Fundadora do ecossistema Grape",
};

export function formatDoctorCrmLabel(
  crm: string,
  region = doctorProfile.crmRegion,
) {
  return `CRM/${region} ${crm}`;
}

export function formatDoctorRegistrationLabel(
  crm = doctorProfile.crm,
  region = doctorProfile.crmRegion,
  rqe = doctorProfile.rqe,
) {
  return `CRM/${region}: ${crm} - RQE Nº: ${rqe}`;
}
