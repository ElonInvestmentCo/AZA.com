import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { Features } from "@/components/sections/Features";
import { WhyPayVora } from "@/components/sections/WhyPayVora";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQPreview } from "@/components/sections/FAQPreview";
import { DownloadCTA } from "@/components/sections/DownloadCTA";

export const metadata: Metadata = {
  title: "PAYVORA – Nigeria's #1 Fintech App for Gift Cards & Bill Payments",
  description:
    "Trade gift cards instantly, pay any bill, recharge airtime, and get a free virtual dollar card. Join thousands of Nigerians using PAYVORA.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBanner />
      <Features />
      <WhyPayVora />
      <SecuritySection />
      <TestimonialsSection />
      <FAQPreview />
      <DownloadCTA />
    </>
  );
}
