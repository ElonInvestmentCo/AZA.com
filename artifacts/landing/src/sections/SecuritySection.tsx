import { Shield, Lock, Eye, RefreshCw } from "lucide-react";

const items = [
  { icon: Shield, title: "256-bit Encryption", description: "All data is encrypted using industry-standard AES-256 encryption, the same used by banks worldwide.", accent: "#00D9A0" },
  { icon: Lock, title: "Two-Factor Auth", description: "Every login and transaction is protected by mandatory 2FA via SMS or authenticator app.", accent: "#00b8ff" },
  { icon: Eye, title: "Fraud Monitoring", description: "Our AI-powered fraud detection system monitors every transaction in real time, 24/7.", accent: "#F59E0B" },
  { icon: RefreshCw, title: "Instant Freeze", description: "Suspicious activity? Instantly freeze your account or card from the app in one tap.", accent: "#FF5B7A" },
];

export function SecuritySection() {
  return (
    <section className="py-24 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
              Security first
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Your money is safe{" "}
              <span className="text-[#00D9A0]">with us.</span>
            </h2>
            <p className="text-[#8F8FA3] text-lg leading-relaxed mb-8">
              We invest heavily in security infrastructure so you never have to worry. PayVora uses multiple layers of protection to keep your funds and personal data secure.
            </p>
            <div className="flex items-center gap-4 p-4 bg-[#14141F] border border-[#2A2A3D] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,217,160,0.1)] flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-[#00D9A0]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Regulated & Compliant</p>
                <p className="text-[#8F8FA3] text-xs mt-0.5">Operating in compliance with CBN guidelines and Nigerian financial regulations.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ icon: Icon, title, description, accent }) => (
              <div key={title} className="bg-[#14141F] border border-[#2A2A3D] rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${accent}18` }}>
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-[#8F8FA3] text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
