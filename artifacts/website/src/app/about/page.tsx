import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Building2, Users, Rocket, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about PAYVORA's mission to build the premium financial ecosystem for Nigeria.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mb-24">
          <FadeIn>
            <h1 className="h1 mb-6">Building borderless finance for Africa.</h1>
            <p className="text-xl text-[var(--color-text-sec)] leading-relaxed">
              We started PAYVORA because we were tired of failed transactions, blocked international payments, and clunky banking apps. We believed Nigerians deserved a premium, reliable financial experience.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <FadeIn className="glass p-10 rounded-3xl border border-[var(--color-border)]">
            <Target className="w-10 h-10 text-[var(--color-accent)] mb-6" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-[var(--color-text-sec)] leading-relaxed">
              To dismantle financial borders for everyday Nigerians by providing a single, powerful platform for local utility payments, global virtual cards, and seamless digital asset conversion.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="glass p-10 rounded-3xl border border-[var(--color-border)]">
            <Rocket className="w-10 h-10 text-[var(--color-accent)] mb-6" />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-[var(--color-text-sec)] leading-relaxed">
              We envision an ecosystem where geographic location no longer dictates financial access. A world where anyone can participate in the global digital economy with confidence.
            </p>
          </FadeIn>
        </div>

        <FadeIn className="mb-16">
          <h2 className="h2 mb-10 text-center">By the numbers</h2>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-32">
          {[
            { label: "Active Users", value: "250K+" },
            { label: "Transactions Processed", value: "$50M+" },
            { label: "App Store Rating", value: "4.8/5" },
            { label: "Supported Countries", value: "Global" },
          ].map((stat, i) => (
            <StaggerItem key={i} className="text-center p-8 glass rounded-2xl border border-[var(--color-border)]">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-[var(--color-text-sec)] text-sm font-medium uppercase tracking-wider">{stat.label}</div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="glass rounded-[3rem] p-10 md:p-20 border border-[var(--color-border)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-accent)] opacity-5 blur-[100px]"></div>
          <Building2 className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-8 relative z-10" />
          <h2 className="h2 mb-6 relative z-10">Backed by the best</h2>
          <p className="text-lg text-[var(--color-text-sec)] max-w-2xl mx-auto mb-10 relative z-10">
            PAYVORA is partnered with tier-1 licensed financial institutions and leading technology providers to ensure your money is always safe, secure, and accessible.
          </p>
          {/* Faux logos area */}
          <div className="flex flex-wrap justify-center gap-8 relative z-10 opacity-50 grayscale">
            <div className="text-2xl font-bold tracking-tighter">FINTECH PARTNER</div>
            <div className="text-2xl font-bold tracking-tighter">GLOBAL BANK</div>
            <div className="text-2xl font-bold tracking-tighter">SECURITY FIRM</div>
          </div>
        </div>
      </Container>
    </div>
  );
}
