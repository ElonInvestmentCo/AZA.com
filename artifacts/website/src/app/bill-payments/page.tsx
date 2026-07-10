import { Metadata } from "next";
import { Container, Button } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Phone, Wifi, Zap, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Bill Payments & Airtime",
  description: "Recharge airtime, buy data, and pay utility bills across Nigeria directly from your PAYVORA wallet.",
};

export default function BillPaymentsPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <FadeIn>
            <h1 className="h1 mb-6">Life admin, <span className="text-gradient-accent">sorted.</span></h1>
            <p className="text-xl text-[var(--color-text-sec)]">
              Pay electricity bills, TV subscriptions, and recharge airtime directly from your app. Fast, reliable, and absolutely zero hidden fees.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {[
            {
              icon: <Phone className="w-8 h-8 text-[#00D9A0]" />,
              title: "Airtime Recharge",
              desc: "Top up MTN, Airtel, GLO, and 9Mobile instantly. Earn cashback on your personal recharges.",
            },
            {
              icon: <Wifi className="w-8 h-8 text-[#00D9A0]" />,
              title: "Data Bundles",
              desc: "Stay connected. Buy data plans for any network directly from your wallet balance.",
            },
            {
              icon: <Zap className="w-8 h-8 text-[#00D9A0]" />,
              title: "Electricity (Prepaid)",
              desc: "Buy tokens for Ikeja, Eko, Abuja, Kano, and all major DisCos in Nigeria without service interruptions.",
            },
            {
              icon: <FileText className="w-8 h-8 text-[#00D9A0]" />,
              title: "Cable TV",
              desc: "Renew DSTV, GOTV, and Startimes subscriptions instantly so you never miss a match.",
            }
          ].map((feature, i) => (
            <StaggerItem key={i} className="glass p-10 rounded-3xl border border-[var(--color-border)] flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-light)] flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[var(--color-text-sec)] leading-relaxed">{feature.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="bg-[var(--color-accent)] rounded-[3rem] p-10 md:p-16 text-black text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Set auto-renew and relax</h2>
            <p className="text-lg md:text-xl font-medium mb-10 text-black/80">
              Schedule your data and TV subscriptions to renew automatically every month. Never get disconnected again.
            </p>
            <Button href="/download" className="bg-black text-white hover:bg-black/90 px-8 py-4 text-lg">
              Download the App
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
