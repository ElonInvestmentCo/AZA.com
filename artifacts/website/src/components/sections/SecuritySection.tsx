import { Shield, Lock, Eye, Fingerprint, AlertCircle } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "256-bit Encryption",
    description:
      "Every byte of your data is encrypted with bank-grade AES-256 encryption, both in transit and at rest.",
  },
  {
    icon: Lock,
    title: "Two-Factor Authentication",
    description:
      "Secure your account with OTP-based 2FA sent to your verified phone number or email.",
  },
  {
    icon: Fingerprint,
    title: "Biometric Login",
    description:
      "Authenticate with your fingerprint or Face ID for fast, seamless, and secure access.",
  },
  {
    icon: Eye,
    title: "Fraud Detection",
    description:
      "Our AI-powered system monitors transactions 24/7 and flags suspicious activity in real-time.",
  },
  {
    icon: AlertCircle,
    title: "Instant Freeze",
    description:
      "Freeze your virtual card or wallet instantly from the app if you suspect unauthorized access.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "We never sell your data. Your personal and financial information stays with you, always.",
  },
];

export function SecuritySection() {
  return (
    <section className="py-24 bg-[#0A0A0F]" id="security">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-4">
            <Shield size={14} />
            Security first
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Your money is safe with us.
          </h2>
          <p className="text-[#8F8FA3] text-lg max-w-2xl mx-auto">
            We take security seriously so you don&apos;t have to worry.
            Multiple layers of protection guard every transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 group hover:bg-[#1C1C2A] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(0,217,160,0.12)] flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#00D9A0]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-[#8F8FA3] text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          {["SSL Secured", "CBN Compliant", "NDPR Compliant", "PCI DSS Ready"].map(
            (badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#14141F] border border-[#2A2A3D] rounded-full text-sm text-[#8F8FA3]"
              >
                <Shield size={14} className="text-[#00D9A0]" />
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
