import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Shield, Zap, Globe, Coins, Layers, ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "All Features | PAYVORA",
  description: "Explore everything you can do with your PAYVORA account. From virtual cards to crypto conversion.",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global USD Cards",
      desc: "Create 3D-secure virtual dollar cards instantly. Fund with Naira and spend on any international website without limits.",
      link: "/virtual-cards"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Gift Card Trading",
      desc: "Convert unused gift cards (Amazon, Steam, Apple, etc.) to Naira at the most competitive market rates.",
      link: "/gift-cards"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Utility Payments",
      desc: "Pay electricity bills and TV subscriptions instantly with zero service charges or hidden fees.",
      link: "/bill-payments"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Grade Security",
      desc: "Protect your funds with biometric login, 2FA, and instant card freezing directly from the app.",
      link: "/security"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Airtime & Data",
      desc: "Recharge your phone or buy data bundles for any Nigerian network in seconds.",
      link: "/airtime-data"
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: "Instant Withdrawals",
      desc: "Move funds from your PAYVORA wallet to any local bank account instantly, 24/7.",
      link: "/download"
    }
  ];

  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-24">
          <FadeIn>
            <h1 className="h1 mb-6">Everything you need. <br/>Nothing you don't.</h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              A powerful suite of financial tools designed for speed, reliability, and global access.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {features.map((feature, i) => (
            <StaggerItem key={i} className="glass p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-accent)] group-hover:bg-[var(--color-accent-dim)] transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-[var(--color-text-sec)] mb-6 leading-relaxed flex-1">
                {feature.desc}
              </p>
              <Button href={feature.link} variant="ghost" className="px-0 hover:bg-transparent hover:text-[var(--color-accent)] justify-start">
                Explore feature <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="glass rounded-[3rem] p-10 md:p-16 border border-[var(--color-border)] relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-dim)] to-transparent opacity-30"></div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="h2 mb-6">Experience it yourself</h2>
            <p className="text-[var(--color-text-sec)] text-lg mb-8">
              Download the app today and join thousands of users enjoying seamless digital finance.
            </p>
            <Button href="/download" size="lg" icon>Get Started</Button>
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
