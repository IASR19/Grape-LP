"use client";

import { ChevronUp, FilePenLine } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { HomeSectionLink } from "@/components/navigation/home-section-link";
import { siteConfig } from "@/content/site";
import { scrollToTop } from "@/lib/navigation/scroll-to-hash";
import { getScrollY } from "@/lib/scroll";
import { zIndex } from "@/lib/z-index";
import { cn } from "@/lib/utils";

const BACK_TO_TOP_THRESHOLD_PX = 320;

const subtleFabButtonClass =
  "flex size-11 items-center justify-center rounded-full border border-border/30 bg-background/20 text-foreground/65 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150 transition-[opacity,transform,colors,background-color,border-color] duration-300 ease-out hover:border-border/45 hover:bg-background/35 hover:text-foreground/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function subtleFabRevealClass(visible: boolean) {
  return visible
    ? "translate-y-0 opacity-100"
    : "pointer-events-none translate-y-2 opacity-0";
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type PrimaryPulseFabProps = {
  href: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
};

function PrimaryPulseFabLink({
  href,
  ariaLabel,
  className,
  children,
}: PrimaryPulseFabProps) {
  return (
    <HomeSectionLink
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group relative flex size-14 items-center justify-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="fab-primary-ring absolute inset-0 rounded-full bg-cta-accent"
      />
      <span
        aria-hidden="true"
        className="fab-primary-ring fab-primary-ring-delay absolute inset-0 rounded-full bg-cta-accent"
      />

      <span
        className={cn(
          "fab-primary-btn relative flex size-14 items-center justify-center rounded-full",
          "bg-cta-accent text-cta-accent-foreground",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-105",
          "group-active:scale-95",
        )}
      >
        {children}
      </span>
    </HomeSectionLink>
  );
}

export function FloatingWhatsApp() {
  const [hideNearContact, setHideNearContact] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const contactSection = document.getElementById("contato");
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideNearContact(entry.isIntersecting);
      },
      {
        rootMargin: "-18% 0px -18% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function updateBackToTopVisibility() {
      setShowBackToTop(getScrollY() > BACK_TO_TOP_THRESHOLD_PX);
    }

    updateBackToTopVisibility();
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTopVisibility);
  }, []);


  const hidden = hideNearContact;

  return (
    <div
      className={cn(
        "fixed right-4 bottom-[max(0.625rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3 sm:right-6 sm:bottom-[max(1rem,env(safe-area-inset-bottom))]",
        "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden && "pointer-events-none translate-y-4 opacity-0",
      )}
      style={{ zIndex: zIndex.fab }}
    >
      <button
        type="button"
        aria-label="Voltar ao início da página"
        onClick={() => scrollToTop(false)}
        className={cn(subtleFabButtonClass, subtleFabRevealClass(showBackToTop))}
      >
        <ChevronUp className="size-5" strokeWidth={2.25} aria-hidden="true" />
      </button>

      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={siteConfig.whatsappLabel}
        className={subtleFabButtonClass}
      >
        <WhatsAppIcon className="size-5" />
      </a>

      <PrimaryPulseFabLink
        href={siteConfig.evaluationFormHref}
        ariaLabel="Solicitar avaliação"
        className="mt-5"
      >
        <FilePenLine className="size-7" strokeWidth={1.75} aria-hidden="true" />
      </PrimaryPulseFabLink>
    </div>
  );
}
