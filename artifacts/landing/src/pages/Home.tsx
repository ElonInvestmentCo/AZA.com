import { Hero } from "../sections/Hero";
import { StatsBanner } from "../sections/StatsBanner";
import { Features } from "../sections/Features";
import { WhyPayVora } from "../sections/WhyPayVora";
import { SecuritySection } from "../sections/SecuritySection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { FAQPreview } from "../sections/FAQPreview";
import { DownloadCTA } from "../sections/DownloadCTA";

export function Home() {
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
