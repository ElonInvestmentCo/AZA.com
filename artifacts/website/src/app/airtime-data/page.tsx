import type { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Smartphone, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Airtime & Data | PAYVORA",
  description: "Top up any network instantly with zero markup.",
};

export default function AirtimeDataPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20 relative">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              Airtime & Data
            </div>
            <h1 className="h1 mb-6">Top up any network, instantly.</h1>
            <p className="text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              Buy data bundles and recharge airtime for MTN, Airtel, Glo, and 9mobile at zero markup. Instant delivery, always.
            </p>
            <Button href="/download" size="lg" icon>Buy Airtime</Button>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <FadeIn>
            <h2 className="h2 mb-16 text-center">Supported Networks</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "MTN", color: "bg-yellow-400", text: "text-black" },
              { name: "Airtel", color: "bg-red-500", text: "text-white" },
              { name: "Glo", color: "bg-green-500", text: "text-white" },
              { name: "9mobile", color: "bg-green-800", text: "text-white" },
            ].map((n) => (
              <FadeIn key={n.name} className="bg-[var(--color-bg)] rounded-3xl p-8 border border-[var(--color-border)] flex flex-col items-center justify-center h-48 text-center group">
                <div className={`w-20 h-20 rounded-full ${n.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className={`font-bold text-lg ${n.text}`}>{n.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="h2 mb-6">Fast, simple, reliable</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">
                Stop jumping between banking apps and USSD codes. PAYVORA gives you direct access to the best data bundles across all networks.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <Zap className="w-5 h-5 text-purple-400" /> Instant top-up to any number
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Smartphone className="w-5 h-5 text-purple-400" /> Save contacts for quick recharge
                </li>
                <li className="flex items-center gap-3 text-white">
                  <Zap className="w-5 h-5 text-purple-400" /> View all available data plans easily
                </li>
              </ul>
            </FadeIn>
            <FadeIn className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-12 text-center h-full flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-4">Never run out of data</h3>
              <p className="text-[var(--color-muted)] mb-8">Download the PAYVORA app to keep your devices connected 24/7.</p>
              <Button href="/download" size="lg">Get the app</Button>
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  );
}
