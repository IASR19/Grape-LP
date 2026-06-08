# Product

## Register

brand

## Users

Grape Clinic atende pessoas que buscam emagrecimento acompanhado, saúde metabólica, estética premium e protocolos de cuidado corporal com alto nível de confiança. O público chega ao site em um momento de avaliação: quer perceber se a clínica é séria, sofisticada, segura, atual e compatível com um investimento high ticket antes de falar com a equipe.

Esses visitantes normalmente vêm de Instagram, WhatsApp, indicação ou campanha. Não querem um site longo e comum. Querem uma experiência clara, bonita e confiável que explique a proposta, mostre autoridade e facilite o próximo passo sem pressão comercial.

## Product Purpose

O site existe para apresentar a Grape Clinic como uma clínica premium de estética, emagrecimento e cuidado médico individualizado. A experiência une três funções:

1. **Landing institucional** — narrativa longa, imersiva e cinematográfica na home.
2. **Hub de conversão na bio** — mini landing page em `/hub`, sem cara de Linktree.
3. **Caminhos claros para ação** — WhatsApp, formulário de avaliação, localização e conteúdo de marca.

O site deve ser dinâmico, elegante, minimalista, high ticket, interativo e memorável. Navegar por ele deve parecer uma experiência, não apenas leitura de seções. A referência de ambição é a sensação de marcas como Apple, Aesop, Stripe e Linear: scroll com narrativa, hierarquia visual forte, transições suaves, composições espaçosas, detalhes interativos precisos e percepção imediata de qualidade.

Minimalismo aqui não significa vazio sem direção. Significa edição, foco e respiro: menos elementos por dobra, mais importância para cada bloco, CTAs mais claros, texto com mais ar, imagens e vídeo com presença. O espaço vazio funciona como sinal de confiança e valor, não como falta de conteúdo.

Sucesso significa que a experiência comunica autoridade, desejo, cuidado e modernidade sem parecer genérica, agressiva, popular demais ou feita por IA. O usuário deve entender rapidamente a proposta, reconhecer os diferenciais, sentir confiança para investir e ter caminhos claros para entrar em contato.

## Estado Atual do Site (2026)

A base visual da home e do link-bio está em produção e evolui com refinamento contínuo de motion, mídia e conversão. Detalhes técnicos em [`ARCHITECTURE.md`](ARCHITECTURE.md), direção visual em [`DESIGN.md`](DESIGN.md), motion em [`src/lib/motion/MOTION.md`](src/lib/motion/MOTION.md).

### Rotas principais

| Rota | Papel |
| --- | --- |
| `/` | Home institucional premium (`PremiumHome`) |
| `/hub` | Hub de conversão para Instagram e WhatsApp (`LinkBioBento`) |
| `/link-bio` | Redirect permanente → `/hub` |

### Home — narrativa implementada

A home é uma página longa com scroll coreografado. Cada seção tem papel editorial e conversão. Ordem atual:

| # | Seção | ID | Função |
| --- | --- | --- | --- |
| 1 | **Hero** | `#hero` | Vídeo loop da clínica em full bleed, parallax no scroll, H1 serif em duas linhas, stats de confiança e CTAs à direita |
| 2 | **Contraste de método** | `#metodo` | Toggle "tentativas isoladas" vs "Método Grape" com GSAP ScrollTrigger |
| 3 | **Quebra visual** | — | Frase editorial + foto imersiva (`VisualBreakSection`) |
| 4 | **Quatro frentes de cuidado** | `#cuidado` | Grid 2×2 de cards editoriais com foto, overlay e link para WhatsApp |
| 5 | **Primeira avaliação** | `#avaliacao` | Tabs (Escuta → Leitura clínica → Próximo passo) + painel fotográfico |
| 6 | **Método Grape** | `#experiencia` | Sete pilares clínicos com sticky scroll e cards editoriais |
| 7 | **Fundadora** | `#fundadora` | Declaração de autoridade da Dra. Marcela Ferreira |
| 8 | **Depoimentos em vídeo** | `#reels` | Carrossel de reels com player inline |
| 9 | **Histórias de pacientes** | `#historias` | Cards de prova social (sem animação de entrada nos cards) |
| 10 | **Dúvidas + Contato** | `#duvidas` / `#contato` | FAQ com pattern da marca + formulário multi-etapas de avaliação |

**Navegação lateral:** `HomeScrollNav` fixo à direita com âncoras das seções principais.

**CTA principal:** "Solicitar avaliação" → WhatsApp ou formulário em `#contato`.

### Shell e primeira impressão

- **Site intro:** logo Grape Clinic com reveal circular na primeira visita da sessão; preload Tier 1 (poster, vídeo hero, logos) antes do reveal; Tier 2 em background após intro.
- **Hero pós-intro:** coreografia Framer Motion (eyebrow → H1 linha a linha → stats → CTAs); revisitas com entrada mais rápida.
- **Vídeo hero:** loop otimizado (~1 MB), poster estático até primeiro frame, sem overlay nativo de play visível.
- **Header / footer / WhatsApp FAB:** chrome global consistente; theme toggle com View Transitions.

### Link bio — hub premium

`/hub` deixou de ser agregador de links. Funciona como **mini landing de conversão**:

- **Coluna esquerda:** badges de confiança, nome da clínica, promessa ("Estética avançada com olhar médico…"), prova social compacta (4.9 Google, +800 acompanhadas, 1:1), **card CTA premium** "Solicitar avaliação" e redes sociais (Instagram, YouTube, Reviews).
- **Coluna direita:** dois cards editoriais grandes (Conhecer a clínica, Programa de emagrecimento) + quatro ações de suporte (WhatsApp, Pré-agendamento, Como chegar, YouTube).
- **Layout:** viewport-fit em desktop (`min-h-[calc(100svh-5rem)]`), sem scroll obrigatório para ver identidade, CTA, cards e redes.
- **Visual:** fundo fotográfico com parallax leve, glass sutil, microinterações em hover.

### Mídia e performance

- Fotos da clínica em `public/images/opt/` por categoria (pipeline `npm run optimize:images`; masters em `public/images/sources/`).
- Masters em `sources/`; versões web em `opt/`.
- Vídeo hero em `public/videos/clinic-hero-loop.mp4` com versionamento de cache.
- Favicon completo em `public/brand/favicon_io/`.
- Preload crítico no layout: poster hero, MP4, logos.

### Motion implementado

| Camada | Onde |
| --- | --- |
| Scroll reveals | `Reveal`, `StaggerReveal`, `RevealItem` em quase todas as seções da home |
| Hero coreography | Variants `heroStagger` / `heroLine` gated por `useSiteIntroReady` |
| Parallax | `ParallaxImage`, `HeroBackground` (scale, blur, fade branco no scroll) |
| Scroll storytelling | GSAP pinned em `#experiencia`, toggle em `#metodo` |
| Scroll suave | Lenis (desligado com `prefers-reduced-motion`) |

## Brand Personality

Sofisticada, precisa, acolhedora, moderna e sensorial.

A marca combina presença editorial, sensação de experiência premium, segurança clínica e refinamento contemporâneo. A comunicação é direta, elegante e concreta, evitando exageros médicos, promessas absolutas, linguagem promocional barata ou frases genéricas de bem-estar.

O tom visual e verbal transmite cuidado individualizado, ciência, estratégia e presença. O site deve parecer desenhado por uma equipe com gosto, critério e domínio técnico, não montado a partir de um template.

## Experience Ambition

A experiência é guiada por scroll, ritmo e interação. O usuário sente que a página responde ao movimento: seções entram com intenção, elementos flutuam com sutileza, cards têm microinterações, CTAs parecem precisos e a narrativa visual avança em camadas.

Fotografias e frames de vídeo usam **parallax sutil** no scroll para aumentar imersão e profundidade. A imagem não parece um bloco estático colado na página: responde ao movimento com deslocamento controlado, reforçando sensação de espaço e narrativa visual. O efeito precisa ser elegante e discreto — nunca exagerado, distrativo ou com cara de template.

O site tem momentos de pausa. Nem toda dobra compete por atenção. A experiência ideal alterna impacto, silencio visual, aprofundamento e ação. Esse ritmo cria a sensação de site moderno, profissional e caro.

Na página de link na bio, a prioridade é conversão premium: identidade no topo, mensagem humana e estratégica, CTA dominante, cards editoriais como portas de entrada, prova social compacta, redes sociais visíveis e caminho para o site completo — tudo sem parecer Linktree.

Stack moderna como parte do produto:

- **Framer Motion** (`motion/react`) — transições, entradas, hover, hero, reveals.
- **GSAP + ScrollTrigger** — parallax, pin, toggle de método, hero scroll.
- **Lenis** — scroll suave sincronizado com GSAP.
- **ParallaxImage / HeroBackground** — mídia imersiva reutilizável.
- **next-themes** — light/dark sem flicker.
- **shadcn/ui + Tailwind CSS 4** — base consistente e refinada.

A tecnologia serve ao acabamento. Animação não é decoração gratuita: melhora orientação, ritmo, foco e sensação premium.

## Editorial

Priorizar imagem, respiro e uma ideia por dobra. Evitar blocos longos de texto institucional repetindo o título. Copy curta, CTAs claros, fotografia e vídeo profissionais como eixo narrativo.

**Tom de copy atual na home:**

- Hero: "Cuidado médico para o corpo."
- Contraste: problema comum vs método Grape.
- Cuidado: quatro frentes (Emagrecimento, Estética corporal, Saúde metabólica, Manutenção).
- Avaliação: três etapas da primeira consulta.
- Método Grape: sete pilares de leitura clínica integral.
- Prova social: stats, depoimentos em vídeo, histórias de pacientes.

Seção de vídeos da Dra. Marcela Ferreira e depoimentos de pacientes na home reforçam humanização e autoridade.

## Conversão

Objetivo principal: **solicitações de avaliação**.

| Canal | Onde |
| --- | --- |
| WhatsApp | Hero, cards `#cuidado`, link-bio, FAB flutuante, footer |
| Formulário multi-etapas | `#contato` (nome, WhatsApp, cidade, renda, situação, duração) |
| Redes | Instagram, YouTube, Google Reviews no link-bio |

CTAs devem parecer convite qualificado, não captura agressiva. Hierarquia visual deixa claro que "Solicitar avaliação" é a ação principal.

## Anti-references

Evitar estética genérica de spa, clínica popular, landing page agressiva de emagrecimento, excesso de badges, antes/depois sensacionalista, copy milagrosa e layouts que pareçam template. Evitar também visual frio demais de hospital, luxo dourado, excesso de glassmorphism, excesso de roxo sem contraste, cards repetidos demais e interfaces que pareçam geradas por IA.

Não usar linguagem de promessa fácil, urgência artificial, "emagreça rápido", transformação milagrosa, comparações apelativas ou visual comercial de clínica de estética popular.

Referências de ambição: Apple (scroll e narrativa), Aesop (silêncio e materialidade), Stripe (precisão), Linear (refinamento), Raycast (microinterações), Ritual (wellness premium), clínicas internacionais de alto padrão. Orientam critério; não são cópias.

## Design Principles

1. Parecer premium antes de explicar premium.
2. Fazer o scroll virar experiência, com ritmo, narrativa, parallax sutil e movimento suave.
3. Usar espaço generoso, hierarquia forte e tipografia precisa como sinais de valor.
4. Tratar o vazio como material de design: respiro, foco, luxo e calma.
5. Mostrar cuidado e método com clareza, sem exagerar promessas.
6. Fazer cada CTA parecer uma conversa qualificada, não uma captura agressiva.
7. Criar interações modernas que reforcem confiança e desejo sem poluir a tela.
8. Evitar qualquer solução com cara de template, IA genérica ou landing page barata.
9. Construir base visual flexível para evoluir páginas, campanhas e variacoes sem retrabalho.
10. Valorizar fotografia e vídeo reais da clínica como principal ativo de percepção de qualidade.

## Accessibility & Inclusion

Mirar WCAG AA para contraste, foco visível, navegação por teclado e estrutura semântica. Respeitar `prefers-reduced-motion` em Framer Motion, GSAP, parallax e Lenis — parallax desativado quando reduzido. Conteúdo evita linguagem excludente, culpabilizante ou promessas que gerem insegurança corporal.

Movimento, contraste, dark mode e interações fazem parte da experiência premium. Uma experiência elegante também precisa ser legível, confortável e previsível.

## Technical Baseline

| Camada | Stack |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Estilo | Tailwind CSS 4, tokens OKLCH em `globals.css` |
| Tipografia | Alice (display) + Montserrat (corpo) |
| Motion | `motion/react`, GSAP 3, Lenis |
| Tema | next-themes + View Transitions API |
| Conteúdo | `src/content/site.ts`, `src/content/media.ts` |
| Componentes home | `src/components/sections/home/*` |
| Link bio | `src/components/sections/link-bio-bento.tsx` |

Refatoração do shell, motion modular e otimização de mídia concluídas. Evolução contínua em fotos contextuais por seção, refinamento de link-bio e polish de conversão.
