"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RouteViewTransition } from "@/components/layout/route-view-transition";
import { SkipLink } from "@/components/ui/skip-link";
import { SITE_FOOTER_ID } from "@/hooks/use-footer-near-viewport";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isHub = pathname === "/hub";

  useEffect(() => {
    document.documentElement.toggleAttribute("data-hub-route", isHub);

    if (!isHub) return;

    window.scrollTo(0, 0);

    function stopLenis() {
      getLenis()?.stop();
    }

    stopLenis();
    const retryId = window.setInterval(() => {
      stopLenis();
      if (getLenis()) window.clearInterval(retryId);
    }, 100);

    return () => {
      window.clearInterval(retryId);
      getLenis()?.start();
    };
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
      <FloatingWhatsApp />
    </>
  );
}
