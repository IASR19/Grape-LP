const CACHE_NAME = "grapeclinic-media-v2";

export const VIDEO_WARMED_EVENT = "grapeclinic:video-warmed";

const warmed = new Set<string>();
const videoBlobUrls = new Map<string, string>();

function stripQuery(url: string) {
  return url.split("?")[0] ?? url;
}

function dispatchVideoWarmed(url: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(VIDEO_WARMED_EVENT, { detail: { url: stripQuery(url) } }),
  );
}

async function putInCache(url: string, response: Response) {
  if (!("caches" in window)) return;

  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(url, response.clone());
  } catch {
    /* quota / private mode */
  }
}

async function fetchCached(url: string) {
  if ("caches" in window) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(url);
      if (hit) return hit;
    } catch {
      /* ignore */
    }
  }

  const response = await fetch(url);
  if (response.ok) {
    await putInCache(url, response);
  }

  return response;
}

export function preloadImage(url: string): Promise<void> {
  const key = stripQuery(url);
  if (warmed.has(key)) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      warmed.add(key);
      resolve();
    };

    void fetchCached(url)
      .then((response) => {
        if (!response.ok) {
          finish();
          return;
        }

        return response.blob().then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          const image = new Image();
          image.decoding = "async";
          image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            finish();
          };
          image.onerror = finish;
          image.src = objectUrl;
        });
      })
      .catch(finish);
  });
}

export function preloadVideo(url: string): Promise<void> {
  const key = stripQuery(url);
  if (warmed.has(key)) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = (blob?: Blob) => {
      if (blob && !videoBlobUrls.has(key)) {
        videoBlobUrls.set(key, URL.createObjectURL(blob));
        dispatchVideoWarmed(url);
      }
      warmed.add(key);
      resolve();
    };

    void fetchCached(url)
      .then(async (response) => {
        if (!response.ok) {
          finish();
          return;
        }

        const blob = await response.blob();
        finish(blob);
      })
      .catch(() => finish());
  });
}

export function preloadAsset(url: string): Promise<void> {
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
    return preloadVideo(url);
  }

  return preloadImage(url);
}

export async function preloadAssetsWithConcurrency(
  urls: readonly string[],
  concurrency = 4,
) {
  const queue = [...urls];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      if (url) await preloadAsset(url);
    }
  });

  await Promise.all(workers);
}

export async function preloadAssets(urls: readonly string[]) {
  await preloadAssetsWithConcurrency(urls, urls.length);
}

export function isMediaWarmed(url: string) {
  return warmed.has(stripQuery(url));
}

export function getWarmedVideoUrl(url: string) {
  return videoBlobUrls.get(stripQuery(url));
}

/** Resolve uma vez por sessão — blob se já aquecido, senão URL de rede. */
export function resolveHeroVideoSrc(url: string) {
  return getWarmedVideoUrl(url) ?? url;
}

export function warmAssetsInBackground(urls: readonly string[]) {
  if (typeof window === "undefined" || urls.length === 0) return;

  const run = () => {
    void preloadAssetsWithConcurrency(urls, 3);
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 1200);
  }
}
