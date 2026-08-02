/**
 * Depoimentos em vídeo (#reels).
 * Masters em public/videos/reels/sources/ → web em public/videos/reels/
 * Posters em public/images/opt/reels/
 *
 * Nome canônico do asset web = campo `out` (ex.: ivan-isabela.mp4).
 * Labels na UI vêm de `title` + `part` em media.ts — não do nome do source.
 */

export const sourcesDir = "public/videos/reels/sources";
export const outputDir = "public/videos/reels";
export const postersDir = "public/images/opt/reels";

/** CRF maior = arquivo menor. 28 + 720p equilibra qualidade e peso para cards mobile. */
export const encode = {
  crf: 28,
  preset: "slow",
  maxWidth: 720,
  audioBitrate: "96k",
  maxRate: "1600k",
  bufsize: "3200k",
};

/** Capas editoriais em public/images/sources/reels/ — masters dos posters. */
export const coversDir = "public/images/sources/reels";

/** Posters verticais — exibidos em cards ~24rem; 720px basta. */
export const posterEncode = {
  maxWidth: 720,
  quality: 76,
};

export const reels = [
  {
    source: "Postado - Ivan_Isabela (Reels 02).mp4",
    id: "ivan-isabela",
    title: "Recuperamos a nossa autoestima — Ivan & Isabela",
    out: "ivan-isabela.mp4",
    poster: "ivan-isabela.webp",
    cover: "Capa - Ivan e Isabela.png",
  },
  {
    source: "Postado - Junior_Leticia (Reels 01).mp4",
    id: "junior-leticia-01",
    title: "A nossa vida mudou completamente — Junior & Letícia",
    out: "junior-leticia-01.mp4",
    poster: "junior-leticia-01.webp",
    cover: "Capa  - Junior e Letícia.png",
  },
  {
    source: "Junior_Leticia (Reels 02).mp4",
    id: "junior-leticia-02",
    title: "A nossa vida mudou completamente — Junior & Letícia",
    out: "junior-leticia-02.mp4",
    poster: "junior-leticia-02.webp",
    cover: "Capa  - Junior e Letícia.png",
  },
  {
    source: "Lucio_Marcela (Reels 02).mp4",
    id: "lucio-marcela",
    title: "Nós fomos os primeiros pacientes — Lúcio & Marcela",
    out: "lucio-marcela.mp4",
    poster: "lucio-marcela.webp",
    cover: "Capa - Lucio e Marcela.png",
  },
  {
    source: "Postado - Marcelo_Marianne (Reels 01).mp4",
    id: "marcelo-marianne-01",
    title: "Nós somos outro casal, vivemos melhor — Marcelo & Marianne",
    out: "marcelo-marianne-01.mp4",
    poster: "marcelo-marianne-01.webp",
    cover: "Capa - Marcelo a Mari.png",
  },
  {
    source: "Marcelo_Marianne (Reels 02).mp4",
    id: "marcelo-marianne-02",
    title: "Nós somos outro casal, vivemos melhor — Marcelo & Marianne",
    out: "marcelo-marianne-02.mp4",
    poster: "marcelo-marianne-02.webp",
    cover: "Capa - Marcelo a Mari.png",
  },
  {
    source: "Marcos_Dani (Reels 02).mp4",
    id: "marcos-dani",
    title: "O nosso corpo é a base dos nossos sonhos — Marcos & Dani",
    out: "marcos-dani.mp4",
    poster: "marcos-dani.webp",
    cover: "Capa - Marcos e Dani.png",
  },
];
