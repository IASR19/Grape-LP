"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const META_PIXEL_IDS = ["616785016453757", "3837288306411762"];

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      loaded: boolean;
      version: string;
      push: (...args: unknown[]) => void;
    };
    _fbq: Window["fbq"];
  }
}

/**
 * Inicializa o Meta Pixel e rastreia PageView a cada mudança de rota.
 * - O script inline (via next/script afterInteractive) dispara o PageView inicial.
 * - O useEffect com [pathname] dispara PageView nas navegações SPA subsequentes.
 * - Proteção contra reinicialização duplicada via `if(f.fbq)return` no próprio stub.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window.fbq !== "function") return;

    META_PIXEL_IDS.forEach((id) =>
      window.fbq("track", "PageView", {}, { eventID: id }),
    );
  }, [pathname]);

  const initScript = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');${META_PIXEL_IDS.map((id) => `fbq('init','${id}');`).join("")}fbq('track','PageView');`;

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
      {META_PIXEL_IDS.map((id) => (
        <noscript key={id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      ))}
    </>
  );
}
