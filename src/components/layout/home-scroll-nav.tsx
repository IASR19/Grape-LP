"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  homeScrollNavItems,
  homeScrollNavSectionIds,
} from "@/content/home-scroll-nav";
import { useActiveSection } from "@/hooks/use-active-section";
import { scrollToHash } from "@/lib/navigation/scroll-to-hash";
import { zIndex } from "@/lib/z-index";
import { cn } from "@/lib/utils";

function useIntroBlocksNav() {
  const [blocked, setBlocked] = useState(true);

  useEffect(() => {
    const read = () => {
      const html = document.documentElement;
      setBlocked(
        html.hasAttribute("data-site-intro-pending") ||
          html.hasAttribute("data-site-intro-revealing") ||
          Boolean(document.querySelector("[data-site-intro-root]")),
      );
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-site-intro-pending", "data-site-intro-revealing"],
    });

    return () => observer.disconnect();
  }, []);

  return blocked;
}

export function HomeScrollNav() {
  const pathname = usePathname();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const blockedByIntro = useIntroBlocksNav();
  const activeId = useActiveSection(homeScrollNavSectionIds);
  const activeLabel =
    homeScrollNavItems.find((item) => item.hash.slice(1) === activeId)?.label ??
    homeScrollNavItems[0]?.label;

  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const expanded = pinnedOpen || hovered;

  const close = useCallback(() => setPinnedOpen(false), []);

  useEffect(() => {
    if (!pinnedOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, pinnedOpen]);

  if (pathname !== "/" || blockedByIntro) return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "home-scroll-nav pointer-events-none fixed hidden lg:block",
        expanded && "home-scroll-nav--expanded",
      )}
      data-active-label={activeLabel}
      style={{ zIndex: zIndex.scrollNav }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setHovered(false);
        }
      }}
    >
      <nav
        aria-label="Navegação por seções da página inicial"
        className="home-scroll-nav__shell pointer-events-auto"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setPinnedOpen(false);
          }
        }}
      >
        <div className="home-scroll-nav__track">
          <button
            type="button"
            className="home-scroll-nav__grip"
            aria-controls={listId}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? "Fechar navegação por seções"
                : "Abrir navegação por seções"
            }
            onClick={(event) => {
              event.stopPropagation();
              setPinnedOpen((open) => !open);
            }}
          >
            <span className="home-scroll-nav__grip-orbit" aria-hidden>
              {homeScrollNavItems.map((item) => {
                const sectionId = item.hash.slice(1);
                const active = activeId === sectionId;

                return (
                  <span
                    key={item.hash}
                    className={cn(
                      "home-scroll-nav__grip-dot",
                      active && "home-scroll-nav__grip-dot--active",
                    )}
                  />
                );
              })}
            </span>
          </button>

          <ul
            id={listId}
            className="home-scroll-nav__links flex flex-col gap-0.5"
            aria-hidden={!expanded}
            inert={!expanded ? true : undefined}
          >
            {homeScrollNavItems.map((item) => {
              const sectionId = item.hash.slice(1);
              const active = activeId === sectionId;

              return (
                <li key={item.hash}>
                  <a
                    href={item.hash}
                    tabIndex={expanded ? 0 : -1}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      scrollToHash(item.hash);
                      close();
                      setHovered(false);
                    }}
                    className={cn(
                      "group/link flex items-center gap-2.5 rounded-lg py-2 pl-2 pr-2.5 text-[0.8125rem] leading-none transition-[background-color,color] duration-300",
                      active
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                    aria-current={active ? "location" : undefined}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 shrink-0 rounded-full transition-[transform,background-color] duration-300",
                        active
                          ? "scale-125 bg-primary"
                          : "bg-border group-hover/link:bg-primary/45",
                      )}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
