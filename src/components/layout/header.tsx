"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { ExternalArrow } from "@/components/ui/external-arrow";
import { MapPin, X } from "lucide-react";

import { trapFocus } from "@/lib/a11y/focus-trap";
import {
  homeSections,
  menuContactLinks,
  siteConfig,
  sitePages,
} from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useHeroInView } from "@/hooks/use-hero-in-view";
import { getScrollY } from "@/lib/lenis";
import { layout } from "@/lib/layout";
import {
  animateMobileMenuClose,
  animateMobileMenuOpen,
  MOTION,
  setMobileMenuClosed,
  setMobileMenuOpen,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { zIndex } from "@/lib/z-index";
import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderEvaluationCta } from "@/components/layout/header-evaluation-cta";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function subscribe() {
  return () => undefined;
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function isExternalHref(href: string) {
  return href.startsWith("http");
}

type MenuLinkProps = {
  item: { label: string; href: string; description?: string };
  index: number;
  onNavigate: () => void;
  registerRef: (index: number, node: HTMLElement | null) => void;
  compact?: boolean;
  dense?: boolean;
};

function MenuLink({
  item,
  index,
  onNavigate,
  registerRef,
  compact,
  dense,
}: MenuLinkProps) {
  const external = isExternalHref(item.href);

  const className = cn(
    "group block text-left motion-safe:transition-colors motion-safe:duration-300",
    compact
      ? "flex min-h-11 items-center rounded-xl border border-border bg-card px-3.5 py-3 hover:border-primary/24 hover:bg-muted/40 sm:min-h-[3.25rem] sm:px-4"
      : dense
        ? "flex min-h-11 items-center py-2 sm:py-2.5"
        : "py-3",
  );

  const content = (
    <>
      <span className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "font-medium leading-tight text-foreground group-hover:text-primary",
            compact
              ? "text-sm sm:text-base"
              : dense
                ? "text-sm sm:text-base"
                : "text-2xl sm:text-[1.65rem]",
          )}
        >
          {item.label}
        </span>
        <ExternalArrow
          className="shrink-0 text-muted-foreground motion-safe:group-hover:text-primary"
          size={compact ? "sm" : "md"}
        />
      </span>
      {item.description && !dense ? (
        <span className="mt-1 block text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          {item.description}
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        ref={(node) => registerRef(index, node)}
        href={item.href}
        onClick={onNavigate}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={(node) => registerRef(index, node)}
      href={item.href}
      onClick={onNavigate}
      className={className}
    >
      {content}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();
  const inHero = useHeroInView();
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<HTMLElement[]>([]);
  const busyRef = useRef(false);
  const shouldAnimateInRef = useRef(false);

  const animatedItemCount =
    sitePages.length + homeSections.length + menuContactLinks.length;

  useScrollLock(open);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    if (open) {
      main.setAttribute("inert", "");
      main.setAttribute("aria-hidden", "true");
      return;
    }

    main.removeAttribute("inert");
    main.removeAttribute("aria-hidden");
  }, [open]);

  useEffect(() => {
    function onScroll() {
      if (open) {
        setHidden(false);
        return;
      }

      const currentScrollY = getScrollY();
      const delta = currentScrollY - lastScrollYRef.current;

      if (Math.abs(delta) < 8) return;

      setHidden(currentScrollY > 96 && delta > 0);
      lastScrollYRef.current = currentScrollY;
    }

    lastScrollYRef.current = getScrollY();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;

    const panel = panelRef.current;
    const accent = accentRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !accent || !backdrop) return;

    itemRefs.current = itemRefs.current.slice(0, animatedItemCount);

    const elements = {
      backdrop,
      panel,
      accent,
      items: itemRefs.current.filter(Boolean),
    };

    if (prefersReducedMotion || !shouldAnimateInRef.current) {
      setMobileMenuOpen(elements);
      shouldAnimateInRef.current = false;
      busyRef.current = false;
      return;
    }

    shouldAnimateInRef.current = false;
    busyRef.current = true;
    setMobileMenuClosed(elements);

    animateMobileMenuOpen(elements, () => {
      busyRef.current = false;
    });
  }, [animatedItemCount, mounted, open, prefersReducedMotion]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    return trapFocus(dialogRef.current);
  }, [open]);

  const registerItemRef = useCallback((index: number, node: HTMLElement | null) => {
    if (node) {
      itemRefs.current[index] = node;
    }
  }, []);

  const closeMenu = useCallback(() => {
    if (busyRef.current || !open) return;

    const panel = panelRef.current;
    const accent = accentRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !accent || !backdrop) {
      setOpen(false);
      menuButtonRef.current?.focus();
      return;
    }

    const elements = {
      backdrop,
      panel,
      accent,
      items: itemRefs.current.filter(Boolean),
    };

    if (prefersReducedMotion) {
      setOpen(false);
      menuButtonRef.current?.focus();
      return;
    }

    busyRef.current = true;
    animateMobileMenuClose(elements, () => {
      setOpen(false);
      busyRef.current = false;
      menuButtonRef.current?.focus();
    });
  }, [open, prefersReducedMotion]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) closeMenu();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, open]);

  function openMenu() {
    if (busyRef.current || open) return;
    shouldAnimateInRef.current = true;
    setHidden(false);
    setOpen(true);
  }

  function toggleMenu() {
    if (open) closeMenu();
    else openMenu();
  }

  let menuItemIndex = 0;

  const overlay =
    open && mounted
      ? createPortal(
          <div
            ref={dialogRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="fixed inset-0"
            style={{ zIndex: zIndex.menuBackdrop }}
          >
            <button
              ref={backdropRef}
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-black/0"
              onClick={closeMenu}
            />
            <div
              ref={accentRef}
              aria-hidden
              className="absolute inset-y-0 right-0 h-svh w-full bg-primary/22"
            />
            <div
              ref={panelRef}
              className="absolute inset-y-0 right-0 flex h-svh w-full flex-col overflow-hidden bg-background text-foreground"
            >
              <div
                className={cn(
                  "flex h-full min-h-0 flex-col",
                  layout.container,
                  layout.gutter,
                  "py-4 sm:py-6 lg:py-7",
                )}
              >
                <div className="flex shrink-0 items-center justify-between gap-3 sm:gap-4">
                  <Link href="/" onClick={closeMenu} aria-label="Grape Clinic início">
                    <BrandLogo width={150} height={48} className="w-[7.5rem] sm:w-32" />
                  </Link>
                  <div className="flex min-w-0 items-center gap-2">
                    <HeaderEvaluationCta
                      mobileVisible
                      onNavigate={closeMenu}
                      className="max-[420px]:hidden"
                    />
                    <ThemeToggle className="border-border/70 bg-card/80" />
                    <button
                      type="button"
                      aria-label="Fechar menu"
                      onClick={closeMenu}
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors duration-300 hover:bg-muted"
                      style={{ transitionTimingFunction: MOTION.easeCss }}
                    >
                      <X className="size-5" aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="mt-3 shrink-0 min-[421px]:hidden">
                  <HeaderEvaluationCta
                    mobileVisible
                    onNavigate={closeMenu}
                    className="w-full justify-center"
                  />
                </div>

                <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain sm:mt-6 lg:mt-7">
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-10">
                    <div className="hidden max-w-xs lg:block lg:py-1">
                      <p className="text-sm text-muted-foreground">{siteConfig.city}</p>
                      <p className="mt-2 text-pretty text-sm leading-6 text-foreground/84 sm:text-base sm:leading-7">
                        Clínica premium de estética, emagrecimento e cuidado médico
                        individualizado.
                      </p>
                    </div>

                    <div className="grid min-w-0 gap-6 sm:col-span-2 sm:grid-cols-2 sm:gap-x-10 lg:col-span-1 lg:col-start-2 lg:gap-x-12">
                      <nav aria-label="Páginas do site" className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                          Páginas
                        </p>
                        <div className="mt-2 grid gap-0.5 border-t border-border pt-3 sm:mt-3">
                          {sitePages.map((item) => {
                            const index = menuItemIndex++;
                            return (
                              <MenuLink
                                key={item.href}
                                item={item}
                                index={index}
                                dense
                                onNavigate={closeMenu}
                                registerRef={registerItemRef}
                              />
                            );
                          })}
                        </div>
                      </nav>

                      <nav aria-label="Seções da home" className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                          Explorar a home
                        </p>
                        <div className="mt-2 grid grid-cols-1 gap-0.5 border-t border-border pt-3 sm:mt-3 sm:grid-cols-2 sm:gap-x-6">
                          {homeSections.map((item) => {
                            const index = menuItemIndex++;
                            return (
                              <MenuLink
                                key={item.href}
                                item={item}
                                index={index}
                                dense
                                onNavigate={closeMenu}
                                registerRef={registerItemRef}
                              />
                            );
                          })}
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid shrink-0 gap-2 border-t border-border pt-4 sm:mt-5 sm:grid-cols-2 sm:pt-5">
                  {menuContactLinks.map((item) => {
                    const index = menuItemIndex++;
                    return (
                      <MenuLink
                        key={item.label}
                        item={item}
                        index={index}
                        compact
                        onNavigate={closeMenu}
                        registerRef={registerItemRef}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 hidden shrink-0 items-center justify-between gap-4 border-t border-border/70 pt-4 text-xs text-muted-foreground lg:flex">
                  <p className="max-w-md text-pretty leading-5">{siteConfig.address}</p>
                  <a
                    href={siteConfig.mapsHref}
                    className="inline-flex shrink-0 items-center gap-1.5 text-foreground transition-colors hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin className="size-3.5" aria-hidden />
                    Abrir no mapa
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 transition-transform duration-500",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
        style={{
          zIndex: zIndex.header,
          transitionTimingFunction: MOTION.easeCss,
          viewTransitionName: "site-header",
        }}
      >
        <div
          className={cn(
            "relative flex h-20 items-center justify-between",
            layout.container,
            layout.gutter,
          )}
        >
          <div className="flex min-w-0 items-center gap-8 lg:gap-10">
            <Link href="/" aria-label="Grape Clinic início" onClick={() => setOpen(false)}>
              <BrandLogo priority width={170} height={52} className="w-[7.5rem] sm:w-36" lockLight={inHero} />
            </Link>

            <nav
              aria-label="Páginas principais"
              className="hidden items-center gap-1 lg:flex"
            >
              {sitePages.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium motion-safe:transition-colors motion-safe:duration-300",
                    inHero
                      ? "text-white/78 hover:bg-white/10 hover:text-white"
                      : "text-foreground/72 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2.5">
            <ThemeToggle
              className={cn(
                "header-glass-btn hidden sm:grid",
                inHero
                  ? "header-glass-btn--hero border-white/26 bg-white/[0.16] text-white hover:bg-white/[0.22]"
                  : "header-glass-btn--default border-border/80 bg-background/80 text-foreground hover:bg-background/92",
              )}
            />
            <HeaderEvaluationCta inHero={inHero} onNavigate={() => setOpen(false)} />
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={toggleMenu}
              className={cn(
                "header-glass-btn inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold motion-safe:transition-[background-color,border-color,color] motion-safe:duration-500 sm:gap-4 sm:px-5",
                inHero
                  ? "header-glass-btn--hero border border-white/26 bg-white/[0.16] text-white hover:bg-white/[0.22]"
                  : "header-glass-btn--default border border-border/80 bg-background/80 text-foreground hover:border-primary/20 hover:bg-background/92",
              )}
              style={{ transitionTimingFunction: MOTION.easeCss }}
            >
              <span className="size-1.5 rounded-full bg-current opacity-55" aria-hidden />
              {open ? "Fechar" : "Menu"}
              <span className="size-1.5 rounded-full bg-current opacity-55" aria-hidden />
            </button>
          </div>
        </div>
      </header>
      {overlay}
    </>
  );
}
