const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function trapFocus(container: HTMLElement) {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE),
  ).filter((node) => !node.hasAttribute("disabled"));

  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Tab" || nodes.length === 0) return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      return;
    }

    if (document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  container.addEventListener("keydown", onKeyDown);
  first?.focus();

  return () => {
    container.removeEventListener("keydown", onKeyDown);
  };
}
