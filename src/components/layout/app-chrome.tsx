"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RouteViewTransition } from "@/components/layout/route-view-transition";
import { SkipLink } from "@/components/ui/skip-link";
import { SITE_FOOTER_ID } from "@/hooks/use-footer-near-viewport";
import { cn } from "@/lib/utils";

const FloatingWhatsApp = dynamic(
  () =>
    import("@/components/layout/floating-whatsapp").then(
      (mod) => mod.FloatingWhatsApp,
    ),
  { ssr: false },
);

const LeadPopup = dynamic(
  () =>
    import("@/components/layout/lead-popup").then((mod) => mod.LeadPopup),
  { ssr: false },
);

type AppChromeProps = {
  children: React.ReactNode;
};

function useIdleChromeWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => setReady(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(enable, { timeout: 2800 });
    } else {
      timeoutId = window.setTimeout(enable, 1200);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isHub = pathname === "/hub";
  const chromeWidgetsReady = useIdleChromeWidgets();

  useEffect(() => {
    document.documentElement.toggleAttribute("data-hub-route", isHub);

    if (!isHub) return;

    window.scrollTo(0, 0);
  }, [isHub]);

  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "relative flex flex-col",
          isHub
            ? "flex h-[100dvh] max-h-[100dvh] min-h-0 flex-1 flex-col overflow-hidden"
            : "flex-1",
        )}
      >
        <RouteViewTransition>
          {isHub ? (
            <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>
          ) : (
            children
          )}
        </RouteViewTransition>
      </main>
      {!isHub ? <Footer id={SITE_FOOTER_ID} /> : null}
      {chromeWidgetsReady ? (
        <>
          <FloatingWhatsApp />
          {!isHub ? <LeadPopup /> : null}
        </>
      ) : null}
    </>
  );
}
