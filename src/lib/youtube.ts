const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:shorts\/|embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/;

export function extractYoutubeId(urlOrId: string) {
  const trimmed = urlOrId.trim();
  const match = trimmed.match(YOUTUBE_ID_PATTERN);
  if (match?.[1]) return match[1];
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export function youtubeThumbnail(id: string, quality: "hq" | "max" = "hq") {
  const file = quality === "max" ? "maxresdefault.jpg" : "hqdefault.jpg";
  return `https://i.ytimg.com/vi/${id}/${file}`;
}

export function youtubeEmbedUrl(id: string, autoplay = true) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    enablejsapi: "0",
  });

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function youtubeShortsUrl(id: string) {
  return `https://www.youtube.com/shorts/${id}`;
}
