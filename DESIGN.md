# Design

## Design Direction

A Grape Clinic deve parecer uma experiencia clinica premium, moderna e silenciosamente cinematica. O site precisa unir a clareza de uma interface de produto refinada com a presenca visual de uma marca high ticket.

Cena fisica: uma clinica contemporanea ao fim da tarde, luz controlada, superficies limpas, detalhes uva profundos, atendimento calmo e preciso. Nada de spa generico, hospital frio ou luxo dourado.

O design deve transmitir modernidade por composicao, ritmo e acabamento: grandes areas de respiro, poucos elementos simultaneos, tipografia com presenca, movimento suave e interacoes que parecem calibradas. A tela deve respirar.

## Visual Strategy

O design deve seguir uma estrategia committed: a identidade uva/vinho carrega presenca de marca em pontos decisivos, enquanto superficies claras, espacamento amplo e tipografia precisa mantem a leitura sofisticada.

O vazio e parte da paleta. Areas brancas, zonas silenciosas e blocos com baixa densidade devem ser usados para aumentar percepcao de valor, foco e confianca. Evitar preencher toda area disponivel com cards, textos, icones ou efeitos.

Light mode:

- Base clara e limpa, sem bege generico.
- Cards brancos ou levemente tintados.
- Texto grafite com alto contraste.
- Uva profundo para CTAs, detalhes de navegacao e momentos de marca.
- Lavanda e salvia em acentos discretos.

Dark mode:

- Base grafite com profundidade uva.
- Superficies com bordas suaves e luz ambiente controlada.
- Gradientes discretos, nunca decorativos demais.
- Contraste forte em texto e botoes.
- Glass e blur apenas quando ajudam a criar profundidade real.

## Color Tokens

### Alvo (referência de direção)

Usar OKLCH em todos os tokens.

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.18 0.018 315);
  --surface: oklch(0.972 0.006 330);
  --surface-strong: oklch(0.94 0.014 326);
  --muted: oklch(0.45 0.026 315);
  --primary: oklch(0.31 0.115 322);
  --primary-soft: oklch(0.62 0.115 326);
  --accent: oklch(0.77 0.075 128);
  --lavender: oklch(0.84 0.065 315);
  --border: oklch(0.88 0.012 315);
}

.dark {
  --background: oklch(0.12 0.03 315);
  --foreground: oklch(0.95 0.01 315);
  --surface: oklch(0.17 0.038 315);
  --surface-strong: oklch(0.22 0.048 315);
  --muted: oklch(0.74 0.025 315);
  --primary: oklch(0.74 0.17 356.8);
  --primary-soft: oklch(0.65 0.12 324);
  --accent: oklch(0.78 0.08 128);
  --lavender: oklch(0.72 0.095 315);
  --border: oklch(0.31 0.04 315);
}
```

### Implementado (`src/app/globals.css`)

Paleta warm/neutral (hue ~58–84), distinta do bloco alvo acima. **Não alterar nesta fase técnica** — alinhamento visual é P2.

| Token | Light (aprox.) | Uso |
| --- | --- | --- |
| `--background` | off-white quente | fundo |
| `--foreground` | grafite quente | texto |
| `--primary` | tom uva/terroso | CTAs, marca |
| `--muted-foreground` | cinza médio | supporting text |
| `--border` | borda suave | cards, inputs |

Tipografia implementada: **Alice** (display, `--font-serif`) + **Montserrat** (corpo, `--font-montserrat`).

## Typography

A tipografia precisa parecer premium pela proporcao, nao por excesso ornamental.

- Fonte principal: grotesk moderna, limpa e com boa leitura.
- Evitar escolhas reflexas de IA como serifas editoriais obvias sem necessidade.
- Usar peso, escala e espaco para criar hierarquia.
- H1 com presenca forte, maximo visual controlado.
- Body com line-height generoso e largura entre 65 e 75 caracteres.
- Usar tracking normal ou muito discreto. Evitar texto apertado, comprimido ou com letter-spacing negativo agressivo.
- Títulos precisam ter ar ao redor. Se o texto parece espremido, o problema e de composicao, nao so de tamanho.
- Labels curtos podem usar peso e cor, mas evitar uppercase repetido em todas as secoes.

Escala desejada:

- H1: grande, confiante, com quebra bonita e `text-wrap: balance`.
- H2: forte, mas com mais silencio que impacto.
- Body: calmo, legivel, com ritmo de leitura premium.
- Microcopy: curta, clara e util.

## Layout

O layout deve ser minimalista, espacoso e editorial, com composicoes que respiram. O primeiro impacto pode funcionar como link na bio premium, mas com profundidade de site institucional.

Regras:

- Primeiro viewport deve ter foco claro. Nao tentar mostrar tudo ao mesmo tempo.
- Espacamentos generosos entre blocos principais.
- Usar vazios intencionais entre secoes para criar pausa e expectativa.
- Secoes com ritmo variado, nao uma sequencia monotona de grids.
- Cards apenas quando forem affordance real: links, protocolos, motivos, etapas.
- Evitar card dentro de card.
- Usar grid editorial, assimetria controlada, areas de respiro e blocos sticky quando fizer sentido.
- A home deve ter uma leitura imediata, mas tambem recompensa para quem rola.

Para `/hub`:

- A pagina deve parecer um hub premium, nao uma landing tradicional.
- O conteudo principal deve caber como uma experiencia vertical direta: identidade, promessa, acoes principais, links secundarios e sinais de confianca.
- Links precisam ter hierarquia: agendar e WhatsApp primeiro, paginas internas depois.
- O visual deve ser mais concentrado, com menos secoes aparentes no inicio e mais acabamento em cada interacao.
- Em desktop, usar composicao sofisticada sem perder a funcao de bio. Em mobile, parecer feito para Instagram: rapido, bonito, claro e refinado.

Para paginas institucionais:

- Usar mais narrativa de scroll, imagens, sticky content e transicoes.
- Alternar secoes densas com secoes silenciosas.
- Evitar blocos longos de texto sem composicao.

## Motion

Motion e parte central da experiencia.

- Lenis cria a base de scroll fluido.
- Framer Motion conduz entradas, transicoes, hover, pressed states, menu mobile e cards.
- GSAP deve ser reservado para scroll storytelling, pinned sections, progress visual e parallax em momentos especiais.
- Animacoes precisam ser suaves, precisas e curtas.
- O conteudo nunca deve depender de animacao para aparecer.
- Sempre respeitar `prefers-reduced-motion`.

Implementação: tokens e presets em `src/lib/motion/` (documentação em `MOTION.md`). GSAP registrado uma vez em `providers.tsx`; ScrollTrigger usa `scrollTriggerScroller()` para Lenis.

Padrao de movimento:

- Entrada inicial com leve deslocamento, blur pequeno e opacidade.
- Cards com hover de profundidade sutil.
- CTAs com feedback claro.
- Menus com transicao fluida.
- Scroll progress discreto.
- Parallax em camadas apenas quando melhorar narrativa.

Direcao de motion:

- Movimento deve parecer caro: lento o suficiente para ser sentido, rapido o suficiente para nao atrapalhar.
- Preferir curvas ease-out refinadas, sem bounce ou elastic.
- Evitar aplicar o mesmo reveal em toda secao. Cada movimento precisa combinar com o conteudo.
- Usar microinteracoes em links de bio para dar resposta imediata: seta, brilho contido, deslocamento leve, mudanca de superficie.
- Usar GSAP apenas para momentos especiais, como uma secao pinned, progresso de narrativa ou composicao Apple-like.

## Interaction

Cada interacao deve parecer deliberada:

- Botoes com estados hover, active, focus e disabled.
- Cards de link com seta, icone e feedback de profundidade.
- Menu mobile elegante, com transicao full-screen ou drawer refinado.
- Theme toggle discreto e claro.
- Floating WhatsApp sem competir com o conteudo.
- Formularios com validacao clara e mensagens humanas.

Interatividade nao deve virar ruido. O usuario precisa sentir que o site e vivo, mas nunca que esta disputando atencao. Cada hover, reveal, transicao e estado deve reforcar orientacao, qualidade ou desejo.

## Imagery And Atmosphere

Usar imagens e materiais visuais com criterio. O site nao deve depender apenas de texto e cards.

- Imagens devem comunicar cuidado, pele, corpo, saude, tecnologia e ambiente premium sem parecer banco de imagem barato.
- Texturas e gradientes devem ser atmosfericos e contidos.
- Elementos abstratos podem sugerir metabolismo, corpo, camadas, fluxo e precision care.
- Evitar imagens muito comerciais, poses exageradas, sorrisos artificiais e estetica de spa comum.

O material visual deve ter uma qualidade quase editorial, mas sem virar revista de moda. A direcao e clinica premium: pele, corpo, cuidado, tecnologia, luz, textura e proximidade humana.

## Spacing And Density

O espacamento e um dos principais sinais de high ticket.

- Usar padding amplo em secoes principais.
- Dar margem visual aos titulos.
- Evitar grids muito apertados.
- Evitar preencher todos os cantos da tela.
- Priorizar uma ideia dominante por dobra.
- Em mobile, preservar respiro sem criar scroll cansativo.
- Em desktop, usar largura maxima e colunas com intencao, nao esticar tudo ate as bordas.

Densidade ideal: baixa no primeiro impacto, media nos hubs de links, baixa novamente nos momentos de marca, media nas secoes informativas.

## Components

Componentes principais:

- Header, mobile menu, theme toggle, site intro
- `PremiumHome` + seções em `src/components/sections/home/*`
- Link-bio hub (`LinkBioBento`)
- `PageSection` / `SectionShell` — ritmo compartilhado (home + institucional)
- `ParallaxImage`, `HeroBackground`
- Formulário em `ClosingCtaSection`, `FaqAccordion` na home
- Footer, floating WhatsApp

Motion centralizada em `src/lib/motion/` — ver `MOTION.md`.

## Quality Bar

Antes de considerar uma tela pronta:

- Conferir desktop e mobile.
- Verificar contraste.
- Verificar que nao existe overflow horizontal.
- Garantir que texto nao encosta nas bordas nem quebra de forma estranha.
- Testar dark e light mode.
- Testar `prefers-reduced-motion`.
- Rodar typecheck e build.

O resultado precisa parecer profissional, autoral e bem dirigido. Se alguem puder olhar e dizer imediatamente que foi feito por IA, a direcao ainda nao esta boa o suficiente.
