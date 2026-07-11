import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRightLeft, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Gift Card Trading | PAYVORA",
  description: "Trade your unused gift cards for instant Naira at the best rates.",
};

export default function GiftCardsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20 relative">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              Gift Card Trading
            </div>
            <h1 className="h1 mb-6">Trade gift cards for instant Naira.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              Sell unused Amazon, iTunes, Google Play, Steam, and 50+ other gift cards. We offer the most competitive rates and instant settlement to your wallet.
            </p>
            <Button href="/download" size="lg" icon>Start trading</Button>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)] overflow-hidden">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16 text-center">Supported Brands</h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['Amazon', 'iTunes', 'Google Play', 'Steam', 'Razer Gold', 'Sephora', 'Nike', 'Macy\'s', 'eBay'].map((brand) => (
              <div key={brand} className="px-8 py-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl text-xl font-semibold text-[var(--color-muted)] hover:text-white transition-colors cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16">How to trade</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "1. Select Brand", desc: "Choose the gift card brand you want to sell from our extensive list." },
              { icon: ArrowRightLeft, title: "2. Check Rate", desc: "Enter the card value to see the exact Naira amount you'll receive instantly." },
              { icon: Zap, title: "3. Get Paid", desc: "Upload the card details. Once verified, the funds hit your wallet instantly." },
            ].map((s, i) => (
              <StaggerItem key={i} className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <s.icon className="w-10 h-10 text-[var(--color-accent)] mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-[var(--color-muted)]">{s.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
      
      <section className="py-24">
        <Container>
          <FadeIn className="bg-[var(--color-surface)] border border-[var(--color-accent)]/20 rounded-3xl p-12 text-center">
            <h2 className="h2 mb-6">Check rates in the app</h2>
            <p className="text-lg text-[var(--color-muted)] mb-8 max-w-xl mx-auto">
              Our rates are updated dynamically to ensure you always get the best market value for your cards. Download the app to see live rates.
            </p>
            <Button href="/download" size="lg">Get the app</Button>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
