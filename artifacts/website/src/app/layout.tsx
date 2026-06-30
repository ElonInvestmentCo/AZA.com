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
  metadataBase: new URL("https://payvora.com"),
  title: {
    default: "PayVora – Digital Fintech App for Nigeria",
    template: "%s | PayVora",
  },
  description:
    "PayVora is a premium fintech app for Nigeria. Buy gift cards, pay bills, recharge airtime, get virtual dollar cards, and manage your digital wallet.",
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
  authors: [{ name: "PayVora" }],
  creator: "PayVora",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://payvora.com",
    siteName: "PayVora",
    title: "PayVora – Digital Fintech App for Nigeria",
    description:
      "Buy gift cards, pay bills, recharge airtime, get virtual dollar cards, and manage your digital wallet.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PayVora – Digital Fintech App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayVora – Digital Fintech App for Nigeria",
    description:
      "Buy gift cards, pay bills, recharge airtime, get virtual dollar cards, and manage your digital wallet.",
    images: ["/og-image.png"],
    creator: "@payvora",
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#00D9A0" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
