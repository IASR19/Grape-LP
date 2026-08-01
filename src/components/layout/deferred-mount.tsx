"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type DeferredMountProps = {
  children: ReactNode;
  /** Antecedência do IntersectionObserver. */
  rootMargin?: string;
  /** Reserva espaço antes do mount para reduzir CLS. */
  minHeight?: CSSProperties["minHeight"];
  className?: string;
};

function readHasHash() {
  if (typeof window === "undefined") return false;
  return Boolean(window.location.hash);
}

/**
 * Monta children só perto do viewport — adia download/parse de chunks pesados.
 * Se a URL já tem hash (ex.: /#contato), monta na hora para o scroll funcionar.
 */
export function DeferredMount({
  children,
  rootMargin = "480px 0px",
  minHeight,
  className,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(readHasHash);

  useEffect(() => {
    if (mounted) return;

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setMounted(true));
      return;
    }

    const mount = () => setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        mount();
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(node);
    window.addEventListener("hashchange", mount);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", mount);
    };
  }, [mounted, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={!mounted && minHeight ? { minHeight } : undefined}
    >
      {mounted ? children : null}
    </div>
  );
}
