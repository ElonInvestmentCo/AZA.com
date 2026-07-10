import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Simple, Transparent Pricing",
  description: "Zero hidden fees. Transparent exchange rates. See exactly what PAYVORA costs.",
};

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <FadeIn>
            <h1 className="h1 mb-6">No hidden fees.<br/>Just honest banking.</h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              We believe in complete transparency. What you see is what you pay.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          <FadeIn delay={0.1}>
            <div className="glass p-10 rounded-3xl border border-[var(--color-border)] h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Wallet Account</h3>
              <p className="text-[var(--color-text-sec)] mb-6">Everything you need to manage your money locally.</p>
              <div className="text-4xl font-bold text-white mb-8">Free</div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Account Maintenance: ₦0",
                  "Naira Deposits: ₦0",
                  "Airtime & Bill Payments: Zero markup",
                  "Intra-app transfers: Free",
                  "Bank withdrawals: ₦20 per transfer",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[var(--color-text-sec)]">
                    <Check className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button href="/download" className="w-full">Open Free Account</Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-[var(--color-surface)] p-10 rounded-3xl border border-[var(--color-accent)] h-full flex flex-col relative shadow-[0_0_40px_var(--color-accent-dim)]">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-[var(--color-accent)] text-black text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Virtual Cards
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Global Spender</h3>
              <p className="text-[var(--color-text-sec)] mb-6">For borderless payments and international subscriptions.</p>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-bold text-white">$2</span>
                <span className="text-[var(--color-text-sec)] mb-1">/ card creation</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Monthly Maintenance: $1",
                  "Card Funding: Best market rate",
                  "Transaction fee: 0%",
                  "Cross-border payments: Supported",
                  "3D Secure: Included",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-white">
                    <Check className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button href="/download" className="w-full bg-[var(--color-accent)] text-black">Get Your Card</Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">Other Limits & Rates</h3>
          <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="p-4 font-semibold text-white">Service</th>
                  <th className="p-4 font-semibold text-white">Rate / Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <tr>
                  <td className="p-4 text-[var(--color-text-sec)]">Gift Card Selling</td>
                  <td className="p-4 text-white">Dynamic market rate (displayed in-app)</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--color-text-sec)]">Tier 1 Maximum Balance</td>
                  <td className="p-4 text-white">₦300,000</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--color-text-sec)]">Tier 2 Maximum Balance</td>
                  <td className="p-4 text-white">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 text-[var(--color-text-sec)]">Virtual Card Limit</td>
                  <td className="p-4 text-white">$10,000 / month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </FadeIn>

      </Container>
    </div>
  );
}
