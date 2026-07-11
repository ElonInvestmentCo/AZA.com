import type { Metadata } from "next";
import { Container } from "@/components/ui/core";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ShieldAlert, LockKeyhole, Activity, Fingerprint, BadgeCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Security | PAYVORA",
  description: "Bank-grade security, always.",
};

export default function SecurityPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <section className="py-20 relative">
        <Container>
          <FadeIn className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl flex items-center justify-center mx-auto mb-8">
              <ShieldAlert className="w-10 h-10 text-[var(--color-accent)]" />
            </div>
            <h1 className="h1 mb-6">Bank-grade security, always.</h1>
            <p className="text-xl text-[var(--color-muted)] leading-relaxed">
              Your money and data are protected by the same security standards used by global financial institutions. We don't compromise on trust.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <Container>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: LockKeyhole, title: "AES-256 Encryption", desc: "All user data and transactions are encrypted with AES-256, ensuring your information remains completely private." },
              { icon: Fingerprint, title: "Biometric & 2FA", desc: "Protect your account with fingerprint, FaceID, and two-factor authentication for every withdrawal." },
              { icon: Activity, title: "Fraud Monitoring", desc: "Our AI-powered systems monitor transactions 24/7 to detect and block suspicious activities instantly." },
              { icon: BadgeCheck, title: "CBN Compliance", desc: "We operate in strict accordance with the regulations set by the Central Bank of Nigeria." },
              { icon: FileText, title: "Data Privacy (NDPR)", desc: "We adhere strictly to the Nigerian Data Protection Regulation guidelines. Your data is yours alone." },
              { icon: ShieldAlert, title: "Secure Infrastructure", desc: "Hosted on enterprise-grade cloud servers with continuous vulnerability testing and compliance audits." },
            ].map((s, i) => (
              <StaggerItem key={i} className="bg-[var(--color-bg)] p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-border-light)] transition-colors">
                <s.icon className="w-8 h-8 text-[var(--color-accent)] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">{s.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </div>
  );
}
