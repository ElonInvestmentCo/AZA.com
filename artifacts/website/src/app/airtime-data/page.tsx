import { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Phone, Wifi, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Airtime & Data Recharge",
  description: "Instant mobile recharge for all Nigerian networks.",
};

export default function AirtimeDataPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <FadeIn>
            <h1 className="h1 mb-6">Stay connected, <br/><span className="text-gradient-accent">always.</span></h1>
            <p className="text-xl text-[var(--color-text-sec)] mb-8 leading-relaxed">
              Top up your phone or buy data bundles for MTN, Airtel, GLO, and 9Mobile. Fast, reliable, and directly from your wallet balance.
            </p>
            <ul className="space-y-4 mb-8">
              {["Zero hidden fees", "Instant delivery to any number", "All major networks supported"].map((item, i) => (
                <li key={i} className="flex gap-3 text-white font-medium">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          
          <FadeIn delay={0.2} className="glass p-8 md:p-12 rounded-[3rem] border border-[var(--color-border)] shadow-[0_0_50px_var(--color-accent-dim)] relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] blur-[100px] opacity-20"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Airtime Recharge</h3>
                  <p className="text-sm text-[var(--color-text-sec)]">Any amount, any network</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Data Bundles</h3>
                  <p className="text-sm text-[var(--color-text-sec)]">Daily, weekly, or monthly plans</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
