import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type MockImageVariant = "muted" | "secondary" | "primary";

type MockImageProps = {
  label?: string;
  variant?: MockImageVariant;
  src?: string;
  sizes?: string;
  className?: string;
};

const variants: Record<MockImageVariant, string> = {
  muted: "bg-muted",
  secondary: "bg-secondary",
  primary: "bg-primary/18 dark:bg-primary/24",
};

export function MockImage({
  label = "Imagem provisória",
  variant = "muted",
  src,
  sizes = "100vw",
  className,
}: MockImageProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative h-full min-h-0 w-full overflow-hidden",
          className,
        )}
      >
        <Image
          src={src}
          alt={label}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden",
        variants[variant],
        className,
      )}
      aria-label={label}
      role="img"
    >
      <ImageIcon
        className="size-14 text-foreground opacity-[0.12] sm:size-16"
        strokeWidth={1.25}
        aria-hidden
      />
    </div>
  );
}
