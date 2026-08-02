# Mídia — Grape Clinic

Pipeline de imagens e vídeo do site. Masters **não** são servidos diretamente; apenas as versões em `public/images/opt/` (WebP + AVIF) e `public/videos/`.

---

## Imagens

### Estrutura

```
public/images/
├── sources/          # Masters (alta resolução, não servidos)
│   ├── hero/
│   ├── spaces/
│   ├── sections/
│   ├── services/
│   ├── journey/
│   ├── evaluation/
│   ├── method/
│   └── reels/
└── opt/              # Versões web (WebP servido + AVIF ao lado)
    ├── hero/
    ├── spaces/
    └── ...
```

O site aponta para `.webp` via [`src/content/media.ts`](../src/content/media.ts). O `next/image` ainda pode servir AVIF em runtime (`formats: avif, webp`). Imagens below-the-fold usam `loading="lazy"` — **não** pré-aquecer a home inteira no intro.

### Categorias

| Pasta | Uso no site |
| --- | --- |
| `hero` | Fundos full-screen da home e Hub |
| `spaces` | Ambientes da clínica, galeria, fundos CTA |
| `sections` | Fundos editoriais (parallax, visual break) |
| `services` | Cards legados (não usados na jornada atual) |
| `journey` | Etapas da Jornada — `diagnostico`, `implementacao`, `monitoramento`, `consolidacao` (`#cuidado`) |
| `evaluation` | Passos legados da avaliação (formulário antigo) |
| `method` | Pilares do Método Grape (`#experiencia`) |
| `reels` | Posters dos depoimentos em vídeo (`#reels`) — `.webp` gerados por `optimize:reels` |

### Posters de reels

1. Adicionar capa em `public/images/sources/reels/`.
2. Rodar `npm run optimize:reels`.
3. Confirmar `poster` em [`src/content/media.ts`](../src/content/media.ts) (`reelPoster` → `.webp`).

### Perfis de compressão

Definidos em [`scripts/optimize-images.config.mjs`](../scripts/optimize-images.config.mjs):

| Perfil | Largura máx. | Uso típico |
| --- | --- | --- |
| `hero` | 1920px | Fundos full-bleed |
| `section` | 1600px | Seções editoriais |
| `card` | 1200px | Cards e posters |
| `thumb` | 640px | Miniaturas |

### Comandos

```bash
# Regenera apenas o que mudou (compara mtime source vs output)
npm run optimize:images

# Escaneia public/images/sources/ e gera tudo que encontrar
npm run optimize:images -- --scan

# Força regeneração de todos os arquivos mapeados
npm run optimize:images -- --force
```

### Adicionar uma imagem nova

1. Coloque o master em `public/images/sources/{categoria}/`
2. Adicione entrada em `images[]` no config (source, output, profile, alt)
3. Rode `npm run optimize:images`
4. Referencie em [`src/content/media.ts`](../src/content/media.ts) via `/images/opt/{categoria}/{arquivo}.jpg`
5. Commit **source + opt** (opt é gerado, mas versionado para deploy sem build step)

---

## Vídeo da hero

| Arquivo | Descrição |
| --- | --- |
| `public/videos/clinic-hero-loop.mp4` | Master (referência / edição) |
| `public/videos/clinic-hero-loop.web.mp4` | Versão servida (H.264, otimizada) |
| `public/videos/clinic-hero-loop.source.mp4` | Backup automático do master anterior |

```bash
npm run optimize:video
```

Ao trocar o vídeo, incremente `HERO_VIDEO_VERSION` em [`src/content/media.ts`](../src/content/media.ts) para invalidar cache do navegador.

---

## Brand e tipografia (referência)

| Pasta | Conteúdo |
| --- | --- |
| [`docs/assets/brand/`](../docs/assets/brand/) | Logos fonte (SVG) — versões servidas em `public/brand/` |
| [`docs/assets/typography/`](../docs/assets/typography/) | Fontes de marca (Avegas Royale, Franie) — **P2**, site usa Montserrat via Google Fonts |

---

## Manifest

O otimizador gera `public/images/opt/manifest.json` com metadados (tamanho, profile, source). Útil para auditoria de peso.
