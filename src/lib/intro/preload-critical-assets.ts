import { clinicPhotos, mediaAssets } from "@/content/media";
import {
  preloadAssetsWithConcurrency,
  preloadVideo,
  warmAssetsInBackground,
} from "@/lib/intro/media-cache";

function collectMediaSrc(value: unknown, urls: Set<string>) {
  if (!value || typeof value !== "object") return;

  if ("src" in value && typeof value.src === "string" && value.src.startsWith("/")) {
    urls.add(value.src.split("?")[0]!);
  }

  if ("poster" in value && typeof value.poster === "string" && value.poster.startsWith("/")) {
    urls.add(value.poster);
  }

  if ("thumbSrc" in value && typeof value.thumbSrc === "string" && value.thumbSrc.startsWith("/")) {
    urls.add(value.thumbSrc);
  }

  for (const nested of Object.values(value)) {
    collectMediaSrc(nested, urls);
  }
}

function uniqueUrls(urls: Iterable<string>) {
  return [...new Set(urls)];
}

const heroVideoSrc = mediaAssets.heroClinicVideo.src!;
const heroPosterSrc = mediaAssets.heroClinicVideo.poster!;

/** Tier 1: vídeo primeiro, depois poster e logos. */
export function getCriticalIntroAssets() {
  return [
    heroVideoSrc,
    heroPosterSrc,
    "/brand/grapeclinic-logo-dark.svg",
    "/brand/grapeclinic-logo-light.svg",
  ] as const;
}

/** Tier 2: restante da home, carregado após reveal sem bloquear. */
export function getDeferredHomeAssets() {
  const urls = new Set<string>([clinicPhotos.grapeMethod]);
  collectMediaSrc(mediaAssets, urls);

  for (const critical of getCriticalIntroAssets()) {
    urls.delete(critical.split("?")[0]!);
  }

  return uniqueUrls(urls);
}

export const criticalIntroAssets = getCriticalIntroAssets();
export const deferredHomeAssets = getDeferredHomeAssets();

export function preloadCriticalAssets(timeoutMs = 8_000) {
  const [, ...restAfterVideo] = criticalIntroAssets;

  return Promise.race([
    (async () => {
      await preloadVideo(heroVideoSrc);
      await preloadAssetsWithConcurrency(restAfterVideo, 2);
    })(),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

export function warmDeferredAssets() {
  warmAssetsInBackground(deferredHomeAssets);
}

/** Aquecimento leve quando o intro é pulado (mesma sessão). */
export function warmHeroOnReturnVisit() {
  void (async () => {
    await preloadVideo(heroVideoSrc);
    await preloadAssetsWithConcurrency(
      [heroPosterSrc, "/brand/grapeclinic-logo-dark.svg", "/brand/grapeclinic-logo-light.svg"],
      2,
    );
  })();
  warmDeferredAssets();
}
