import type { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Apple, Play, Download, UserPlus, Fingerprint, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Download | PAYVORA",
  description: "Get the PAYVORA app on iOS and Android.",
};

export default function DownloadPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen flex flex-col">
      <section className="py-20 flex-grow flex items-center">
        <Container className="w-full">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="inline-block px-3 py-1 bg-[var(--color-accent-dim)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase rounded-full mb-8">
                Get Started
              </div>
              <h1 className="text-[clamp(3rem,8vw,5rem)] font-bold tracking-tighter leading-none text-white mb-8">
                PAYVORA is available on <span className="text-[var(--color-accent)]">iOS</span> and <span className="text-[var(--color-accent)]">Android.</span>
              </h1>
              <p className="text-xl text-[var(--color-muted)] mb-12 max-w-2xl mx-auto">
                Join thousands of Nigerians managing their money without borders. Download the app today and create your free account in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
                <a href="#" className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                  <Apple className="w-6 h-6 fill-current" />
                  App Store
                </a>
                <a href="#" className="flex items-center justify-center gap-3 bg-transparent border border-[var(--color-border-light)] text-white px-8 py-4 rounded-full font-semibold hover:bg-[var(--color-surface)] transition-colors">
                  <Play className="w-6 h-6 fill-current" />
                  Google Play
                </a>
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-4 gap-8 text-left border-t border-[var(--color-border)] pt-16">
              {[
                { icon: Download, title: "1. Download", desc: "Get the app from your store" },
                { icon: UserPlus, title: "2. Register", desc: "Sign up with basic details" },
                { icon: Fingerprint, title: "3. Verify", desc: "Complete quick KYC" },
                { icon: Rocket, title: "4. Transact", desc: "Fund wallet & go global" },
              ].map((step, i) => (
                <StaggerItem key={i} className="relative">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{step.desc}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>
    </div>
  );
}
