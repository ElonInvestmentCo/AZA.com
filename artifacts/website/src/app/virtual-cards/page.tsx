import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Shield, Globe, Zap, CreditCard, ShoppingBag, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Virtual Dollar Cards | PAYVORA",
  description: "Generate a virtual dollar card in minutes and shop globally without limits.",
};

export default function VirtualCardsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20 relative">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              Virtual Cards
            </div>
            <h1 className="h1 mb-6">Your global dollar card.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              Create a USD virtual card instantly. Pay for your favorite international subscriptions, shop online globally, and say goodbye to card limits.
            </p>
            <Button href="/download" size="lg" icon>Create your card</Button>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16">How it works</h2>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Fund your wallet", desc: "Add Naira to your PAYVORA account instantly via bank transfer." },
              { step: "02", title: "Create a card", desc: "Generate your virtual dollar card with a tap. Zero creation fees." },
              { step: "03", title: "Shop globally", desc: "Use your card details to pay on any international platform." },
            ].map((s, i) => (
              <StaggerItem key={i} className="relative">
                <span className="text-5xl font-bold text-[var(--color-border)] mb-6 block">{s.step}</span>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-[var(--color-muted)]">{s.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Accepted Worldwide", desc: "Works on Netflix, Amazon, Apple, Spotify, and millions of global merchants." },
              { icon: Shield, title: "3D Secure", desc: "Every transaction is protected with industry-standard 3D Secure authentication." },
              { icon: Zap, title: "Instant Funding", desc: "Move money from your Naira wallet to your USD card instantly." },
              { icon: CreditCard, title: "Multiple Cards", desc: "Create multiple cards for different purposes to manage subscriptions." },
              { icon: Smartphone, title: "Freeze Anytime", desc: "Freeze or unfreeze your card instantly from the app with one tap." },
              { icon: ShoppingBag, title: "No Hidden Fees", desc: "Transparent conversion rates. What you see is what you pay." },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.1} className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <f.icon className="w-8 h-8 text-[var(--color-accent)] mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-[var(--color-muted)]">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <FadeIn className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-12 text-center">
            <h2 className="h2 mb-6">Ready to go global?</h2>
            <p className="text-lg text-[var(--color-muted)] mb-8 max-w-xl mx-auto">
              Join thousands of Nigerians who trust PAYVORA for their international payments.
            </p>
            <Button href="/download" size="lg">Get the app now</Button>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
