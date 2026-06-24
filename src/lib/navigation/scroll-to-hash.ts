import { getLenis, getScrollY } from "@/lib/lenis";

const HEADER_OFFSET_PX = 80;
/** Respiro abaixo do header fixo ao ancorar no formulário. */
const FORM_ANCHOR_OFFSET_PX = 96;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function anchorScrollDuration(distance: number) {
  return Math.min(2.2, Math.max(0.9, distance / 1800));
}

function resolveScrollTarget(hash: string): HTMLElement | null {
  if (hash === "#contato") {
    return (
      document.getElementById("contato-form") ??
      document.getElementById("contato")
    );
  }

  const target = document.querySelector(hash);
  return target instanceof HTMLElement ? target : null;
}

function getScrollOffset(hash: string) {
  if (hash === "#contato" || hash === "#contato-form") {
    return FORM_ANCHOR_OFFSET_PX;
  }

  return HEADER_OFFSET_PX;
}

export function initScrollRestoration() {
  if (typeof history === "undefined" || !("scrollRestoration" in history)) return;
  history.scrollRestoration = "manual";
}

export function scrollToTop(immediate = true) {
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }

  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToHash(hash: string, immediate = false) {
  if (!hash.startsWith("#")) return false;

  const target = resolveScrollTarget(hash);
  if (!target) return false;

  const offset = getScrollOffset(hash);
  const lenis = getLenis();

  if (lenis) {
    const targetTop =
      target.getBoundingClientRect().top + getScrollY() - offset;
    const distance = Math.abs(targetTop - getScrollY());

    lenis.scrollTo(target, {
      offset: -offset,
      immediate,
      duration: immediate ? undefined : anchorScrollDuration(distance),
      easing: immediate ? undefined : easeOutCubic,
      lock: !immediate,
    });
    return true;
  }

  const top =
    target.getBoundingClientRect().top + window.scrollY - offset;
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

    const target = resolveScrollTarget(url.hash);
    if (!target) return;

    event.preventDefault();
    scrollToHash(url.hash);
  }

  document.addEventListener("click", handleClick);

  return () => document.removeEventListener("click", handleClick);
}

export function scrollToInitialHash() {
  if (!window.location.hash) {
    scrollToTop(true);
    return;
  }

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
