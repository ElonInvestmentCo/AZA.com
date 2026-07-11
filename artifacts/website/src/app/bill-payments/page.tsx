import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Lightbulb, Tv, Wifi, Droplet, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Bill Payments | PAYVORA",
  description: "Pay your utility bills in seconds with zero service fees.",
};

export default function BillPaymentsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20 relative">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              Bill Payments
            </div>
            <h1 className="h1 mb-6">Pay every bill on time.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              Electricity, cable TV, internet, and water — pay any Nigerian utility bill instantly. Automated reminders keep you ahead with absolutely zero hidden fees.
            </p>
            <Button href="/download" size="lg" icon>Pay a bill</Button>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16">Supported Utilities</h2>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lightbulb, title: "Electricity", desc: "IKEDC, EKEDC, AEDC, IBEDC & more" },
              { icon: Tv, title: "Cable TV", desc: "DSTV, GOTV, Startimes" },
              { icon: Wifi, title: "Internet", desc: "Spectranet, Smile, Swift" },
              { icon: Droplet, title: "Water", desc: "Lagos Water, state utilities" },
            ].map((c, i) => (
              <StaggerItem key={i} className="p-8 rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col items-center text-center group hover:border-[var(--color-border-light)] transition-colors">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <c.icon className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{c.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="h2 mb-6">Zero fees. Zero stress.</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                Unlike traditional banking apps that charge you up to ₦100 per bill payment, PAYVORA covers the transaction cost. 
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "No convenience fees",
                  "Instant token generation for electricity",
                  "Save frequent bills as favorites",
                  "Set up auto-pay for subscriptions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <Zap className="w-5 h-5 text-orange-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn className="bg-[var(--color-surface)] rounded-3xl p-12 border border-[var(--color-border)] text-center flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-3xl font-bold text-white mb-4">Never miss a due date again</h3>
                <p className="text-[var(--color-muted)] mb-8">Download PAYVORA to schedule your payments automatically.</p>
                <Button href="/download" size="lg">Get Started</Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  );
}
