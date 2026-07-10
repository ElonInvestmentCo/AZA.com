import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ShieldCheck, Lock, Eye, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & AML/KYC",
  description: "Learn how PAYVORA protects your funds and personal information.",
};

export default function SecurityPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-3xl mb-20">
          <FadeIn>
            <h1 className="h1 mb-6">Bank-grade security. <br/>Zero compromises.</h1>
            <p className="text-xl text-[var(--color-text-sec)] leading-relaxed">
              We take the security of your funds and data seriously. PAYVORA employs state-of-the-art encryption, rigorous compliance, and advanced fraud detection.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Lock className="w-8 h-8 text-[var(--color-accent)]" />,
              title: "End-to-End Encryption",
              desc: "All traffic and personal data is encrypted using AES-256 and TLS 1.3 protocols before it leaves your device.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />,
              title: "Regulatory Compliance",
              desc: "We strictly adhere to global AML and KYC regulations to prevent fraud and ensure a safe trading environment.",
            },
            {
              icon: <Eye className="w-8 h-8 text-[var(--color-accent)]" />,
              title: "Continuous Monitoring",
              desc: "Our automated systems monitor transactions 24/7 to detect and block suspicious activity in real-time.",
            },
          ].map((feature, i) => (
            <StaggerItem key={i} className="glass p-8 rounded-3xl border border-[var(--color-border)]">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-dim)] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[var(--color-text-sec)] leading-relaxed">{feature.desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <FadeIn>
            <h2 className="h3 mb-6">KYC & AML Policy</h2>
            <div className="prose prose-invert max-w-none text-[var(--color-text-sec)]">
              <p className="mb-4">
                To maintain a secure ecosystem and comply with international regulations, PAYVORA implements a robust Know Your Customer (KYC) and Anti-Money Laundering (AML) policy.
              </p>
              <h3 className="text-white font-semibold text-lg mt-8 mb-4">Verification Tiers</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                  <div>
                    <strong className="text-white block">Tier 1 (Basic)</strong>
                    <span>Email verification, phone number, and basic demographic data. Allows limited transaction volumes.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                  <div>
                    <strong className="text-white block">Tier 2 (Standard)</strong>
                    <span>Government-issued ID and facial verification. Unlocks standard limits and virtual cards.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                  <div>
                    <strong className="text-white block">Tier 3 (Premium)</strong>
                    <span>Proof of address. Unlocks maximum account limits for high-volume users.</span>
                  </div>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="glass p-10 rounded-3xl border border-[var(--color-border)] flex flex-col justify-center">
            <h3 className="h3 mb-4">Account Protection</h3>
            <p className="text-[var(--color-text-sec)] mb-8">
              You are in control of your account security. We provide the tools you need to lock down your wallet.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Two-Factor Authentication (2FA) support",
                "Biometric login (FaceID / TouchID)",
                "Instant virtual card freezing",
                "New device login alerts",
                "PIN protection for all transactions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
            <Button href="/contact" variant="outline">Report a Security Issue</Button>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
