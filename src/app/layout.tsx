import type { Metadata, Viewport } from "next";
import { Epilogue, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ConsentProvider } from "@/lib/consent";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsConsenso from "@/components/AnalyticsConsenso";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maeli Pizza | Forno a Legna Campocroce",
    template: "%s | Maeli Pizza",
  },
  description:
    "Pizzeria da asporto con autentico forno a legna a Campocroce di Mogliano Veneto (TV). Impasti artigianali dal 2003.",

  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: "#fcf9f8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${epilogue.variable} ${jakarta.variable}`}>
      <body className="bg-surface text-on-surface font-body-md antialiased">

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <ConsentProvider>
          <Header />
          {children}
          <Footer />
          <AnalyticsConsenso />
          <CookieConsent />
        </ConsentProvider>
      </body>
    </html>
  );
}
