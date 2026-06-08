"use client";

import { usePathname } from "next/navigation";

import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RouteViewTransition } from "@/components/layout/route-view-transition";
import { SkipLink } from "@/components/ui/skip-link";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isHub = pathname === "/link-bio";

  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "flex flex-col",
          isHub
            ? "flex min-h-0 flex-1 flex-col max-lg:h-dvh max-lg:max-h-dvh lg:h-svh lg:max-h-svh lg:overflow-hidden"
            : "flex-1",
        )}
      >
        <RouteViewTransition>
          {isHub ? (
            <div className="flex h-full min-h-0 flex-1 flex-col">
              {children}
            </div>
          ) : (
            children
          )}
        </RouteViewTransition>
      </main>
      {!isHub ? <Footer /> : null}
      <FloatingWhatsApp />
    </>
  );
}
