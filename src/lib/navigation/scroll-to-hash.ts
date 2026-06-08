import { getLenis } from "@/lib/lenis";

const HEADER_OFFSET_PX = 80;

export function scrollToHash(hash: string, immediate = false) {
  if (!hash.startsWith("#")) return false;

  const target = document.querySelector(hash);
  if (!target) return false;

  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(target as HTMLElement, {
      offset: -HEADER_OFFSET_PX,
      immediate,
    });
    return true;
  }

  const top =
    target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  return true;
}

export function initHashNavigation() {
  function handleClick(event: MouseEvent) {
    const anchor = (event.target as HTMLElement | null)?.closest("a[href*='#']");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname !== window.location.pathname) return;
    if (!url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    scrollToHash(url.hash);
  }

  document.addEventListener("click", handleClick);

  return () => document.removeEventListener("click", handleClick);
}

export function scrollToInitialHash() {
  if (!window.location.hash) return;

  const hash = window.location.hash;
  let attempts = 0;
  const maxAttempts = 24;

  function tryScroll() {
    if (scrollToHash(hash, true)) return;

    attempts += 1;
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 50);
    }
  }

  requestAnimationFrame(tryScroll);
}
