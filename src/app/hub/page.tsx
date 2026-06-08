import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { LinkBioBento } from "@/components/sections/link-bio-bento";
import { createPageMetadata, hubWebPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hub de links",
  description:
    "Principais links da Grape Clinic: solicitar avaliação, tratamentos, localização, Instagram, YouTube e WhatsApp.",
  path: "/hub",
  keywords: [
    "Grape Clinic links",
    "Grape Clinic Instagram",
    "agendar avaliação Grape Clinic",
    "clínica estética Pouso Alegre",
  ],
});

export default function HubPage() {
  return (
    <>
      <JsonLd data={hubWebPageJsonLd()} />
      <LinkBioBento />
    </>
  );
}
