import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { CreditCard, Globe, Zap, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Virtual Dollar Cards",
  description: "Get a virtual dollar card instantly. Pay on global platforms like Netflix, Apple, Amazon, and Spotify.",
};

export default function VirtualCardsPage() {
  return (
    <div className="pt-32 pb-24 overflow-hidden">
      <Container>
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent)] text-sm font-semibold mb-6">
              <CreditCard className="w-4 h-4" /> Global Payments
            </div>
            <h1 className="h1 mb-6">
              Your <span className="text-gradient-accent">global card</span> for everything.
            </h1>
            <p className="text-xl text-[var(--color-text-sec)] mb-8 leading-relaxed">
              Create a virtual USD card in seconds. Shop securely on international websites, pay for subscriptions, and manage your online expenses from Nigeria without FX limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/download" icon>Get Your Card</Button>
              <Button href="/pricing" variant="outline">View Pricing</Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="relative">
            <div className="absolute inset-0 bg-[var(--color-accent)] blur-[100px] opacity-20 rounded-full"></div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-surface)]">
              {/* This uses the generated image */}
              <div className="absolute inset-0 w-full h-full">
                <Image 
                  src="/images/hero-card.png" 
                  alt="Premium Virtual Card" 
                  fill 
                  className="object-cover object-center mix-blend-screen opacity-90"
                  priority
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="h2 mb-4">Made for borderless spending</h2>
            <p className="text-[var(--color-text-sec)] text-lg">
              Say goodbye to transaction failures and steep conversion fees.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Zap />,
                title: "Instant Creation",
                desc: "Fund your account and generate a ready-to-use virtual card instantly. No waiting for physical delivery."
              },
              {
                icon: <Globe />,
                title: "Accepted Everywhere",
                desc: "Works perfectly on AWS, Apple Music, Netflix, Facebook Ads, Aliexpress, and millions of global merchants."
              },
              {
                icon: <Shield />,
                title: "Maximum Security",
                desc: "Freeze your card anytime. View exact transaction details and set spending limits to protect your balance."
              },
              {
                icon: <CreditCard />,
                title: "Transparent Rates",
                desc: "Fund with Naira via bank transfer or USDT. We offer the most competitive market rates with zero hidden fees."
              }
            ].map((item, i) => (
              <StaggerItem key={i} className="glass p-8 rounded-3xl border border-[var(--color-border)] group hover:border-[var(--color-accent)] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-light)] flex items-center justify-center mb-6 text-white group-hover:text-[var(--color-accent)] transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[var(--color-text-sec)]">{item.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* How it works */}
        <div className="glass rounded-[3rem] p-10 md:p-20 border border-[var(--color-border)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-accent)] blur-[150px] opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="h2 mb-12">Get started in 3 steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Create Account", desc: "Download PAYVORA and complete a quick KYC verification." },
                { step: "02", title: "Fund Wallet", desc: "Deposit Naira directly from your bank or crypto wallet." },
                { step: "03", title: "Create Card", desc: "Tap 'Virtual Cards', fund it, and start spending globally." }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-6xl font-bold text-[var(--color-surface)] absolute -top-4 -left-4 z-0 pointer-events-none">
                    {step.step}
                  </div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-[var(--color-text-sec)]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t border-[var(--color-border-light)] flex justify-center">
              <Button href="/download" size="lg" icon>Create Your Card Now</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
