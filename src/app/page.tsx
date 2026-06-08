import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { PremiumHome } from "@/components/sections/premium-home";
import { faqs, siteConfig } from "@/content/site";
import {
  createPageMetadata,
  faqJsonLd,
  medicalClinicJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Clínica de emagrecimento médico e estética em Pouso Alegre",
  description: siteConfig.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={[websiteJsonLd(), medicalClinicJsonLd(), faqJsonLd(faqs.slice(0, 5))]}
      />
      <PremiumHome />
    </>
  );
}
