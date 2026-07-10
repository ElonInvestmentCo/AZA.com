import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Tag, ArrowLeftRight, TrendingUp, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Buy & Sell Gift Cards",
  description: "Trade Amazon, iTunes, Steam, and other gift cards instantly at the best market rates in Nigeria.",
};

export default function GiftCardsPage() {
  const brands = ["Amazon", "Apple", "Steam", "Google Play", "PlayStation", "Xbox", "Sephora", "Razer Gold"];

  return (
    <div className="pt-32 pb-24 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <FadeIn className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-[#8b5cf6] blur-[100px] opacity-20 rounded-full"></div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-surface)]">
              <Image 
                src="/images/feature-gift-cards.png" 
                alt="Digital Gift Cards Stack" 
                fill 
                className="object-cover object-center opacity-90 mix-blend-screen"
                priority
              />
            </div>
          </FadeIn>
          
          <FadeIn className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6">
              <Tag className="w-4 h-4" /> Top Rates Guaranteed
            </div>
            <h1 className="h1 mb-6">
              Trade gift cards at <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[var(--color-accent)]">unbeatable rates.</span>
            </h1>
            <p className="text-xl text-[var(--color-text-sec)] mb-8 leading-relaxed">
              Have an unused gift card? Convert it to Naira instantly. Need to buy a gift card for a friend abroad? Buy it seamlessly from your PAYVORA wallet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/download" icon>Trade Now</Button>
            </div>
          </FadeIn>
        </div>

        {/* Brand Marquee (Static layout for now) */}
        <div className="mb-32">
          <p className="text-center text-[var(--color-muted)] text-sm font-medium uppercase tracking-wider mb-8">Supported Brands</p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {brands.map(brand => (
              <div key={brand} className="px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-white font-medium">
                {brand}
              </div>
            ))}
            <div className="px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-sec)] font-medium">
              + 50 more
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <StaggerContainer className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <ArrowLeftRight className="w-10 h-10 text-[var(--color-accent)] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Buy & Sell</h3>
              <p className="text-[var(--color-text-sec)]">
                Complete flexibility. Purchase global gift cards directly from your wallet, or sell unused cards for instant Naira to your bank.
              </p>
            </StaggerItem>
            <StaggerItem className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <TrendingUp className="w-10 h-10 text-[var(--color-accent)] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Premium Rates</h3>
              <p className="text-[var(--color-text-sec)]">
                Our rates are updated in real-time to ensure you always get the highest value in the market for your trade.
              </p>
            </StaggerItem>
            <StaggerItem className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <CheckCircle2 className="w-10 h-10 text-[var(--color-accent)] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Instant Payout</h3>
              <p className="text-[var(--color-text-sec)]">
                No delays. Once your gift card is verified (usually under 2 minutes), your funds are immediately available for withdrawal.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>

      </Container>
    </div>
  );
}
