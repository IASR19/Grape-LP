import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  /** Mantem o logo claro, ignorando o tema — usado sobre a hero escura. */
  lockLight?: boolean;
  /** Mantem o logo escuro — usado sobre superficies claras fixas. */
  lockDark?: boolean;
  /** Inverte a logica do tema para superficies `bg-primary` (footer). */
  onPrimary?: boolean;
};

export function BrandLogo({
  priority = false,
  className,
  width = 180,
  height = 55,
  lockLight = false,
  lockDark = false,
  onPrimary = false,
}: BrandLogoProps) {
  if (lockDark) {
    return (
      <Image
        src="/brand/grapeclinic-logo-dark.svg"
        alt="Grape Clinic"
        width={width}
        height={height}
        priority={priority}
        className={cn("block h-auto", className)}
      />
    );
  }

  if (lockLight) {
    return (
      <Image
        src="/brand/grapeclinic-logo-light.svg"
        alt="Grape Clinic"
        width={width}
        height={height}
        priority={priority}
        className={cn("block h-auto", className)}
      />
    );
  }

  if (onPrimary) {
    return (
      <>
        <Image
          src="/brand/grapeclinic-logo-light.svg"
          alt="Grape Clinic"
          width={width}
          height={height}
          priority={priority}
          className={cn("block h-auto dark:hidden", className)}
        />
        <Image
          src="/brand/grapeclinic-logo-dark.svg"
          alt="Grape Clinic"
          width={width}
          height={height}
          priority={priority}
          className={cn("hidden h-auto dark:block", className)}
        />
      </>
    );
  }

  return (
    <>
      <Image
        src="/brand/grapeclinic-logo-dark.svg"
        alt="Grape Clinic"
        width={width}
        height={height}
        priority={priority}
        className={cn("block h-auto dark:hidden", className)}
      />
      <Image
        src="/brand/grapeclinic-logo-light.svg"
        alt="Grape Clinic"
        width={width}
        height={height}
        priority={priority}
        className={cn("hidden h-auto dark:block", className)}
      />
    </>
  );
}
