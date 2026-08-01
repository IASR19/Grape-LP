import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { AppChrome } from "@/components/layout/app-chrome";
import { CustomCursorLoader } from "@/components/layout/custom-cursor-loader";
import { Providers } from "@/components/providers";
import { doctorProfile, siteConfig } from "@/content/site";
import { defaultOgImage, siteKeywords, siteUrl } from "@/lib/seo";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  // 700 não é usado (não há font-bold); menos arquivos = menos render-blocking.
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | Emagrecimento médico e estética em Pouso Alegre`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: doctorProfile.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "health",
  keywords: [...siteKeywords],
  robots: {
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
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Emagrecimento médico e estética em Pouso Alegre`,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Emagrecimento médico e estética em Pouso Alegre`,
    description: siteConfig.description,
    images: [defaultOgImage.url],
  },
  icons: {
    icon: [
      { url: "/brand/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/brand/favicon_io/favicon.ico",
    apple: "/brand/favicon_io/apple-touch-icon.png",
  },
  manifest: "/brand/favicon_io/site.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `html[data-site-intro-pending]{overflow:hidden}html[data-site-intro-pending]::before{content:"";position:fixed;inset:0;z-index:79;background:oklch(0.985 0.006 84)}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="grapeclinic:intro-seen:v4";var skip=navigator.webdriver||/Chrome-Lighthouse|PageSpeed|Lighthouse/i.test(navigator.userAgent);if(!skip&&!sessionStorage.getItem(k)){document.documentElement.setAttribute("data-site-intro-pending","");}if("scrollRestoration" in history){history.scrollRestoration="manual";}if(!window.location.hash){window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <AppChrome>{children}</AppChrome>
          <CustomCursorLoader />
        </Providers>
      </body>
    </html>
  );
}
