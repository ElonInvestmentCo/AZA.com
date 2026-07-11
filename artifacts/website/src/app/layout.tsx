import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.payvora.org"),
  title: {
    default: "PAYVORA – Digital Fintech App for Nigeria",
    template: "%s | PAYVORA",
  },
  description:
    "PAYVORA is a premium fintech app for Nigeria. Buy gift cards, pay bills, recharge airtime, get virtual dollar cards, and manage your digital wallet.",
  keywords: [
    "buy gift cards in Nigeria",
    "best virtual dollar card",
    "cheap airtime recharge",
    "pay electricity bills online",
    "USDT to Naira",
    "digital banking app",
    "fintech app Nigeria",
    "virtual card Nigeria",
    "gift card trading Nigeria",
    "bill payment app Nigeria",
  ],
  authors: [{ name: "PAYVORA" }],
  creator: "PAYVORA",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.payvora.org",
    siteName: "PAYVORA",
    title: "PAYVORA – Digital Fintech App for Nigeria",
    description:
      "Buy gift cards, pay bills, recharge airtime, get virtual dollar cards, and manage your digital wallet.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PAYVORA – Digital Fintech App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PAYVORA – Digital Fintech App for Nigeria",
    description:
      "Buy gift cards, pay bills, recharge airtime, get virtual dollar cards, and manage your digital wallet.",
    images: ["/og-image.png"],
    creator: "@payvora",
  },
  icons: {
    icon: [
      { url: "/favicon-dark.png",  media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-dark.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#00D9A0" />
      </head>
      <body>
        <div className="noise-overlay"></div>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}