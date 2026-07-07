import { Shield, Lock, Eye, Fingerprint, AlertCircle, CheckCircle2 } from "lucide-react";

const pillars = [
  { icon: Shield,      title: "256-bit Encryption",         description: "Every byte of your data is encrypted with bank-grade AES-256 encryption, both in transit and at rest.",                      accent: "#00D9A0" },
  { icon: Lock,        title: "Two-Factor Authentication",   description: "Secure your account with OTP-based 2FA sent to your verified phone number or email.",                                         accent: "#3B82F6" },
  { icon: Fingerprint, title: "Biometric Login",             description: "Authenticate with your fingerprint or Face ID for fast, seamless, and secure access.",                                        accent: "#EF4444" },
  { icon: Eye,         title: "Fraud Detection",             description: "Our AI-powered system monitors transactions 24/7 and flags suspicious activity in real-time.",                                 accent: "#F59E0B" },
  { icon: AlertCircle, title: "Instant Freeze",              description: "Freeze your virtual card or wallet instantly from the app if you suspect unauthorized access.",                                accent: "#00D9A0" },
  { icon: Lock,        title: "Privacy First",               description: "We never sell your data. Your personal and financial information stays with you, always.",                                     accent: "#3B82F6" },
];

const badges = [
  { label: "SSL Secured",    color: "#00D9A0" },
  { label: "CBN Compliant",  color: "#3B82F6" },
  { label: "NDPR Compliant", color: "#EF4444" },
  { label: "PCI DSS Ready",  color: "#F59E0B" },
  { label: "2FA Protected",  color: "#00D9A0" },
];

export function SecuritySection() {
  return (
    <section className="py-24 bg-white" id="security">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.10)] border border-[rgba(0,217,160,0.25)] text-[#00B88A] text-sm font-semibold mb-4">
            <Shield size={14} /> Security first
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Your money is safe with us.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We take security seriously so you don&apos;t have to worry.
            Multiple layers of protection guard every transaction.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {pillars.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${accent}12` }}>
                <Icon size={22} style={{ color: accent }} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* How we protect */}
        <div className="bg-[#F7F8FA] border border-gray-100 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: "End-to-end encrypted",    body: "All data between your device and our servers uses TLS 1.3. Nobody intercepts your transactions." },
              { title: "Zero-knowledge passwords", body: "We use bcrypt hashing. Your password and PIN are never stored in plaintext — not even our engineers can see them." },
              { title: "Real-time monitoring",     body: "Every transaction is scanned by our fraud engine. Unusual patterns trigger instant alerts to your device." },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <CheckCircle2 size={20} className="text-[#00D9A0] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">{title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all">
              <Shield size={14} style={{ color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
