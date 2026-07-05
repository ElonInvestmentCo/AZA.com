import type { Metadata } from "next";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { DownloadCTA } from "@/components/sections/DownloadCTA";
import { Shield, Lock, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Security",
  description:
    "PAYVORA uses bank-grade 256-bit encryption, biometric authentication, 2FA, and AI fraud detection to keep your money safe.",
};

export default function SecurityPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            <Shield size={14} /> Bank-grade security
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Your money is <span className="text-[#00D9A0]">protected.</span>
          </h1>
          <p className="text-[#8F8FA3] text-xl max-w-2xl mx-auto">
            We&apos;ve built multiple layers of security so you can transact with confidence. Every feature, every transaction, every account is protected.
          </p>
        </div>
      </section>

      <SecuritySection />

      {/* How we protect you */}
      <section className="py-24 bg-[#14141F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12">
            How we protect you
          </h2>
          <div className="space-y-6">
            {[
              {
                icon: Lock,
                title: "End-to-end encryption",
                body: "All communication between your device and PAYVORA servers is encrypted using TLS 1.3. Your data is stored with AES-256 encryption. No one — not even our engineers — can read your personal data.",
              },
              {
                icon: Shield,
                title: "Secure payment processing",
                body: "All payment transactions are processed through PCI-DSS compliant infrastructure. Card details are tokenized and never stored on our servers. Your virtual card details are masked by default.",
              },
              {
                icon: Eye,
                title: "Fraud detection & prevention",
                body: "Our AI-powered fraud engine analyzes every transaction in real-time. Unusual patterns trigger automatic holds and instant notifications. You can freeze your account or card with one tap.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[#1C1C2A] border border-[#2A2A3D] rounded-2xl p-8 flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-[#00D9A0]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-3">{title}</h3>
                  <p className="text-[#8F8FA3] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DownloadCTA />
    </>
  );
}
