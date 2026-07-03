import { Shield, Zap, BadgeCheck, HeartHandshake } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transactions complete in under 60 seconds. No waiting, no delays — your money moves when you need it to.",
    accent: "#F59E0B",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "256-bit encryption, two-factor authentication, and real-time fraud monitoring protect every transaction.",
    accent: "#00D9A0",
  },
  {
    icon: BadgeCheck,
    title: "Best Rates Guaranteed",
    description: "We offer the most competitive rates for gift cards and currency exchange. Compare and see the difference.",
    accent: "#00b8ff",
  },
  {
    icon: HeartHandshake,
    title: "24/7 Support",
    description: "Our Nigerian support team is always available to help. Real humans, not bots — we genuinely care.",
    accent: "#FF5B7A",
  },
];

export function WhyPayVora() {
  return (
    <section className="py-24 bg-[#14141F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,217,160,0.12)] border border-[rgba(0,217,160,0.25)] text-[#00D9A0] text-sm font-medium mb-6">
            Why choose us
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Built for Nigerians,{" "}
            <span className="text-[#00D9A0]">by Nigerians.</span>
          </h2>
          <p className="text-[#8F8FA3] text-lg max-w-2xl mx-auto">
            We understand the unique needs of the Nigerian market. That's why PayVora is designed to work perfectly for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(({ icon: Icon, title, description, accent }) => (
            <div key={title} className="bg-[#0A0A0F] border border-[#2A2A3D] rounded-3xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${accent}18` }}>
                <Icon size={26} style={{ color: accent }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-[#8F8FA3] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
