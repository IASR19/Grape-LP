import Link from "next/link";
import type { CSSProperties } from "react";
import { Camera, MapPin, MessageCircle, PlayCircle, Star } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { ExternalArrow } from "@/components/ui/external-arrow";
import {
  doctorProfile,
  formatDoctorRegistrationLabel,
  footerNavItems,
  siteConfig,
} from "@/content/site";
import { layout } from "@/lib/layout";
import { newWindowHint } from "@/lib/a11y";
import { cn } from "@/lib/utils";

const footerSocialLinks = [
  { label: "Instagram", href: siteConfig.instagramHref, icon: Camera },
  { label: "YouTube", href: siteConfig.youtubeHref, icon: PlayCircle },
  { label: "WhatsApp", href: siteConfig.whatsappHref, icon: MessageCircle },
  { label: "Google", href: siteConfig.reviewsHref, icon: Star },
] as const;

type FooterProps = {
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export function Footer({ id, className, style }: FooterProps) {
  return (
    <footer
      id={id}
      className={cn(
        "border-t border-border bg-primary text-primary-foreground",
        className,
      )}
      style={style}
    >
      <div className={cn(layout.container, layout.gutter, "py-9 lg:py-12")}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-end lg:gap-10">
          <div>
            <BrandLogo onPrimary className="w-36" />
            <p className="mt-7 max-w-2xl text-balance font-sans text-[clamp(1.65rem,7.5vw,3.65rem)] font-medium leading-[1.06] sm:text-[clamp(2rem,4vw,3.65rem)] sm:leading-[1.02]">
              Uma avaliação individual é o melhor começo.
            </p>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-primary-foreground/72 sm:text-base">
              A equipe entende seu momento, orienta o próximo passo e indica se
              a Grape Clinic é o caminho certo para você.
            </p>
          </div>

          <aside className="flex w-full flex-col gap-4 lg:justify-self-end">
            <Link
              href={siteConfig.evaluationFormHref}
              className="group flex min-h-[3.75rem] items-center justify-between gap-4 rounded-xl bg-primary-foreground px-4 py-3.5 text-primary motion-safe:transition motion-safe:duration-300 motion-safe:hover:bg-primary-foreground/92 sm:min-h-[4.25rem] sm:px-5 sm:py-4"
            >
              <span className="min-w-0">
                <span className="block text-base font-medium leading-tight sm:text-lg">
                  Solicitar avaliação
                </span>
                <span className="mt-1 block text-sm leading-5 text-primary/70">
                  Falar com a equipe
                </span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground motion-safe:transition motion-safe:duration-300 group-hover:scale-105 sm:size-11">
                <ExternalArrow />
              </span>
            </Link>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 sm:overflow-hidden sm:rounded-xl sm:border sm:border-primary-foreground/14 sm:divide-x sm:divide-primary-foreground/14">
              {footerSocialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label}. ${newWindowHint}`}
                    className="flex min-h-11 flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-center transition-colors hover:bg-primary-foreground/10 sm:min-h-[4.25rem] sm:rounded-none sm:px-3"
                  >
                    <Icon
                      className="size-4 text-primary-foreground/88"
                      aria-hidden
                    />
                    <span className="text-xs font-medium leading-none text-primary-foreground/76">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-6 border-t border-primary-foreground/14 pt-6 sm:grid-cols-2 lg:items-start">
          <nav aria-label="Páginas do site">
            <p className="text-sm font-medium text-primary-foreground">
              Navegação
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex min-h-9 items-center gap-1.5 py-1 text-sm text-primary-foreground/66 transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                    <ExternalArrow
                      size="sm"
                      className="opacity-0 motion-safe:group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="text-sm not-italic leading-6 text-primary-foreground/72 sm:text-right">
            <p className="font-medium text-primary-foreground">
              {siteConfig.city}
            </p>
            <p className="mt-2 text-pretty">{siteConfig.address}</p>
            <a
              href={siteConfig.mapsHref}
              className="group mt-2 inline-flex min-h-10 items-center gap-1.5 text-primary-foreground transition-colors hover:text-primary-foreground/82"
            >
              <MapPin className="size-3.5 shrink-0" />
              Como chegar
              <ExternalArrow size="sm" />
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-primary-foreground/14">
        <div
          className={cn(
            "flex flex-col gap-1 text-xs text-primary-foreground/58 sm:flex-row sm:items-center sm:justify-between",
            layout.container,
            layout.gutter,
            "py-4",
          )}
        >
          <p>
            © {new Date().getFullYear()} Grape Clinic. Todos os direitos
            reservados.
          </p>
          <p>CNPJ {siteConfig.cnpj}</p>
          <div className="text-right">
            <p>{doctorProfile.name}</p>
            <p>{formatDoctorRegistrationLabel()}</p>
            <p>{doctorProfile.primarySpecialty}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
