import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | PAYVORA",
  description: "Simple, transparent pricing for your digital fintech needs.",
};

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20 text-center">
        <Container>
          <FadeIn className="max-w-2xl mx-auto">
            <h1 className="h1 mb-6">Simple, transparent pricing.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              No hidden fees. No surprising charges. Just clean, predictable pricing that puts you in control.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <FadeIn className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-10 flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
              <p className="text-[var(--color-muted)] mb-6">Everything you need to go global.</p>
              <div className="text-5xl font-bold text-white mb-8">₦0<span className="text-lg text-[var(--color-muted)] font-normal">/month</span></div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {["1 Virtual USD Card", "Zero fee bill payments", "Airtime & data recharge", "Gift card trading", "Free Naira transfers to PAYVORA users", "Standard customer support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" /> {f}
                  </li>
                ))}
              </ul>
              <Button href="/download" variant="outline" className="w-full">Get Free Account</Button>
            </FadeIn>

            {/* Pro Plan */}
            <FadeIn delay={0.1} className="bg-[var(--color-bg)] border-2 border-[var(--color-accent)] rounded-3xl p-10 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[var(--color-accent)] text-black font-bold text-xs px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                Most Popular
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
              <p className="text-[var(--color-muted)] mb-6">For power users and businesses.</p>
              <div className="text-5xl font-bold text-white mb-8">₦2,500<span className="text-lg text-[var(--color-muted)] font-normal">/month</span></div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {["Up to 5 Virtual USD Cards", "All Free features included", "Priority 24/7 customer support", "Higher daily transaction limits", "Free transfers to local banks", "Early access to new features"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" /> {f}
                  </li>
                ))}
              </ul>
              <Button href="/download" className="w-full">Upgrade to Pro</Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  );
}
