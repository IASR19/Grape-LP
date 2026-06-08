import { youtubeEmbedUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

type YoutubeEmbedProps = {
  videoId: string;
  title: string;
  autoplay?: boolean;
  className?: string;
};

export function YoutubeEmbed({
  videoId,
  title,
  autoplay = true,
  className,
}: YoutubeEmbedProps) {
  return (
    <iframe
      src={youtubeEmbedUrl(videoId, autoplay)}
      title={title}
      className={cn("absolute inset-0 h-full w-full border-0", className)}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
