import { Shield, Lock, Eye, Fingerprint, AlertCircle, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "256-bit Encryption",
    description: "Every byte of your data is encrypted with bank-grade AES-256 encryption, both in transit and at rest.",
    accent: "#00D9A0",
  },
  {
    icon: Lock,
    title: "Two-Factor Authentication",
    description: "Secure your account with OTP-based 2FA sent to your verified phone number or email.",
    accent: "#00b8ff",
  },
  {
    icon: Fingerprint,
    title: "Biometric Login",
    description: "Authenticate with your fingerprint or Face ID for fast, seamless, and secure access.",
    accent: "#FF5B7A",
  },
  {
    icon: Eye,
    title: "Fraud Detection",
    description: "Our AI-powered system monitors transactions 24/7 and flags suspicious activity in real-time.",
    accent: "#F59E0B",
  },
  {
    icon: AlertCircle,
    title: "Instant Freeze",
    description: "Freeze your virtual card or wallet instantly from the app if you suspect unauthorized access.",
    accent: "#00D9A0",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "We never sell your data. Your personal and financial information stays with you, always.",
    accent: "#00b8ff",
  },
];

const badges = [
  { label: "SSL Secured", color: "#00D9A0" },
  { label: "CBN Compliant", color: "#00b8ff" },
  { label: "NDPR Compliant", color: "#FF5B7A" },
  { label: "PCI DSS Ready", color: "#F59E0B" },
  { label: "2FA Protected", color: "#00D9A0" },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {pillars.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="group bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-6 hover:bg-[#1C1C2A] transition-all duration-300 hover:scale-[1.02]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${accent}20` }}
              >
                <Icon size={22} style={{ color: accent }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-[#8F8FA3] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* How we protect banner */}
        <div className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: "End-to-end encrypted",
                body: "All data between your device and our servers uses TLS 1.3. Nobody intercepts your transactions.",
              },
              {
                title: "Zero-knowledge passwords",
                body: "We use bcrypt hashing. Your password and PIN are never stored in plaintext — not even our engineers can see them.",
              },
              {
                title: "Real-time monitoring",
                body: "Every transaction is scanned by our fraud engine. Unusual patterns trigger instant alerts to your device.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <CheckCircle2 size={20} className="text-[#00D9A0] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">{title}</h4>
                  <p className="text-[#8F8FA3] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map(({ label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#14141F] border border-[#2A2A3D] rounded-full text-sm text-[#8F8FA3] hover:border-[#2A2A3D] transition-all"
            >
              <Shield size={14} style={{ color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
