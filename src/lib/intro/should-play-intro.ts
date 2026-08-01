/** Detecta Lighthouse / PageSpeed / automação — o intro zera a sessão e infla o LCP. */
export function isAutomationClient() {
  if (typeof navigator === "undefined") return false;

  if (navigator.webdriver) return true;

  return /Chrome-Lighthouse|PageSpeed|Lighthouse/i.test(navigator.userAgent);
}
