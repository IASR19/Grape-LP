export const googleReviewsMeta = {
  rating: 5,
  count: 937,
  label: "Avaliações no Google",
  href: "https://www.google.com/maps/place/Grape+Clinic/@-22.2244861,-45.9259731,17z/data=!4m8!3m7!1s0x94cbc749485e24f5:0xef1266625663eac6!8m2!3d-22.2244861!4d-45.9233982!9m1!1b1",
} as const;

/** Depoimentos reais curados a partir das avaliações públicas no Google. */
export const googleReviews = [
  {
    quote:
      "Viajamos 130 km para ser atendidas e valeu cada centímetro. Desde a chegada, o consultório encanta e toda a equipe é super acolhedora.",
    name: "Gabi Jorge",
  },
  {
    quote:
      "Em quatro meses, perdi 16 kg sem sensação adversa, com melhora real em todos os aspectos da saúde — e sem sofrimento ou restrições exageradas.",
    name: "João Luiz Lopes",
  },
  {
    quote:
      "Estou no terceiro ano de reposição hormonal com a Marcela. Ela me fez ter qualidade de vida de novo. Para mim, é a médica que toda mulher precisa conhecer.",
    name: "Nara Kitsidis",
  },
  {
    quote:
      "Fui literalmente tratada como uma princesa. A Dra. Marcela tem muita empatia, cuidado e responsabilidade. Simplesmente a melhor médica com quem já me consultei.",
    name: "Ana Letícia Bacha",
  },
  {
    quote:
      "Minha experiência com a Dra. Marcela mudou minha vida. Ela investigou as causas, me apresentou os tratamentos possíveis e me trouxe qualidade de vida e bem-estar.",
    name: "Joyce Silva",
  },
  {
    quote:
      "Ambiente super agradável e equipe amorosa. A Dra. Marcela me deu solução para problemas que me disseram que não tinham mais jeito.",
    name: "Cristiana Costa",
  },
  {
    quote:
      "Passei por 15 médicos diferentes e ninguém conseguiu me ajudar. Com a Dra. Marcela, finalmente encontrei quem investigou de verdade a minha dor.",
    name: "Tatiana do Vale",
  },
  {
    quote:
      "Simplesmente a melhor profissional da cidade. Busca de fato a raiz do problema. Me senti muito amparada como nunca havia sido antes.",
    name: "Daniele S. Paula",
  },
  {
    quote:
      "Atendimento excelente, lugar impecável. Todas as profissionais — da copa à recepção, enfermagem e auxiliares — são educadas, atenciosas e cordiais.",
    name: "Douglas Jorge",
  },
  {
    quote:
      "Encantada com o atendimento de toda a equipe. A Dra. Marcela é atenciosa, delicada e completa. Será minha médica de hoje em diante.",
    name: "Tânia Moraes",
  },
  {
    quote:
      "Melhor escolha que fiz. Desde a recepção até a consulta, tudo faz diferença. A Dra. Marcela é competente, atenciosa e explica em detalhes cada opção de tratamento.",
    name: "Elaine Fonseca",
  },
  {
    quote:
      "O atendimento começa na chegada — tudo é preparado para você se sentir bem e cuidada. A equipe é capaz e competente. A Marcela, brilhante.",
    name: "Ana Paula Cortes",
  },
  {
    quote:
      "Tudo impecável. A Dra. Marcela investiga até os pequenos detalhes que muitos deixam passar. Confio 100% nela e indico para todas as minhas amigas.",
    name: "Roberta Paula",
  },
  {
    quote:
      "Com o coração cheio de gratidão por tudo o que vivemos juntas ao longo de dez meses de tratamento. Quando iniciei essa jornada, carregava muito mais do que peso.",
    name: "Jamila Leal",
  },
  {
    quote:
      "A Dra. Marcela superou minhas expectativas. O diferencial são os tipos de exames que ela solicita — alguns eu nem tinha ouvido falar.",
    name: "Flávia Mendonça",
  },
  {
    quote:
      "A melhor clínica que existe. Acolhimento excepcional desde a recepção, com um abraço carinhoso e acolhedor. Indico para todo mundo.",
    name: "thata",
  },
  {
    quote:
      "A Dra. Marcela e sua equipe são sensacionais. O atendimento nota mil já começa pelo primeiro contato, na consulta e no pós. Recomendo demais.",
    name: "Iara Corsini",
  },
  {
    quote:
      "Sou paciente há quase quatro anos. A Dra. Marcela é super atualizada, esclarece todas as dúvidas e solicita exames que nenhum outro médico havia pedido antes.",
    name: "Lisiane Silva",
  },
  {
    quote:
      "Pela primeira vez na vida, achei uma médica que me fez sentir confortável e segura. Competente, simpática e com total domínio do que fala.",
    name: "Daiane Santos",
  },
  {
    quote:
      "Não foi só estética. Recuperei autoestima, saúde e amor próprio — e isso refletiu até na minha casa. Só gratidão.",
    name: "Cristiane Manoel da Silva",
  },
] as const;

export type GoogleReview = (typeof googleReviews)[number];
