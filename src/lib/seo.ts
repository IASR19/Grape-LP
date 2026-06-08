import type { Metadata } from "next";

import { doctorProfile, siteConfig } from "@/content/site";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://grapeclinic.vercel.app";

export const defaultOgImage = {
  url: "/images/opt/hero/foto-da-clinica.jpg",
  width: 1200,
  height: 630,
  alt: "Ambiente da Grape Clinic em Pouso Alegre, MG",
} as const;

export const siteKeywords = [
  "Grape Clinic",
  "clínica de estética Pouso Alegre",
  "emagrecimento médico Pouso Alegre",
  "estética corporal Pouso Alegre",
  "saúde metabólica",
  "avaliação médica individual",
  "Dra. Marcela Ferreira",
  "clínica médica MG",
] as const;

function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageSeoInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords?: readonly string[];
  ogImage?: typeof defaultOgImage;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = siteKeywords,
  ogImage = defaultOgImage,
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...keywords],
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: absoluteUrl(ogImage.url),
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage.url)],
    },
  };
}

export function medicalClinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${siteUrl}/#clinic`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    image: absoluteUrl(defaultOgImage.url),
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Cel. Brito Filho, n°461 - e 469 - Fátima",
      addressLocality: "Pouso Alegre",
      addressRegion: "MG",
      postalCode: "37554-246",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -22.2244861,
      longitude: -45.9233982,
    },
    areaServed: {
      "@type": "City",
      name: "Pouso Alegre",
    },
    medicalSpecialty: ["WeightLoss", "Endocrinology", "Dermatology"],
    sameAs: [
      siteConfig.instagramHref,
      siteConfig.youtubeHref,
      siteConfig.mapsHref,
    ],
    founder: {
      "@type": "Person",
      name: doctorProfile.name,
      jobTitle: "Médica",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${siteUrl}/#clinic`,
    },
  };
}

export function hubWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Hub | ${siteConfig.name}`,
    description:
      "Principais links da Grape Clinic: avaliação, tratamentos, localização e canais oficiais.",
    url: absoluteUrl("/link-bio"),
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#clinic`,
    },
    inLanguage: "pt-BR",
  };
}

export function faqJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
