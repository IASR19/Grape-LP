# Motion (`src/lib/motion`)

Single source for animation tokens, `motion/react` presets, GSAP helpers and shell timelines.

## Imports

```ts
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  MOTION,
  fadeUp,
  fadeUpSoft,
  fadeIn,
  scaleIn,
  mediaReveal,
  heroStagger,
  gsapDuration,
  scrollTriggerScroller,
} from "@/lib/motion";
import {
  Reveal,
  RevealText,
  StaggerReveal,
  RevealItem,
  RevealMedia,
} from "@/components/motion/reveal";
import { useSiteIntroReady } from "@/hooks/use-site-intro-ready";
```

## Responsibility matrix

| Case | Tool | Where |
| --- | --- | --- |
| Entrances, scroll reveals | `Reveal*` components + presets | Home sections, link-bio, FAQ |
| Hero mount (pós-intro) | Framer variants + `useSiteIntroReady` | `hero-section.tsx` |
| Image parallax | GSAP ScrollTrigger | `parallax-image.tsx`, `hero-background.tsx` |
| Scroll storytelling | GSAP + Lenis proxy | care-toggle, process pinned |
| Smooth scroll | Lenis | `providers.tsx` |

## Presets (`reveal.ts`)

| Preset | Use |
| --- | --- |
| `fadeUp` | Headlines — opacity + y 24→0 |
| `fadeUpSoft` | Body, cards — y 16→0 |
| `fadeIn` | Eyebrows — opacity + blur sutil |
| `scaleIn` | Stats, números |
| `mediaReveal` | Imagens — scale 1.05→1 |
| `heroStagger` / `heroLine` | Coreografia da hero |

Aliases legados: `reveal` → `fadeUpSoft`, `revealWide` → `fadeUp`.

## Componentes (`components/motion/reveal.tsx`)

- **`Reveal`** — bloco genérico com preset
- **`RevealText`** — linhas animadas (H1/H2 editorial)
- **`StaggerReveal`** — container com stagger no scroll
- **`RevealItem`** — filho de grid/lista
- **`RevealMedia`** — imagens com profundidade

## Intro + hero

1. `SiteIntro` dispara `grapeclinic:intro-ready` ao terminar (ou imediatamente se revisit)
2. `useSiteIntroReady()` libera a coreografia da hero
3. Primeira visita: stagger completo (~1.4s); revisit: entrada mais curta

## Reduced motion

- Lenis disabled
- GSAP durations via `gsapDuration()` → 0
- `Reveal*` renderizam `<div>` estático
- MotionConfig `reducedMotion="always"`

## Adding motion to new UI

1. Preferir `Reveal` / `StaggerReveal` antes de variants locais
2. Usar `MOTION.ease` + tokens de duração
3. Reservar GSAP + ScrollTrigger para scroll storytelling
4. `viewport: { once: true }` — nunca re-trigger a cada pixel
