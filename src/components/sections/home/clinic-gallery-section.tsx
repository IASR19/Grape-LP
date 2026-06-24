"use client";

import Image from "next/image";

import { AnimatedHeading } from "@/components/motion/animated-heading";
import { Reveal } from "@/components/motion/reveal";
import { clinicPhotos } from "@/content/media";
import { homeCopy } from "@/content/site";
import { layout } from "@/lib/layout";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

type GalleryPhoto = {
  src: string;
  alt: string;
  objectPosition: string;
  priority?: boolean;
};

/** Ambientes reais da clínica — apenas fotos de espaço em `public/images/opt/spaces/`. */
const galleryPhotos = [
  {
    src: clinicPhotos.receptionWide,
    alt: "Recepção ampla da Grape Clinic com balcão curvo e iluminação integrada",
    objectPosition: "50% 50%",
    priority: true,
  },
  {
    src: clinicPhotos.ambiance,
    alt: "Consultório com espelho iluminado e ambiente acolhedor",
    objectPosition: "50% 50%",
  },
  {
    src: clinicPhotos.corridor,
    alt: "Corredor interno da Grape Clinic com lounge integrado",
    objectPosition: "50% 50%",
  },
  {
    src: clinicPhotos.treatmentRoom,
    alt: "Sala de atendimento com arquitetura curva e equipamentos clínicos",
    objectPosition: "50% 42%",
  },
] as const satisfies readonly GalleryPhoto[];

function GalleryTile({
  photo,
  className,
}: {
  photo: GalleryPhoto;
  className?: string;
}) {
  return (
    <figure className={className}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={photo.priority}
        sizes="(min-width: 1024px) 40vw, 50vw"
        className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-[1.015]"
        style={{ objectPosition: photo.objectPosition }}
      />
    </figure>
  );
}

export function ClinicGallerySection() {
  const [hero, consultorio, corridor, consultRoom] = galleryPhotos;

  return (
    <section
      id="galeria"
      className={cn(
        "relative w-full max-w-[100vw] overflow-hidden bg-transparent",
        layout.sectionBandStart,
        layout.gutter,
      )}
    >
      <div className={cn("mx-auto w-full", layout.container)}>
        <div className="max-w-2xl text-left">
          <Reveal preset="fadeUp">
            <p className={type.eyebrow}>Galeria da clínica</p>
          </Reveal>
          <AnimatedHeading
            text={homeCopy.galleryTitle}
            textAlign="left"
            className={cn(layout.proseAfterHeading, "max-w-2xl text-balance", type.section)}
          />
        </div>

        <div
          className={cn(
            layout.gridAfterProse,
            "max-sm:h-[min(78dvh,44rem)] max-sm:min-h-[min(72dvh,40rem)] sm:h-[min(62vh,34rem)] sm:min-h-[28rem] lg:min-h-[32rem]",
          )}
        >
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-1 sm:gap-1.5">
            <div className="grid min-h-0 grid-cols-6 grid-rows-2 gap-1 sm:grid-cols-12 sm:grid-rows-2 sm:gap-1.5">
              <GalleryTile
                photo={hero}
                className="relative col-span-6 row-span-1 min-h-0 overflow-hidden bg-muted sm:col-span-7 sm:row-span-2"
              />
              <GalleryTile
                photo={consultorio}
                className="relative col-span-6 row-span-1 min-h-0 overflow-hidden bg-muted sm:col-span-5 sm:col-start-8 sm:row-span-2"
              />
            </div>

            <div className="grid min-h-0 grid-cols-2 gap-1 sm:gap-1.5">
              <GalleryTile
                photo={corridor}
                className="relative min-h-0 overflow-hidden bg-muted"
              />
              <GalleryTile
                photo={consultRoom}
                className="relative min-h-0 overflow-hidden bg-muted"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
