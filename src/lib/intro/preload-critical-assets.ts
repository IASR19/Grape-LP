import { mediaAssets } from "@/content/media";
import {
  preloadAssetsWithConcurrency,
  preloadVideo,
} from "@/lib/intro/media-cache";

const heroVideoSrc = mediaAssets.heroClinicVideo.src!;

/**
 * Tier 1 — só logos do intro.
 * Poster da hero fica com `priority` no next/image (evita fetch duplicado
 * do arquivo estático competindo com `/_next/image`).
 */
export function getCriticalIntroAssets() {
  return [
    "/brand/grapeclinic-logo-dark.svg",
    "/brand/grapeclinic-logo-light.svg",
  ] as const;
}

export const criticalIntroAssets = getCriticalIntroAssets();

export function preloadCriticalAssets(timeoutMs = 8_000) {
  return Promise.race([
    preloadAssetsWithConcurrency(criticalIntroAssets, 2),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

function canWarmHeroVideoInBackground() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return false;
  if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
    return false;
  }

  return true;
}

/** Aquecimento do MP4 da hero só em desktop, em idle — nunca no critical path. */
export function warmHeroVideoInBackground() {
  if (!canWarmHeroVideoInBackground()) return;

  const run = () => {
    void preloadVideo(heroVideoSrc);
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 3500 });
  } else {
    window.setTimeout(run, 1500);
  }
}

/** Aquecimento leve quando o intro é pulado (mesma sessão). Sem pré-baixar o poster. */
export function warmHeroOnReturnVisit() {
  void preloadAssetsWithConcurrency([...criticalIntroAssets], 2);
  warmHeroVideoInBackground();
}
