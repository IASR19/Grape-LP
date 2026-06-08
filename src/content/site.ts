import { clinicPhotos, previewPhoto } from "@/content/media";

export const siteConfig = {
  name: "Grape Clinic",
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
    "https://www.google.com/maps/dir//R.+Cel.+Brito+Filho,+n%C2%B0461+-+e+469+-+Fatima,+Pouso+Alegre+-+MG,+37554-246/@-22.2244654,-46.0057998,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x94cbc749485e24f5:0xef1266625663eac6!2m2!1d-45.9233982!2d-22.2244861?entry=ttu",
};

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export const sitePages: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Link Bio",
    href: "/link-bio",
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
    description: "Quatro frentes de atendimento",
  },
  {
    label: "Avaliação",
    href: "/#avaliacao",
    description: "Como funciona a primeira consulta",
  },
  {
    label: "Método Grape",
    href: "/#experiencia",
    description: "Sete pilares de leitura clínica",
  },
  {
    label: "Depoimentos",
    href: "/#reels",
    description: "Vídeos de pacientes",
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
  heroTitle: "Cuidado médico para o corpo.",
  heroTitleLines: ["Cuidado médico", "para o corpo."] as const,
  stats: [
    { value: "800+", label: "pacientes acompanhadas" },
    { value: "1:1", label: "avaliação individual" },
    { value: "MG", label: "atendimento presencial" },
  ],
  visualBreakTitle: "O corpo pede leitura inteira, não atalhos.",
  timelineTitle: "Primeira avaliação.",
  founderTitle: "Escuta, estratégia e acompanhamento.",
  galleryTitle: "A clínica por dentro.",
  testimonialsTitle: "Relatos de pacientes.",
  faqTitle: "Dúvidas frequentes.",
  ctaTitle: "Comece por uma avaliação individual.",
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
  title: "Sete frentes de leitura para cuidar do corpo de forma integral.",
  description:
    "Cada pilar entra na avaliação e no plano individual. Nada de receita pronta: a estratégia evolui com você, conforme exames, rotina e resposta do corpo.",
};

export const grapeMethodSteps = [
  {
    title: "Hormônios",
    text: "Metabolismo, energia, composição corporal e resposta ao plano passam por uma leitura hormonal cuidadosa.",
    src: clinicPhotos.hormoneBalance,
    variant: "muted" as const,
  },
  {
    title: "Inflamação",
    text: "Processos inflamatórios que atrapalham a evolução são identificados e tratados com critério clínico.",
    src: clinicPhotos.antiInflammatoryNutrition,
    variant: "secondary" as const,
  },
  {
    title: "Músculo",
    text: "Massa magra entra na estratégia como parte do cuidado com corpo, força e metabolismo.",
    src: clinicPhotos.muscleStrength,
    variant: "primary" as const,
  },
  {
    title: "Intestino",
    text: "Equilíbrio digestivo e absorção de nutrientes compõem a base do cuidado metabólico.",
    src: clinicPhotos.gutHealth,
    variant: "muted" as const,
  },
  {
    title: "Nutrientes",
    text: "Alimentação e suplementação são indicados com base clínica, não por tendência ou moda.",
    src: clinicPhotos.clinicalNutritionPlate,
    variant: "secondary" as const,
  },
  {
    title: "Estilo de vida",
    text: "Sono, rotina, estresse e movimento entram no plano de forma praticável e sustentável.",
    src: clinicPhotos.healthyLifestyle,
    variant: "primary" as const,
  },
  {
    title: "Medicamentos",
    text: "Recursos medicamentosos entram quando indicados, com monitoramento e segurança ao longo do percurso.",
    src: clinicPhotos.medicationConsultation,
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
    question: "Preciso iniciar com exercicios intensos?",
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

export const testimonials = [
  {
    quote:
      "Cheguei ao meu grande dia mais confiante, sem sentir que estava sozinha.",
    name: "Ana Silva",
    photoSrc: previewPhoto(0),
  },
  {
    quote: "Entendi o que mudar na rotina e parei de recomeçar toda semana.",
    name: "Vanessa Duarte",
    photoSrc: previewPhoto(1),
  },
  {
    quote: "O acompanhamento trouxe segurança para cuidar do corpo com calma.",
    name: "Livia Rodrigues",
    photoSrc: previewPhoto(2),
  },
  {
    quote: "Um plano que cabia na minha vida, sem dieta extrema.",
    name: "Camila Nunes",
    photoSrc: previewPhoto(3),
  },
  {
    quote: "Cuidado real, com ajustes e escuta.",
    name: "Juliana Moraes",
    photoSrc: previewPhoto(4),
  },
] as const;

export const doctorProfile = {
  name: "Dra. Marcela Ferreira",
  title:
    "Acompanhamento médico para mulheres que desejam cuidar do corpo com critério, estratégia e proximidade.",
  note: "Anos de prática clínica unindo ciência, avaliação individual e acompanhamento próximo.",
};
