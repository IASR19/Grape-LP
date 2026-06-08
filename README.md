# Grape Clinic

Site institucional e hub de conversão da **Grape Clinic** — clínica premium de estética, emagrecimento médico e cuidado corporal em Pouso Alegre (MG).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · motion/react · GSAP · Lenis

---

## Início rápido

### Requisitos

| Ferramenta | Versão mínima |
| --- | --- |
| Node.js | 20.x |
| npm | 10.x |

Não há variáveis de ambiente obrigatórias para rodar o site em desenvolvimento.

### Instalação

```bash
git clone https://github.com/ricktcunha/grapeclinic.git
cd grapeclinic
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build (`npm run build` antes) |
| `npm run typecheck` | Verificação TypeScript (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run optimize:images` | Gera versões web em `public/images/opt/` |
| `npm run optimize:video` | Gera versão web do vídeo da hero |
| `npm run optimize:media` | Imagens + vídeo |
| `npm run optimize:media:force` | Regenera tudo, ignorando cache |

### Checklist antes de merge

```bash
npm run typecheck && npm run lint && npm run build
```

Testar manualmente:

- `/` e `/hub` em mobile e desktop
- Tema claro e escuro
- `prefers-reduced-motion: reduce` (animações desligadas)
- Links do Hub → home (`/#contato`, `/#cuidado`, `/#reels`)

---

## Rotas

| Rota | Componente | Descrição |
| --- | --- | --- |
| `/` | `PremiumHome` | Home institucional (12 seções) |
| `/hub` | `LinkBioBento` | Hub de conversão (bio Instagram / WhatsApp) |
| `/link-bio` | — | Redireciona permanentemente para `/hub` |

**Âncoras da home** (navegação por hash):

| Hash | Seção |
| --- | --- |
| `#metodo` | Método / toggle editorial |
| `#cuidado` | Quatro frentes de cuidado |
| `#avaliacao` | Primeira avaliação (timeline) |
| `#experiencia` | Método Grape (7 pilares) |
| `#fundadora` | Dra. Marcela Ferreira |
| `#reels` | Depoimentos em vídeo (YouTube) |
| `#historias` | Relatos de pacientes |
| `#duvidas` | FAQ |
| `#contato` | Formulário de avaliação estratégica |
| `#galeria` | Galeria da clínica |

---

## Estrutura do projeto

```
grapeclinic/
├── docs/                          # Documentação e assets de referência
│   ├── assets/
│   │   ├── brand/                 # Logos fonte (SVG)
│   │   └── typography/            # Fontes de marca (P2 — ainda não no site)
│   └── MEDIA.md                   # Pipeline de imagens e vídeo
├── public/
│   ├── brand/                     # Logos, favicons, pattern (servidos)
│   ├── images/
│   │   ├── sources/               # Masters — não servidos diretamente
│   │   └── opt/                   # Versões web — usadas pelo site
│   └── videos/                    # Vídeo loop da hero
├── scripts/
│   ├── optimize-images.mjs        # Otimizador de imagens (sharp)
│   ├── optimize-images.config.mjs # Mapa source → output
│   └── optimize-video.mjs         # Transcode hero (ffmpeg)
├── src/
│   ├── app/                       # App Router (layout, globals.css, rotas)
│   ├── components/
│   │   ├── layout/                # Header, footer, intro, providers, nav
│   │   ├── sections/home/         # Seções modulares da home
│   │   ├── sections/              # Orquestradores (premium-home, hub, blocos)
│   │   ├── motion/                # Reveal, StaggerReveal
│   │   ├── media/                 # ParallaxImage, HeroBackground, YouTube
│   │   ├── interaction/           # FAQ accordion
│   │   └── ui/                    # Button, ExternalArrow, etc.
│   ├── content/                   # Copy, nav, assets (site.ts, media.ts)
│   ├── hooks/                     # reduced-motion, scroll-lock, media-query
│   ├── lib/                       # motion, layout, navigation, theme, a11y
│   ├── registry/                  # Componentes de terceiros (Magic UI)
│   └── styles/                      # CSS de transição (intro, tema, rotas)
├── ARCHITECTURE.md                # Arquitetura técnica
├── PRODUCT.md                     # Produto, tom, anti-referências
├── DESIGN.md                      # Direção visual e tokens
├── COPY.md                        # Copy de referência
└── docs/MEDIA.md                  # Pipeline de imagens e vídeo
```

---

## Onde editar o quê

| O que mudar | Arquivo |
| --- | --- |
| Textos, links, nav, FAQs | [`src/content/site.ts`](src/content/site.ts) |
| Imagens e vídeos | [`src/content/media.ts`](src/content/media.ts) + [`scripts/optimize-images.config.mjs`](scripts/optimize-images.config.mjs) |
| Seções da home (ordem) | [`src/components/sections/premium-home.tsx`](src/components/sections/premium-home.tsx) |
| Hub / link-bio | [`src/components/sections/link-bio-bento.tsx`](src/components/sections/link-bio-bento.tsx) |
| Formulário de contato | [`src/components/sections/home/closing-cta-section.tsx`](src/components/sections/home/closing-cta-section.tsx) |
| Tokens de animação | [`src/lib/motion/`](src/lib/motion/) — ver [`MOTION.md`](src/lib/motion/MOTION.md) |
| Cores e tema | [`src/app/globals.css`](src/app/globals.css) |
| Redirects | [`next.config.ts`](next.config.ts) |

**Regra:** copy e navegação ficam em `content/`. Componentes não devem hardcodar URLs — usar `siteConfig`.

---

## Mídia

Fluxo resumido:

1. Colocar masters em `public/images/sources/{categoria}/`
2. Registrar em `scripts/optimize-images.config.mjs` (se necessário)
3. Rodar `npm run optimize:images`
4. Referenciar em `src/content/media.ts` via `/images/opt/...`

Detalhes completos: [`docs/MEDIA.md`](docs/MEDIA.md).

---

## Motion e acessibilidade

- **UI motion:** `motion/react` via [`src/components/motion/reveal.tsx`](src/components/motion/reveal.tsx)
- **Scroll storytelling:** GSAP + ScrollTrigger (parallax, pin)
- **Scroll suave:** Lenis (desligado com `prefers-reduced-motion`)
- **Tema:** next-themes + View Transitions API

Guia completo: [`src/lib/motion/MOTION.md`](src/lib/motion/MOTION.md).

---

## Fase 1 (entrega atual) vs. P2

| Incluído na fase 1 | Planejado para P2 |
| --- | --- |
| Home `/` completa | Páginas `/emagrecimento`, `/protocolo-emagrecimento` |
| Hub `/hub` | Integração real do formulário (backend / CRM) |
| Shell global (header, footer, intro, FAB) | Fontes de marca locais (`docs/assets/typography/`) |
| Pipeline de mídia (sharp + ffmpeg) | CI com E2E visual |
| Tema claro/escuro | Motion nas páginas institucionais |

---

## Documentação complementar

| Arquivo | Conteúdo |
| --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Stack, fluxo de motion, convenções de código |
| [`PRODUCT.md`](PRODUCT.md) | Propósito do site, tom de marca, jornada |
| [`DESIGN.md`](DESIGN.md) | Direção visual, tokens, anti-padrões |
| [`COPY.md`](COPY.md) | Referência de copy |
| [`docs/MEDIA.md`](docs/MEDIA.md) | Pipeline de imagens e vídeo |
| [`src/lib/motion/MOTION.md`](src/lib/motion/MOTION.md) | Presets e tokens de animação |

---

## Deploy

Build estático compatível com Vercel, Netlify ou qualquer host Node:

```bash
npm run build
npm run start
```

Imagens remotas permitidas: thumbnails do YouTube (`i.ytimg.com`) — ver `next.config.ts`.

---

## Licença

Projeto privado. Todos os direitos reservados © Grape Clinic.
